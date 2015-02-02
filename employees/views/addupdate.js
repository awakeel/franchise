define(['text!employees/tpl/addupdate.html','employees/models/employee','employees/views/list'],
	function (template,EmployeeModel,Employee) {
		'use strict';
		return Backbone.View.extend({  
			 events:{
				 'click .close-p':"closeView", 
				 "click .save-p":"save"
			 },
			  id:'divnewemployee',
			  initialize: function () {
				this.template = _.template(template); 
				this.app = this.options.page.setting;
				this.id = null;
				this.services = null;
				this.roleid = 0;
				this.branchid =  this.app.user_branch_id;
				this.franchiseid = this.app.user_franchise_id;
				this.jobtypes = null;
				this.parent = this.options.page;
				this.objModelEmployee = new EmployeeModel(); 
				this.render();
				
			},
			render: function () {   
				this.$el.html(this.template( )); 
				if(typeof this.options.id  == "undefined"){
					this.objModelEmployee =  this.options.model;
				 
					this.jobtypes = this.objModelEmployee.get('jobtypes');
					this.parent = this.options.page.options.page;
					this.firstname = this.objModelEmployee.get('firstname');
					this.lastname = this.objModelEmployee.get('lastname');
					this.email = this.objModelEmployee.get('email');
					this.password = this.objModelEmployee.get('password');
					this.phone = this.objModelEmployee.get('phone');
					this.address = this.objModelEmployee.get('address');
					this.roleid = this.objModelEmployee.get('roleid');
					this.id = this.objModelEmployee.get('id');
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
					//this.getServices();
					
				}
				this.getEmployeesRoles();
				this.getEmployeesDepartments();
			},
			closeView:function(){
				var that = this;
				require(['employees/views/lists' ],
						 function(Lists) {
				 
							var objLists = new Lists({
								setting : that.app,
								id:that.branchid
							});
							 
								 that.$el.parent().html(objLists.$el);
								  })
			},
			getEmployeesRoles:function(){
				var URL = "api/allroles";
	            var that = this;
	            var str = "";
	            console.log(this.franchiseid);
	            this.app.showLoading('Loading roles...',that.$el.find('.role-area'));
	            jQuery.getJSON(URL, {franchiseid:this.franchiseid}, function (tsv, state, xhr) {
	                var _json = jQuery.parseJSON(xhr.responseText);
	               var all = _json;
	                _.each(all,function(value,key,list){
	                	var check = "";
	                	if(that.roleid == value.id)
	                		check = "checked";
	                	 
	                	str += '<label class="btn  btn-toggle">';
	      	            str +='  <input type="radio" checked="" data-name="'+value.name+'"';
	      	            str +='	value="'+value.id+'" name="optionsrole"> '+value.name;
	      	         
	      	            str +='</label>';
	      	            str +=' ';
	                }) 
	                that.app.showLoading(false,that.$el.find('.role-area'));
	                that.$el.find('.role-area').append(str);
	                that.$el.find('.role-area input[type=radio]').change(function(){
	                	that.$el.find('.role-area').hide();
	                	var department = that.$el.find('.role-area').data('id'); 
	                	 console.log(department);
	                	if(this.checked){
	                		that.$el.find('#label_'+department).removeClass('hide')
		                	that.$el.find('#label_'+department).text(  $(this).data('name'));
		                	that.$el.find('#value_'+department).data('role',$(this).val());
		                	
	                	}else{
	                		that.$el.find('#label_'+department).addClass('hide');
	                		
	                	}
	                })
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
		                ///that.getServices();
		               // this.getEmployeesRoles();
				 });
			},
			getServices:function(){
				
				var str = "";
				 var that = this;
				 var URL = "api/services";
		            var that = this;
		            var services = this.options.page.setting.services;
		         //  console.log(this.services);
		            if($.isEmptyObject(services) ){
		            	 
			            jQuery.getJSON(URL,{franchiseid:this.franchiseid},  function (tsv, state, xhr) {
			                var _json = jQuery.parseJSON(xhr.responseText);
			                var services = _json;
			              
			                _.each(services,function(value,key,list){ 
			                     	var check = "";
			                	   if(that.services){
			                		  	 var objs = _.filter(that.services, function(obj){ 
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
			               
		            }
				 
			},
			getJobTypes:function(){
				var str = "";
				 var that = this;
				 var URL = "api/jobtypes";
		            var that = this;
		            var jobtypes = this.options.page.setting.jobTypes; 
		            if($.isEmptyObject(jobtypes)){
		            	 
			            jQuery.getJSON(URL,{franchiseid:this.franchiseid},  function (tsv, state, xhr) {
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
			getEmployeesDepartments:function(){
			 
				 var that = this;
				 var URL = "api/getemployeedepartments";
		            var that = this; 
		            
		            	 
			            jQuery.getJSON(URL, {franchiseid:this.franchiseid,employeeid : this.id},  function (tsv, state, xhr) {
			                var _json = jQuery.parseJSON(xhr.responseText);
			                var deps = _json;
			                var str = "";
			               
			                _.each(deps,function(value,key,list){ 
			                	var selected = "";  
			                	 var role = "";
					                var clas = "hide";
					                var roleid = '';
					                if(value.role != "0"){
					                	role = value.rolename;
					                	clas = "";
					                	roleid = value.role;
					                }
								 str+='<div class="checkbox">';
								    str+='<label> <input type="checkbox" '+value.selected+' id="value_'+value.id+'" data-role="'+roleid+'" value="'+value.id+'" '+selected+'>'+value.name;
									
								    str+='&nbsp;<span class="label label-info '+clas+'"   id="label_'+value.id+'"> '+role+'</span>';
										str+='</label></div>'; 
							}); 
			                that.$el.find('.departments').html(str); 
			                that.$el.find('.departments input[type=checkbox]').change(function() {
			                	that.$el.find('.role-area').data('id',$(this).val()) ;
			                	 that.$el.find('#label_'+$(this).val()).html('');
		                		 $(this).data('role','');
			                      if($(this).is(":checked")) {
			                    	var p = $(this).position();
			                    	 var top = p.top;
			                    	 console.log(top);
			                    	 var left =p.left; 
			                    	
			                         that.$el.find('.role-area').css({left:left,top:top});
			                         that.$el.find('.role-area').show();
			                     } else{
			                    	that.$el.find('.role-area').hide();
			                     }
			                });
			            });
		           
				  
			},
			clearFields:function(){
				this.$el.find('.phone-error').addClass('hide');
				this.$el.find('.firstname-error').addClass('hide');
				this.$el.find('.lastname-error').addClass('hide');
				this.$el.find('.role-error').addClass('hide');
				this.$el.find('.jobtype-error').addClass('hide');
			},
			save:function(){
					this.clearFields();
			     	var _f = this.$el.find('#txtfirstname').val();
					var _l = this.$el.find('#txtlastname').val();
					var _p = this.$el.find('#txtphone').val();
					var _e = this.$el.find('#txtemail').val();
					var _pas = this.$el.find('#txtpassword').val();
					var branchid = this.$el.find('#ddldepartments').val();
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
					var jobtypes = "";
				 	var jtypes = "";
				 	$('.jobtypes-box :checked').each(function() {
				 		jobtypes +=$(this).val()+",";
				 		jtypes +=$(this).text()+",";
			        }); 
				 	var branchesrole = 0;
				 	var role = "";
				 	 
				 	var branches = "";
				 	var branchesid = "";
				 	
				 	$('.departments :checked').each(function() {
				 		branchesid +=$(this).val();
				 		branches +=$(this).text();
				 		 
				 		branchesrole +=$(this).val()+"----"+$(this).data('role')+",";
			        }); 
				 	 
				 	if(!jobtypes){
				 		this.$el.find('.jobtype-error').removeClass('hide');
						return false;
				 	}
					var _about = 'about';//this.$el.find('#txtabout').val();
					var _add = this.$el.find('#txtaddress').val();
				 	var _type = this.$el.find('input[name=optionstype]:checked').val() 
				 	var services = "";
				 	$('.services-box :checked').each(function() {
			    	  services +=$(this).val()+","
			        }); 
				 	
	            	this.objModelEmployee.set('firstname',_f);
	            	this.objModelEmployee.set('lastname',_l);
	            	this.objModelEmployee.set('phone',_p);
	            	this.objModelEmployee.set('email',_e);
	            	this.objModelEmployee.set('password',_pas);
	            	this.objModelEmployee.set('branchid',branchid);
	            	this.objModelEmployee.set('address',_add);
	            	this.objModelEmployee.set('about',_about);
	            	this.objModelEmployee.set('type',_type);
	            	this.objModelEmployee.set('services',services);
	            	this.objModelEmployee.set('jobtypes',jobtypes);
	            	this.objModelEmployee.set('branchesrole',branchesrole);
	            	this.objModelEmployee.set('franchiseid',this.franchiseid);
	            	this.objModelEmployee.set('role',role);
	            	this.objModelEmployee.set('branchids',branchesid);
	            	var model = this.objModelEmployee.save(); 
	            	this.objModelEmployee.set('jobtypes',jtypes);
	            	this.parent.objEmployees.add(this.objModelEmployee);  
	            	if(typeof this.options.id  == "undefined"){
	            		this.parent.render();
	            	}else{
		            	
	            		this.parent.render();
		            }
					this.closeView();
					this.app.successMessage();
		            $("#tr_norecord").remove();
			}
		 
		});
	});
