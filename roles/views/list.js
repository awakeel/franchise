define(['text!roles/tpl/list.html','app'],
	function (template,app) {
		'use strict';
		return Backbone.View.extend({  
			tagName:'tr',
			events:{
			 	"click .delete-token":"deleteToken",
			 	"click .manage-permission":"showManagePermission",
			 	"click .edit-token":"updateToken",
			 	"click .close":"closeView"
			 	
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
			getModules:function(){
				var lables = "";
				if(this.model.get('modulename')){
				var modules = this.model.get('modulename');
				var modules = modules.split(',')
				
				_.each(modules,function(value,key,list){
					var id = value.split('-');
					  lables += '<span class="badge blue">'+id[1]+'</span>';
				})
				}
				return lables;
			},
			deleteToken:function(ev){
				var that = this;
            	var id = this.model.get('id'); 
                var URL = "api/deleterole";
                 
                swal({
  			      title: "Are you sure?",
  			      text: "You will not be able to recover this record!",
  			      type: "error",
  			      showCancelButton: true,
  			      confirmButtonClass: 'btn-danger',
  			      confirmButtonText: 'Delete!'
  			    },
  			    function(isConfirm) {
  			    	    if (isConfirm) {
  			    	    	 $.get(URL, {id:id})
  		                        .done(function(data) {
  		                            var _json = jQuery.parseJSON(data);
  		                           console.log(_json);
  		                            if (typeof _json.error == "undefined") {
  		                            	that.setting.successMessage();
  		                            	that.model.destroy({
  		                            	      success: function() { 
  		                            	    	  swal("Deleted!", "Recrod has been deleted.", "success");
  		                            	      }
  		                            	  });  
  		                            }
  		                            else {
  		                            	swal("Error", "There is problem while deleting :)", "error");
  		                            }
  		                        });
  			    		    
  			    		  } else {
  			    		    
  			    		  }
  			    });
  			
                 },
                 closeView:function(){
     				this.$el.find('.modal').modal('toggle'); 
     				 //this.undelegateEvents();
     				//1 this.$el.remove();
     				 //this.$el.removeData().unbind(); 
     				 //this.remove();  
     				 //Backbone.View.prototype.remove.call(this);
     			},
                 updateToken:function(ev){
                	 var that = this;
                	 
                	 var id =$(ev.target).data('id');
                	 require(['roles/views/addupdate'],function(addupdate){
                		   that.options.page.$el.find('.roles').html(new addupdate({model:that.model,isnew:false,id:id,name:that.model.get('name'),description:that.model.get('description'),page:that}).$el);
                		   $('#newrole').modal('show');
                	})
                 },
                 showManagePermission:function(ev){
                	 var that = this;
                	 
                	 var id =$(ev.target).data('id');
                	 require(['roles/views/managepermission'],function(manage){
                		   that.options.page.$el.find('.permission').html(new manage({ roleid:that.model.get('id'),page:that,modules:that.model.get('modulename')}).$el);
                		   $('#managepermission').modal('show');
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
