define( [ 'text!booking/tpl/createbooking.html','booking/models/booking' ,'timepick','daterangepicker'],
		function(template ,BookingModel,timepick,daterangepicker) {
			'use strict';
			return Backbone.View
					.extend({
						events : {
							'click .close-pp' : "closeView",
							"click .save-p" : "save",
							"click .add-new-box":"clone"
						},
						initialize : function() {
							this.template = _.template(template); 
							this.app = this.options.app;
							this.cloneId = 1;
							this.branchid = this.app.user_branch_id;
							 console.log(this.app);
							this.parent = this.options.page;
							 if(typeof this.options.page.branchid !="undefined" && this.options.page.branchid)
								this.branchid = this.options.page.branchid;
							this.render(); 
							   console.log(this.app.timings);
						},
						render : function() {
							this.$el.html(this.template());
							var that = this;
							this.startdate = null;
							this.enddate = null;
							//that.$el.find("#txtname").typeahead({
							//	  hint: true, 
							//	  local: that.app.globaljobtypes
							// }); 
							var startDate = new Date(); startDate.setDate( startDate.getDate() + 1 );
							this.$el.find('#scheduledate input').daterangepicker({
								format: 'YYYY-MM-DD',
							    startDate:startDate,
							    minDate: new Date()
							 } ,function(start, end, label) {
								 console.log(label + ' start ' +  start + ' end ' + end);
								that.startdate =  start.format('YYYY-MM-DD') ;
								that.enddate =  end.format('YYYY-MM-DD');
							  });
							
							 
						    this.fillEmployees();
						    this.fillJobTypes();
							if(typeof this.options.id == "undefined"){ 
							}
						},
						clone:function(){
							var quantity = this.$el.find("#ddlquantity").val();
							for(var i = 0; i<=quantity-1; i++){
								this.cloneFirstOne();
							}
						},
						cloneFirstOne:function(){
							
							this.app.showLoading('Loading Setting...',this.$el);
							this.cloneId= this.cloneId + 1;
							var count = this.cloneId ;
						 
							var clone = this.$el.find('.schedule-row div:first').clone();
							this.$el.find('.schedule-row div:first').removeClass('clone');
							clone.addClass('removable-clone'+this.cloneId);
							
							clone.find('.change-header').attr('id','area_'+count);
							clone.find('.change-body').attr('id','area_a'+count);
							var that = this;
							clone.find('.areas').on('click',function(){
								$(this).find('i').toggleClass("fa-chevron-down fa-chevron-up");
								console.log($(this)  + 'id is this' ); 
								var id = $(this).attr('id').split('_')[1];
								that.$el.find('#area_a'+id).slideToggle( "slow" );
							});
							var text  = this.$el.find('#ddljobtypes option:selected').text().trim();
							var id = this.$el.find('#ddljobtypes').val();
							clone.find('input[type=hidden]').val(id);
							clone.find('.portlet-title h4 strong').text('1  x ' +text);
							 this.$el.find('.schedule-row').prepend(clone);
							
							clone.show();
							clone.find('.btn-remove').on('click',function(){
								clone. remove();
							 
							});
							this.$el.find(".timepicker").timepicker({ 'timeFormat': 'H:i' });
							this.fillEmployees(id,clone);
							this.app.showLoading(false,this.$el);
						},
						closeView : function() { 
							var that = this;

							require([ 'schedulelist/views/lists' ],
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
						clearErrorFilter : function() {
							this.$el.find('.name-error').addClass('hide');
						}, 
						save : function() {
							var that = this;
							this.app.showLoading('Wait a moment....', this.$el);
							 
							this.$el.find('.schedule-div:not(:last-child)').each(function(){
								var timeto = $(this).find('.timeto').val();
								var timefrom = $(this).find('.timefrom').val();
								var jobtypeid = $(this).find('input[type=hidden]').val();
								var employeeid  = $(this).find('.ddlemployees').val();
							    console.log($(this).find('.ddlemployees').val());
								var objScheduleModel = new ScheduleModel();
								objScheduleModel.set('timefrom',timefrom);
								objScheduleModel.set('timeto',timeto)
								objScheduleModel.set('jobtypeid',jobtypeid);
								objScheduleModel.set('datefrom',that.startdate);
								objScheduleModel.set('dateto',that.enddate);
								objScheduleModel.set('employeeid',employeeid);
								objScheduleModel.set('branchid',that.branchid);
								objScheduleModel.save();
							})
							this.app.showLoading(false, this.$el); 
						 
							this.app.successMessage();
						 
						},
						fillEmployees:function(id,clone){
							var url = "api/employeebyid";
							 var that = this;
							 var employees ;
							 var names = new Array();
			                 var ids = new Object(); 
			                 var str = "<option value='0' selected> None <option>";
			                  jQuery.getJSON(url,{jobtypeid:id,branchid:this.branchid}, function(tsv, state, xhr) {
			                   var employees = jQuery.parseJSON(xhr.responseText);
			                   		_.each( employees, function ( value, key,list ) {
			                   			if(value.id){
			                   			  str+="<option value='"+value.id+"'> "+value.firstname + '' + value.lastname + " </option>";
			                   			  
			                   			}
			                         });  
			                              clone.find(".ddlemployees") .html(str);
			                              clone.find(".ddlemployees  option")
			                              .filter(function() {
			                                  return !this.value || $.trim(this.value).length == 0;
			                               })
			                              .remove();

			                       	   	 
			                  		 
			                   
			                   });
						 },
						fillJobTypes:function(){
							 
							var url = "api/jobtypes";
							var that = this;
							var str = "";
							jQuery.getJSON(url, {franchiseid:this.app.user_franchise_id},function(tsv, state, xhr) {
			                   var employees = jQuery.parseJSON(xhr.responseText);
			                   		_.each( employees, function (value,key,list)
			                               {
			                                 str+= "<option value='"+value.id+"'>"+ value.name +"</option>";
			                               } ); 
					                   	  that.$el.find("#ddljobtypes").html(str);
					                   	 
			                   
			                   });
						},

					});
		});
