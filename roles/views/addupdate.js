define(['text!jobtypes/tpl/addupdate.html','jobtypes/views/list','jobtypes/models/jobtype'],
	function (template,JobType,JobTypeModel) {
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
		            	var objjobtype = new JobTypeModel();
		            	objjobtype.set('branchid',1);
		            	objjobtype.set('name',name);
		            	objjobtype.set('comments',comments);
		            	var model = objjobtype.save(); 
		            	this.options.page.objJobTypes.add(objjobtype);  
		                var last_model = this.options.page.objJobTypes.last();
		                //this.closePopup();
		                var objjobtype = new JobType({model:objjobtype,page:this.options.page,setting:this.options.page.setting});
						this.options.page.$el.find('tbody').prepend(objjobtype.$el);
						this.options.page.setting.jobTypes[this.options.page.setting.jobTypes.length-1] = name;
						this.closeView();
						this.options.page.setting.successMessage();
						this.$el.find('#txtname').val('');
						this.$el.find('#txtcomments').val('');
						spin.stop();
			}
		 
		});
	});
