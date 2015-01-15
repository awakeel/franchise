define(['text!employees/tpl/addupdate.html'],
	function (template,Services) {
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
				 console.log(this.options)
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
					var _f = this.$el.find('#txtfirstname').val();
					var _l = this.$el.find('#txtlastname').val();
					var _p = this.$el.find('#txtphone').val();
					var _e = this.$el.find('#txtemail').val();
					var _pas = this.$el.find('#txtpassword').val();
					var _about = 'about';//this.$el.find('#txtabout').val();
					var _add = this.$el.find('#txtaddress').val();
					 
					var _type = this.$el.find('input[name=optionstype]:checked').val() 
					this.options.page.save(_f,_l,_p,_e,_pas,_add,_about,_type,1,this);
				}else{
					this.options.page.saveToken(this.options.id,this.$el.find('#txtname').val(),1,this.$el.find('#txtcomments').val(),this);
				}
				
			}
		 
		});
	});
