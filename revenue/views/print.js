define(
		[ 'text!revenue/tpl/print.html'],
		function(template) {
			'use strict';
			return Backbone.View
					.extend({
						events : {
							'click .back' : "closeView",
							"click .print" : "showPrint"
						},
						initialize : function() {
							this.template = _.template(template);  
							this.app = this.options.page.setting; 
							this.id = this.options.model.get('id');
							this.date = this.options.date;
							 this.loadInvoice();
							
						},
						render : function() {
							this.$el.html(this.template());
							var that = this;
							 
						},
						loadInvoice:function(){
							 var URL = "api/getinvoice";
					         var that = this; 
						        jQuery.getJSON(URL,{franchiseid:this.app.user_franchise_id,bookingid:this.options.model.get('id')},  function (tsv, state, xhr) {
					            	 var _json = jQuery.parseJSON(xhr.responseText);
					            	 that.model = _json[0];
					            	 that.render(); 
					            	 that.app.showLoading(false,that.$el);	 
					            }); 
							
						},
						showPrint:function(){
							this.$el.find(".print-area").print();
						},
						closeView : function() { 
							var that = this; 
							require([ 'revenue/views/lists' ],
								function(Lists) { 
									var objLists = new Lists({
										setting : that.app,
										id:that.branchid
									});
									that.$el.parent().html(objLists.$el);
									Backbone.View.prototype.remove.call(that);
									that.undelegateEvents();
									that.$el.remove();
									that.$el.removeData().unbind();
									that.remove();
								})
						},
						 
					});
		});
