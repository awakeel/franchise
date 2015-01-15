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
				console.log(this.options.setting.modules);
				var that = this;
			
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
				getMenu:function(){
				
				var that = this;
			
				var total = this.options.setting.modules.length;
				var iterator = 0;
				var html = "";
				var which_child = "";
				_.each(this.options.setting.modules,function(value, key, list){
					var text = value.text;
					var name = value.name;
				 
					iterator +=1;
					var childof = value.childof; 
					
					if((which_child && childof != which_child   ) || (which_child && total == iterator)){
                        which_child = "";
                    	console.log(which_child + 'childof' +childof +'iterator'+ iterator+total)
                    	html+="</ul></li>";
					} 
					if(childof && childof != which_child){
						console.log(childof);
						which_child = childof;
						html+= '<li class="panel">';
						html +='<a href="javascript:;" data-parent="#side" data-toggle="collapse" class="accordion-toggle" data-target="#ul_'+childof+'">';
						html +='<i class="fa fa-edit"></i> '+childof+' <i class="fa fa-caret-down"></i>';
						html +='</a>';
						html += ' <ul class="collapse nav" id="ul_'+childof+'">'; 					 
				     }
						html += ' <li data-folder="'+name+'" class=" ">';
					    html +=' <a  data-folder="'+name+'" data-show="n">';
	                    html +='  <i class="fa fa-'+name+'" data-show="n"></i>'+text
	                    html +=' </a>  </li>'; 
                    if((which_child && childof != which_child ) || (which_child && total == iterator)){
                        which_child = "";
                    	console.log(which_child + 'childof' +childof +'iterator'+ iterator+total)
                    	html+="</ul></li>";
					} 
                    
					
					 
				}) 
				return html;
			},
			checkUndefined:function(id){
				if(typeof id!="undefined") return id;
				else return false;
			}
		});
	});
