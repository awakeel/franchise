define(['text!schedule/tpl/schedule.html','schedule/collections/schedules','fullcalendar','timepick','daterangepicker','typeahead','tokenfield'],
	function (template,Schedules,calendar,timepicker,daterangepicker,typeahead,tokenfield) {
		'use strict';
		return Backbone.View.extend({  
			events:{
			 	"click .delete-token":"deleteToken",
			 	"click .edit-token":"updateToken",
			 	"click .add-new":'addNewSchedule',
			 	"click .close-p":"closeSchedule"
			},
            initialize: function () {
				this.template = _.template(template);
				//this.listenTo(this.model, 'change', this.render);
			   // this.listenTo(this.model, 'destroy', this.remove);
			    this.setting = this.options.setting;
			    this.objSchedules = new Schedules();
			    this.render();
			    this.fillEmployees();
			    this.fillJobTypes();
			},
			render: function () {
				this.$el.html(this.template({id:1123,name:'wakeel'}));
				
				this.$el.find('#timefrom').timepicker();
				this.$el.find('#timeto').timepicker();
				this.$el.find('#scheduledate input').daterangepicker({
				  
					 
				});
				var that = this;
				this.objSchedules.fetch({data:{},success:function(data){
					that.initScheduleCalander(that.objSchedules.toJSON());
				}})
				
				
			} ,
			addNewSchedule:function(){
				
				this.$el.find("#popup").show();
				
			},
			closeSchedule:function(){
				this.$el.find("#popup").hide();
			},
			initScheduleCalander:function(models){
				console.log(models)
				 this.$el.find('#calendar').fullCalendar({
			            header: {
			                left: 'prev,next today',
			                center: 'title',
			                right: 'month,agendaWeek,agendaDay'
			            },
			            defaultDate: 'agendaDay',
			            editable: true,
			            allDaySlot: false,
			            selectable: true,
			            slotMinutes: 15,
			            events:models,
			            eventClick: function (calEvent, jsEvent, view) {
			                alert('You clicked on event id: ' + calEvent.id
			                    + "\nSpecial ID: " + calEvent.someKey
			                    + "\nAnd the title is: " + calEvent.title);

			            }
			 
				 });
			},
			fillEmployees:function(){
				var url = "api/employees";
				 var that = this;
				 var employees ;
				 var names = new Array();
                 var ids = new Object(); 
                  jQuery.getJSON(url, function(tsv, state, xhr) {
                   var employees = jQuery.parseJSON(xhr.responseText);
                   		_.each( employees, function ( employee, index )
                               {   names.push( employee.firstname + '  ' + employee.lastname );
                                   ids[employee.firstname + '  ' + employee.lastname] = employee.id;
                               } );  
                               that.$el.find("#txtemployees").tokenfield({
                            	   
                            	    typeahead:{
                            		    source: names,
                            		    local:names
                            		} 
                            	});
                  		 
                   
                   });
			 },
			fillJobTypes:function(){
				 
				var url = "api/jobtypes";
				 var that = this;
				 var employees ;
				 var names = new Array();
                 var ids = new Object(); 
                  jQuery.getJSON(url, function(tsv, state, xhr) {
                   var employees = jQuery.parseJSON(xhr.responseText);
                   		_.each( employees, function ( employee, index )
                               {
                                   names.push( employee.name );
                                   ids[employee.name] = employee.id;
                               } ); 
		                   	  that.$el.find("#txtjobtypes").tokenfield({
		                   	   
		                  	    typeahead:{
		                  		    source: names,
		                  		    local:names
		                  		} 
		                  	});
        		 
                   
                   });
			},
			eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc) {
			                if (confirm("Confirm move?")) {
			                   // UpdateEvent(event.id, event.start);
			                }
			                else {
			                   // revertFunc();
			                }
			            },

			            eventResize: function (event, dayDelta, minuteDelta, revertFunc) {

			                if (confirm("Confirm change appointment length?")) {
			                    //UpdateEvent(event.id, event.start, event.end);
			                }
			                else {
			                   // revertFunc();
			                }
			            },



			            dayClick: function (date, allDay, jsEvent, view) {
			                $('#eventTitle').val("");
			                $('#eventDate').val($.fullCalendar.formatDate(date, 'dd/MM/yyyy'));
			                $('#eventTime').val($.fullCalendar.formatDate(date, 'HH:mm'));
			               // ShowEventPopup(date);
			            },

			            viewRender: function (view, element) {

			                if (!CalLoading) {
			                    if (view.name == 'month') {
			                        $('#calendar').fullCalendar('removeEventSource', sourceFullView);
			                        $('#calendar').fullCalendar('removeEvents');
			                        $('#calendar').fullCalendar('addEventSource', sourceSummaryView);
			                    }
			                    else {
			                        $('#calendar').fullCalendar('removeEventSource', sourceSummaryView);
			                        $('#calendar').fullCalendar('removeEvents');
			                        $('#calendar').fullCalendar('addEventSource', sourceFullView);
			                    }
			                }
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
