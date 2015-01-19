define(['text!branches/tpl/list.html','app'],
	function (template,app) {
		'use strict';
		return Backbone.View.extend({  
			tagName:'tr',
			id:"table-white-row",
			events:{
			 	"click .delete-branch":"deleteBranch",
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
				this.$el.on("mouseover",function(){
					this
				})
			},
			deleteBranch:function(ev){
				var that = this;
            	var id = $(ev.target).data('id'); 
                var URL = "api/deletebranch";
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
                 updateToken:function(ev){
                	 var that = this;
                	 var id =$(ev.target).data('id');
                	 require(['branches/views/addupdate'],function(addupdate){
               		 	 	that.options.page.$el.html(new addupdate({model:that.model,page:that,setting:that.setting}).$el);
         			 })
         			 
         		     
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
