define(['text!employees/tpl/list.html','app'],
	function (template,app) {
		'use strict';
		return Backbone.View.extend({  
			tagName:'tr',
			events:{
			 	"click .delete-token":"deleteToken",
			 	"click .edit-token":"update"
			},
            initialize: function () {
				this.template = _.template(template);
				this.listenTo(this.model, 'change', this.render);
			    this.listenTo(this.model, 'destroy', this.remove);
			    this.setting = this.options.setting;
				this.render();
			},
			render: function () {
				this.$el.html(this.template(this.model.toJSON()));
				
			},
			deleteToken:function(ev){
				var that = this;
            	var id = $(ev.target).data('id'); 
                var URL = "api/deleteemployees";
                $.get(URL, {id:id})
                        .done(function(data) {
                             var _json = jQuery.parseJSON(data);
                            if (_json[0] !== 'err') {
                            	that.setting.successMessage();
                            	that.model.destroy({
                            	      success: function() { 
                            	      }
                            	  });  
                            }
                            else {
                            	that.setting.errorMessage();
                            }
                        });
                 },
                 update:function(){
     				var that = this;
     				require(['employees/views/addupdate'],function(AddUpdate){
     					var objAddUpdate = new AddUpdate({page:that,model:that.model});
     					that.options.page.$el.find('.employees').append(objAddUpdate.$el);
     					that.options.page.$el.find('#employees').modal('show');
     				})
     			},
                 
                 save:function(title,comments,branchid,view){
                	    this.model.set('branchid',branchid);
                	  	this.model.set('name',title);
                	  	this.model.set('comments',comments);
	                 	 this.model.save();
	                 	view.closeView();
	                 	this.setting.successMessage();
                 }
              
		});
	});
