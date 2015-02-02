define(['text!authorize/tpl/login.html','authorize/models/login'],
	function (template,Login) {
		'use strict';
		return Backbone.View.extend({  
			events:{
				"click .btn-login":"login",
				"keyup #txtpassword":"enterLogin"
			}, 
			initialize: function () {
				this.app = this.options.app;
				this.app.showLoading('Loading Login....',this.$el.find('.login-area'));
				this.template = _.template(template);
				this.app.users = {};
				$('body').addClass('login');
				///var objAuthentication = new Authentication();
				this.render();
			},
			render: function () {
				this.$el.html(this.template()); 
				this.app.showLoading(false,this.$el.find('.login-area'));
			},
			clearError:function(){
				this.$el.find('.phone-error').addClass('hide');
				this.$el.find('.password-error').addClass('hide');
				this.$el.find('.phone-error-empty').addClass('hide');
				this.$el.find('.password-error-empty').addClass('hide');
			},
			enterLogin:function(ev){
				if(ev.which == 13) {
					this.login();
				}
			},
			login:function(){
				this.app.showLoading('Wait, We checking our database...',this.$el.find('.login-area'));
				this.clearError();
				var URL = "api/process";
				var phone = this.$el.find("#txtphone").val();
				var password = this.$el.find("#txtpassword").val();
                if(!phone){
                	this.$el.find('.phone-error-empty').removeClass('hide');
                	 this.app.showLoading(false,this.$el.find('.login-area'));
                	return;
                }
                if(!password){
                	this.$el.find('.password-error-empty').removeClass('hide');
                	 this.app.showLoading(false,this.$el.find('.login-area'));
                	return;
                } 
                var that = this;
				$.post(URL, {phone:phone,password:password})
                .done(function(data) {  
                	 
                    var _json = jQuery.parseJSON(data);
                    
                     if(_json.password == false){
                     	that.$el.find('.phone-error').removeClass('hide');
                      	return;
                      }
                     if(_json.phone == false){
                     	that.$el.find('.password-error').removeClass('hide');
                      	return;
                      }
                    if(_json.is_logged_in){
                    	that.app.destroy();
                    	require([ 'app' ], function(app) {
                    		// var mainRouter = new router({user:_json[0]});
                    		Backbone.History.started = false;
                    		  app.load( _json.user[0])
                    		 
                    		})
                    }else{
                    	console.log('I am false');
                    }
                 });
				 this.app.showLoading(false,this.$el.find('.login-area'));
			}
		});
	});
