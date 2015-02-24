define(['text!schedulelist/tpl/list.html' ],
	function (template) {
		'use strict';
		return Backbone.View.extend({  
			tagName:'tr',
			events:{
			 	"click .delete-token":"deleteToken",
			 	"click .edit-token":"updateToken",
			 	"click .change-day":"changeSpecialDay",
			 	"click .plus-click":'loadSchedule'
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
			loadSchedule:function(){
				var that = this;
				require(['schedulelist/views/loadschedule'],function(loadschedule){
					var objLoadschedule = new loadschedule({model:that.model,app:that.app});
					var modal = that.options.page.$el.find("#loadschedule");
					modal.find('#loadschedule_d').html(objLoadschedule.$el);
					
					modal.modal('show');
					 
				});
			},
			changeSpecialDay:function(){
				var that = this;
				require(['schedulelist/views/specialday'],function(specialday){
					var objSpecialDay = new specialday({model:that.model,app:that.app});
					var modal = that.options.page.$el.find("#changespecialday");
					modal.find('#modalspecialdialog').html(objSpecialDay.$el);
					modal.modal('show');
				});
			},
			getDuration:function(){
		
				var str = this.getDate(this.model.get('datefrom')) + ' to ' +  this.getDate(this.model.get('dateto'));
			 
				return str;
			},
			getDate:function(date){
				return date.slice(0,4) + '-' + date.slice(4,6) +'-'+ date.slice(6,8);
			},
			deleteToken:function(ev){
				var that = this;
            	var id = $(ev.target).data('id'); 
                var URL = "api/deleteschedule";
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
		                            if (_json[0] !== 'err') {
		                            	that.setting.successMessage();
		                            	that.model.destroy({
		                            	      success: function() { 
		                            	    	  swal("Deleted!", "Schedule has been deleted.", "success");
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
                 
                 updateToken:function(){
      				var that = this;
      				require(['schedulelist/views/createschedule'],function(AddUpdate){ 
      					var objAddUpdate = new AddUpdate({page:that, model:that.model});
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
