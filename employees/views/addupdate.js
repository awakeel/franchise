define(['text!employees/tpl/addupdate.html','employees/models/employee','employees/views/list'],
	function (template,EmployeeModel,Employee) {
		'use strict';
		return Backbone.View.extend({  
			 events:{
				 'click .close-p':"closeView", 
				 "click .save-p":"save"
			 },
			  initialize: function () {
				this.template = _.template(template); 
				this.app = this.options.page.setting;
				this.id = null;
				this.services = null;
				this.roleid = 0;
				this.branchid = this.app.users.branchid;
				this.jobtypes = null;
				this.parent = this.options.page;
				this.objModelEmployee = new EmployeeModel();
				if(typeof this.options.page.branchid !="undefined")
					this.branchid = this.options.page.branchid;
				this.render();
				
			},
			render: function () {   
				this.$el.html(this.template( ));
			 
				if(typeof this.options.id  == "undefined"){
					this.objModelEmployee =  this.model;
					this.jobtypes = this.model.get('jobtypes');
					this.parent = this.options.page.options.page;
					this.firstname = this.model.get('firstname');
					this.lastname = this.model.get('lastname');
					this.email = this.model.get('email');
					this.password = this.model.get('password');
					this.phone = this.model.get('phone');
					this.address = this.model.get('address');
					this.roleid = this.model.get('roleid');
					this.id = this.model.get('id');
					this.services = null;
					this.getServiceByEmployeeId();
					this.objModelEmployee.set({id:this.model.get('id')}); 
					this.$el.find('#txtfirstname').val(this.firstname);
					this.$el.find('#txtlastname').val(this.lastname);
					this.$el.find('#txtphone').val(this.phone);
					this.$el.find('#txtaddress').val(this.address);
					this.$el.find('#txtemail').val(this.email);
					this.$el.find('#txtpassword').val(this.password);
					this.$el.find("input:radio[value='"+this.model.get('type')+"']").attr('checked', true);
				}else{
					this.getJobTypes();
					this.getServices();
					this.getRoles();
				}
				
			},
			closeView:function(){
				 if(this.id)
					 this.options.page.options.page.$el.find('#employees').modal('hide');
				 else
					 this.options.page.$el.find('#employees').modal('hide');
				 this.undelegateEvents();
				 this.$el.remove();
				 this.$el.removeData().unbind(); 
				 this.remove();  
				 Backbone.View.prototype.remove.call(this);
			},
			getRoles:function(){
				var URL = "api/allroles";
	            var that = this;
	            var str = "";
	            this.app.showLoading('Loading roles...',that.$el.find('.role-area'));
	            jQuery.getJSON(URL,  function (tsv, state, xhr) {
	                var _json = jQuery.parseJSON(xhr.responseText);
	               var all = _json;
	                _.each(all,function(value,key,list){
	                	var check = "";
	                	if(that.roleid == value.id)
	                		check = "checked";
	                	 str += '<div class="radio">';
	      	            str +='<label> <input type="radio" checked=""';
	      	            str +='	value="'+value.id+'" name="optionsrole"> '+value.name;
	      	         
	      	            str +='</label>';
	      	            str +='</div>';
	                }) 
	                that.app.showLoading(false,that.$el.find('.role-area'));
	                that.$el.find('.role-area').append(str);
	            } );
	         
			},
			getServiceByEmployeeId:function(){
				 var that = this;
				 var URL = "api/employeeservices";
				 jQuery.getJSON(URL,{id:this.id},  function (tsv, state, xhr) {
		                var _json = jQuery.parseJSON(xhr.responseText);
		                var str = "";
		                _.each(_json,function(value,key,list){
		                	str +=value.serviceid+",";
		                });
		                str.trim();
		                console.log(str);
		                that.services = str.split(',');
		                that.getJobTypes();
		                that.getServices();
		                that.getRoles();
				 });
			},
			getServices:function(){
				
				var str = "";
				 var that = this;
				 var URL = "api/services";
		            var that = this;
		            var services = this.options.page.setting.services;
		           console.log(this.services);
		            if($.isEmptyObject(services) ){
		            	 
			            jQuery.getJSON(URL,{branchid:this.branchid},  function (tsv, state, xhr) {
			                var _json = jQuery.parseJSON(xhr.responseText);
			                var services = _json;
			              
			                _.each(services,function(value,key,list){ 
			                     	var check = "";
			                	   if(that.services){
			                		   
			                    		 var objs = _.filter(that.services, function(obj){ 
			                    			 console.log('I am in services but dont know' + obj + ' id ' + value.id);
					            			 return obj.trim() == value.id.trim();
					            		 });
									 	 if(objs.length > 0){ 
											   check = "checked";
										 }
			                		 
			                     	}
								str+='<div class="checkbox">';
								str+='<label> <input type="checkbox" value="'+value.id+'" '+check+'>'+value.name;
									str+='</label>';
										str+='</div>';
							});
			                that.$el.find('.services-box').append(str);
			            });
		            }else{
		            	 _.each(services,function(value,key,list){ 
		            		 var check = "";
		            		 	if(that.services){
		            		 		if(list[key]){
				            		 var objs = _.filter(that.services, function(obj){ return obj.trim() == key.trim() });
								 	 if(objs.length > 0){ 
										   check = "checked";
									 }
		            		 		}
		            	 		}
								str+='<div class="checkbox">';
								str+='<label> <input type="checkbox" value="'+key+'" '+check+'>  '+list[key];
									str+='</label>';
										str+='</div>';
							});
			                that.$el.find('.services-box').append(str);
		            }
				 
			},
			getJobTypes:function(){
				var str = "";
				 var that = this;
				 var URL = "api/jobtypes";
		            var that = this;
		            var jobtypes = this.options.page.setting.jobTypes;
		            console.log(this.jobtypes);
		            if($.isEmptyObject(jobtypes)){
		            	 
			            jQuery.getJSON(URL,{branchid:this.branchid},  function (tsv, state, xhr) {
			                var _json = jQuery.parseJSON(xhr.responseText);
			                var jobtypes = _json;
			                
			                _.each(jobtypes,function(value,key,list){ 
			                	var check = "";
			                	if(that.jobtypes){
				            		 var objs = _.filter(that.jobtypes.split(','), function(obj){ return obj.trim() == value.name.trim() });
								 	 if(objs.length > 0){ 
										   check = "checked";
									 }
		            	 		}
								str+='<div class="checkbox">';
								str+='<label> <input type="checkbox" value="'+value.id+'" '+check+'>'+value.name;
									str+='</label>';
										str+='</div>';
							});
			                that.$el.find('.jobtypes-box').append(str);
			            });
		            }else{
		            	 _.each(jobtypes,function(value,key,list){ 
		            		 var check = "";
		            		 if(that.jobtypes){
			            		 var objs = _.filter(that.jobtypes.split(','), function(obj){ return obj.trim() == list[key].trim() });
							 	 if(objs.length > 0){ 
									   check = "checked";
								 }
	            	 		}
		            		 
								str+='<div class="checkbox">';
								str+='<label> <input type="checkbox" value="'+key+'" '+check+'>'+list[key];
									str+='</label>';
										str+='</div>';
							});
			                that.$el.find('.jobtypes-box').append(str);
		            }
				
				  
			},
			clearFields:function(){
				this.$el.find('.phone-error').addClass('hide');
				this.$el.find('.firstname-error').addClass('hide');
				this.$el.find('.lastname-error').addClass('hide'); 
			},
			save:function(){
					this.clearFields();
			     	var _f = this.$el.find('#txtfirstname').val();
					var _l = this.$el.find('#txtlastname').val();
					var _p = this.$el.find('#txtphone').val();
					var _e = this.$el.find('#txtemail').val();
					var _pas = this.$el.find('#txtpassword').val();
					if(!_p){
						this.$el.find('.phone-error').removeClass('hide');
						return false;
					}
					if(!_f){
						this.$el.find('.firstname-error').removeClass('hide');
						return false;
					}
					if(!_l){
						this.$el.find('.lastname-error').removeClass('hide');
						return false;
					}
					var _about = 'about';//this.$el.find('#txtabout').val();
					var _add = this.$el.find('#txtaddress').val();
				 	var _type = this.$el.find('input[name=optionstype]:checked').val() 
				 	var services = "";
				 	$('.services-box :checked').each(function() {
			    	  services +=$(this).val()+","
			        }); 
				 	var jobtypes = "";
				 	var jtypes = "";
				 	$('.jobtypes-box :checked').each(function() {
				 		jobtypes +=$(this).val()+",";
				 		jtypes +=$(this).text()+",";
			        }); 
				 	var roleid = 0;
				 	var role = "";
				 	$('.role-area :checked').each(function() {
				 		roleid =$(this).val();
				 		roleid =$(this).text();
			        });  
	            	this.objModelEmployee.set('firstname',_f);
	            	this.objModelEmployee.set('lastname',_l);
	            	this.objModelEmployee.set('phone',_p);
	            	this.objModelEmployee.set('email',_e);
	            	this.objModelEmployee.set('password',_pas);
	            	this.objModelEmployee.set('branchid',this.branchid);
	            	this.objModelEmployee.set('address',_add);
	            	this.objModelEmployee.set('about',_about);
	            	this.objModelEmployee.set('type',_type);
	            	this.objModelEmployee.set('services',services);
	            	this.objModelEmployee.set('jobtypes',jobtypes);
	            	this.objModelEmployee.set('roleid',roleid);
	            	this.objModelEmployee.set('role',role);
	            	var model = this.objModelEmployee.save(); 
	            	this.objModelEmployee.set('jobtypes',jtypes);
	            	this.parent.objEmployees.add(this.objModelEmployee);  
	            	if(typeof this.options.id  == "undefined"){
	            		this.parent.fetchEmployees();
	            	}else{
		            	
	            		this.parent.fetchEmployees();
		            }
					this.closeView();
					this.app.successMessage();
		            $("#tr_norecord").remove();
			}
		 
		});
	});
