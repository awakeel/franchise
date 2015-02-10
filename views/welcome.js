define(['jquery', 'backbone', 'underscore',  'text!templates/welcome.html'],
	function ($, Backbone, _,   template) {
		'use strict';
		return Backbone.View.extend({
			 
                         events: {
                            'click .btn-change':'changePassword'
                        	 
                         },

			initialize: function () {
				this.template = _.template(template); 
				this.app = this.options.setting;
				this.render();
				 			
			},

			render: function () {
				this.$el.html(this.template({}));
				
			},
			newBranch:function(){
				var that = this;
			  	 require(['branches/views/addupdate'],function(addupdate){
			  		 console.log('I am vived');
			  		$('#page-wrapper').find('.page-content').html(new addupdate({model:{},id:1,page:that,setting:that.options.setting}).$el);
				 }) 
			},
			clearError:function(){
				this.$el.find('.password1-error').addClass('hide');
				this.$el.find('.password2-error').addClass('hide');
				this.$el.find('.password-confirm').addClass('hide');
			},
			changePassword:function(){
				
				this.clearError();
				var URL = "api/changepassword";
				var password1 = this.$el.find("#txtpassword1").val();
				var password2 = this.$el.find("#txtpassword2").val();
                if(!password1){
                	this.$el.find('.password1-error').removeClass('hide');
                	 return;
                }
                if(!password2){
                	this.$el.find('.password2-error').removeClass('hide');
                	 return;
                } 
                if(password1 !=password2){
                	this.$el.find('.password-confirm').removeClass('hide');
                	return;
                }
                this.app.showLoading('Wait...',this.$el);
                var that = this;
				$.post(URL, {password1:password1,password2:password2,employeeid:this.app.user_employee_id})
                .done(function(data) { 
                	that.getUser();
                    var _json = jQuery.parseJSON(data); 
                     
                 });
				that.app.showLoading(false,this.$el );
			},
			getUser: function (branchid) {
	            var URL = "api/getsession";
	            var that = this;
	            jQuery.getJSON(URL,{employeeid:that.app.user_employee_id},  function (tsv, state, xhr) {
	                var _json = jQuery.parseJSON(xhr.responseText);
	                that.options.page.users = _json.user;
	                that.app.successMessage();
      			  	 require(['branches/views/addupdate'],function(add){
      			  		$('#page-wrapper').html(new add({model:{},id:1,page:that.options.page,setting:that.app}).$el);
      				 })	
	            });
	                
	              
	         },
		});
	});
