define(['text!language/tpl/addupdate.html'],
	function (template) {
		'use strict';
		return Backbone.View.extend({  
			 events:{
				 'click .close-p':"closeView", 
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
				
				 this.undelegateEvents();
				 this.$el.remove();
				 this.$el.removeData().unbind(); 
				 this.remove();  
				 Backbone.View.prototype.remove.call(this);
			},
			save:function(){
				if(!this.options.id){
					this.options.page.saveToken(this.$el.find('#txttitle').val(),this.$el.find('#txttranslate').val(),this);
				}else{
					this.options.page.saveToken(this.options.id,this.$el.find('#txttitle').val(),this.$el.find('#txttranslate').val(),this);
				}
				
			}
		 
		});
	});
