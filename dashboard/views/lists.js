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
				///this.loadQuickStats();
				this.loadTodayBookings();
				this.loadTasks();
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
			},
			loadTodayBookings:function(){
					var that = this;
					this.app.showLoading('loading tasks..',this.$el.find("#divtodaybooking"));
				    require(['booking/views/lists'],function(Lists){ 
				    	var objLists = new Lists({setting:that.app,dashboard:true});
				        that.$el.find("#divtodaybooking").html(objLists.$el);
				    })
			},
			loadTasks:function(){
				var that = this;
				this.app.showLoading('loading tasks..',this.$el.find("#tasks"));
				require(['tasks/views/lists'],function(Lists){ 
			    	var objLists = new Lists({app:that.app,dashboard:true});
			        that.$el.find("#tasks").html(objLists.$el);
			    })
			}
		});
	});
