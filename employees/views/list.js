define(['text!employees/tpl/list.html','app','swal'],
	function (template,app,swal) {
		'use strict';
		return Backbone.View.extend({  
			tagName:'tr',
			events:{
			 	"click .delete-token":"deleteToken",
			 	"click .edit-token":"update",
			 	"click .btn-schedule":'openSchedule'
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
			openSchedule:function(){
				var that = this;
				require(['schedule/views/lists' ],
						 function(Lists) {
				 
							var objLists = new Lists({
								setting : that.setting,
								id:that.branchid
								///employeeid:that.model.get('id')
							});
							 
								 that.$el. parents('.col-lg-12').html(objLists.$el);
								  })
			},
			deleteToken:function(ev){
				var that = this;
            	var id = this.model.get('id');
            	var franchiseid = this.model.get('franchiseid');
                var URL = "api/deleteemployees";
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
    			    	        jQuery.getJSON(URL, {id:id,franchiseid:that.setting.user_franchise_id}, function (tsv, state, xhr) {
    				                var _json = jQuery.parseJSON(xhr.responseText);
    		                          
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
    			    	    that.options.page.render();
    			    });
                
                 },
                 update:function(){
     				var that = this;
     				require(['employees/views/addupdate'],function(AddUpdate){
     					console.log('n single lsit '+that.options.page.branchid);
     					var objAddUpdate = new AddUpdate({page:that,branchid:that.options.page.branchid,model:that.model});
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
