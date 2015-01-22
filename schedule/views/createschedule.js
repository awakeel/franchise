define( [ 'text!schedule/tpl/createschedule.html','schedule/models/schedule' ],
		function(template ,ScheduleModel) {
			'use strict';
			return Backbone.View
					.extend({
						events : {
							'click .close-pp' : "closeView",
							"click .save-p" : "save",
							"click .add-new-box":"cloneFirstOne"
						},
						initialize : function() {
							this.template = _.template(template); 
							this.app = this.options.page.setting;
							this.cloneId = 1;
							this.branchid = this.app.users.branchid;
							 
							this.parent = this.options.page;
							 if(typeof this.options.page.branchid !="undefined" && this.options.page.branchid)
								this.branchid = this.options.page.branchid;
							this.render(); 
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
							
							this.$el.find('#scheduledate input').daterangepicker({format: 'YYYY-MM-DD'
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
						cloneFirstOne:function(){
							this.app.showLoading('Loading Setting...',this.$el);
							this.cloneId= this.cloneId + 1;
							var count = this.cloneId ;
						 
							var clone = this.$el.find('.schedule-row div:first').clone();
							this.$el.find('.schedule-row div:first').removeClass('clone');
							clone.find('.change-header').attr('id','area_'+count);
							clone.find('.change-body').attr('id','area_a'+count);
							var that = this;
							clone.find('.areas').on('click',function(){
								$(this).find('i').toggleClass("fa-chevron-down fa-chevron-up");
								console.log($(this)  + 'id is this' ); 
								var id = $(this).attr('id').split('_')[1];
								that.$el.find('#area_a'+id).slideToggle( "slow" );
							});
							var text  = this.$el.find('#txtjobtypes').val().trim();
							var id = that.jobtypes[text] ;
							clone.find('input[type=hidden]').val(id);
							clone.find('.portlet-title h4 strong').text("1 " +text);
							this.$el.find('.schedule-row').prepend(clone);
						
							clone.show();
							this.$el.find(".timepicker").timepicker({ 'timeFormat': 'H:i' });
							this.fillEmployees(id,clone);
							this.app.showLoading(false,this.$el);
						},
						closeView : function() { 
							var that = this;

							require([ 'schedule/views/lists' ],
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
							 
							this.$el.find('.clone').each(function(){
								var timeto = $(this).find('.timeto').val();
								var timefrom = $(this).find('.timefrom').val();
								var jobtypeid = $(this).find('input[type=hidden]').val();
								var text  = $(this).find('.employees').val().trim();
								var employeeid = that.employees[text] ;
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
			                  jQuery.getJSON(url,{jobtypeid:id,branchid:this.branchid}, function(tsv, state, xhr) {
			                   var employees = jQuery.parseJSON(xhr.responseText);
			                   		_.each( employees, function ( employee, index )
			                               {   names.push( employee.firstname + '  ' + employee.lastname );
			                                   ids[employee.firstname + '  ' + employee.lastname] = employee.id;
			                               } );  
			                              that.employees = ids;
			                              clone.find(".employees") .
				                      	   
			                       	    typeahead({
			                       		  
			                       		    local:names
			                       		} );	 
			                  		 
			                   
			                   });
						 },
						fillJobTypes:function(){
							 
							var url = "api/jobtypes";
							 var that = this;
							 this.jobtypes = null;
							 var names = new Array();
			                 var ids = new Object(); 
			                  jQuery.getJSON(url, function(tsv, state, xhr) {
			                   var employees = jQuery.parseJSON(xhr.responseText);
			                   		_.each( employees, function ( j, index )
			                               {
			                                   names.push( j.name );
			                                   ids[j.name] = j.id;
			                               } ); 
					                   	  that.$el.find("#txtjobtypes").typeahead({
					                  		    
					                  		    local:names
					                  	});
					                   	 that.jobtypes = ids;
					                   	 
			                   
			                   });
						},

					});
		});
