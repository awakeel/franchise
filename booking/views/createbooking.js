define( [ 'text!booking/tpl/createbooking.html','booking/models/booking' ,'timepick','daterangepicker'],
		function(template ,BookingModel,timepick,daterangepicker) {
			'use strict';
			return Backbone.View
					.extend({
						events : {
							'click .close-pp' : "closeView",
							"click .update-customer" : "updateCustomer",
							"click .add-new-box":"clone",
							"click .add-new-comments":'updateComments',
							'click .back':'closeView',
							'click .btn-change-employee':'showEmployeeList',
							'click .btn-change-service':'showServiceList',
							'change #ddlemployees':'changeBooking',
							'change #ddlservices':'changeBooking',
							'click .send-sms':'sendSMS'
						},
						initialize : function() {
							this.template = _.template(template); 
							this.app = this.options.app;
							this.cloneId = 1;
							this.model = null;
							this.branchid = this.app.user_branch_id; 
							console.log(this.options);
							this.render();  
						},
						showEmployeeList:function(){
							this.$el.find("#ddlemployees").removeAttr('disabled');
						},
						showServiceList:function(){
							this.$el.find("#ddlservices").removeAttr('disabled');
						},
						render : function() {
							this.$el.html(this.template());
							if(this.options.model.get('status') == "Completed"){
								this.$el.find('.btn-change-employee').hide();
								this.$el.find('.btn-change-service').hide();
							}
							this.getBookings();
							this.getComments();
							this.getHistory();
							this.getLogs();
							this.getSMS();
						},
						closeView:function(){
							var that = this;
							  require(['booking/views/lists','views/breadcrumb'],function(Lists,BreadCrumb){ 
							    	var objLists = new Lists({setting:that.app});
							    	var objBreadCrumb = new BreadCrumb({title:'Booking',setting:that.app});
							    	$('#page-wrapper').find('.page-content').html(objLists.$el); 
							    	 $('#page-wrapper').find('.page-content').prepend(objBreadCrumb.$el); 
							    })
						},
						getBookings:function(){
							var url = "api/bookingbyid";
							 var that = this; 
			                  jQuery.getJSON(url,{bookingid:this.options.model.get('id'),branchid:this.branchid}, function(tsv, state, xhr) {
					                   var employees = jQuery.parseJSON(xhr.responseText);
					                   that.model = employees[0];
					                   that.basicInfo();
					                   that.basicBooking();
					                   that.fetchEmployees();
					                   that.fetchServices();
			                   
			                   	});
						},
						  
						getLogs:function(){
							var url = "api/getalllogs";
							 var that = this; 
			                  jQuery.getJSON(url,{bookingid:this.options.model.get('id')}, function(tsv, state, xhr) {
			                   var logs = jQuery.parseJSON(xhr.responseText);
			                   var str = ""; 
			                   _.each(logs,function(value,key,list){
			                	    str +='<div class="info-container" style="margin-top: 20px;"> <div class="col-sm-4"><p><strong>';
			                	    str +=value.createdon+'</strong> 	</p> </div> <div class="col-sm-4"> <p> <strong>';
			                	    str +=value.title+' </strong> </p> 	</div> <div class="col-sm-4"> <p> <strong style="color: #e74c3c;">';
			                	    str +=value.text+'</strong> </p> </div> </div>'; 
			                   })
			                   that.$el.find("#divlogs").html(str);
			               
			                  });
						},
						getSMS:function(){
							var url = "api/getsms";
							 var that = this; 
			                  jQuery.getJSON(url,{bookingid:this.options.model.get('id')}, function(tsv, state, xhr) {
			                   var logs = jQuery.parseJSON(xhr.responseText);
			                   var mdr = ""; 
			                   _.each(logs,function(value,key,list){
			                		 mdr +='<div class="col-lg-12 col-md-12 col-sm-12">';
				                	    mdr +='<div class="info-container" style="margin-top:20px;">';
				                	    mdr +='<p><strong> '+value.createdon+'</strong></p>';
				                	    mdr +='<strong>To:'+that.model.name+'</strong></span></p>';
				                	    mdr +='<p>'+value.text+'</p></div></div>';
				                	    	 
			                   })

	                	    	that.$el.find("#smshistory").prepend(mdr);
			                  });
						},
						getComments:function(){
							var url = "api/getallcomments";
							 var that = this; 
			                  jQuery.getJSON(url,{customerid:this.options.model.get('customerid'),branchid:this.branchid}, function(tsv, state, xhr) {
			                   var comments = jQuery.parseJSON(xhr.responseText);
			                   var str = "";
			                   var mdr = "";
			                   var i = 0;
			                   _.each(comments,function(value,key,list){
			                	   if(i < 6){
			                	    str +='<div class="feaild_container">';
			                	    str +='<div class="col-sm-12"><p><strong>'+value.createddate+'</strong> </p></div>';
			                	    str +='<div class="col-sm-12">  <p>'+value.comments+'</p></div>';
			                	    str +='</div>';
			                	   }
			                	   i = i + 1;
			                	    mdr +='<div class=" col-md-12">';
			                	    mdr +='<div class="info-container" style="margin-top:20px;">';
			                	    mdr +='<p><strong>'+value.createddate+'</strong></p>';
			                	    mdr +='<p>'+value.comments+'</p>';
			                	    mdr +='</div>';
			                	   mdr +='</div>';
			                   })
			                   if(i == 0){
			                	   str = '<a data-toggle="tab" href="#comments">Add Comments</a>';
			                	  // that.$el.find("#myTab li").removeClass('active');
			                	   //that.$el.find("#myTab").find('.comments-li').addClass('active');
			                   }
			                   that.$el.find("#divcomments").html(str);
			                   that.$el.find("#divsectioncomments").html(mdr);
			                  });
						},
						getHistory:function(){
							var url = "api/getallhistory";
							 var that = this; 
			                  jQuery.getJSON(url,{customerid:this.options.model.get('customerid'),branchid:this.branchid}, function(tsv, state, xhr) {
			                   var history = jQuery.parseJSON(xhr.responseText);
			                   var str = "";
			                    
			                   _.each(history,function(value,key,list){
									   str+='<div class="col-lg-12 col-md-12 col-sm-12">';
									   str+='<div class="info-container" style="margin-top:20px;">';
									   str+='<div class="row">';
									   str+='<div class="col-sm-4">';
									   str+='<p>'+that.getDate(value.dayid) + ' from '+ value.timestart + ' to ' + value.timeend+'</p>';
									   str+='</div>';
									   str+='<div class="col-sm-4">';
									   str+='<p>Services: <strong>'+value.service+'</strong></p>';
									   str+='</div>';
									str+='<div class="col-sm-4">';
									str+='<p>Status:</p>';
									str+='</div>';
									str+='<div class="clearfix"></div>';
									str+='<div class="col-sm-4">';
									str+='<p>Price :<strong>'+value.price+'</strong></p>';
									str+='</div>';
									str+='<div class="col-sm-4">';
									str+='<p>Employee: <strong>'+value.employee+'</strong></p>';
									str+='</div>';
									str+='<div class="col-sm-4">';
									str+='<p>Duration: <strong> from '+ value.timestart + ' to ' + value.timeend+'</strong></p>';
									str+='</div>';
									str+='<div class="col-sm-12">';
									   str+='</div>';
									   str+='</div>';
									   str+='</div>';
									   str+='</div>';
			                   })
			                   
			                   that.$el.find("#divhistory").html(str);
			                  });
						},
						updateCustomer:function(){
							var that = this;
							this.$el.find('.email-error').addClass('hide');
							var name =  this.$el.find('#txtname').val();
							var phone = this.$el.find('#txtphone').val();
							var email = this.$el.find('#txtemail').val();
							
							if(!email || !this.app.IsEmail(email)){
								this.$el.find('.email-error').removeClass('hide');
								return false;
							}
							this.$el.find('#txtemailcustomer').val(this.model.email);
							this.$el.find('#lblnamecustomer').html(this.model.name);
							var id = this.model.customerid;
							var URL = "api/savcustomer1";
							 this.app.showLoading('Wait, Saving info...',this.$el);
								$.post(URL, {phone:phone,name:name,id:id,email:email})
				                .done(function(data) { 
				                	that.render();
				                	 that.app.showLoading(false,that.$el);
				                	 that.app.successMessage();
				                });
						},
						changeBooking:function(ev){
							var from = $(ev.target).attr('id');
							var id = ev.target.value;
							var that = this;
							var URL = "api/changebooking";
							var type = "";
							var title ;
							if(from == "ddlemployees"){
								type = "employees";
								title = this.$el.find('#ddlemployees option:selected').text();
							}else{
							    type = "services";
							    title = this.$el.find('#ddlservices option:selected').text();
							}
							
							 this.app.showLoading('Wait, Saving info...',this.$el);
							  var mdr = "";
								$.post(URL, {title:title,type:type,customerid:this.model.customerid,id:id,bookingid:this.model.bookingid,franchiseid:this.app.user_franchise_id,branchid:this.app.user_branch_id})
				                .done(function(data) { 
				                	 that.app.showLoading(false,that.$el);
				                	 that.app.successMessage();
				                	 $(ev.target).attr('disabled',true);
				                	 that.render();
				                });
						},
						basicInfo:function(){
							this.$el.find('#txtname').val(this.model.name);
							this.$el.find('#txtphone').val(this.model.phone);
							this.$el.find('#txtemail').val(this.model.email);
							this.$el.find('#txtemailcustomer').val(this.model.email);
							this.$el.find('#lblnamecustomer').html(this.model.name);
							console.log(this.model);
							if(this.model.isregistered == "0"){
								this.$el.find("#isregistered").show();
							}else{
								this.$el.find("#isregistered").hide();
							}
							this.$el.find("#strongisregistered").html('Registration Id: '+ this.model.customerid);
						},
						basicBooking:function(){
							this.$el.find('#pdepartment').html(this.model.branch);
						 	this.$el.find('#pprice').html(this.model.price  );
							this.$el.find('#pdatetime').html(this.model.dayid);
							this.$el.find('#pbookingtype').html(this.model.bookingtype);
							this.$el.find('#pstatus').html(this.model.status);
							this.$el.find('#pDatetime').html(this.getDate(this.model.dayid) + ' from '+ this.model.timestart + ' to ' + this.model.timeend); 
						},
						getDate:function(date){
							return date.slice(0,4) + '-' + date.slice(4,6) +'-'+ date.slice(6,8);
						},
						sendSMS:function(){ 
							var phone = this.$el.find('#txtphonenumber').val();
							var bookingid = this.model.bookingid;
							var customerid = this.model.customerid;
							if(!this.model.name)
								this.model.name = "not register";
							var text = this.$el.find('#txtemailtext').val();
							this.$el.find('.email-error-sms').addClass('hide');
							if(!this.app.validatePhone(phone)){
								this.$el.find('.email-error-sms').removeClass('hide');
								return false;
							}
							var that = this;
							 this.app.showLoading('Wait, Sending...',this.$el);
							 var mdr = "";
							 var URL = "api/sendsms";
								$.post(URL, {franchiseid:this.app.user_franchise_id,text:text,customerid:customerid,bookingid:bookingid,email:phone})
				                .done(function(data) { 
				                	 that.app.showLoading(false,that.$el);
				                	 that.app.successMessage(data);
				                	 
				                	 mdr +='<div class="col-lg-12 col-md-12 col-sm-12">';
				                	    mdr +='<div class="info-container" style="margin-top:20px;">';
				                	    mdr +='<p><strong> Just now</strong></p>';
				                	    mdr +='<strong>To:'+that.model.name+'</strong></span></p>';
				                	    mdr +='<p>'+text+'</p></div>';
				                	    	 
				                	    	that.$el.find("#smshistory").prepend(mdr);
				                });
							
						},
						updateComments:function(){
							var that = this;
							var comments =  this.$el.find('#txtcomments').val(); 
							var id = this.model.customerid;
							var URL = "api/savecomments";
							 this.app.showLoading('Wait, Saving info...',this.$el);
							 var mdr = "";
								$.post(URL, {comments:comments,customerid:id})
				                .done(function(data) { 
				                	 that.app.showLoading(false,that.$el);
				                	 that.app.successMessage();
				                	 that.render();
				                	 mdr +='<div class=" col-md-12">';
				                	    mdr +='<div class="info-container" style="margin-top:20px;">';
				                	    mdr +='<p><strong> Few moment Ago</strong></p>';
				                	    mdr +='<p>'+comments+'</p>';
				                	    mdr +='</div>';
				                	    	mdr +='</div>';
				                	    	that.$el.find("#divsectioncomments").prepend(mdr);
				                });
						},
						 fetchServices:function(){
							 var URL = "api/servicesbyjobtypeid";
					         var that = this;  
					          jQuery.getJSON(URL,{franchiseid:this.app.user_franchise_id,jobtypeid:this.model.jobtypeid},  function (tsv, state, xhr) {
				                var _json = jQuery.parseJSON(xhr.responseText);
					                 that.$el.find("#ddlservices").html(_.map(_json,function(value,key,list){ 
					                	 var check = "";
					                	 if(value.id == that.model.serviceid)
					                		 check = "selected";
					                	 return "<option "+check+" data-price="+value.price+" data-time="+value.time+" value="+value.id+">"+value.name+"</option>";
					                	 }).join());
					                
									  
					          }); 
					     },
					       
					     fetchEmployees:function(branchid){
					    	 this.app.showLoading('Loading Data...',this.lid );
								 var URL = "api/getemployeesbyjobtypeid";
								 var that = this; 
								 this.$el.find("#ddlemployees").html("<option value='0' selected> None </option>");
							      jQuery.getJSON(URL,{frachiseid:this.app.user_franchise_id,jobtypeid:this.model.jobtypeid},  function (tsv, state, xhr) {
					                var _json = jQuery.parseJSON(xhr.responseText);
						                 that.$el.find("#ddlemployees").append(_.map(_json,function(value,key,list){
						                	 var check = "";
						                	 console.log(that.model.employeeid)
						                	 if(value.id == that.model.employeeid)
						                		 check = "selected";
						                	 	return "<option "+check+" value="+value.id+">"+value.name + "</option>";
						                	 }).join());
						                 that.app.showLoading(false,this.lid );
							      	});
					     }
					});
		});
