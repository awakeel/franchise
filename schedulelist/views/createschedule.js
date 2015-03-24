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
							this.app.checkTiming(this.app);
							this.render(); 
							
							this.branchTimings();
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
						getDate:function(date){
							return date.slice(0,4) + '-' + date.slice(4,6) +'-'+ date.slice(6,8);
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
								console.log(this.model.get('datefrom'));
								var date = this.getDate(this.options.model.get('datefrom'));
								var date1 = this.getDate(this.options.model.get('dateto'));
								   this.startDate = date.trim();
								   this.endDate = date1.trim();
								   that.$el.find('.date-picker input').val(this.startDate  +' - '+  this.endDate);
							} 
							
							this.$el.find('.date-picker input').daterangepicker({
								format: 'YYYY-MM-DD',
							    startDate:this.startDate,
							    endDate:this.endDate
							    ///minDate: new Date()
							 } ,function(start, end, label) {
								 
					 			that.startDate =  start.format('YYYY-MM-DD') ;
								that.endDate =  end.format('YYYY-MM-DD');
							  });
							
							 
						   // this.fillEmployees();
						    this.fillJobTypes();
						    if(typeof this.options.model  !="undefined"){
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
							var that = this;
							var empid = 0;
							var clone = this.$el.find('.schedule-row div:first').clone();
							

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
                            if(typeof value == "undefined"){
								var id = this.$el.find('#ddljobtypes').val();
								var text  = this.$el.find('#ddljobtypes option:selected').text().trim();
								clone.find('.jobtype-hdn').val(id);
								clone.find('.portlet-title h4 strong').text('1  x ' +text);
								that.fillEmployees(id,clone,empid);
								that.checkFunction(clone);
								that.app.showLoading(false,that.$el);
							}else{
								empid = value.employeeid;
								var id = value.jobtypeid;
								clone.find('.scheduleid-hdn').val(value.id);
								var URL = "api/getscheduletiming"; 
								 var that = this;
								 this.app.showLoading('Loading Timing...',clone.find(".timings-div-schedule"));
								 $.getJSON(URL,{scheduleid:value.id},  function (tsv, state, xhr) {
									 var _json =jQuery.parseJSON( xhr.responseText );
									 _.each(_json,function(value,key,list){
										 clone.find("#txts"+value.day).val(value.start).removeAttr('disabled');
										 clone.find("#txte"+value.day).val(value.end).removeAttr('disabled');
										 clone.find(".timings-div-schedule #"+value.day+"").attr('checked',true);
									 });
									 that.app.showLoading(false,clone.find(".timings-div-schedule"));
									    clone.find('.jobtype-hdn').val(id);
										clone.find('.portlet-title h4 strong').text('1  x ' + value.jobtype);
										that.fillEmployees(id,clone,empid);
										that.checkFunction(clone);
										that.app.showLoading(false,that.$el);
								 })
							
							}
							clone.show();
							clone.find('.btn-remove').on('click',function(){
								clone. remove();
							 
							});
							 
							
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
							 var data = {title:title,branchid:this.app.user_branch_id};
							 if(this.id){
								   data = {title:title,branchid:this.app.user_branch_id,schedulegroupid:this.options.model.get('schedulegroupid')};
							 }
							 this.app.showLoading('Saving Schedule....', this.$el.find('.schedule-row'));
							 $.getJSON(URL,data,  function (tsv, state, xhr) {
	   	 		                var groupid = jQuery.parseJSON(xhr.responseText);
	   	 		                var l = 0;
	   	 		                that.$el.find('.schedule-div:not(:last-child)').each(function(index){
	   	 		                	var data = that.getScheduleTiming($(this));
	   	 		                	var days = "";
	   	 		                	l = l + 1;
	   	 		                    $(this).find('.timings-div-schedule .days:checked').each(function() {
							    	 days +=($(this).val())+",";
							        });
									var jobtypeid = $(this).find('.jobtype-hdn').val();
									var employeeid  = $(this).find('.ddlemployees').val();
								    var objScheduleModel = new ScheduleModel(); 
									if(this.id){
										var sid = $(this).find('.scheduleid-hdn').val();
										objScheduleModel.set('id',sid);
									}
								 
									objScheduleModel.set('jobtypeid',jobtypeid);
									objScheduleModel.set('datefrom',that.startDate);
									objScheduleModel.set('dateto',that.endDate);
									objScheduleModel.set('employeeid',employeeid);
									objScheduleModel.set('branchid',that.branchid);
									objScheduleModel.set('data',data);
									objScheduleModel.set('days',days);
									objScheduleModel.set('schedulegroupid',groupid); 
										objScheduleModel.save(null,{success:function(){
											that.app.showLoading(false, that.$el.find('.schedule-row')); 
											that.app.successMessage('Schedule '+ l + ' Saved Successfully' );
									       	that.closeView();
										}} );
									})
									
	   	 				     });
							 
								
						},
						calculate:function(time1,time2) {
							 if(time1 == 0 || time2 == 0) return 0;
					         var hours = parseInt(time1.split(':')[0], 10) - parseInt(time2.split(':')[0], 10);
					         if(hours < 0) hours = 24 + hours;
					         
					         return hours;
					     },
						getScheduleTiming:function(div){
							 var days = [];
							 this.days = days;
							 var data = "";
							 var that = this;
						     div.find('.timings-div-schedule .days:checked').each(function() {
						    	 days.push($(this).val());
						     });

						     var returnValue = true;
						     if(days.length < 1){
						    	  
									return false;
						     }
						     div.find('.help-block').addClass('hide');
						     _.each(days,function(index){ 
						    	 if(index){ 
								    	 var start = div.find("#txts"+index).val();
								    	 var end =div.find("#txte"+index).val()
								    	
								    	 var diff = that.calculate(start,end);
								    	 console.log(index + 'start '+ start + ' end '+ end + 'difference')
								    	 if(diff < 1 ){
								    		var span = '<span class="help-block"><i class="fa fa-warning"></i>  Time from</span>';
								    		div.find("#txts"+index).after(span);
								    		 var span = '<span class="help-block"><i class="fa fa-warning"></i> Time to</span>';
								    		 div.find("#txte"+index).after(span);
								    		 returnValue = false;
								    	 }
								    	
								    		 data += index+"="+start+"##"+end+'||';
						    	 } 
						     })
						     return data;
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
			                   			  str+="<option "+selected+" value='"+value.id+"'> "+value.firstname + '  ' + value.lastname + " </option>";
			                   			  
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
						checkFunction:function(clone){ 
							clone.find('#chkall').on('click',function(ev){ 
								if($(ev.target).is(':checked')){
									clone.find('.days').prop("checked",true);
									clone.find('.first-text').attr('disabled',false);
									clone.find('.end-text').attr('disabled',false);
									clone.find('.first-text').each(function(){ 
										 $(this).val($(this).data('start'));
									})
									clone.find('.end-text').each(function(){
										$(this).val($(this).data('end'));
									}) 
								}else{
									clone.find('.days').prop("checked",false);
									clone.find('.first-text').attr('disabled',true);
									clone.find('.end-text').attr('disabled',true);
									clone.find(".first-text").val('')
									clone.find(".end-text").val('')
								}
								
							})  
							clone.find('.days').on('click',function(){
								 
								if($(this).prop('checked')!= true){
									clone.find("#txts"+$(this).attr('id')).attr('disabled',true);
									clone.find("#txte"+$(this).attr('id')).attr('disabled',true)
									var first = clone.find("#txts"+$(this).attr('id')).val('');
									var end = clone.find("#txte"+$(this).attr('id')).val('');
								}else{
									clone.find("#txts"+$(this).attr('id')).attr('disabled',false);
									clone.find("#txte"+$(this).attr('id')).attr('disabled',false)
									var first = clone.find("#txts"+$(this).attr('id')).data('start');
									var end =clone.find("#txte"+$(this).attr('id')).data('end');
									clone.find("#txts"+$(this).attr('id')).val(first);
									clone.find("#txte"+$(this).attr('id')).val(end);
								}
							})
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
						
						branchTimings:function(){
							var url = "api/gettimings";
							var that = this;
							var str = "";
							 var day   ;
							    var close  ;
							    var open  ;   
							jQuery.getJSON(url, {branchid:this.app.user_branch_id},function(tsv, state, xhr) {
			                   var employees = jQuery.parseJSON(xhr.responseText);
			                         var str = ""; 
			                         that.$el.find(".timings-div-schedule").html('');
			                   		_.each(employees,function(value,key,list){ 
			                   		 day = value.day;
								      close = value.closed;
								      open = value.opened; 
			                   		    str =(' <tr> <td> <div class="checkbox"><label>'+
			                   		    		'<input name="days_group[]" class="days" id='+value.day+'  type="checkbox" value="'+value.day+'">'+that.capatalize(value.day)+' </label></div></td>'+
			                   		    		'<td><input type="text" disabled class="timepicker form-control  first-text" data-start='+open+' data-end='+close+'  id="txts'+value.day+'" /></td>'+
			                   		    		'<td><input type="text" disabled class="timepicker form-control end-text" data-start='+open+' data-end='+close+'  id="txte'+value.day+'" /></td></tr>');
									    var $tr =  $(str).appendTo(".timings-div-schedule");
									    
									      that.$el.on('focus',"#txts"+day, function(){
									    	  var open1 = $(this).data('start');
									    	  var close1 =$(this).data('end');
									    	    $(this).timepicker({ 'timeFormat': 'H:i' , 'minTime':open1, 'maxTime': close1,
												    'showDuration': true});
									    	});
									      that.$el.on('focus',"#txte"+day, function(){
									    	  var open1 = $(this).data('start');
									    	  var close1 =$(this).data('end');
									    	    $(this).timepicker({ 'timeFormat': 'H:i' , 'minTime':open1, 'maxTime': close1,
												    'showDuration': true});
									    	});

										   
									    
			                   		 })
			                   		
			                   });
					    	

						},
						weekDays:function(day,open,close){
							var that = this;
							console.log(that.$el.find('.timings-div').find("#txts"+day));
						},
						capatalize:function(str){
							return str.charAt(0).toUpperCase() + str.slice(1);
						}

					});
		});
