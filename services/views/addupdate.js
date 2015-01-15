define(['text!services/tpl/addupdate.html','services/models/service','services/views/list'],
	function (template,ServiceModel,Service) {
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
				var that = this;
				this.$el.find('#radioBtn a').on('click', function(){
	                    var sel = $(this).data('title');
	                    var tog = $(this).data('toggle');
	                    that.$el.find('#'+tog).prop('value', sel);
	                    
	                    that.$el.find('a[data-toggle="'+tog+'"]').not('[data-title="'+sel+'"]').removeClass('active').addClass('notActive');
	                    that.$el.find('a[data-toggle="'+tog+'"][data-title="'+sel+'"]').removeClass('notActive').addClass('active');
	                    if(sel == "Y"){
	                    	that.$el.find('.show-bookable').slideDown('fast')
	                    }else{
	                    	that.$el.find('.show-bookable').slideUp('fast');
	                    }
	                    	
				})
			},
			closeView:function(){
				this.$el.find('#newservice').modal('toggle'); 
				 //this.undelegateEvents();
				// this.$el.remove();
				// this.$el.removeData().unbind(); 
				// this.remove();  
				// Backbone.View.prototype.remove.call(this);
			},
			clearErrorFilter:function(){
				this.$el.find('.name-error').addClass('hide');
				this.$el.find('.price-error').addClass('hide')
				this.$el.find('.time-error').addClass('hide')
			},
			save:function(){ 
				this.clearErrorFilter();
				var name = this.$el.find('#txtservice').val();
				var type = this.$el.find('#radioBtn .active').data('title') 
				var comments = this.$el.find('#txtcomments').val();
				var time = this.$el.find('#txttime').val();
				var price = this.$el.find('#txtprice').val();
				console.log(type)
				 if(!name){
					 this.$el.find('.name-error').removeClass('hide')
					 return false;
				 }
				 if(type == "Y"){
					 if(!price){
						 this.$el.find('.price-error').removeClass('hide')
						 return false;
					 }
					 if(!time){
						 this.$el.find('.time-error').removeClass('hide')
						 return false;
					 }
				
				 }
				 	var objService = new ServiceModel();
		            	objService.set('branchid',1);
		            	objService.set('name',name);
		            	objService.set('type',type);
		            	objService.set('comments',comments);
		            	objService.set('time',time);
		            	objService.set('price',price);
		            	var model = objService.save(); 
		            	this.options.page.objServices.add(objService);  
		                var last_model = this.options.page.objServices.last();
		                //this.closePopup();
		                var objService = new Service({model:objService,page:this,setting:this.options.page.setting});
		                this.options.page.$el.find('tbody').prepend(objService.$el);
						this.options.page.setting.services[this.options.page.setting.services.length-1] = name;
						this.closeView();
						this.options.page.setting.successMessage();
		            
			}
		 
		});
	});
