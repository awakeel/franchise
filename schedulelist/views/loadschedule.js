 define(['text!schedulelist/tpl/loadschedule.html' ],
		function (template) {
			'use strict';
			return Backbone.View.extend({  
				tagName:'div',
				className:"modal-content",
				 
	            initialize: function () {
					this.template = _.template(template);
				    this.app = this.options.app;
					this.render();
				},
				render: function () {
					this.$el.html(this.template(this.model.toJSON()));
					 
				 
				}  
			});
		});
