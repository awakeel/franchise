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
								var data = this.$el.find(".print-area");
							  var mywindow = window.open('', 'Invoice', 'height=800,width=1024');
						        mywindow.document.write('<html><head><title>Printing Invoice</title>');
						        /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
						        mywindow.document.write('</head><body >');
						        mywindow.document.write(data.html());
						        mywindow.document.write('</body></html>');

						        mywindow.document.close(); // necessary for IE >= 10
						        mywindow.focus(); // necessary for IE >= 10

						        mywindow.print();
						        mywindow.close();

						        return true;
						    
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
