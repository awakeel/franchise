define(
		[ 'text!jobtypes/tpl/addupdate.html', 'jobtypes/views/list',
				'jobtypes/models/jobtype'  ],
		function(template, JobType, JobTypeModel) {
			'use strict';
			return Backbone.View
					.extend({
						events : {
							'click .close-pp' : "closeView",
							"click .save-p" : "save", 
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
							console.log(that.app.globaljobtypes);
							that.$el.find("#txtname").typeahead( {
								  local:that.app.globaljobtypes 
								})   
							
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
								that.$el.find("#txtname").on('blur',function(){
									if(!that.$el.find("#txtname").val())
										that.$el.find("#txtname").val(that.name);
									console.log(that.name);
								}) 
							}
							this.$el.find('.color')  .spectrum({
							    color: this.color
							});  
						},
						closeView : function() { 
							var that = this; 
							require([ 'jobtypes/views/lists' ],
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
						}, 
						save : function() {
							var name = this.$el.find('#txtname').val();
							var name = this.$el.find('#txtname').val();
							var a = '';
							if(typeof this.options.id != "undefined"){
							 a = this.options.page.objJobTypes.where({ name: name});
							}
							if(a.length > 0){
								  swal({
								      title: "Warning?",
								      text: "Job Type Already Exists",
								      type: "error",
								     });
								return false;
								
							}else{
								var t = this.$el.find(".color").spectrum("get") ;
								var color = t.toHexString() // "#ff0000"
								var comments = this.$el.find('#txtcomments').val()
								if (!name) {
									this.$el.find('.name-error').removeClass('hide')
									return false;
								}
								this.app.showLoading('Wait a moment....', this.$el);
								
								this.objjobtype.set('franchiseid', this.franchiseid);
								this.objjobtype.set('name', name);
								this.objjobtype.set('color', color);
								this.objjobtype.set('comments', comments);
								var that = this;
								 this.objjobtype.save(null,{success:function(){
									that.options.page.setting.jobTypes[that.options.page.setting.jobTypes.length - 1] = name;
									
									that.options.page.setting.successMessage();
									that.$el.find('#txtname').val('');
									that.$el.find('#txtcomments').val('');
									that.app.showLoading(false, that.$el);
									that.closeView();
									$("#tr_norecord").remove();
								}}); 
							}
							
							 
							// this.closePopup();
							
							
						}

					});
		});
