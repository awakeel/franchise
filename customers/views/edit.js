define(
		[ 'text!customers/tpl/edit.html','customers/models/customer'],
		function(template,ModelCustomer) {
			'use strict';
			return Backbone.View
					.extend({
						events : {
							'click .back' : "closeView",
							"click .save" : "Save"
						},
						initialize : function() {
							this.template = _.template(template);  
							this.app = this.options.page.setting; 
							this.id = this.options.model.get('id');
							this.render();
							
						},
						render : function() {
							this.$el.html(this.template());
							var that = this;
							this.app.showLoading(false,this.$el);
						},
						Save:function(){
						   var obj = new ModelCustomer();
						   var name = this.$el.find("#txtname").val();
						   var email = this.$el.find("#txtemail").val();
						   var phone = this.$el.find("#txtphone").val();
						   this.app.showLoading('Wait a moment....', this.$el);
						   obj.set('name',name);
						   var that = this;
						   obj.set('email',email);
						   obj.set('phone',phone);
						   obj.set('id',this.model.get('id'));
						   obj.save(null,{success:function(){
									that.app.successMessage();
									that.app.showLoading(false, that.$el);
									that.closeView();
									$("#tr_norecord").remove();
								}});
						},
						showPrint:function(){
							this.$el.find(".print-area").print();
						},
						closeView : function() { 
							var that = this; 
							require([ 'customers/views/lists' ],
								function(Lists) { 
									var objLists = new Lists({
										setting : that.app,
										id:that.branchid
									});
									that.$el.parent().html(objLists.$el);
									Backbone.View.prototype.remove.call(that);
									that.undelegateEvents();
									that.$el.remove();
									that.$el.removeData().unbind();
									that.remove();
								})
						},
						 
					});
		});
