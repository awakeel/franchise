define([ 'text!booking/tpl/newbooking.html','booking/models/booking','timepick', 'datepicker' ],
		function(template, BookingModel,timepicker,datepicker) {
		'use strict';
		return Backbone.View.extend({
				events:{
					'click .close-pp' : "closeView",
					"click .save-p" : "save",
				},
				initialize:function() {
					this.template = _.template(template);
					this.name = "";
					this.comments = "";
					this.color = "";
					var msec = Date.parse(this.options.start);
				 	this.start = new Date(msec);
				 	this.startTime =this.start.getHours()+':'+this.start.getMinutes();
				  	this.start = this.start.getMonth() +'-'+this.start.getDate()+'-'+this.start.getFullYear();
					this.end = this.options.end;
					this.lid = $("#newbooking");
					this.objBookingModel = new BookingModel();
					this.app = this.options.page.app;
					this.franchiseid  = this.app. user_franchise_id;
					this.render();
				},
				render:function() {
							this.$el.html(this.template());
							var that = this; 
							this.$el.find('.modal').modal('show');
							this.parent = this.options.page;
							this.$el.find("#txtstart").val(this.startTime);
							this.app.showLoading('Loading Data...',this.lid );
							if(typeof this.options.id == "undefined"){ 
								this.parent = this.options.page.options.page;
								this.objjobtype = this.options.model;  
								this.color = this.options.model.get('color');
							 	this.name = this.options.model.get('name');
								this.comments = this.options.model.get('comments');
								this.$el.find("#txtname").val( this.options.model.get('name'));
								this.$el.find("#txtcolor").val(this.color);
								this.$el.find('#txtcomments').val( this.options.model.get('comments'));
							}
							this.$el.find('#txtdate').datepicker({ todayBtn: true,
							    clearBtn: true,
							    autoclose: true,
							    defaultDate: this.start,
 							    todayHighlight: true
							});  
							this.$el.find('#txtdate').val(this.start);
							this.$el.find(".timepicker").timepicker({ 'timeFormat': 'H:i' , 'minTime':this.app.timings[0].opened,
							    'maxTime': this.app.timings[0].closed,
							    'showDuration': true});
							this.fetchDepartments();
							this.fetchServices(); 
							this.app.showLoading(false,this.lid );
							
							
						}, 	
						closeView:function() {
							this.$el.find('.modal').modal('hide'); 
							this.$el.remove();
						},
						clearErrorFilter:function() {
							this.$el.find('.name-error').addClass('hide');
						},
						save:function() {
							var employeeid = this.$el.find('#ddlemployees').val();
							var jobtypeid = 0;
							var franchiseid = this.app.user_franchise_id;
							var title = '';
							var branchid = this.$el.find("#ddldepartments").val();
							var serviceid = this.$el.find("#ddlservices").val();
							var timestart = this.$el.find("#txtstart").val();
							var timeend = this.$el.find("#txtend").val();
							var bookingtype = this.$el.find("#ddlbookingtype").val();
							var price = this.$el.find("#txtprice").text();
							var bookingdate = this.$el.find("#txtdate").val();
							var customername = this.$el.find("#txtcustomername").val();
							var email = this.$el.find("#txtemail").val();
							var phone = this.$el.find("#txtphone").val();
							var status = "Present";
							this.app.showLoading('Wait a moment....', this.lid );
							this.objBookingModel.set('employeeid', employeeid);
							this.objBookingModel.set('jobtypeid', jobtypeid);
							this.objBookingModel.set('branchid', branchid);
							this.objBookingModel.set('franchiseid', franchiseid);
							this.objBookingModel.set('title', title);
							this.objBookingModel.set('serviceid', serviceid);
							this.objBookingModel.set('timestart', timestart);
							this.objBookingModel.set('timeend', timeend);
							this.objBookingModel.set('bookingtype', bookingtype);
							this.objBookingModel.set('price', price);
							this.objBookingModel.set('bookingdate', bookingdate);
							this.objBookingModel.set('customername', customername);
							this.objBookingModel.set('email', email);
							this.objBookingModel.set('phone', phone);
							this.objBookingModel.set('status', status); 
							var model = this.objBookingModel.save();
							this.app.showLoading(false, this.lid );
							$("#tr_norecord").remove();
							this.app.successMessage();
							this.closeView();
							this.parent.render();
						},
						fetchDepartments:function(){
							 var URL = "api/branches";
					         var that = this;
					          jQuery.getJSON(URL,{franchiseid:this.app.user_franchise_id},  function (tsv, state, xhr) {
				                var _json = jQuery.parseJSON(xhr.responseText);
					                 that.$el.find("#ddldepartments").html(_.map(_json,function(value,key,list){ return "<option value="+value.id+">"+value.name+"</option>";}).join());
					                 that.$el.find("#ddldepartments").on('change',function(){
											var id = $(this).find(':selected').val(); 
											that.fetchEmployees(id);
									 }) 
									 that.$el.find("#ddldepartments").trigger('change');
					           }); 
					     }, 
					     fetchServices:function(){
							 var URL = "api/services";
					         var that = this;
					          jQuery.getJSON(URL,{franchiseid:this.app.user_franchise_id},  function (tsv, state, xhr) {
				                var _json = jQuery.parseJSON(xhr.responseText);
					                 that.$el.find("#ddlservices").html(_.map(_json,function(value,key,list){ return "<option data-price="+value.price+" data-time="+value.time+" value="+value.id+">"+value.name+"</option>";}).join());
					                 that.$el.find("#ddlservices").on('change',function(){
											var price = $(this).find(':selected').data('price'); 
											var end = $(this).find(":selected").data('time');
										 
											var newEnd = that.addMinutes(that.startTime, end);
											that.$el.find("#txtprice").html(price);
											that.$el.find("#txtend").val(newEnd);
										
									 }) 
									 that.$el.find("#ddlservices").trigger('change');
					          }); 
					     },
					      addMinutes:function(time, minsToAdd) {
					    	  function D(J){ return (J<10? '0':'') + J;};
					    	  var piece = time.split(':');
					    	  var mins = piece[0]*60 + +piece[1] + +minsToAdd;

					    	  return D(mins%(24*60)/60 | 0) + ':' + D(mins%60);  
					    	}, 
					     fetchEmployees:function(branchid){
					    	 this.app.showLoading('Loading Data...',this.lid );
								 var URL = "api/employeesgetall";
								 var that = this;
							      jQuery.getJSON(URL,{branchid:branchid},  function (tsv, state, xhr) {
					                var _json = jQuery.parseJSON(xhr.responseText);
						                 that.$el.find("#ddlemployees").html(_.map(_json,function(value,key,list){ console.log(value);return "<option value="+value.id+">"+value.name + "</option>";}).join());
						                 that.app.showLoading(false,this.lid );
							      	});
					     }
					});
		});
