define( [ 'text!schedulelist/tpl/createschedule.html','schedule/models/schedule' ,'timepick','daterangepicker'],
		function(template ,ScheduleModel,timepick,daterangepicker) {
			'use strict';
			return Backbone.View
					.extend({
						events : {
							'click .close-pp' : "closeView",
							"click .save-p" : "save",
							"click .add-new-box":"clone", 
						},
						initialize : function() {
							this.template = _.template(template); 
							this.app = this.options.page.setting;
							this.cloneId = 1;
							this.id = null;
							this.branchid = this.app.user_branch_id;
							this.parent = this.options.page;
							
							if(typeof this.options.page.branchid !="undefined" && this.options.page.branchid)
							   this.branchid = this.options.page.branchid;
							
							this.render(); 
							this.app.checkTiming(this.app);
						},
						
						fetchAllData:function(groupid){
						this.app.showLoading('Loading data...',this.$el);
							 var URL = "api/getschedulebygroupid"; 
							 var that = this;
							 $.getJSON(URL,{groupid:groupid},  function (tsv, state, xhr) {
								 var _json =jQuery.parseJSON( xhr.responseText );
								 _.each(_json,function(value,key,list){
									   
									 that.cloneFirstOne(value);
								 });
							 })
							this.app.showLoading(false,this.$el);
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
							var endDate;
							var startDate = new Date(); startDate.setDate( startDate.getDate() + 1 );
							if(typeof this.options.model  !="undefined"){
								var date = this.options.model.get('datefrom');
								var date1 = this.options.model.get('dateto');
								   this.startDate = date.trim();
								   this.endDate = date1.trim();
								   console.log(this.startDate + ' End Date ' + this.endDate);
							}
							
							this.$el.find('.date-picker input').daterangepicker({
								format: 'YYYY-MM-DD',
							    startDate:this.startDate,
							    endDate:this.endDate
							    ///minDate: new Date()
							 } ,function(start, end, label) {
								/// that.$el.find('.date-picker input').val(start +' - '+ end);
					 			that.startDate =  start.format('YYYY-MM-DD') ;
								that.endDate =  end.format('YYYY-MM-DD');
							  });
							
							 
						   // this.fillEmployees();
						    this.fillJobTypes();
						    if(typeof this.options.model  !="undefined"){
						    	console.log('checking option id '+ this.options.model.get('schedulegroupid'));
								this.id = this.options.model.get('id');
								//this.$el.find('.date-picker input').val(this.startDate +' - '+ this.endDate);
								this.$el.find('#txttitle').val(this.options.model.get('title'));
								 this.fetchAllData(this.options.model.get('schedulegroupid'));
							 	}
							 						},
							clone:function(){
								var quantity = this.$el.find("#ddlquantity").val();
								for(var i = 0; i<=quantity-1; i++){
									this.cloneFirstOne();
								}
							},
						cloneFirstOne:function(value){
							
							this.app.showLoading('Loading Setting...',this.$el);
							this.cloneId= this.cloneId + 1;
							var count = this.cloneId ;
							var empid = 0;
							var clone = this.$el.find('.schedule-row div:first').clone();
							if(typeof value == "undefined"){
								var id = this.$el.find('#ddljobtypes').val();
								var text  = this.$el.find('#ddljobtypes option:selected').text().trim();
								clone.find('.jobtype-hdn').val(id);
								clone.find('.portlet-title h4 strong').text('1  x ' +text);
							}else{
								empid = value.employeeid;
								var id = value.jobtypeid;
								clone.find('.scheduleid-hdn').val(value.id);
								clone.find('.timeto').val(value.end);
							    clone.find('.timefrom').val(value.start);
							    console.log(value.jobtypeid);
							    clone.find('.jobtype-hdn').val(id);
								clone.find('.portlet-title h4 strong').text('1  x ' + value.jobtype);

							}

							this.$el.find('.schedule-row div:first').removeClass('clone');
							clone.addClass('removable-clone'+this.cloneId);
							
							clone.find('.change-header').attr('id','area_'+count);
							clone.find('.change-body').attr('id','area_a'+count);
							var that = this;
							clone.find('.areas').on('click',function(){
								$(this).find('i').toggleClass("fa-chevron-down fa-chevron-up");
							 
								var id = $(this).attr('id').split('_')[1];
								that.$el.find('#area_a'+id).slideToggle( "slow" );
							});
                            this.$el.find('.schedule-row').prepend(clone);
							clone.show();
							clone.find('.btn-remove').on('click',function(){
								clone. remove();
							 
							});
							this.$el.find(".timepicker").timepicker({ 'timeFormat': 'H:i' , 'minTime':this.app.timings[0].opened,
							    'maxTime': this.app.timings[0].closed,
							    'showDuration': true});
							this.fillEmployees(id,clone,empid);
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
							
							 var groupid = 0;
							 var total = this.$el.find('.schedule-div:not(:last-child)').length;
							 var URL = "api/saveschedulegroup"; 
							 var title = that.$el.find('#txttitle').val();
							 if(!title){
								 swal({
								      title: "Warning",
								      text: "Please enter title",
								      type: "error" 
								   
								    });
								 return;
							 }
							 if(!that.startDate || !that.endDate){
								 swal({
								      title: "Warning",
								      text: "Please select date range",
								      type: "error" 
								   
								    });
								 return;
						     }
							 if(!that.startDate || !that.endDate){
									 swal({
									      title: "Warning",
									      text: "Please select date range",
									      type: "error" 
									   
									    });
									 return;
							 }
							 var total = that.$el.find('.schedule-div:not(:last-child)').length;
							 if(total < 1){
								 swal({
								      title: "Warning",
								      text: "Please choose atleast one job type",
								      type: "error" 
								   
								    });
								 return;
							 }
							 var data = {title:title};
							 if(this.id){
								   data = {title:title,schedulegroupid:this.options.model.get('schedulegroupid')};
							 }
							 this.app.showLoading('Saving Schedule....', this.$el);
							 $.getJSON(URL,data,  function (tsv, state, xhr) {
	   	 		                var groupid = jQuery.parseJSON(xhr.responseText);
	   	 		                that.$el.find('.schedule-div:not(:last-child)').each(function(index){
								var timeto = $(this).find('.timeto').val();
								var timefrom = $(this).find('.timefrom').val();
								var jobtypeid = $(this).find('.jobtype-hdn').val();
								var employeeid  = $(this).find('.ddlemployees').val();
							   var objScheduleModel = new ScheduleModel();
								objScheduleModel.set('timefrom',timefrom);
								if(this.id){
									var sid = $(this).find('.scheduleid-hdn').val();
									objScheduleModel.set('id',sid);
								}
								
								objScheduleModel.set('timeto',timeto)
								objScheduleModel.set('jobtypeid',jobtypeid);
								objScheduleModel.set('datefrom',that.startDate);
								objScheduleModel.set('dateto',that.endDate);
								objScheduleModel.set('employeeid',employeeid);
								objScheduleModel.set('branchid',that.branchid);
								objScheduleModel.set('schedulegroupid',groupid); 
								objScheduleModel.save(null,{success:function(){
									that.app.showLoading(false, that.$el); 
									that.app.successMessage();
							       	that.closeView();
								}} );
								})
	   	 				     });
							
								this.app.showLoading(false,this.$el);
						},
						fillEmployees:function(id,clone,empid){
							var url = "api/employeebyid";
							 var that = this;
							 var employees ;
							 var names = new Array();
			                 var ids = new Object(); 
			                 var str = "<option value='0' selected> None <option>";
			                  jQuery.getJSON(url,{jobtypeid:id,branchid:this.branchid}, function(tsv, state, xhr) {
			                   var employees = jQuery.parseJSON(xhr.responseText);
			                   		_.each( employees, function ( value, key,list ) {
			                   			var selected = "";
			                   			if(empid !=0 && empid == value.id){
			                   				selected =  "selected" ;
			                   			}
			                   			if(value.id){
			                   			  str+="<option "+selected+" value='"+value.id+"'> "+value.firstname + '' + value.lastname + " </option>";
			                   			  
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
