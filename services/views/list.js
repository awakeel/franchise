define(['text!services/tpl/list.html','app'],
	function (template,app) {
		'use strict';
		return Backbone.View.extend({  
			tagName:'tr',
			events:{
			 	"click .delete-token":"deleteToken",
			 	"click .edit":"updateToken"
			},
            initialize: function () {
				this.template = _.template(template);
				this.listenTo(this.model, 'change', this.render);
			    this.listenTo(this.model, 'destroy', this.remove);
			    this.setting = this.options.setting;
			    this.branchid = this.options.page.branchid;
				this.render();
			},
			render: function () {
				this.$el.html(this.template(this.model.toJSON()));
			},
			deleteToken:function(ev){
				var that = this;
            	var id = $(ev.target).data('id'); 
                var URL = "api/deleteservices";
                swal({
  			      title: "Are you sure?",
  			      text: "You will not be able to recover this record!",
  			      type: "error",
  			      showCancelButton: true,
  			      confirmButtonClass: 'btn-danger',
  			      confirmButtonText: 'Yes, Delete'
  			    },
  			    function(isConfirm) {
  			    	    if (isConfirm) {
  			    	    	 $.get(URL, {id:id})
  		                        .done(function(data) {
  		                             var _json = jQuery.parseJSON(data);
  		                           if (typeof _json.error == "undefined") {
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
                 updateToken:function(ev){
                	 var that = this; 
                	 require(['services/views/addupdate'],function(addupdate){
                		 	 that.options.page.$el.html(new addupdate({model:that.model,page:that,branchid:that.options.branchid}).$el);
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
