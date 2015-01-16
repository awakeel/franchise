define(['text!roles/tpl/managepermission.html','roles/views/list','roles/models/role'],
	function (template,JobType,JobTypeModel) {
		'use strict';
		return Backbone.View.extend({  
			 events:{
				 'click .close':"closeView", 
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
				var spin = this.options.page.setting.showLoading('Fetching info...',this.$el,{top:'10%'});
			             var URL = "api/allmodules";
			             var that = this;
			             jQuery.getJSON(URL,  function (tsv, state, xhr) {
			                 var _json = jQuery.parseJSON(xhr.responseText);
			                 allmodules = _json;
			                   that.compareModules(allmodules,spin);
			             } ); 
			
			},
			compareModules:function(allmodules,spin){
				var lables = "";
				 spin.stop();
				if(this.options.modules)
					  modules = this.options.modules.split(",");
						
						
						var modules = {};
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
				var spin = this.options.page.setting.showLoading('',this.$el);
				$.post(url,
						  {
						    modules:checkedValues,
						    roleid:roleid
						  },
						  function(data,status){
							  that.options.page.options.page.fetchRoles();
							  that.closeView();
						  });    
				spin.stop();
				
			}
		 
		});
	});
