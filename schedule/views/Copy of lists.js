define(['text!schedule/tpl/schedule.html','schedule/collections/schedules','fullcalendar','timepick','daterangepicker','typeahead','datepicker','qtip'],
	function (template,Schedules,calendar,timepicker,daterangepicker,typeahead,datepicker,qtip) {
		'use strict';
		return Backbone.View.extend({  
			events:{
			  
			 	"click .close-p":"closeSchedule", 
			 	"change #ddlemployees":"showEmployees",
			 	"change #ddljobtypes":"showJobTypes",
			 	"change #ddlschedules":"showSchedules",
			 	"click .color-code":"showCode"
			},
            initialize: function () {
				this.template = _.template(template);
			 
			    this.setting = this.options.setting;
			    this.app = this.setting;
			    this.objSchedules = new Schedules();
			    this.scheduleid = null;
			    this.employeeid = null;
			    this.jobtypes = null;
			    this.jobtypeid = null;
			    this.app.getTiming(this.app.user_branch_id);
			    this.fetchSchedules();
			    this.fetchEmployees();
			    this.fetchJobTypes();
			    this.render();
				
			},
			showCode:function(){
				var str = "";
				_.each(this.jobtypes,function(value,key,list){
					str +="<tr>";
					str +="<td>"+value.name+"</td>";
					str +="<td><label style='padding-left:25px;padding-right:25px;background:"+value.color+"'>&nbsp;</label></td>";
					str +="</tr>";
				})
				this.$el.find('#colorcode table tbody').html(str);
				this.$el.find('#colorcode').modal('show');
			},
			showEmployees:function(ev){
				var id = $(ev.target).val();
				this.employeeid = id;
				this.jobtypeid = null;
				this.scheduleid = null;
				//this.changeCalender(id);
			},
			showJobTypes:function(ev){
				var id = $(ev.target).val();
				this.jobtypeid = id;
				this.employeeid = null; 
				this.scheduleid = null;
				//this.fetchEmployees(id);
				//this.changeCalender(id);
			},
			showSchedules:function(ev){
				var id = $(ev.target).val();
				this.scheduleid = id;
				this.employeeid = null;
				this.jobtypeid = null; 
				//this.fetchJobTypes(id);
				//this.changeCalender(id);
			},
			changeCalender:function(value){
				this.fetchData();
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
				   this.$el.find('#txtdate').datepicker({})
				    .on('changeDate', function(e){
				    	 that.$el.find('#calendar').fullCalendar('gotoDate',e.date)
				    });
				this.fetchData();
				
				 this.app.showLoading(false,this.$el);
			},
			closeSchedule:function(){
				this.$el.find("#popup").hide();
			},
			initScheduleCalander:function(models){  
				    var start,end;
				   	start = this.app.timings[0].opened.split(':')[0];
					end = this.app.timings[0].closed.split(':')[0];
				    var date = new Date();
	                var d = date.getDate();
	                var m = date.getMonth();
	                var y = date.getFullYear();
			        var that = this;

			    	
			        this.$el.find('#calendar').empty();
	                var calendar = this.$el.find('#calendar').fullCalendar({
	                    header: {
	                    	left: 'prev,next today',
	        				center:'title',
	        				right: 'month,agendaWeek,agendaDay'
	                    },
    					titleFormat: {
    						  month: 'MMMM yyyy',
    						  week: "d[ MMM][ yyyy]{ '&#8212;' d MMM yyyy}",
    						  day: 'dddd, MMM d, yyyy'
    						},
	                    defaultView: 'agendaWeek',
	                    //selectable: true,
	                    formatDate:(new Date()).toISOString().slice(0, 10),
	                    selectHelper: true,
	                    minTime:start,
	                    maxTime:end, 
	                    slotMinutes:30, 
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
	                    
	                    viewDisplay: function (element) {
	                    	
	                    },
	                    eventResize: function(event, dayDelta, minuteDelta) {
	                        console.log("@@ resize event " + event.title + ", start " + event.start + ", end " + event.end + ", resource " + event.resourceId);
	                    },
	                    eventDrop: function( event, dayDelta, minuteDelta, allDay) {
	                        console.log("@@ drag/drop event " + event.title + ", start " + event.start + ", end " + event.end + ", resource " + event.resourceId);
	                    },
	                    eventRender: function(event, element) {  
	                    	element.find('.fc-event-inner').empty();
	                    	var content = '<h3>'+event.description+'</h3>' + 
	                    	'<p><b>Assign to :</b> '+event.name+'<br />' + 
	        				'<p><b>Start:</b> '+event.start+'<br />' + 
	        				(event.end && '<p><b>End:</b> '+event.end+'</p>' || '');
	                    	 element.qtip({ 
	                             content:content,
	                             style: {
	                                 background: 'black',
	                                 color: '#FFFFFF'
	                             },
	                             hide: {
	                                 delay: 200,
	                                 fixed: true, // <--- add this
	                                 effect: function() { $(this).fadeOut(250); }
	                             },
	                             position: {
	                            	 my: 'bottom center',
		    			    			at: 'top center',
		    			    			target: 'mouse',
		    			    			viewport: $('#fullcalendar'),
		    			    			adjust: {
		    			    				mouse: false,
		    			    				scroll: false
		    			    			}
	                             }
	                         }); 
 
	                    },
	                    eventBackgroundColor:'#fff',
	                    editable: false, 
	                    events:  models
	                     
	                });
 
				 
			},
		      
			 fetchJobTypes:function(id){
				 var URL = "api/jobtypeschedule";
		         var that = this;
		         that.$el.find("#ddljobtypes").html("<option selected value='0'> All Job types </option>");
	            jQuery.getJSON(URL,{franchiseid:this.app.user_franchise_id,sid:id},  function (tsv, state, xhr) {
	            	 var _json = jQuery.parseJSON(xhr.responseText);
	            	 if(!that.jobtypes)
	            		 that.jobtypes = _json;
		                 that.$el.find("#ddljobtypes").append(_.map(_json,function(value,key,list){ console.log(value);return "<option value="+value.id+">"+value.name +  "</option>";}).join());
		                 that.app.showLoading(false,this.$el );
	            }); 
		     }, 
		     fetchData:function(id){ 
		    	 this.app.showLoading('Loading schedule...',this.$el); 
		    	 var data = {branchid:this.app.user_branch_id};
		    	 data['employeeid'] = this.employeeid;
		    	 data['jobtypeid'] = this.jobtypeid;
		    	 data['scheduleid'] = this.scheduleid;
		    	 var that = this;
		    	 that.objSchedules.fetch({data:data ,success:function(data){
					 that.initScheduleCalander(that.objSchedules.toJSON());
				 }})
				 this.app.showLoading(false,this.$el); 
		     },
		     fetchEmployees:function(jobtypeid){
					var url = "api/employeegetallbyjobtype";
					 var that = this;
					 var str = "";
					 that.$el.find("#ddlemployees").html("<option selected value='0'> All Employees </option>");
	                  jQuery.getJSON(url,{ branchid:this.app.user_branch_id,jobtypeid:jobtypeid}, function(tsv, state, xhr) {
	                	  var _json = jQuery.parseJSON(xhr.responseText);
			                 that.$el.find("#ddlemployees").append(_.map(_json,function(value,key,list){ console.log(value);return "<option value="+value.id+">"+value.name+  "</option>";}).join());
			                 that.app.showLoading(false,this.$el );
				      	});
				     }   ,
				    fetchSchedules:function( ){
				    	 this.app.showLoading('Loading Data...',this.$el );
							 var URL = "api/getallschedules";
							 var that = this;
							 that.$el.find("#ddlschedules").html("<option selected value='0'>All Schedules</option>");
						      jQuery.getJSON(URL,{branchid:this.app.user_branch_id},  function (tsv, state, xhr) {
				                var _json = jQuery.parseJSON(xhr.responseText);
					                 that.$el.find("#ddlschedules").append(_.map(_json,function(value,key,list){ console.log(value);return "<option value="+value.id+">"+value.title + "</option>";}).join());
					                 that.app.showLoading(false,this.$el );
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
