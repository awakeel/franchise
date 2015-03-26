define(['text!branches/tpl/editdepartment.html','wizard','branches/models/branch','timepick'],
	function (template,wizard,ModelBranch,timepick) {
		'use strict';
		return Backbone.View.extend({  
			 events:{
				/// 'click .close-p':"closeView", 
				 "click .close-p":"closeView",
				 "click .btn-save":"saveBasicInfo",
				 "keyup #txtname":'changeDepartmentName'
			 },
			 
			  initialize: function () {
				this.id = 0;
				this.name = "";
				this.desc = "";
				this.id = 0;
				this.zip = '';
				this.city = '';
				this.address = '';
				this.departmentName = 'Department';
				this.template = _.template(template);
				this.setting = this.options.setting;
				this.app = this.options.setting;
				this.empcity = this.app.users.city || null;
				this.objModelBranch = new ModelBranch();
				this.render();
				
			},
			changeDepartmentName:function(ev){
				var text = $(ev.target).val();  
				if(text)
					this.$el.find('.department-name').html(text);
				else
					this.$el.find('.department-name').html('newly created department');
			},
			render: function () {  
				this.$el.html(this.template( ));
				 this.app.showLoading('Loading pages....',this.$el);
				 var that = this;
					that.$el.find('.first-text').attr('disabled',true);
					that.$el.find('.end-text').attr('disabled',true);
				 if(typeof this.options.id  =="undefined"){
						this.name = this.model.get('name');
						this.desc = this.model.get('notes');
						this.languageid = this.model.get('languageid');
						this.currencyid = this.model.get('currencyid');
						this.countryid = this.model.get('countryid');
						this.id = this.model.get('id');
						this.city = this.model.get('city');
						this.address = this.model.get('address');
						this.zip = this.model.get('zip');
						that.$el.find('.first-text').attr('disabled',false);
						that.$el.find('.end-text').attr('disabled',false);
						this.fillTimings();
						this.objModelBranch = this.model;
						this.objModelBranch.set({id:this.model.get('id')});
						this.$el.find('.department-name').html(this.name);
					}
				  
				   this.fetchCities();
			 
			 
				 
			
				
				this.$el.find('#txtname').val(this.name);
				this.$el.find('#txtcity').val(this.city);
				this.$el.find('#txtzip').val(this.zip	);
				this.$el.find('#txtaddress').val(this.address); 
				 this.app.showLoading(false,this.$el);
				
				this.$el.find('#chkall').on('click',function(ev){ 
					
					 
					var first = that.$el.find("#txtsmonday").val();
					var end = that.$el.find("#txtemonday").val();
					if(!first)
						first = "09:00";
					if(!end)
						end = "18:00"; 
					if($(ev.target).is(':checked')){
						that.$el.find('.days').prop("checked",true);
						that.$el.find('.first-text').attr('disabled',false);
						that.$el.find('.end-text').attr('disabled',false);
						that.$el.find(".first-text").val(first)
						that.$el.find(".end-text").val(end)
					}else{
						that.$el.find('.days').prop("checked",false);
						that.$el.find('.first-text').attr('disabled',true);
						that.$el.find('.end-text').attr('disabled',true);
						that.$el.find(".first-text").val('')
						that.$el.find(".end-text").val('')
					}
					
				}) 

				this.$el.find(".timepicker").timepicker({ 'step': 15 ,'timeFormat': 'H:i'  ,
							    'useSelect':false});
				this.$el.find('.days').on('click',function(){
					if($(this).prop('checked')!= true){
						that.$el.find("#txts"+$(this).attr('id')).attr('disabled',true);
						that.$el.find("#txte"+$(this).attr('id')).attr('disabled',true)
						var first = that.$el.find("#txts"+$(this).attr('id')).val('');
						var end = that.$el.find("#txte"+$(this).attr('id')).val('');
					}else{
						that.$el.find("#txts"+$(this).attr('id')).attr('disabled',false);
						that.$el.find("#txte"+$(this).attr('id')).attr('disabled',false)
						var first =that.$el.find(".first-text").val();
						var end = that.$el.find(".end-text").val();
						 that.$el.find("#txts"+$(this).attr('id')).val(first);
						 that.$el.find("#txte"+$(this).attr('id')).val(end);
					}
				})
			} ,
			closeView:function(){
				
				// this.$el.find('#newservice').modal('hide');
				var that = this;

				require([ 'branches/views/lists' ],
						function(Lists) {

							var objLists = new Lists({
								setting : that.app 
								 
							});
							that.$el.parent().html(objLists.$el);
							Backbone.View.prototype.remove
									.call(that);
							that.undelegateEvents();
							that.$el.remove();
							that.$el.removeData().unbind();
							that.remove();
						})
			},
			startWizard:function(){
				var that = this;
				 
				
				this.$el.bootstrapWizard({onTabShow: function(tab, navigation, index) {
					var $total = navigation.find('li').length;
					var $current = index+1;
					var $percent = ($current/$total) * 100;
					that.$el.find('.bar').css({width:$percent+'%'});
					
					// If it's the last tab then hide the last button and show the finish instead
					if($current >= $total) {
						that.$el.find('.pagerw .next').hide();
						that.$el.find('.pagerw .finish').show().on('click',function(){
							console.log('some one clicked me');
						});
						that.$el.find('.pagerw .finish').removeClass('disabled');
					} else {
						that.$el.find('.pagerw .next').show();
						that.$el.find('.pagerw .finish').hide();
					}
				 
					switch($current){
					case 1:
						that.changeText('Follow the instruction to create <strong>new department</strong>, These are basic information each department have name, language, timings(close at, open at) etc.');
						 break;
					 
					case 2:
						that.changeText('Add a few <strong>Job types</strong> eg <em> Hair Dresser </em>, if you leave this empty, than no problem, you can add this later.');
					 	break;
				 
					case 3:
						that.changeText('Add a few <strong>Services</strong>, if you leave this empty, than no problem, you can add this later. ');
					 break;
					case 4:
						that.changeText('You almost done, We would not bother you more, Simply add <strong>Employees</strong>, Who is working with you in this department, if you leave this empty, you can add back later.');
						break;
					case 5:
						that.changeText('<strong> Great! </strong> You have successfully created <strong>' + that.$el.find('.department-name').html() + '</strong>, If you want to add schedule, simply create a new schedule. I hope you know how to schedule otherwise, read <em>FAQ </em>. ');
						break;
					} 
					
					
				} ,onNext:function(tab, nav, index){
					var id = tab.data('id');
					switch(id){
					case 1:
						return that.saveBasicInfo(id);
						//that.saveBasicSetting();
						break;
					 
					case 2:
						//that.saveJobTypes(2);
						break;
				 
					case 3:
						//that.saveServices(3);
						break;
					case 4:
						//that.saveEmployees(4);
						break;
					}
				} });
			
			},
			changeText:function(txt){
				this.$el.find('.top-info').html(txt);
			},
			saveBasicInfo:function(id){
				this.app.showLoading('Saving information....',this.$el);
				this.clearFormInput();
				var name = this.$el.find('#txtname').val();
				if(!name){
					this.app.showLoading(false,this.$el);
					this.$el.find('.name-error').removeClass('hide');
					return false;
				}
				var desc = '';
				//var desc = this.$el.find('#txtdescription').val();
				//if(!desc){
				//	this.$el.find('.desc-error').removeClass('hide');
				//	this.app.showLoading(false,this.$el);
				//	return false;
				//}
				
				
				this.objModelBranch.set({name:name,notes:desc});
				var city = this.$el.find('#txtcity').val();
				var address = this.$el.find('#txtaddress').val();
				var zip = this.$el.find("#txtzip").val();
				if(!name){
					
				}
				
				this.objModelBranch.set({id:this.objModelBranch.get('id'),city:city,address:address,zip:zip});
				return this.saveTiming(this.id);
				
			},
			clearFormInput:function(){
				this.$el.find('.name-error').addClass('hide');	 
				this.$el.find('.desc-error').addClass('hide');
				this.$el.find('.help-block').addClass('hide');
			},
			saveTiming:function(id){
				
				 var days = [];
				 this.days = days;
				 var data = "";
				 var that = this;
			     $('.timings-div :checked').each(function() {
			    	 days.push($(this).val());
			     });
			     var returnValue = true;
			     if(days.length < 1){
			    	 that.$el.find('.timing-error').removeClass('hide');
			    	 this.app.showLoading(false,this.$el);
						return false;
			     }
			     _.each(days,function(index){ 
			    	 if(index){
					    	 console.log(that.$el.find("#txte"+index).val()) 
					    	 var start = that.$el.find("#txts"+index).val();
					    	 var end = that.$el.find("#txte"+index).val()
					    	
					    	 var diff = that.calculate(start,end);
					    	 console.log(index + 'start '+ start + ' end '+ end + 'difference')
					    	 if(diff < 1 ){
					    		var span = '<span class="help-block"><i class="fa fa-warning"></i>  We opened '+that.$el.find('.department-name').html() + ' on ' + index +'</span>';
					    		 that.$el.find("#txts"+index).after(span);
					    		 var span = '<span class="help-block"><i class="fa fa-warning"></i> We closed '+that.$el.find('.department-name').html()+ ' on' + index +'</span>';
					    		 that.$el.find("#txte"+index).after(span);
					    		 returnValue = false;
					    	 }
					    	
					    		 data += index+"="+start+"##"+end+'||';
			    	 } 
			     })
			     
			     if(returnValue == false){
			    	 this.app.showLoading(false,this.$el);
			    	 return false;
			     }
	                 var that = this;
	               this.objModelBranch.set({timing:data});
 				 
 				  $.when(this.objModelBranch.save({id:this.id})).done(function(data){
 					    var d = jQuery.parseJSON(data);
 					    that.id = d.id;
 					    that.setting.successMessage(that.$el.find('.department-name').html() + ' saved successfuly.');
 						that.app.showLoading(false,that.$el);
 						that.closeView();
 				  }).fail(function(){
 					 that.setting.successMessage(that.$el.find('.department-name').html() + ' Problem saving successfuly. ');
					 that.app.showLoading(false,that.$el);
 				   });
 				
 				
			},
			calculate:function(time1,time2) {
				 if(time1 == 0 || time2 == 0) return 0;
		         var hours = parseInt(time1.split(':')[0], 10) - parseInt(time2.split(':')[0], 10);
		         if(hours < 0) hours = 24 + hours;
		         
		         return hours;
		     },
		 
			fillCountries:function(){
				var url = "api/countries";
				 var that = this;
				 var options = "<select value=0>Select language</option>";
                jQuery.getJSON(url, function(tsv, state, xhr) {
                    var jobtypes = jQuery.parseJSON(xhr.responseText);
                    _.each(jobtypes,function(key){
                    	var selected = "";
                    	if(that.countryid == key.id)
                    		selected = "selected";
                   	  	options +="<option value='"+key.id+"' "+selected+">"+key.name+"</option>";
                   	  	
                    })
                    that.$el.find("#ddlcountries").html(options);
                    
                });
			},
			fillTimings:function(){
				var url = "api/gettimings";
				 var that = this;
				  
                jQuery.getJSON(url,{branchid:this.id}, function(tsv, state, xhr) {
                    var timings = jQuery.parseJSON(xhr.responseText);
                    _.each(timings,function(value,key,list){ 
                    	that.$el.find("#txts"+value.day).val(value.opened).removeAttr('disabled');
                    	that.$el.find("#txte"+value.day).val(value.closed).removeAttr('disabled');
                    	that.$el.find(".timings-div #"+value.day+"").attr('checked',true);
                    	that.$el.find('#chkall').attr('checked',true);
                    }) 
                    
                });
			},
			fillCurrencies:function(){
				var url = "api/currencies";
				 var that = this;
				 var options = "<select value=0>Select language</option>";
               jQuery.getJSON(url, function(tsv, state, xhr) {
                   var jobtypes = jQuery.parseJSON(xhr.responseText);
                   _.each(jobtypes,function(key){
                	   var selected = "";
                   	if(that.currencyid == key.id)
                   		selected = "selected";
                  	  	options +="<option value='"+key.id+"'  "+selected+">"+key.code+" -- "+key.name+"</option>";
                  	  	
                   })
                   that.$el.find("#ddlcurrencies").html(options);
                   
               });
			},
			fillJobTypes:function(){
				var that = this;
				require(['jobtypes/views/lists'],function(JobTypes){
					var objJobTypes = new JobTypes({setting:that.setting,id:that.id});
					that.$el.find(".table-jobtypes").html(objJobTypes.$el);
				})
			},
			fillServices:function(){
				var that = this;
				require(['services/views/lists'],function(Services){
					var objServices = new Services({setting:that.setting,id:that.id});
					that.$el.find(".table-services").html(objServices.$el);
				})
			},
			addSchedule:function(){
				var that = this;
				require(['schedule/views/lists'],function(Services){
					var objServices = new Services({setting:that.setting,id:that.id});
					that.$el.find(".table-schedule").html(objServices.$el);
				})
			},
			fillLanguages:function(){
				 var url = "api/languages";
				 var that = this;
				 var options = "<select value=0>Select language</option>";
                 jQuery.getJSON(url, function(tsv, state, xhr) {
                     var languages = jQuery.parseJSON(xhr.responseText);
                     _.each(languages,function(key){
                    	 var selected = "";
                     	if(that.countryid == key.id)
                     		selected = "selected";
                    	  	options +="<option value='"+key.id+"' "+selected+"  >"+key.title+"</option>";
                    	  	
                     })
                     that.$el.find("#ddllanguage").html(options);
                     
                 });
			},
			fillEmployees:function(){
				var that = this;
				require(['employees/views/lists'],function(Employees){
					var objEmployees = new Employees({setting:that.setting,id:that.id,from:'department'});
					that.$el.find(".table-employees").html(objEmployees.$el);
				})
			},
			fetchCities:function(){
				 var URL = "api/cities";
		         var that = this;
		         var country = this.app.users.country;
		          jQuery.getJSON(URL,{ country:country},  function (tsv, state, xhr) {
	                var _json = jQuery.parseJSON(xhr.responseText);
		                 that.$el.find("#txtcity").html(_.map(_json,function(value,key,list){
		                	 var checked = "";
		                	 if(that.id && that.city.toLowerCase().trim() == value.Name.toLowerCase().trim())
		                	   checked = "selected";
		                	 else if(!that.id && that.empcity && that.empcity.toLowerCase().trim() == value.Name.ID)
		                	   checked = "selected";
		                	 
		                	   return "<option value='"+value.Name+"'  "+checked+">"+value.Name+"</option>";}).join());
		                    
		           }); 
		     }, 
		 
		});
	});
