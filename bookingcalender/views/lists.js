define(['text!bookingcalender/tpl/bookingcalender.html','bookingcalender/collections/bookingcalenders','fullcalendar','timepick','daterangepicker','typeahead','datepicker','jqueryui','qtip','booking/views/newbooking'],
	function (template,BookingCalender,calendar,timepicker,daterangepicker,typeahead,datepicker,jqueryui,qtip,NewBooking) {
		'use strict';
		return Backbone.View.extend({  
			events:{
			  
			 	"click .close-p":"closeSchedule", 
			 	"change #ddlemployees":"changeCalenderByEmployeeId",
			 	"change #ddljobtypes":"changeCalenderByJobTypeId"
			},
            initialize: function () {
				this.template = _.template(template);
				//this.listenTo(this.model, 'change', this.render);
			   // this.listenTo(this.model, 'destroy', this.remove);
			    this.setting = this.options.setting;
			    this.app = this.setting;
			    this.from = this.options.dashboard || false
			    this.objBookingCalender = new BookingCalender();
			    this.app.getTiming(this.app.user_branch_id);
			    this.render();
				
			},
			changeCalenderByEmployeeId:function(ev){
			 
				var that = this;
				this.app.showLoading('Loading Booking...',this.$el);
				 var e = ev.target.value; 
				 var resource = [{id:e,name:this.$el.find("#ddlemployees option:selected").text()}];
				 if(e == "0"){
					 resource =   that.jobtypes;
				 }
				  var data = {branchid:this.app.user_branch_id,employeeid:e};
			    	 that.objBookingCalender.fetch({data:data ,success:function(data){
						 that.initScheduleCalander(that.objBookingCalender.toJSON(),resource);
					 }})
			  
			},
			changeCalenderByJobTypeId:function(ev){
				 
				var that = this;
				this.app.showLoading('Loading Booking...',this.$el);
				 var e = ev.target.value;  
				 var resource = [{id:e,name:this.$el.find("#ddljobtypes option:selected").text()}];
				 if(e == "0"){
					 resource =   that.jobtypes;
				 }
				  var data = {branchid:this.app.user_branch_id,jobtypeid:e};
			    	 that.objBookingCalender.fetch({data:data ,success:function(data){
						 that.initScheduleCalander(that.objBookingCalender.toJSON(),resource);
						 that.fetchEmployees(e);
					 }})
			   
			},
			render: function () {
				this.$el.html(this.template( ));
				this.app.showLoading('Loading Booking...',this.$el); 
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
			
				   /// this.fetchJobTypes(); 
				   this.fetchJobTypes();
				   this.fetchEmployees(0);
				   if(this.from == true){
					   this.$el.find('.filters').hide();
				   }
				 this.app.showLoading(false,this.$el);
			}  ,
		 
			closeSchedule:function(){
				this.$el.find("#popup").hide();
			}, 
			initScheduleCalander:function(models,resource){ 
			    var start,end;
				start = this.app.timings[0].opened.split(':')[0];
				end = this.app.timings[0].closed.split(':')[0];
				//}
			    var date = new Date();
                var d = date.getDate();
                var m = date.getMonth();
                var y = date.getFullYear();
		        var that = this;
		        var btns = 'prev,next today';
		        if(this.from){
		        	btns = "";
		        }
		        this.$el.find('#calendar').html(''); 
		        $('#calendar').fullCalendar({
		          header: {
		            left: btns,
		            center: 'title',
		            right: ' '
		          },
		          defaultView: 'resourceDay',
		          editable: true,
		          droppable: true,
		          resources: resource,
		          events:models,
		           
		      	//},
                  axisFormat: 'HH:mm',
                  timeFormat: {
                      agenda: 'H:mm{ - h:mm}'
                  },
                  eventBorderColor:'#fff',
		          // the 'ev' parameter is the mouse event rather than the resource 'event'
		          // the ev.data is the resource column clicked upon
                  eventOverlap : true,
                  slotEventOverlap:true,
                  minTime:start,
                  maxTime:end,  
                  allDayDefault:false,
                  editable: false, 
                  select: function(start, end, allDay, event, resourceId) {
                      // var title = prompt('Event Title:');
                       //if (title) {
                   	 var title = '';
                         //  console.log("@@ adding event " + title + ", start " + start + ", end " + end + ", allDay " + allDay + ", resource " + resourceId);
                              require(['booking/views/newbooking'],function(AddUpdate){
               					var objAddUpdate = new AddUpdate({id:1,page:that,app:that.app,start:start,end:end});
               					that.$el.append(objAddUpdate.$el);
               				})
               		///	} 
                        
                       calendar.fullCalendar('unselect');
                   },
                   
                   disableResizing: true,
                   eventClick: function(event,jsEvent,view) {
                		 var title = '';  
                              var start = that.formatTime(jsEvent.timeStamp);
                              var resource = that.getJobTypeValue(event.resourceId);
                              if(event.booking == "1"){ 
                            	  swal({
        						      title: "Warning!",
        						      text: "Booking can't be created on the selected slot.",
        						      type: "error" , 
        				  			     } );
                                 return false
                              };
                              var date =  event.start ;//.split('T')[0];
                              var end =  event.end ;
                              
               					var objNewBooking = new NewBooking({id:1,page:that,app:that.app,date:date,start:start,end:end,resource:resource});
               					that.$el.append(objNewBooking.$el);
               				 
                   },  
                    eventDrop: function( event, dayDelta, minuteDelta, allDay) {
                       console.log("@@ drag/drop event " + event.title + ", start " + event.start + ", end " + event.end + ", resource " + event.resourceId);
                    },
                     
                    eventAfterRender: function(event, element, view) {
                    	//var width  ; 
                    	///width = that.$("#calendar").width()/that.jobtypes.length;
                    	 // Where 4 is the maximum events allowed at that time.
                       //  console.log(width);
                        // element.attr('data-width',width);
                        // element.css('width','');
                    	//element.width(width);
                            
                     
                    }, 
		            eventRender: function(event, element,view) { 
		            	$(this).css('width','100%')
		            	if(event.booking !="1"){
		                  	element.find('.fc-event-time').empty();
		                  	return;
		            	}else{
		            		element.find('.fc-event-inner').empty();
	                    	var content = '<h3>Customer: '+event.customer+'</h3>' + 
	                    	'<p> <h4>Assign to :  '+event.employee+'</h4><br />' + 
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
		            	} 
                  	}
		        });
		        this.app.showLoading(false,this.$el);
		},
		getJobTypeValue:function(id){
			
			var matchingResults = this.jobtypes.filter(function(x){ return x.id == id; });
			return matchingResults;
		},
		  
		getDatePart:function(date){
			var d = date;

			var month = d.getMonth()+1;
			var day = d.getDate();

			var output = d.getFullYear() + '-' +
			    (month<10 ? '0' : '') + month + '-' +
			    (day<10 ? '0' : '') + day;
		},
		formatTime:function(unixTimestamp) {
    	    var dt = new Date(unixTimestamp * 1000);

    	    var hours = dt.getHours();
    	    var minutes = dt.getMinutes();
    	    var seconds = dt.getSeconds();

    	    // the above dt.get...() functions return a single digit
    	    // so I prepend the zero here when needed
    	    if (hours < 10) 
    	     hours = '0' + hours;

    	    if (minutes < 10) 
    	     minutes = '0' + minutes;

    	    if (seconds < 10) 
    	     seconds = '0' + seconds;

    	    return hours + ":" + minutes + ":" + seconds;
    	}       
,
			 fetchJobTypes:function(){
				 var URL = "api/jobtypes";
		         var that = this;
		         var str = "";  
		         this.jobtypes = null;  
	            jQuery.getJSON(URL,{franchiseid:this.app.user_franchise_id,jobtypeid:0},  function (tsv, state, xhr) {
	                var _json = jQuery.parseJSON(xhr.responseText);
	                var jobtypes = _json;
	                that.jobtypes = jobtypes;
	            	var ids = "";
	                that.$el.find("#ddljobtypes").append(_.map(_json,function(value,key,list){  return "<option value="+value.id+">"+value.name +  "</option>";}).join());
	                that.fetchData(ids,"jobtypes",jobtypes);
	            	 
	            }); 
		     }, 
		     fetchEmployees:function(id){
					var url = "api/getemployeesbyjobtypeid";
					 var that = this;
					 var str = ""; 
					 that.$el.find("#ddlemployees").html("<option selected value='0'> All Employees </option>");
	                  jQuery.getJSON(url,{ franchiseid:this.app.user_franchise_id,jobtypeid:id}, function(tsv, state, xhr) {
	                	  var _json = jQuery.parseJSON(xhr.responseText);
			                 that.$el.find("#ddlemployees").append(_.map(_json,function(value,key,list){ return "<option value="+value.id+">"+value.name+  "</option>";}).join());
			                 that.app.showLoading(false,this.$el );
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
		  	     var data = {branchid:this.app.user_branch_id};
		    	 that.objBookingCalender.fetch({data:data ,success:function(data){
					 that.initScheduleCalander(that.objBookingCalender.toJSON(),resource);
				 }})
				 this.app.showLoading(false,this.$el); 
		     }, 
                        
			        
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




