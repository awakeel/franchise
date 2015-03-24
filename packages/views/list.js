define(['text!packages/tpl/list.html','app','swal'],
	function (template,app,swal) {
		'use strict';
		return Backbone.View.extend({  
			tagName:'tr', 
			events:{
			 	"click .delete-token":"deleteToken",
			 	"click .edit-token":"updateToken"
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
			getDate:function(date){
				return date.slice(0,4) + '-' + date.slice(4,6) +'-'+ date.slice(6,8);
			},
			getWhen:function( ){
				return this.getDate(this.model.get('dayid')) +' Time: '+  this.model.get('timestart') + ' - '+  this.model.get('timeend')
			},
			deleteToken:function(ev){
				var that = this;
            	var id = $(ev.target).data('id'); 
                var URL = "api/deletejobtypes";
                
			    swal({
			      title: "Are you sure?",
			      text: "You will not be able to recover this record!",
			      type: "error",
			      showCancelButton: true,
			      confirmButtonClass: 'btn-danger',
			      confirmButtonText: 'Yes, Delete!'
			    },
			    function(isConfirm) {
			    	    if (isConfirm) {
			    	    	 $.get(URL, {id:id})
		                        .done(function(data) {
		                             var _json = jQuery.parseJSON(data);
		                             if (typeof _json.error == "undefined") {
		                            	 
		                            	that.model.destroy({
		                            	      success: function() { 
		                            	    	  swal("Deleted!", "Job type has been deleted.", "success");
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
       	              require(['views/pricing'],function(pricing){
                         	$('#pricing').html(new pricing({app:that.app}).$el);
                         	$('#mdlpricing').modal('show');
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
