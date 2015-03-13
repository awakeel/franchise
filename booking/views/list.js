define(['text!booking/tpl/list.html','app'],
	function (template,app) {
		'use strict';
		return Backbone.View.extend({  
			tagName:'tr',
			events:{
			 	"click .delete-token":"deleteToken",
			 	"click .edit-token":"updateToken",
			 	"click .change-status":'changeStatus',
			 	'click .btn-change-status':'bookingStatusChange',
			 	'click .close-status':function(){
			 		$('.divshowstatus').hide();
			 	}
			},
            initialize: function () {
				this.template = _.template(template);
				this.listenTo(this.model, 'change', this.render);
			    this.listenTo(this.model, 'destroy', this.remove);
			    this.app = this.options.app;
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
			bookingStatusChange:function(ev){
				var status = $(ev.target).data('status');
				var URL = "api/bookingstatuschange";
				var that = this;
				that.model.set('status',status);
				 $.get(URL, {id:this.model.get('id'),status:status})
                 .done(function(data) {
                      var _json = jQuery.parseJSON(data);
                     
                     	that.app.successMessage();
                     	$('.divshowstatus').hide();
                     	that.model.set('status',status);
                     	that.render();
                     
                 });
			},
			changeStatus:function(ev){
				var childPos = $(ev.target).position();
				var parentPos = $(ev.target).parent().offset();
				$('.divshowstatus').hide();
				var childOffset = {
					    top: childPos.top,
					    right: 10
					}
				this.$el.find('.divshowstatus').css(childOffset).show();
			},
			deleteToken:function(ev){
				var that = this;
            	var id = $(ev.target).data('id'); 
                var URL = "api/deletebooking";
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
		                            	that.app.successMessage();
		                            	that.model.destroy({
		                            	      success: function() { 
		                            	    	  swal("Deleted!", "Booking has been deleted.", "success");
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
			  getStatus:function(){
				  var str = "";
				  var that = this;
			    	var status = [{'btn-green':'Scheduled','btn-blue':'Present','btn-orange':'No Show','btn-red':'Cancelled','btn-purple':'Completed'}];
			    	var dbStatus = this.model.get('status');
			    	_.each(status[0],function(value,key ){
			    		if(value != dbStatus){
			    			if(dbStatus == "Scheduled" && value !="Completed")
			    				str +="<button class='btn btn-change-status "+key+"' data-status='"+value+"'>"+value+"</button>";
			    			if(dbStatus == "Present" && value !="No Show")
			    				str +="<button class='btn btn-change-status "+key+"' data-status='"+value+"'>"+value+"</button>";
			    			if(dbStatus == "No Show" && (value !="Cancelled" && value!="Completed"))
			    				str +="<button class='btn btn-change-status "+key+"' data-status='"+value+"'>"+value+"</button>";
			    			if(dbStatus == "Cancelled" && (value !="No Show" && value !="Completed"))
			    				str +="<button class='btn btn-change-status "+key+"' data-status='"+value+"'>"+value+"</button>";
			    			if(dbStatus == "Completed" && value =="Scheduled")
			    				str +="<button class='btn btn-change-status "+key+"' data-status='"+value+"'>"+value+"</button>";
			    		}
			    	        
			    		 
			    	})
			    	return str;
			    	 
			    },
			  updateToken:function(ev){
             	 var that = this;  
             	 
             	 require(['booking/views/createbooking'],function(addupdate){
             		 that.options.page.$el.html(new addupdate({model:that.model,page:that,app:that.app}).$el);
             		 	// $("#newjobtypes").modal('show');
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
