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
							this.color = "";
							this.objjobtype = new JobTypeModel();
							this.app = this.options.page.setting;
							this.franchiseid  = this.app. user_franchise_id;
							this.render(); 
						},
						render : function() {
							this.$el.html(this.template());
							var that = this;
							that.$el.find("#txtname").typeahead({
								hint : true,

								local : that.app.globaljobtypes
							});
							this.parent = this.options.page;
							if(typeof this.options.id == "undefined"){ 
								this.parent = this.options.page.options.page;
								this.objjobtype = this.options.model;  
								this.color = this.options.model.get('color');
							 	this.name = this.options.model.get('name');
								this.comments = this.options.model.get('comments');
								this.$el.find("#txtname").val( this.options.model.get('name'));
								this.$el.find("#txtcolor").val(this.color);
								this.$el.find('#txtcomments').val( this.options.model.get('comments'));
							}
						},
						closeView : function() {
							this.$el.find('.modal').modal('hide'); 
							this.$el.remove();
						},
						clearErrorFilter : function() {
							this.$el.find('.name-error').addClass('hide');
						},
						
						save : function() {
							var name = this.$el.find('#txtname').val();
							var color = this.$el.find('#txtcolor').val();
							var comments = this.$el.find('#txtcomments').val()
							if (!name) {
								this.$el.find('.name-error')
										.removeClass('hide')
								return false;
							}
							this.app.showLoading('Wait a moment....', this.$el);
							
							this.objjobtype.set('franchiseid', this.franchiseid);
							this.objjobtype.set('name', name);
							this.objjobtype.set('color', color);
							this.objjobtype.set('comments', comments);
							var model = this.objjobtype.save();
							this.closeView();
							// this.closePopup();
							this.parent.render();
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
