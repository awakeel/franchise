define(['backbone', 'underscore',  'text!dashboard/tpl/lists.html'],
	function (Backbone, _,   template) {
		'use strict';
		return Backbone.View.extend({  
                        events: {
                             
                         },

			initialize: function () {
				this.template = _.template(template);		
				this.app = this.options.setting;
				 this.app.showLoading('loading dashboard..',this.$el);
				this.render();
				this.loadQuickStats();
				//  			
			},

			render: function () {
				this.$el.html(this.template({}));
				
			},
			loadQuickStats:function(){
				var that = this;
				require(['dashboard/views/quickstats'],function(quickstats){
					that.$el.prepend(new quickstats().$el);
				})
				this.app.showLoading(false,this.$el.find('.login-area'));
			}
		});
	});
