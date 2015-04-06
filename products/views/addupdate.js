define(
		[ 'text!products/tpl/addupdate.html', 'products/views/list',
				'products/models/product'  ],
		function(template, ViewProduct, ModelProduct) {
			'use strict';
			return Backbone.View
					.extend({
						events : {
							'click .close-pp' : "closeView",
							"click .save-p" : "save", 
							'change #images':"prepareFile"
						},
						initialize : function() {
							this.template = _.template(template);
							this.name = "";
							this.comments = "";
							this.color = "";
							this.objProduct = new ModelProduct();
							this.app = this.options.page.setting;
							this.franchiseid  = this.app.user_franchise_id;
							this.render(); 
						},
						prepareFile:function(e){
							var fileCollection = [];
							var files = e.target.files;
							$.each(files, function(i, file){
								fileCollection.push(file);
								var reader = new FileReader();
								reader.readAsDataURL(file);
								reader.onload = function(e){
									var template = '<form id="form1">'+
										 ' <button class="btn btn-sm btn-info upload">Upload</button>'+
										 
									'</form>';
									$('#images-to-upload').html(template);
								};
							});
						 
						//form upload ... delegation
						    var that = this;
							this.$el.on('click','.upload',function(e){
								e.preventDefault();
								//this form index 
								var formdata = new FormData($("#form1")[0]); //direct form not object
								//append the file relation to index
								console.log(fileCollection[0]);
								formdata.append('image',fileCollection[0]);
								var request = new XMLHttpRequest();
								request.open('post', 'api/pictureuploads', true);
								var data = request.send(formdata);
								that.$el.find("#hdnfile").val(data);
							});
						 

						},
						render : function() {
							this.$el.html(this.template());
							var that = this;
							 that.$el.find("#txtname").typeahead( {
								  local:that.app.globaljobtypes 
								})   
							this.fetchService();
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
						 fetchService:function(){
								var url = "api/getallservicebybranch";
								 var that = this;
								 var str = "";
								     jQuery.getJSON(url,{ franchiseid:this.franchiseid}, function(tsv, state, xhr) {
				                	  var _json = jQuery.parseJSON(xhr.responseText);
						                 that.$el.find("#ddlservice").append(_.map(_json,function(value,key,list){ console.log(value);return "<option value="+value.id+">"+value.name+  "</option>";}).join());
						                 that.app.showLoading(false,this.$el );
							      	});
							     } ,
						closeView : function() { 
							var that = this; 
							require([ 'products/views/lists' ],
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
						    var price = this.$el.find('#txtprice').val();
						    var description = this.$el.find('#txtdescription').val();
						    var service = this.$el.find("#ddlservice").val();
							this.app.showLoading('Wait a moment....', this.$el);
							this.objProduct.set('franchiseid', this.franchiseid);
							this.objProduct.set('branchid', this.app.user_branch_id);
							this.objProduct.set('name', name);
							this.objProduct.set('price', price);
							this.objProduct.set('image', this.$el.find('#hdnfile').val());
							this.objProduct.set('serviceid', service);
							this.objProduct.set('description', description);
								var that = this;
								 this.objProduct.save(null,{success:function(){
									that.options.page.setting.successMessage();
									that.app.showLoading(false, that.$el);
									that.closeView();
									$("#tr_norecord").remove();
								}}); 
							
						}

					});
		});
