define(
		[ 'text!leaves/tpl/addupdate.html', 'leaves/views/list',
				'leaves/models/leave' ],
		function(template, Leave, LeaveModel) {
			'use strict';
			return Backbone.View
					.extend({
						events : {
							'click .close-pp' : "closeView",
							"click .save-p" : "save"
						},
						initialize : function() {
							this.template = _.template(template);
							this.name = "";
							this.comments = "";
							this.objLeave = new Leave();
							this.app = this.options.page.setting;
							this.branchid = this.app.users.branchid;
							if (typeof this.options.page.branchid != "undefined" && this.options.page.branchid)
								this.branchid = this.options.page.branchid; 
							this.render(); 
						},
						render : function() {
							this.$el.html(this.template());
							var that = this;
							 
							if(typeof this.options.id == "undefined"){ 
								this.objLeave = this.options.model;  
							 	this.name = this.options.model.get('name');
								this.comments = this.options.model.get('comments');
								this.$el.find("#txtname").val('What is this'+this.options.model.get('name'));
								this.$el.find('#txtcomments').val('TYpe comments' + this.options.model.get('comments'));
							}
						},
						closeView : function() {
							this.$el.find('.modal').modal('hide');
							// this.undelegateEvents();
							// 1 this.$el.remove();
							// this.$el.removeData().unbind();
							// this.remove();
							// Backbone.View.prototype.remove.call(this);
						},
						clearErrorFilter : function() {
							this.$el.find('.name-error').addClass('hide');
						},
						
						save : function() {
							var name = this.$el.find('#txtname').val();
							var comments = this.$el.find('#txtcomments').val()
							if (!name) {
								this.$el.find('.name-error')
										.removeClass('hide')
								return false;
							}
							this.app.showLoading('Wait a moment....', this.$el);
							
							this.objLeave.set('branchid', this.branchid);
							this.objLeave.set('name', name);
							this.objLeave.set('comments', comments);
							var model = this.objLeave.save();
							this.options.page.objLeaves.add(this.objLeave);
							var last_model = this.options.page.objLeaves
									.last();
							// this.closePopup();
							var objViewLeave = new Leave({
								model : this.objLeave,
								page : this.options.page,
								setting : this.options.page.setting
							});
							this.options.page.$el.find('tbody').prepend(
									objViewLeave.$el);
							this.closeView();
							this.options.page.setting.successMessage();
							this.$el.find('#txtname').val('');
							this.$el.find('#txtcomments').val('');
							this.app.showLoading(false, this.$el);
							$("#tr_norecord").remove();
						}

					});
		});
