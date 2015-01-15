define(['text!authorize/tpl/login.html','authorize/models/login'],
	function (template,Login) {
		'use strict';
		return Backbone.View.extend({  
			events:{
				"click .btn-login":"login"
			},
			className:"login",
			initialize: function () {
				this.template = _.template(template);
				///var objAuthentication = new Authentication();
				this.render();
			},
			render: function () {
				this.$el.html(this.template()); 
			},
			clearError:function(){
				this.$el.find('.phone-error').addClass('hide');
				this.$el.find('.password-error').addClass('hide');
				this.$el.find('.phone-error-empty').addClass('hide');
				this.$el.find('.password-error-empty').addClass('hide');
			},
			login:function(){
				this.clearError();
				var URL = "api/process";
				var phone = this.$el.find("#txtphone").val();
				var password = this.$el.find("#txtpassword").val();
                if(!phone){
                	this.$el.find('.phone-error-empty').removeClass('hide');
                	return;
                }
                if(!password){
                	this.$el.find('.password-error-empty').removeClass('hide');
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
                    	require([ 'app' ], function(app) {
                    		//var mainRouter = new router({user:_json[0]});
                    		Backbone.History.started = false;
                    		 app.load( _json.user[0])
                    		 
                    		})
                    }else{
                    	console.log('I am false');
                    }
                 });
			}
		});
	});
