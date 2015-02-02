define(
		[ 'text!services/tpl/addupdate.html', 'services/models/service',
				'services/views/list' ],
		function(template, ServiceModel, Service) {
			'use strict';
			return Backbone.View
					.extend({
						events : {
							'click .close-pp' : "closeView",
							"click .save-p" : "save"
						},
						initialize : function() {
							this.template = _.template(template);
							this.app = this.options.page.setting;
							this.franchiseid = this.app.user_franchise_id;
							this.objService = new ServiceModel();
							this.jobtypeid = 0;
						 
							if(typeof this.options.id  == "undefined"){
								this.parent = this.options.page.options.page;
							}else{
								this.parent = this.options.page;
							}
							if(typeof this.options.id  == "undefined"){
								this.objService = this.model;
								this.jobtype = this.model.get('jobtype');
								this.name = this.model.get('name');
								this.jobtypeid = this.model.get('jobtypeid');
								this.time = this.model.get('time');
								this.price = this.model.get('price');
								this.type = this.model.get('type');
								this.comments = this.model.get('comments');
								
							}
							this.render();
							this.getJobTypes();
						},
						render : function() {
							this.$el.html(this.template());
							var that = this;
							this.$el.find('#radioBtn a').on('click',
									function() {
										var sel = $(this).data('title');
										var tog = $(this).data('toggle');
										that.$el.find('#' + tog).prop('value',sel);
										that.$el.find('a').addClass('notActive').removeClass('active');
												that.$el.find(
												'a[data-toggle="' + tog
														+ '"][data-title="'
														+ sel + '"]')
												.removeClass('notActive')
												.addClass('active');
										if (sel == "Y" ) {
											that.$el.find('.show-bookable')
													.slideDown('fast')
										} else {
											that.$el.find('.show-bookable')
													.slideUp('fast');
										}

									})
							that.$el.find("#txtservice").typeahead({
								hint : true,

								local : that.app.globalservices
							});
							if(typeof this.options.id  == "undefined"){
								this.$el.find('#txtservice').val(this.name);
								this.$el.find("#txttime").val(this.time);
								this.$el.find("#txtprice").val(this.price);
								this.$el.find("#txtcomments").val(this.comments);
								this.$el.find('#ddljobtypes').val(this.jobtypeid);
								that.$el.find('a').addClass('notActive').removeClass('active');
								that.$el.find(
										'a[data-toggle="' + this.type.trim()
												+ '"] ')
										.removeClass('notActive')
										.addClass('active');
								
								if (this.type.trim() == "bookable" ) { 
									that.$el.find('.show-bookable').slideDown('fast')						
								} else {
									console.log('I am here at the top of the screen');
									that.$el.find('.show-bookable').hide('fast');	
								}
							}
						},
						closeView : function() {
							// this.$el.find('#newservice').modal('hide');
							var that = this;

							require([ 'services/views/lists' ],
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
						clearErrorFilter : function() {
							this.$el.find('.name-error').addClass('hide');
							this.$el.find('.price-error').addClass('hide')
							this.$el.find('.time-error').addClass('hide')
						},
						save : function() {
							this.clearErrorFilter();
							var name = this.$el.find('#txtservice').val();
							var type = this.$el.find('#radioBtn .active').data(
									'toggle')
							var comments = this.$el.find('#txtcomments').val();
							var time = this.$el.find('#txttime').val();
							var price = this.$el.find('#txtprice').val();
							var jobtypeid = this.$el.find('#ddljobtypes').val();
							console.log(type)
							if (!name) {
								this.$el.find('.name-error')
										.removeClass('hide')
								return false;
							}
							if (type == "Y") {
								if (!price) {
									this.$el.find('.price-error').removeClass(
											'hide')
									return false;
								}
								if (!time) {
									this.$el.find('.time-error').removeClass(
											'hide')
									return false;
								}

							}
							this.app.showLoading('Saving Info...', this.$el);
							
							this.objService.set('franchiseid', this.franchiseid);
							this.objService.set('name', name);
							this.objService.set('type', type);
							this.objService.set('comments', comments);
							this.objService.set('time', time);
							this.objService.set('price', price);
							this.objService.set('jobtypeid', jobtypeid);
							var model = this.objService.save();
							this.parent.objServices.add(this.objService);
							var last_model = this.parent.objServices
									.last();
							// this.closePopup();
							var objService = new Service({
								model : this.objService,
								page : this,
								setting : this.app
							});
							this.parent.$el.find('tbody').prepend(
									objService.$el);
							this.app.services[this.options.page.setting.services.length - 1] = name;
							this.closeView();
							this.app.successMessage();
							this.app.showLoading(false, this.$el);
							$("#tr_norecord").remove();
						},
						getJobTypes : function() {
							var URL = "api/jobtypes";
							var that = this;
							var options = "";
							jQuery.getJSON(URL, {
								franchiseid : this.franchiseid
							}, function(tsv, state, xhr) {
								var _json = jQuery.parseJSON(xhr.responseText);

								_.each(_json, function(value, key, list) {
									var selected = "";
									// if(that.countryid == key.id)
									//	selected = "selected";
									if(that.jobtypeid == value.id )
										selected = "selected";
									options += "<option value='" + value.id
											+ "' " + selected + "  >"
											+ value.name + "</option>";
								})
								that.$el.find("#ddljobtypes").html(options);

							});
						},
					});
		});
