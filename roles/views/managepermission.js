define(['text!roles/tpl/managepermission.html','roles/views/list','roles/models/role'],
	function (template,JobType,JobTypeModel) {
		'use strict';
		return Backbone.View.extend({  
			 events:{
				 'click .close-p':"closeView", 
				 "click .save-p":"save"
			 },
			  initialize: function () {
				this.template = _.template(template);
				 
				this.render();
			},
			render: function () {  
				this.$el.html(this.template( ));
				 
			},
			closeView:function(){
				this.$el.find('.modal').modal('toggle'); 
				 //this.undelegateEvents();
				//1 this.$el.remove();
				 //this.$el.removeData().unbind(); 
				 //this.remove();  
				 //Backbone.View.prototype.remove.call(this);
			},
			clearErrorFilter:function(){
				this.$el.find('.name-error').addClass('hide');
			},
			closeView:function(){
				this.$el.find('.modal').modal('toggle'); 
				 //this.undelegateEvents();
				//1 this.$el.remove();
				 //this.$el.removeData().unbind(); 
				 //this.remove();  
				 //Backbone.View.prototype.remove.call(this);
			},
			getModules:function(){ 
				
				var allmodules
				this.options.page.setting.showLoading('Fetching modules...',this.$el);
			             var URL = "api/allmodules";
			             var that = this;
			             jQuery.getJSON(URL,  function (tsv, state, xhr) {
			                 var _json = jQuery.parseJSON(xhr.responseText);
			                 allmodules = _json;
			                   that.compareModules(allmodules);
			             } ); 
			
			},
			compareModules:function(allmodules){
				var lables = "";
				
				this.options.page.setting.showLoading(false,this.$el);

				var modules = {};
				if(this.options.modules)
					  modules = this.options.modules.split(","); 
						
					  _.each(allmodules,function(value,key,list){ 
						 
						 var check =""; 
						 var mod = value.id+"-"+value.name;
						 var objs = _.filter(modules, function(obj){ return obj.trim() == mod.trim() });
					 	 if(objs.length > 0){ 
							   check = "checked";
						 }
							lables +='<label class="checkbox-inline"> <input type="checkbox"';
							lables +='value="'+value.id+'" '+check+'  name="modules[]">'+  value.text ;
							lables +='</label>';
					 }) 
					
					 this.$el.find(".modules-selected").html(lables); 
			},
			 save:function(){
				var checkedValues = $('.modules-selected input:checkbox:checked').map(function() {
				    return this.value;
				}).get();
				var that = this;
				var url = "api/savepermission";
				checkedValues = checkedValues.join(",");
				var roleid = this.options.roleid;		 
				 this.options.page.setting.showLoading('Data saving...',this.$el);
				$.post(url,
						  {
						    modules:checkedValues,
						    roleid:roleid
						  },
						  function(data,status){
							  that.options.page.options.page.fetchRoles();
							  that.closeView();
						  });    
				this.options.page.setting.showLoading(false,this.$el);
				
			}
		 
		});
	});
