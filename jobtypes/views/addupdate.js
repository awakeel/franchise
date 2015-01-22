define(
		[ 'text!jobtypes/tpl/addupdate.html', 'jobtypes/views/list',
				'jobtypes/models/jobtype' ],
		function(template, JobType, JobTypeModel) {
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
							this.objjobtype = new JobTypeModel();
							this.app = this.options.page.setting;
							this.branchid = this.app.users.branchid;
							if (typeof this.options.page.branchid != "undefined" && this.options.page.branchid)
								this.branchid = this.options.page.branchid; 
							this.render(); 
						},
						render : function() {
							this.$el.html(this.template());
							var that = this;
							that.$el.find("#txtname").typeahead({
								  hint: true, 
								  local: that.app.globaljobtypes
								}); 
							if(typeof this.options.id == "undefined"){
								this.objjobtype = this.options.model;  
								this.name = this.options.model.get('name');
								this.comments = this.options.model.get('comments');
								that.$el.find("#txtname").val(this.options.model.get('name'));
								this.$el.find('#txtcomments').val(this.options.model.get('comments'));
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
							
							this.objjobtype.set('branchid', this.branchid);
							this.objjobtype.set('name', name);
							this.objjobtype.set('comments', comments);
							var model = this.objjobtype.save();
							this.options.page.objJobTypes.add(this.objjobtype);
							var last_model = this.options.page.objJobTypes
									.last();
							// this.closePopup();
							var objjobtype = new JobType({
								model : this.objjobtype,
								page : this.options.page,
								setting : this.options.page.setting
							});
							this.options.page.$el.find('tbody').prepend(
									objjobtype.$el);
							this.options.page.setting.jobTypes[this.options.page.setting.jobTypes.length - 1] = name;
							this.closeView();
							this.options.page.setting.successMessage();
							this.$el.find('#txtname').val('');
							this.$el.find('#txtcomments').val('');
							this.app.showLoading(false, this.$el);
							$("#tr_norecord").remove();
						}

					});
		});
