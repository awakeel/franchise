define(['text!employees/tpl/addupdate.html','employees/models/employee','employees/views/list','timepick'],
	function (template,EmployeeModel,Employee,timepick) {
		'use strict';
		return Backbone.View.extend({  
			 events:{
				 'click .close-t':"closeViewTiming", 
				 "click .save-p":"save",
				 "click .close-p":'closeView',
				 "click .save-t":"saveEmployeeTimings"
				 
			 },
			  id:'divnewemployee',
			  initialize: function () {
				this.template = _.template(template); 
				this.app = this.options.page.setting;
				this.id = null;
				this.services = null;
				this.isEmptyRole = true;
				this.data = null;
				this.roleid = 0;
				this.branchid =  this.app.user_branch_id;
				this.franchiseid = this.app.user_franchise_id;
				this.jobtypes = null;
				this.parent = this.options.page;
				this.objModelEmployee = new EmployeeModel(); 
				this.render();
				
			},
			closeViewTiming:function(){
				console.log('I am logging');
				this.$el.find('.modal').modal('hide');  
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
					if(this.model.get('type').trim()=="Hourly"){
						this.$el.find('.visit-timing').removeClass('hide');
					}
				 
				}else{
					this.getJobTypes();
					//this.getServices();
					
				}
				this.getEmployeesRoles();
				this.getEmployeesDepartments();
				var that = this;
				this.$el.find("#optionvisiting").on('click',function(){
					if(this.checked){
						that.$el.find('.visit-timing').removeClass('hide');
					}else{
						that.$el.find('.visit-timing').addClass('hide');
					}
				})
				that.$el.find('.visit-timing').on('click',function(){
					that.fillTimings();
					that.$el.find('#newemployeetiming').modal('show');
				})
				this.$el.find('#chkall').on('click',function(ev){ 
					
					that.$el.find('.days').prop("checked", !that.$el.find('.days').prop("checked"));
					var first = that.$el.find("#txtsm").val();
					var end = that.$el.find("#txtem").val();
					if(!first)
						first = "9:00";
					if(!end)
						end = "17:00"; 
					if($(ev.target).is(':checked')){
						that.$el.find('.first-text').attr('disabled',false);
						that.$el.find('.end-text').attr('disabled',false);
						that.$el.find(".first-text").val(first)
						that.$el.find(".end-text").val(end)
					}else{
						that.$el.find('.first-text').attr('disabled',true);
						that.$el.find('.end-text').attr('disabled',true);
						that.$el.find(".first-text").val('')
						that.$el.find(".end-text").val('')
					}
					if(!this.checked){
						 
						that.$el.find('.first-text').attr('disabled',true);
						that.$el.find('.end-text').attr('disabled',true);
						that.$el.find(".first-text").val('')
						that.$el.find(".end-text").val('')
					 	that.$el.find('.days').prop("checked",false);
						return;
				}
				}) 

				this.$el.find(".timepicker").timepicker({ 'timeFormat': 'H:i' });
				this.$el.find('.days').on('click',function(){
					if($(this).prop('checked')!= true){
						that.$el.find("#txts"+$(this).attr('id')).attr('disabled',true);
						that.$el.find("#txte"+$(this).attr('id')).attr('disabled',true)
						var first = that.$el.find("#txts"+$(this).attr('id')).val('');
						var end = that.$el.find("#txte"+$(this).attr('id')).val('');
					}else{
						that.$el.find("#txts"+$(this).attr('id')).attr('disabled',false);
						that.$el.find("#txte"+$(this).attr('id')).attr('disabled',false)
					}
				})
			},
			closeView:function(){
				var that = this;
				require(['employees/views/lists' ],
						 function(Lists) {
				 
							var objLists = new Lists({
								setting : that.app,
								//id:that.branchid
							});
							 
								 that.$el.parent().html(objLists.$el);
								  })
			},
			saveEmployeeTimings:function(){
				 var that = this;
				this.app.showLoading('Saving...',that.$el.find('#newemplyeetimings'));
				var days = [];
				 this.days = days;
				 var data = "";
				
			     $('.timings-div :checked').each(function() {
			    	 days.push($(this).val());
			     });
			     var returnValue = true;
			     if(days.length < 1){
			    	 that.$el.find('.timing-error').removeClass('hide');
			    	 this.app.showLoading(false,that.$el.find('#newemplyeetimings'));
						return false;
			     }
			     _.each(days,function(index){ 
			    	 if(index){
					    	 console.log(that.$el.find("#txte"+index).val()) 
					    	 var start = that.$el.find("#txts"+index).val();
					    	 var end = that.$el.find("#txte"+index).val()
					    	
					    	 var diff = that.calculate(start,end);
					    	 console.log(index + 'start '+ start + ' end '+ end + 'difference')
					    	 if(diff < 1 ){
					    		var span = '<span class="help-block"><i class="fa fa-warning"></i>  We opened '+that.$el.find('.department-name').html() + ' on ' + index +'</span>';
					    		 that.$el.find("#txts"+index).after(span);
					    		 var span = '<span class="help-block"><i class="fa fa-warning"></i> We closed '+that.$el.find('.department-name').html()+ ' on' + index +'</span>';
					    		 that.$el.find("#txte"+index).after(span);
					    		 returnValue = false;
					    	 }
					    	
					    		 data += index+"="+start+"##"+end+'||';
			    	 } 
			     })
			     
			     if(returnValue == false){
			    	 this.app.showLoading(false,that.$el.find('#newemplyeetimings'));
			    	 return false;
			     } 
			     var that = this;
				 var URL = "api/saveemployeetiming";
				 if(!this.id){
					 this.data = data;
					 this.app.showLoading(false,that.$el.find('#newemplyeetimings'));
					 that.closeViewTiming();
					 return;
				 }
				 jQuery.getJSON(URL,{id:this.id,timings:data},  function (tsv, state, xhr) {
		                var _json = jQuery.parseJSON(xhr.responseText);
		               
				 });
				 this.app.showLoading(false,that.$el.find('#newemplyeetimings'));
				 that.closeViewTiming();
			},
			calculate:function(time1,time2) {
				 if(time1 == 0 || time2 == 0) return 0;
		         var hours = parseInt(time1.split(':')[0], 10) - parseInt(time2.split(':')[0], 10);
		         if(hours < 0) hours = 24 + hours;
		         
		         return hours;
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
	      	          that.isEmptyRole = false;
	      	            str +='</label>';
	      	            str +=' ';
	                }) 
	                if(that.isEmptyRole == true){
	                	that.addNewRoles();
	                }
	                that.app.showLoading(false,that.$el.find('.role-area'));
	                that.$el.find('.role-area').append(str);
	                that.$el.find('.role-area input[type=radio]').on('click',function(){
	                	that.$el.find('.role-area').hide();
	                	var department = that.$el.find('.role-area').data('id');  
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
			addNewRoles:function(){
				var that = this;
				 swal({
   			      title: "Role confirmation?",
   			      text: "Please add few roles, so you can assign them to employees.!",
   			      type: "info", 
   			    });
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
			fillTimings:function(){
				var url = "api/employeetimings";
				 var that = this;
				  
                jQuery.getJSON(url,{id:this.id}, function(tsv, state, xhr) {
                    var timings = jQuery.parseJSON(xhr.responseText);
                    _.each(timings,function(value,key,list){ 
                    	that.$el.find("#txts"+value.day).val(value.opened).removeAttr('disabled');
                    	that.$el.find("#txte"+value.day).val(value.closed).removeAttr('disabled');
                    	that.$el.find(".timings-div #"+value.day+"").attr('checked',true);
                    	that.$el.find('#chkall').attr('checked',true);
                    }) 
                    
                });
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
				this.$el.find('.password-error').addClass('hide');
				this.$el.find('.email-error').addClass('hide');
			},
			save:function(){
					this.clearFields();
			     	var _f = this.$el.find('#txtfirstname').val();
					var _l = this.$el.find('#txtlastname').val();
					var _p = this.$el.find('#txtphone').val();
					var _e = this.$el.find('#txtemail').val();
					var _pas = this.password(6);
					
					var branchid = this.$el.find('#ddldepartments').val();
					if(!_p){
						this.$el.find('.phone-error').removeClass('hide');
						return false;
					}
					if(!_f){
						this.$el.find('.firstname-error').removeClass('hide');
						return false;
					}
					if(_e && !this.app.IsEmail(_e)){
						this.$el.find('.email-error').removeClass('hide');
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
				 	var that = this;
				 	
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
	            	var model = this.objModelEmployee.save(null,{
	            	    
	            	    success:function(model, response) {
	            	    	if(that.data){
	   	            		 var URL = "api/saveemployeetiming"; 
	   	            		 $.getJSON(URL,{id:response,employeeid:response,timings:that.data},  function (tsv, state, xhr) {
	   	 		                var _json = jQuery.parseJSON(xhr.responseText);
	   	 		           
	   	 				     });
	   	            		  that.data = null;
	   	            	    }  
	            	    	that.closeView();
	 	   	 		           that.app.successMessage();
	 		   			        $("#tr_norecord").remove();
	 		   			         
	            	    },
	            	    error: function(model, error) {
	            	    	console.log(error.statusText  );
	            	    	that.app.errorMessage();
	            	    	that.closeView();
	            	    }
	            	}); 
	       
	            	
	            	 
	            	
					
			},
			 password:function(length, special) {
				  var iteration = 0;
				  var password = "";
				  var randomNumber;
				  if(special == undefined){
				      var special = false;
				  }
				  while(iteration < length){
				    randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
				    if(!special){
				      if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
				      if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
				      if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
				      if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
				    }
				    iteration++;
				    password += String.fromCharCode(randomNumber);
				  }
				  return password;
				}
		 
		});
	});
