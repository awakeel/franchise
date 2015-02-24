define(['text!schedule/tpl/schedule.html','schedule/collections/schedules','fullcalendar','timepick','daterangepicker','typeahead','datepicker'],
	function (template,Schedules,calendar,timepicker,daterangepicker,typeahead,datepicker) {
		'use strict';
		return Backbone.View.extend({  
			events:{
			  
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
			    this.app.getTiming(this.app.user_branch_id);
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
				   this.$el.find('#txtdate').datepicker({})
				    .on('changeDate', function(e){
				    	that.$el.find('#calendar').fullCalendar('gotoDate',e.date)
				    });
				    this.fetchJobTypes();  
				
				 this.app.showLoading(false,this.$el);
			}  ,
		 
			closeSchedule:function(){
				this.$el.find("#popup").hide();
			},
			initScheduleCalander:function(models,resource){ 
				    var start,end;
				  /// console.log(models[0]);
					//if(typeof models[0] !="undefined" && models[0].ischanged == "1"){
					//	start = models[0].start.split('T')[1];
						//end = models[0].end.split('T')[1];
					//}else{
					start = this.app.timings[0].opened.split(':')[0];
					end = this.app.timings[0].closed.split(':')[0];
					//}
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
	                    eventBackgroundColor:'#fff',
	                    editable: false,
	                    resources: resource,
	                    events:  models
	                     
	                });
 
				 
			},
		      
			 fetchJobTypes:function(){
				 var URL = "api/jobtypes";
		         var that = this;
		         var str = "";  
		         this.jobtypes = null;
	            jQuery.getJSON(URL,{franchiseid:this.app.user_franchise_id},  function (tsv, state, xhr) {
	                var _json = jQuery.parseJSON(xhr.responseText);
	                var jobtypes = _json;
	                that.jobtypes = jobtypes;
	            	var ids = "";
	                _.each(jobtypes,function(value,key,list){ 
	                	var check = "";
	                	ids +=value.id+",";
	                	str+='<div class="user_container">';
						str+='<label> <input type="checkbox" checked value="'+value.id+'" '+check+'>'+value.name+'</label></div>';
					});
	                that.fetchData(ids,"jobtypes",jobtypes);
	            	that.$el.find('.selection-box  ').html(str);
	            	var oldjobs = that.jobtypes;
	            	that.$el.find('.selection-box input[type=checkbox]').change(function(ev){
	            		var ids = "";
            			that.$el.find('.selection-box input[type=checkbox]:checked').each(function(ev){
            				ids += $(this).val()+",";
            			});
            			var id = $(this).val().trim();
            			ids+=id+",";
	            		if(this.checked){
	             			 oldjobs = that.jobtypes.filter(function (el) { 
	            				 return $.inArray(el.id , ids.split(',')) > -1;
	                         }); 
	            		}else{
	            			 oldjobs = oldjobs.filter(function (el) { 
	            				 return el.id !== id;
	                         }); 
	            		 }
	            		that.fetchData(ids,"jobtypes",oldjobs);
	            	})
	            }); 
		     }, 
		     fetchData:function(ids, type,resource){ 
		    	 this.app.showLoading('Loading schedule...',this.$el); 
		    	 var data = {branchid:this.app.user_branch_id};
		    	 if(type=="employees"){
		    	  data['employeeid'] = ids;
		    	 }else{
		    		 data['jobtypeid'] = ids;
		    	 }
		    	 var that = this;
		    	 that.objSchedules.fetch({data:data ,success:function(data){
					 that.initScheduleCalander(that.objSchedules.toJSON(),resource);
				 }})
				 this.app.showLoading(false,this.$el); 
		     },
		     fetchEmployees:function(id,clone){
					var url = "api/employeesgetall";
					 var that = this;
					 var str = "";
	                  jQuery.getJSON(url,{ branchid:this.app.user_branch_id}, function(tsv, state, xhr) {
	                   var employees = jQuery.parseJSON(xhr.responseText);
	                   	that.employees = employees; 
	                   	var ids = "";
	                    	_.each(employees,function(value,key,list){ 
			                	 var check = "";
			                	 ids +=value.id+",";
			                	 var pic = value.picture;
			                	 if(!pic || pic == "undefined")
			                		 pic = "3.jpg";
								  if(typeof value.name !="undefined"){
									  str+='<div class="user_container"> <span class="circle_border"><div class=" "><img  src="userimages/'+pic+'"></div></span><label> <input type="checkbox" checked value="'+value.id+'" '+check+'>'+value.name+'</label></div>'; 
								  }
						     });
	                    	that.fetchData(ids,"employees",employees);
	                    	that.$el.find('.selection-box  ').html(str);
	                    	var oldemployees = that.employees;
	    	            	that.$el.find('.selection-box input[type=checkbox]').change(function(ev){
	    	            		var ids = "";
	                			that.$el.find('.selection-box input[type=checkbox]:checked').each(function(ev){
	                				ids += $(this).val()+",";
	                			});
	                			var id = $(this).val().trim();
	                			ids+=id+",";
	    	            		if(this.checked){
	    	            			oldemployees = that.employees.filter(function (el) { 
	    	            				 return $.inArray(el.id , ids.split(',')) > -1;
	    	                         }); 
	    	            		}else{
	    	            			oldemployees = oldemployees.filter(function (el) { 
	    	            				 return el.id !== id;
	    	                         }); 
	    	            		 }
	    	            		that.fetchData(ids,"employees",oldemployees);
	    	            	})
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
