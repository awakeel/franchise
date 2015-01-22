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
                swal({
    			      title: "Are you sure?",
    			      text: "You will not be able to recover this record!",
    			      type: "error",
    			      showCancelButton: true,
    			      confirmButtonClass: 'btn-danger',
    			      confirmButtonText: 'Danger!'
    			    },
    			    function(isConfirm) {
    			    	    if (isConfirm) {
    			    	    	 $.get(URL, {id:id})
    		                        .done(function(data) {
    		                             var _json = jQuery.parseJSON(data);
    		                            if (_json[0] !== 'err') {
    		                            	that.setting.successMessage();
    		                            	that.model.destroy({
    		                            	      success: function() { 
    		                            	    	  swal("Deleted!", "Record has been deleted.", "success");
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
                 update:function(){
     				var that = this;
     				require(['employees/views/addupdate'],function(AddUpdate){
     					var objAddUpdate = new AddUpdate({page:that,model:that.model});
     					that.options.page.$el.html(objAddUpdate.$el);
     					
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
