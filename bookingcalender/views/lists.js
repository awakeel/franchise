define(['text!bookingcalender/tpl/bookingcalender.html','bookingcalender/collections/bookingcalenders','fullcalendar','timepick','daterangepicker','typeahead','datepicker','jqueryui','qtip','booking/views/newbooking','moment'],
	function (template,BookingCalender,calendar,timepicker,daterangepicker,typeahead,datepicker,jqueryui,qtip,NewBooking,moment) {
		'use strict';
		return Backbone.View.extend({  
			className:'cslg',
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
			    this.employees = null;
			    this.app.getTiming(this.app.user_branch_id);
			    this.render();
				
			},
			changeCalenderByEmployeeId:function(ev){
			 
				var that = this;
				this.app.showLoading('Loading Booking...',this.$el);
				 var e = ev.target.value; 
				 var resource = [{id:e,name:this.$el.find("#ddlemployees option:selected").text()}];
				 if(e == "0" && e !="-1"){
					 resource =   that.jobtypes;
				 }else{
					 if(e=="-1"){
						 resource = that.employees;
					 }else{
						 var resource = [{id:e,name:this.$el.find("#ddlemployees option:selected").text()}];
					}
					
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
				 this.$el.find('#sandbox-container input').datepicker({ todayBtn: true ,
					    autoclose: true,
					    todayHighlight: true
					})  
				    .on('changeDate', function(e){
				    	that.$el.find('#calendar').fullCalendar('gotoDate',e.date)
				    });
				   this.$el.find('#calendar').html(''); 
				   /// this.fetchJobTypes();  
				   this.fetchJobTypes();
				   if( this.options.isemployee){
					   this.$el.find(".jobtyedropdown").remove();
				   }
				   this.fetchEmployees(0);
				   if(this.from == true){
					   this.$el.find('.filters').hide();
				   }
				 this.app.showLoading(false,this.$el);
			},
			closeSchedule:function(){
				this.$el.find("#popup").hide();
			}, 
			
			initScheduleCalander:function(models,resource){ 
			    var start,end;
				start = this.app.timings[0].opened.split(':')[0];
				end = this.app.timings[0].closed.split(':')[0];
				 
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
		        if(typeof this.$el.find('#calendar .fc-header') !="undefined")
		        	this.$el.find('#calendar .fc-header').remove();
		        if(typeof this.$el.find('#calendar .fc-content') !="undefined")
		        	this.$el.find('#calendar .fc-content').remove();
		        this.$el.find('#calendar').fullCalendar('destroy');
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
                  disableResizing: false,
                  eventClick: function(event,jsEvent,view) {
                		 var title = '';  
                              var start = that.formatTime(jsEvent.timeStamp);
                              console.log(event);
                              var resource = that.getJobTypeValue(event.jobtypeid);
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
                              
               					var objNewBooking = new NewBooking({resourceid:event.resourceId,id:1,page:that,app:that.app,date:date,start:start,end:end,resource:resource});
               					that.$el.append(objNewBooking.$el);
               				 
                   },  
                    eventDrop: function( event, dayDelta, minuteDelta, allDay) {
                       console.log("@@ drag/drop event " + event.title + ", start " + event.start + ", end " + event.end + ", resource " + event.resourceId);
                    },
                     
		            eventRender: function(event, element,view) {   
		            	$(this).css('width','100%')
		            	if(event.booking =="0"){
		                  	element.find('.fc-event-time').empty();
		                    var one_day = 1000 * 60 * 60 * 24;
		                    var _Diff = Math.ceil((event.start.getTime() - view.visStart.getTime())/(one_day));
		                    var dayClass = ".fc-day" + _Diff; 
		                    console.log(dayClass);
		                    $(dayClass).addClass('fc-sun');
		                    var dataToFind = moment(event.start).format('YYYY-MM-DD');
		                    $('#calendar').find("td[data-date='"+dataToFind+"']").addClass('activeDay');
		                  	return;
		            	}else{
		            		element.find('.fc-event-inner').empty();
		            			var c= '<table cellpadding="0" cellspacing="0" class="bubble-table bubble">';
		            		c+='<tbody><tr><td class="bubble-cell-side"><div class="bubble-corner" id="tl:1"><div class="bubble-sprite bubble-tl"></div></div></td>';
		            		c+='<td class="bubble-cell-main"><div class="bubble-top"></div></td><td class="bubble-cell-side"><div class="bubble-corner" id="tr:1"><div class="bubble-sprite bubble-tr"></div></div></td></tr>';
		            		c+='<tr><td colspan="3" class="bubble-mid"><div style="overflow:hidden" id="bubbleContent:1"><div class="details"><span class="title" style="color: #125A12">'+event.service+'/'+event.employee+'</span><div class="detail-content"><div class="detail-item"><span class="event-details-label">When</span><span class="event-when">'+moment(event.start).format("LLL")+' - '+moment(event.end).format("LLL")+'</span></div> <div class="detail-item"><span class="event-details-label">Customer Info</span><span class="event-description"> ' + event.customer+ ' </span></div></div><div class="separator" style="background-color: #125A12;"></div><span class="links"><a class="more-detail" data-id='+event.booking+' data-cust='+event.customerid+' data-status='+event.status+'>more details»</a></span></div></div></td></tr><tr><td><div class="bubble-corner" id="bl:1"><div class="bubble-sprite bubble-bl"></div></div></td><td><div class="bubble-bottom"></div></td><td><div class="bubble-corner" id="br:1"><div class="bubble-sprite bubble-br"></div></div></td></tr>';
		            		c+='</tbody></table>';
		            		
	                     
	                    	 	 element.qtip({ 
	                             content:c, 
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
	                             },
	                             events: {
	                                 show: function(event, api) {
	                                	 $(".more-detail").on('click',function(ev){
	    	                    	 		 var id = $(ev.target).data('id');
	    	                    	 		 that.viewBooking(id,$(ev.target).data('cust'),$(ev.target).data('status'));
	    	                    	 	 })
	                                 }
	                             }
	                         }); 
	                    	 	
		            	} 
                  	}
		        });
		        this.app.showLoading(false,this.$el);
		},
		viewBooking : function(id,customerid,status) { 
			var that = this; 
			var obj = Backbone.Model.extend({});
			var obj = new obj();
			obj.set('id',id);
			obj.set('customerid',customerid);
			obj.set('status',status);
			 
			require([ 'booking/views/createbooking' ],	function(Lists) { 
					var objLists = new Lists({model:obj,page:that,app:that.app}) 
					$('#page-wrapper').find('.page-content > div:gt(0)').remove();
					$('#page-wrapper').find('.page-content').append(objLists.$el); 
				 
					
				})
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
	                if(!that.options.isemployee)
	                that.fetchData(ids,"jobtypes",jobtypes);
	            	 
	            }); 
		     }, 
		     fetchEmployees:function(id){
		    	     if(this.options.isemployee){
		    	    	 var url = "api/employeesgetall";
		    	     }else{
		    	    	 var url = "api/getemployeesbyjobtypeid";
		     		  }
					 var that = this;
					 var str = "";   
					 that.$el.find("#ddlemployees").html("<option selected value='-1'> All Employees </option>");
	                  jQuery.getJSON(url,{branchid:this.app.user_branch_id, franchiseid:this.app.user_franchise_id,jobtypeid:id}, function(tsv, state, xhr) {
	                	  var _json = jQuery.parseJSON(xhr.responseText);
	                	  that.employees = _json;
			                 that.$el.find("#ddlemployees").append(_.map(_json,function(value,key,list){ return "<option value="+value.id+">"+value.name+  "</option>";}).join());
			                 if(that.options.isemployee)
			                 that.fetchData("-1","employees",_json);
			                 that.app.showLoading(false,this.$el );
				      	});
			  },
		     fetchData:function(ids, type,resource){ 
		    	 this.app.showLoading('Loading schedule...',this.$el); 
		    	 var data = {branchid:this.app.user_branch_id};
		    	 if(type=="employees" && this.options.isemployee){
		    		 data['employeeid'] = ids;
		    	 } 
		    	 var that = this;

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




