define(['text!roles/tpl/addupdate.html','roles/views/list','roles/models/role'],
	function (template,Role,RoleModel) {
		'use strict';
		return Backbone.View.extend({  
			 events:{
				 'click .close':"closeView", 
				 "click .save-p":"save"
			 },
			  initialize: function () {
				this.template = _.template(template);
				 
				this.render();
			},
			render: function () {  
				this.$el.html(this.template( ));
				if(this.options.name || this.options.description){
					console.log(this.options)
					this.$el.find('#txtname').val(this.options.name);
					this.$el.find('#txtcomments').val(this.options.description);
				}
			},
			closeView:function(){
				this.$el.find('.modal').modal('toggle'); 
				 //this.undelegateEvents();
				//1 this.$el.remove();
				 //this.$el.removeData().unbind(); 
				 //this.remove();  
				 //Backbone.View.prototype.remove.call(this);
			},
			clearErrorFilter:function(){
				this.$el.find('.name-error').addClass('hide');
			},
			
			save:function(){
						 var name = this.$el.find('#txtname').val();
						 var comments = this.$el.find('#txtcomments').val()
						 if(!name){
							 this.$el.find('.name-error').removeClass('hide')
							 return false;
						 }
						var spin = this.options.page.setting.showLoading('',this.$el);
						 
						if( this.options.isnew == true){
			            	var objRoleModel = new RoleModel();
			             	objRoleModel.set('name',name);
			            	objRoleModel.set('description',comments);
			            	var model = objRoleModel.save(); 
			            	this.options.page.objRoles.add(objRoleModel);  
			                var last_model = this.options.page.objRoles.last();
			                //this.closePopup();
			                var objRole = new Role({model:objRoleModel,page:this.options.page,setting:this.options.page.setting});
							this.options.page.$el.find('tbody').prepend(objRole.$el);
							this.options.page.fetchRoles();
							this.options.page.setting.successMessage();
						}else{
							this.model.set('name',name);
			            	this.model.set('description',comments);
			            	var model = this.model.save(); 
			            	this.options.page.options.page.fetchRoles();
							this.options.page.options.page.setting.successMessage();
						}
						spin.stop();
						this.closeView();
						
						this.$el.find('#txtname').val('');
						this.$el.find('#txtcomments').val('');
						
			}
		 
		});
	});
