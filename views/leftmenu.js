define(['jquery', 'backbone', 'underscore',  'text!templates/leftmenu.html','views/breadcrumb'],
	function ($, Backbone, _,   template,BreadCrumb) {
		'use strict';
		return Backbone.View.extend({
			 
                tagName: 'footer',
                className:"clearfix",
                events: {
                   'click .navbar-side li':'openWorkspace'
                },

			initialize: function () {
				this.language = this.options.setting.language;
				this.template = _.template(template);				
				this.render();
				 			
			},
			openWorkspace:function(ev){
				var that = this;
				var title = $(ev.target).text();
			    var folder = this.checkUndefined($(ev.target).data('folder'));
			    var show = this.checkUndefined($(ev.target).data('show'));
			    if(!folder){ folder = $(ev.target).parent('li').data('folder')}
			    require([folder+'/views/lists'],function(Lists){
			    	var objLists = new Lists({setting:that.options.setting});
			    	var objBreadCrumb = new BreadCrumb({title:folder,setting:that.options.setting,show:show});
			    	$('#page-wrapper').find('.page-content').html(objLists.$el);
			 
			    	 $('#page-wrapper').find('.page-content').prepend(objBreadCrumb.$el);
			    	
			    })
			},
			render: function () {
				this.$el.html(this.template({}));
				
			},
			checkUndefined:function(id){
				if(typeof id!="undefined") return id;
				else return false;
			}
		});
	});
