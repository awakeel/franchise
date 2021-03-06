define([ 'text!booking/tpl/newbooking.html','booking/models/booking','timepick', 'datepicker' ],
		function(template, BookingModel,timepicker,datepicker) {
		'use strict';
		return Backbone.View.extend({
				events:{
					'click .close-pp' : "closeView",
					"click .save-p" : "save",
					"keyup #div_customer input":'getCustomerSearch'
				},
				initialize:function() {
					this.template = _.template(template);
					this.name = "";
					this.comments = "";
					this.color = "";
					var msec = Date.parse(this.options.date);
				 	this.start = new Date(msec);
				 	this.req = null;
				 	this.startTime =this.getTimeFromDate(this.start);
				  	this.start =   this.start.getFullYear() +'-'+ ( '0' + (this.start.getMonth()+1) ).slice( -2 ) + '-'+ ( '0' + (this.start.getDate()) ).slice( -2 );
				  	var msec = Date.parse(this.options.end);
				  	this.endTime = new Date(msec);
				  	this.endTime = this.getTimeFromDate(this.endTime);
					
				    this.jobtypeid = this.options.resource[0].id;
				    this.jobtype = this.options.resource[0].name; 
					this.lid = $("#newbooking");
					this.objBookingModel = new BookingModel();
					this.app = this.options.page.app;
					this.franchiseid  = this.app. user_franchise_id;
					this.render();
					this.$el.find('#colorcode').modal('hide');
				},
				getCustomerSearch:function(ev){
					var text = $(ev.target).val();
					var id = $(ev.target).attr('id');
					
					
					if(text.length > 2){
						if(id == "txtcustomername"){
							 text = {name:text};   	
							}else if(id == "txtphone"){
								text = {phone:text}
							}else if(id == "txtemail"){
							  text = {email:text}
						}
						this.fetchCustomer(text);
					}
					console.log(id);
				},
				fetchCustomer:function(text){
					var URL = "api/getcustomersbytext";
			         var that = this;
			         var str = "";
			         if(this.req){
			        	 this.req.abort();
			         }
			         text['branchid'] =this.app.user_branch_id;
			          this.req = jQuery.getJSON(URL,text,  function (tsv, state, xhr) {
		                var customers = jQuery.parseJSON(xhr.responseText);
		                _.each(customers,function(value,key,list){
		 					str +="<tr>";
		 					str +="<td>"+value.name+"</td>";
		 					str +="<td><label>"+value.email+"</label></td>";
		 					str +="<td><label>"+value.phone+"</label> <button class='btn btn-primary btn-select-customer' data-id='"+value.id+"' data-phone='"+value.phone+"' data-email='"+value.email+"' data-name='"+value.name+"'>Use</button></td>";
		 					str +="</tr>";
		 				})
			 				if(customers.length > 0){
			 					 that.$el.find("#txtcustomername").data('id','');
				 				that.$el.find('#colorcode table tbody').html(str);
				            	 that.$el.find('#colorcode').modal('show');
				            	 that.$el.find('.btn-select-customer').on('click',function(){
				            		 that.$el.find("#txtcustomername").val($(this).data('name'));
										  that.$el.find("#txtemail").val($(this).data('email'));
										 that.$el.find("#txtphone").val($(this).data('phone'));
									 that.$el.find("#txtcustomername").data('id',$(this).data('id'));
									 that.$el.find('#colorcode').modal('hide');
				            	 })
				            	 
			 				}
			           }); 
				},
				getTimeFromDate:function(datetime){
					var hours = datetime.getHours(); //returns 0-23
					var minutes = datetime.getMinutes();
				 
					return this.addZero(hours)+':'+this.addZero(minutes);
				},
				 addZero:function(i) {
				    if (i < 10) {
				        i = "0" + i;
				    }
				    return i;
				},
				render:function() {
							this.$el.html(this.template());
							var that = this; 
							this.$el.find('.modal').modal('show');
							this.parent = this.options.page;
							this.$el.find("#lbljobtype").html(this.jobtype);
							this.$el.find("#txtstartbooking").val(this.startTime);
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
							//this.$el.find('#txtdatebooking').datepicker({ format: "yyyy-mm-dd" });  
							this.$el.find('#txtdatebooking').val(this.start)
							 
							this.$el.find(".timepicker").timepicker({ 'timeFormat': 'H:i' , 'minTime':this.startTime,
							    'maxTime': this.endTime });
							this.$el.find("#txtstartbooking").on('changeTime', function() {
			            		var end =	that.$el.find("#ddlservices").val();
			            	 		var newEnd = that.addMinutes($(this).val(), end);
								    that.$el.find('#txtendbooking').val(newEnd);
								 
							});

							this.fetchDepartments();
							this.fetchServices(); 
							this.app.showLoading(false,this.lid );
							
							
						}, 	
						closeView:function() {
							this.$el.find('.modal').modal('hide'); 
							this.options.page.render();
							this.$el.remove();
						},
						clearErrorFilter:function() {
							this.$el.find('.name-error').addClass('hide');
						},
						saveConfirmed:function(){
							var employeeid = this.$el.find('#ddlemployeesbooking').val();
							var jobtypeid = 0;
							var franchiseid = this.app.user_franchise_id;
							var title = '';
							var branchid = this.app.user_branch_id;
							var serviceid = this.$el.find("#ddlservices").val();
							var timestart = this.$el.find("#txtstartbooking").val();
							var timeend = this.$el.find("#txtendbooking").val();
							var bookingtype = this.$el.find("#ddlbookingtypebooking").val();
							var price = this.$el.find("#txtprice").text();
							var bookingdate = this.$el.find("#txtdatebooking").val();
							bookingdate = bookingdate.split('-').join('');
							var customername = this.$el.find("#txtcustomername").val();
							var customerid = this.$el.find("#txtcustomername").data('id');
							var email = this.$el.find("#txtemail").val();
							var phone = this.$el.find("#txtphone").val();
							var status = "Scheduled";
							
							this.app.showLoading('Wait a moment....', this.$el );
							this.objBookingModel.set('employeeid', employeeid);
							this.objBookingModel.set('jobtypeid', this.jobtypeid);
							this.objBookingModel.set('branchid', branchid);
							this.objBookingModel.set('franchiseid', franchiseid);
							this.objBookingModel.set('title', title);
							this.objBookingModel.set('serviceid', serviceid);
							this.objBookingModel.set('timestart', timestart);
							this.objBookingModel.set('timeend', timeend);
							this.objBookingModel.set('bookingtype', bookingtype);
							this.objBookingModel.set('price', price);
							this.objBookingModel.set('dayid', bookingdate);
							this.objBookingModel.set('customername', customername);
							this.objBookingModel.set('customerid', customerid);

							this.objBookingModel.set('email', email);
							this.objBookingModel.set('phone', phone);
							this.objBookingModel.set('status', status); 
							var model = this.objBookingModel.save();
							this.app.showLoading(false, this.$el );
							$("#tr_norecord").remove();
							this.app.successMessage();
							this.closeView();
							this.parent.render();
						},
						save:function() {
							//if(!this.validateCustomer()){return false;}
							 var that = this;
							var customername = this.$el.find("#txtcustomername").val();
							var email = this.$el.find("#txtemail").val();
							var phone = this.$el.find("#txtphone").val();
							if(!customername && !email && !phone){ 
							 	swal({
								      title: "Warning?",
								      text: "No, customer name, email and phone is empty, would you like to continue!",
								      type: "info" , 
								    	  showCancelButton: true,
						  			      confirmButtonClass: 'btn-primary',
						  			      confirmButtonText: 'Yes, Save!'
						  			    },
						  			    function(isConfirm) {
						  			    	if(isConfirm){
						  			    		
						  			    		that.saveConfirmed();
						  			    	}else{
						  			    		if(!email || !this.app.IsEmail(email)){
													that.$el.find('.email-error').removeClass('hide');
													return false;
												}
						  			    		that.saveConfirmed();
						  			    	}
						  			    })
							}else{
								 
								that.saveConfirmed();
							}
							
						},
						fetchDepartments:function(){
							 var URL = "api/branchesbyid";
					         var that = this;
					         that.fetchEmployees(this.app.user_branch_id);
					          jQuery.getJSON(URL,{branchid:this.app.user_branch_id},  function (tsv, state, xhr) {
				                var _json = jQuery.parseJSON(xhr.responseText);
					                 that.$el.find("#lbldepartments").html(_.map(_json,function(value,key,list){ return "<option value="+value.id+">"+value.name+"</option>";}).join());
					                
					           }); 
					     }, 
					     fetchServices:function(){
							 var URL = "api/servicesbyjobtypeid";
					         var that = this;
					         this.end = 0;
					         that.$el.find("#ddlservices").html("<option value='0' data-price = '0' data-time = '0'> Select Service </option>");
					          jQuery.getJSON(URL,{franchiseid:this.app.user_franchise_id,jobtypeid:this.jobtypeid},  function (tsv, state, xhr) {
				                var _json = jQuery.parseJSON(xhr.responseText);
					                 that.$el.find("#ddlservices").append(_.map(_json,function(value,key,list){ return "<option data-price="+value.price+" data-time="+value.time+" value="+value.id+">"+value.name+"</option>";}).join());
					                 that.$el.find("#ddlservices").on('change',function(){
											var price = $(this).find(':selected').data('price'); 
											var end = $(this).find(":selected").data('time');
											var newEnd = that.addMinutes(that.$el.find("#txtstartbooking").val(), end);
											 that.end = end;
											that.$el.find("#txtprice").html(price);
											 that.$el.find("#txtendbooking").val(newEnd);
										
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
								 var URL = "api/getemployeesbyjobtypeid";
								 var that = this;
								 this.$el.find("#ddlemployeesbooking").html("<option value='0'> None </option>");
							      jQuery.getJSON(URL,{frachiseid:this.app.user_franchise_id,jobtypeid:this.jobtypeid},  function (tsv, state, xhr) {
					                var _json = jQuery.parseJSON(xhr.responseText);
						                 that.$el.find("#ddlemployeesbooking").append(_.map(_json,function(value,key,list){  
						                	 var selected =  "";
						                	 if(that.options.resourceid == value.id)
						                		 selected = "selected";
						                	 return "<option value="+value.id+" "+selected+">"+value.name + "</option>";
						                	 }).join());
						                 that.app.showLoading(false,this.lid );
							      	});
					     }
					});
		});
