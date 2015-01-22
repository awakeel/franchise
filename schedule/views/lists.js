define(['text!schedule/tpl/schedule.html','schedule/collections/schedules','fullcalendar','timepick','daterangepicker','typeahead','datepicker'],
	function (template,Schedules,calendar,timepicker,daterangepicker,typeahead,datepicker) {
		'use strict';
		return Backbone.View.extend({  
			events:{
			 	"click .delete-token":"deleteToken",
			 	"click .edit-token":"updateToken",
			 	"click .add-new":'addNewSchedule',
			 	"click .close-p":"closeSchedule",
			  
			 	"change #ddlscheduletype":"changeCalenderView"
			},
            initialize: function () {
				this.template = _.template(template);
				//this.listenTo(this.model, 'change', this.render);
			   // this.listenTo(this.model, 'destroy', this.remove);
			    this.setting = this.options.setting;
			    this.app = this.setting;
			    this.objSchedules = new Schedules();
			    this.render();
				
			},
			changeCalenderView:function(ev){
				var res;
				var that = this;
				this.app.showLoading('Loading schedule...',this.$el);
				if($(ev.target).val() == "1"){
					this.fetchJobTypes(); 
					 
				}else{
					  
					this.fetchEmployees();
					 
				}
				this.app.showLoading(false,this.$el);
			},
			render: function () {
				this.$el.html(this.template( ));
				this.app.showLoading('Loading schedule...',this.$el);
				
				var that = this;
				 this.$el.find('#txtdate').datepicker({ todayBtn: true,
					    clearBtn: true,
					    autoclose: true,
					    todayHighlight: true
					});
				///);
				 this.$el.find('#txtdate').datepicker()
				    .on('changeDate', function(e){
				    	that.$el.find('#calendar').fullCalendar('gotoDate',e.date)
				    });
				    this.fetchJobTypes();  
				
				 this.app.showLoading(false,this.$el);
			}  ,
			addNewSchedule:function(){
				
				var that = this;
				require(['schedule/views/createschedule'],function(AddUpdate){
					var objAddUpdate = new AddUpdate({id:1,page:that});
					that.$el .html(objAddUpdate.$el);
				})
				
			},
			closeSchedule:function(){
				this.$el.find("#popup").hide();
			},
			initScheduleCalander:function(models,resource){
					console.log(resource);
				 var date = new Date();
	                var d = date.getDate();
	                var m = date.getMonth();
	                var y = date.getFullYear();
			        var that = this;
			        this.$el.find('#calendar').empty();
	                var calendar = this.$el.find('#calendar').fullCalendar({
	                    header: {
	                        left: 'prev,next today',
	                        center: 'title',
	                        right: ' '
	                    },
	                    titleFormat: 'ddd, MMM dd, yyyy',
	                    defaultView: 'resourceDay',
	                    //selectable: true,
	                    formatDate:(new Date()).toISOString().slice(0, 10),
	                    selectHelper: true,
	                    allDayDefault:false,
	                   /* select: function(start, end, allDay, event, resourceId) {
	                        var title = prompt('Event Title:');
	                        if (title) {
	                            console.log("@@ adding event " + title + ", start " + start + ", end " + end + ", allDay " + allDay + ", resource " + resourceId);
	                            calendar.fullCalendar('renderEvent',
	                            {
	                                title: title,
	                                start: start,
	                                end: end,
	                                allDay: false,
	                                resourceId: resourceId
	                            },
	                            true // make the event "stick"
	                        );
	                        }
	                        calendar.fullCalendar('unselect');
	                    },*/
	                    eventResize: function(event, dayDelta, minuteDelta) {
	                        console.log("@@ resize event " + event.title + ", start " + event.start + ", end " + event.end + ", resource " + event.resourceId);
	                    },
	                    eventDrop: function( event, dayDelta, minuteDelta, allDay) {
	                        console.log("@@ drag/drop event " + event.title + ", start " + event.start + ", end " + event.end + ", resource " + event.resourceId);
	                    },
	                    editable: true,
	                    resources: resource,
	                    events:  models
	                     
	                });
 
				 
			},
		      
			 fetchJobTypes:function(){
				 var URL = "api/jobtypes";
		         var that = this;
		         var str = "";  
		         this.jobtypes = null;
	            jQuery.getJSON(URL,{branchid:this.branchid},  function (tsv, state, xhr) {
	                var _json = jQuery.parseJSON(xhr.responseText);
	                var jobtypes = _json;
	                that.jobtypes = jobtypes;
	            	that.objSchedules.fetch({data:{jobtypeid:1},success:function(data){
						 that.initScheduleCalander(that.objSchedules.toJSON(),jobtypes);
					 }})
	                _.each(jobtypes,function(value,key,list){ 
	                	var check = "";
	                	 
						str+='<li>';
						str+='<label> <input type="checkbox" value="'+value.id+'" '+check+'>'+value.name;
							str+='</label>';
								str+='</li>';
					});
	               
	                that.$el.find('.selection-box ul ').html(str);
	            }); 
		     },
		     fetchEmployees:function(id,clone){
					var url = "api/employeesgetall";
					 var that = this;
					 var str = "";
	                  jQuery.getJSON(url,{ branchid:this.branchid}, function(tsv, state, xhr) {
	                   var employees = jQuery.parseJSON(xhr.responseText);
	                   	that.employees = employees; 
	                   	that.objSchedules.fetch({data:{employeeid:1},success:function(data){
							 that.initScheduleCalander(that.objSchedules.toJSON(),employees);
						 }})
	                   	_.each(employees,function(value,key,list){ 
		                	var check = "";
		                	 
							str+='<li><img style="width: 100px; height: 100px;" src="userimages/'+value.picture+'">';
							str+='<label> <input type="checkbox" value="'+value.id+'" '+check+'>'+value.name;
								str+='</label>';
									str+='</li>';
						});
		                that.$el.find('.selection-box ul ').html(str);
	                   });
				 }        
			        
/*

			    $('#btnInit').click(function () {
			        $.ajax({
			            type: 'POST',
			            url: "/Home/Init",
			            success: function (response) {
			                if (response == 'True') {
			                    $('#calendar').fullCalendar('refetchEvents');
			                    alert('Database populated! ');
			                }
			                else {
			                    alert('Error, could not populate database!');
			                }
			            }
			        });
			    });

			    $('#btnPopupCancel').click(function () {
			        ClearPopupFormValues();
			        $('#popupEventForm').hide();
			    });

			    $('#btnPopupSave').click(function () {

			        $('#popupEventForm').hide();

			        var dataRow = {
			            'Title': $('#eventTitle').val(),
			            'NewEventDate': $('#eventDate').val(),
			            'NewEventTime': $('#eventTime').val(),
			            'NewEventDuration': $('#eventDuration').val()
			        }

			        ClearPopupFormValues();

			        $.ajax({
			            type: 'POST',
			            url: "/Home/SaveEvent",
			            data: dataRow,
			            success: function (response) {
			                if (response == 'True') {
			                    $('#calendar').fullCalendar('refetchEvents');
			                    alert('New event saved!');
			                }
			                else {
			                    alert('Error, could not save event!');
			                }
			            }
			        });
			    });

			    function ShowEventPopup(date) {
			        ClearPopupFormValues();
			        $('#popupEventForm').show();
			        $('#eventTitle').focus();
			    }

			    function ClearPopupFormValues() {
			        $('#eventID').val("");
			        $('#eventTitle').val("");
			        $('#eventDateTime').val("");
			        $('#eventDuration').val("");
			    }

			    function UpdateEvent(EventID, EventStart, EventEnd) {

			        var dataRow = {
			            'ID': EventID,
			            'NewEventStart': EventStart,
			            'NewEventEnd': EventEnd
			        }

			        $.ajax({
			            type: 'POST',
			            url: "/Home/UpdateEvent",
			            dataType: "json",
			            contentType: "application/json",
			            data: JSON.stringify(dataRow)
			        });
			    }
 


			}


		 

 
*/
		});
	});
