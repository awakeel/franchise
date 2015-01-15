define([ 'backbone', 'underscore',  'text!templates/breadcrumb.html'],
	function (Backbone, _,   template) {
		'use strict';
		return Backbone.View.extend({
		    events:{
		    	'click .logout':'logout'
		    },
			initialize: function () {
				 this.language = this.options.setting.language;
				this.template = _.template(template); 
				 this.title = this.options.title;
				this.render();
				 	console.log(this.title)		
			},
			render: function () {
				var that = this;
				this.$el.html(this.template({})); 
			},
			logout:function(){
				this.options.setting.users = {};
				Backbone.history.length = 0;
				 var URL = "api/logout";
		            var that = this;
		            jQuery.getJSON(URL,  function (tsv, state, xhr) {
		                var _json = jQuery.parseJSON(xhr.responseText);
		                	console.log(_json);
		                    require(['authorize/views/login'],function(login){
	                        	$('body').html(new login().$el);
	                        })
		            }); 
				
			},
			getCurrentDate:function(){
				var date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
				return date;
			},
			addNewButton:function(){
			//	if(this.options.show !="n")
				//return '<button class="btn btn-success btn-lg pull-right btn-add-new">'+this.options.setting.language["add"]+'</button>';
				
			},
			getTitle:function(){
				return this.language[this.title];
			}
		});
	});
