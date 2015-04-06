define(['text!branches/tpl/list.html','app'],
	function (template,app) {
		'use strict';
		return Backbone.View.extend({  
			tagName:'tr',
			id:"table-white-row",
			events:{
			 	"click .delete-branch":"deleteBranch",
			 	"click .edit-token":"updateToken",
			 	"click .change-status":"changeStatus"
			},
            initialize: function () {
				this.template = _.template(template);
				this.listenTo(this.model, 'change', this.render);
			    this.listenTo(this.model, 'destroy', this.remove);
			    this.setting = this.options.setting;
			    this.app = this.setting;
				this.render();
			},
			render: function () {
				this.$el.html(this.template(this.model.toJSON()));
				 
			},
			changeStatus:function(){
				 var id = this.model.get('id');
				 var status = this.model.get('isactivated');
				 var text = "You are about to disable " + this.model.get('name') 
				 if(status == "0"){
					 var text = "You are about to enable " + this.model.get('name') 
					 status = 1;
				 } else {
					 status = 0;
				 }
				 var that = this;
				 var URL = "api/changestatus";
	                swal({
	  			      title: "Are you sure?",
	  			      text: text,
	  			      type: "error",
	  			      showCancelButton: true,
	  			      confirmButtonClass: 'btn-danger',
	  			      confirmButtonText: 'Yes!'
	  			 },
	  			  function(isConfirm) {
	  			     if (isConfirm) {
	  			    			that.app.showLoading('Please wait...',that.$el);
	  			    			$.get(URL, {id:id,status:status,franchiseid:that.app.user_franchise_id})
		                        .done(function(data) {
		                             var _json = jQuery.parseJSON(data);
		                             if(status == 1){
		     					    	$('#ddlmenubranches').append('<option value='+that.model.get('id')+'>'+that.model.get('name')+'</option>');
		     					     }else{
		     					    	$("#ddlmenubranches option[value='"+that.model.get('id')+"']").remove();
		     					 	     }
					                if (typeof _json.error == "undefined" || _json == "") {
	  		                            	that.setting.successMessage();
	  		                                  
	  		                            	  swal("Status Changed!", "Transaction done.", "success");
	  		                            	  // that.render();  
	  		                            }
	  		                            else {
	  		                            	swal("Error",  _json.error, "error");
	  		                            }
					                  that.app.showLoading(false,that.$el);
	  		                      	 that.options.page.render();
		                            	
	  		                        });
	  			    		    
	  			    		  } else {
	  			    		    
	  			    		  }
	  			        });
			},
			deleteBranch:function(ev){
				var that = this;
            	var id = that.model.get('id'); 
                var URL = "api/deletebranch";
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
  			    			that.app.showLoading('Please wait...',that.$el);
  			    			$.get(URL, {id:id})
	                        .done(function(data) {
	                             var _json = jQuery.parseJSON(data);
				                
				                if (typeof _json.error == "undefined" || _json == "") {
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
				                  that.app.showLoading(false,that.$el);
  		                      	that.options.page.render();
	                            	
  		                        });
  			    		    
  			    		  } else {
  			    		    
  			    		  }
  			        });
  			 
                 },
                 updateToken:function(ev){
                	 var that = this;
                	 var id =$(ev.target).data('id');
                	 require(['branches/views/editdepartment'],function(addupdate){
               		 	 	that.options.page.$el.html(new addupdate({model:that.model,page:that,setting:that.setting}).$el);
         			 })
         			 
         		     
                 },
                 getStatus:function(){
                	 var status = this.model.get('isactivated');
                	 if(status !="0")
                		 return "<span class='label label-success'> Active </span>";
                	 else
                		 return "<span class='label label-warning'> Inactive </span>";
                 },
                 saveToken:function(id,title,translate,view){
                	  	this.model.set('languageid',this.options.page.languageFilter);
	                 	this.model.set('title',title);
	                 	this.model.set('languagetitle',translate);
	                 	this.model.save();
	                 	view.closeView();
	                 	this.setting.successMessage();
                 },
                 employeeList:function(){
                	 if(!this.model.get('employeename')) return;
	                	 var employees = this.model.get('employeename');
	                	 employees = employees.split(',');
	                	 var str = "";
	                	 var comma = "";
		                	 _.each(employees,function(value,key,list){
		                		  comma = ",";
		                		  str +="<span> "+value+"</span>"+comma;
		                		  
		                	 }) 
	                	 return str;
                 }
              
		});
	});
