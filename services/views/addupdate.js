define(
		[ 'text!services/tpl/addupdate.html', 'services/models/service',
				'services/views/list' ],
		function(template, ServiceModel, Service) {
			'use strict';
			return Backbone.View
					.extend({
						events : {
							'click .close-pp' : "closeView",
							"click .save-p" : "save",
							"keydown #txtprice":"preventNonNumeric",
							"keydown #txttime":"preventNonNumeric"
						},
						initialize : function() {
							this.template = _.template(template);
							this.app = this.options.page.setting;
							this.franchiseid = this.app.user_franchise_id;
							this.objService = new ServiceModel();
							this.jobtypeid = 0;
						    this.id = 0;
							if(typeof this.options.id  == "undefined"){
								this.parent = this.options.page.options.page;
								this.id = 0;
							}else{
								
								this.parent = this.options.page;
							}
							if(typeof this.options.id  == "undefined"){
								this.objService = this.model;
								this.id = this.model.get('id');
								this.jobtype = this.model.get('jobtype');
								this.name = this.model.get('name');
								this.jobtypeid = this.model.get('jobtypeid');
								this.color = this.model.get('color');
								this.time = this.model.get('time');
								this.price = this.model.get('price');
								this.type = this.model.get('type');
								this.comments = this.model.get('comments');
								
							}
							this.render();
							this.getJobTypes();
						},
						preventNonNumeric:function(e){
							if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
						             // Allow: Ctrl+A
						            (e.keyCode == 65 && e.ctrlKey === true) || 
						             // Allow: home, end, left, right, down, up
						            (e.keyCode >= 35 && e.keyCode <= 40)) {
						                 // let it happen, don't do anything
						                 return;
						        }
						        // Ensure that it is a number and stop the keypress
						        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
						            e.preventDefault();
						        }
						},
						render : function() {
							this.$el.html(this.template());
							var that = this;
							$('.btn-toggle').click(function() {
							    $(this).find('.btn').toggleClass('active');  
							    
							    if ($(this).find('.btn-danger').size()>0) {
							    	$(this).find('.btn').toggleClass('btn-danger');
							    }
							    $(this).find('.btn').toggleClass('btn-grey');
							});
							that.$el.find("#txtservice").typeahead({
								hint : true,

								local : that.app.globalservices
							});
							this.$el.find('#rdobookable').attr('checked','checked');
							if(typeof this.options.id  == "undefined"){
								this.$el.find('#txtservice').val(this.name);
								this.$el.find("#txttime").val(this.time);
								this.$el.find("#txtprice").val(this.price);
								this.$el.find("#txtcolor").val(this.color);
								this.$el.find("#txtcomments").val(this.comments);
								this.$el.find('#ddljobtypes').val(this.jobtypeid);
								if(this.type=="bookable")
									this.$el.find('#rdobookable').attr('checked','checked');
								else
									this.$el.find('#rdononebookable').attr('checked','checked');
								 
								
								 
								that.$el.find("#txtservice").on('blur',function(){
									if(!that.$el.find("#txtservice").val())
										that.$el.find("#txtservice").val(that.name);
									console.log(that.name);
								}) 
							}
							this.$el.find('.color')  .spectrum({
							    color: this.color
							}); 
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
							this.$el.find('.jobtypes-error').addClass('hide');
							this.$el.find('.price-error').addClass('hide')
							this.$el.find('.time-error').addClass('hide')
							this.$el.find('.already-error')
								.addClass('hide')
						},
						save : function() {
							this.clearErrorFilter();
							
							var name = this.$el.find('#txtservice').val();
							var type = this.$el.find('input[name=group1]:checked').val();
							var comments = this.$el.find('#txtcomments').val();
							var time = this.$el.find('#txttime').val();
							var t = this.$el.find(".color").spectrum("get") ;
							var color = t.toHexString() // "#ff0000"
							var price = this.$el.find('#txtprice').val();
							if(typeof this.options.id  != "undefined" ){
								var isAlreadyExists = this.options.page.objServices.where({name: name});
								if(isAlreadyExists.length !== 0 ){
									this.$el.find('.already-error')
									.removeClass('hide')
											return false;
								}
							}
								if (!name) {
									this.$el.find('.name-error')
											.removeClass('hide')
									return false;
								}
								 
								if (!price || price < 0) {
									this.$el.find('.price-error').removeClass(
											'hide')
									return false;
								}
								if (!time || time <= 14) {
									this.$el.find('.time-error').removeClass(
											'hide')
									return false;
								}
								var jobtypes = "";
							 	$('.jobtypes-list :checked').each(function() {
							 		jobtypes +=$(this).val()+","; 
						        }); 
							 	if(!jobtypes){
							 		this.$el.find('.jobtypes-error').removeClass(
									'hide')
							         return false;
							 	}
							 var that = this;
							
							
							this.objService.set('franchiseid', this.franchiseid);
							this.objService.set('name', name);
							this.objService.set('type', type);
							this.objService.set('comments', comments);
							this.objService.set('time', time);
							this.objService.set('price', price);
							this.objService.set('color', color);
							this.objService.set('jobtypes', jobtypes);
							this.app.showLoading('Saving Info...', this.$el);
							 this.objService.save(null,{success:function(){
								 console.log('err');
								 that.app.showLoading(false, that.$el);

									that.app.successMessage();
									
									$("#tr_norecord").remove();
								that.app.services[that.options.page.setting.services.length - 1] = name;
								
								that.closeView();
							}}); 
							 
							// this.closePopup();
							 
							 
						
						},
						getJobTypes : function() {
							var URL = "api/servicejobtypes";
							var that = this;
							var options = "";
							jQuery.getJSON(URL, {
								franchiseid : this.franchiseid,serviceid:this.id
							}, function(tsv, state, xhr) {
								var _json = jQuery.parseJSON(xhr.responseText);
								var str = "";
								 _.each(_json,function(value,key,list){ 
					                	  
										 str+='<div class="checkbox" style="display:inline-block; padding:0px 20px 0px 20px; width:46%;">';
										    str+='<label> <input type="checkbox" '+value.selected+'    value="'+value.id+'"  >'+value.name;
								 
												str+='</label></div>'; 
									}); 
					                that.$el.find('.jobtypes-list').html(str);  

							});
						},
					});
		});
