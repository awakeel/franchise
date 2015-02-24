define(['text!schedulelist/tpl/specialday.html','datepicker','timepick'],
	function (template,datepicker,timepicker) {
		'use strict';
		return Backbone.View.extend({  
			tagName:'div',
			className:"modal-content",
			events:{
			  
			 	"click .changespecial":"SavechangeSpecialDay"
			},
            initialize: function () {
				this.template = _.template(template);
			    this.app = this.options.app;
				this.render();
			},
			render: function () {
				this.$el.html(this.template(this.model.toJSON()));
				this.$el.find('#txtdate').datepicker({ todayBtn: true,
				    clearBtn: true,
				    autoclose: true,
				    defaultDate: this.start,
					    todayHighlight: true
				});  
				this.$el.find('#txtdate').val();
				this.$el.find(".timepicker").timepicker({ 'timeFormat': 'H:i'  });
				this.fillJobTypes();
			} ,
			fillJobTypes:function(){
				 
				var url = "api/jobtypeschedule";
				var that = this;
				var str = "";
				jQuery.getJSON(url, {sid:this.options.model.get('schedulegroupid')},function(tsv, state, xhr) {
                   var employees = jQuery.parseJSON(xhr.responseText);
                   		_.each( employees, function (value,key,list)
                               {
                   		     str+='<div class="checkbox">';
						       str+='<label> <input type="checkbox" value="'+value.id+'"  >'+value.name;
							    str+='</label>';
								str+='</div>'; 
                               } ); 
		                   	  that.$el.find("#ddljobtypes").html(str);
		                   	 
                   
                   });
			},
			clearField:function(){
				this.$el.find('.e-date').addClass('hide');
				this.$el.find('.e-jobtypes').addClass('hide');
				this.$el.find('.e-timefrom').addClass('hide');
				this.$el.find('.e-timeto').addClass('hide');
				
			},
			SavechangeSpecialDay:function(){
				this.clearField();
				var URL = "api/specialdaychanges";
				var theday = this.$el.find('#txtdate').val();
				var tf = this.$el.find('#txtstart').val();
				var tt = this.$el.find('#txtend').val();
				var jtid = this.$el.find("#ddljobtypes").val();
				var jobtypes = ""; 
			 	$('#ddljobtypes :checked').each(function() {
			 		jobtypes +=$(this).val()+","; 
		        }); 
			 	if(!jobtypes){
			 		this.$el.find('.e-jobtypes').removeClass('hide');
			 		return false;
			 	}
			 	if(!theday){
			 		this.$el.find('.e-date').removeClass('hide');
			 		return false;
			 	}
			 	if(!tf){
			 		this.$el.find('.e-timefrom').removeClass('hide');
			 		return false;
			 	}
			 	if(!tt){
			 		this.$el.find('.e-timeto').removeClass('hide');
			 		return false;
			 	}
			 	var that = this;
			 	 this.app.showLoading('Saving Schedule....', this.$el );
				$.post(URL, {sid:this.options.model.get('id'),jtid:jobtypes,theday:theday,timefrom:tf,timeto:tt,eid:this.options.model.get('employeeid')}).done(function(data) {
					that.app.showLoading(false, that.$el );
					var exists = jQuery.parseJSON(data);
					if(typeof exists.exists !="undefined"){
						 swal({
						      title: "Warning",
						      text: "No schedule found for selected date.",
						      type: "error" 
						    });
					}else{
						$("#changespecialday").modal('hide');
						that.app.successMessage();	
					}
					
                });
            }
		});
	});
