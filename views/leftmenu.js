define(['jquery', 'backbone','bootstrap', 'underscore',  'text!templates/leftmenu.html','views/breadcrumb','swal'],
	function ($, Backbone,bootstrap, _,   template,BreadCrumb,sweetalert) {
		'use strict';
		return Backbone.View.extend({
			 
                tagName: 'footer',
                className:"clearfix",
                
                events: {
                   'click .navbar-side li':'openWorkspace',
                    "click .fa-sign-out":"logout"	   
                },

			initialize: function () {
				this.language = this.options.setting.language;
				this.template = _.template(template); 
				this.app = this.options.setting;
			
				this.render();
				 			
			},
			logout:function(){
            	this.app.users = {};
				Backbone.history.length = 0;
				 var URL = "api/logout";
		            var that = this;
		            jQuery.getJSON(URL,  function (tsv, state, xhr) {
		                var _json = jQuery.parseJSON(xhr.responseText);
		                	 
		                    require(['authorize/views/login'],function(login){
	                        	$('body').html(new login({app:that.app}).$el);
	                        })
		            }); 
				
			},

			openWorkspace:function(ev){
				var that = this;
				var title = $(ev.target).text();
			    var folder = this.checkUndefined($(ev.target).data('folder'));
			    var show = this.checkUndefined($(ev.target).data('show'));
			    if(!folder){ folder = $(ev.target).parent('li').data('folder')}
			    if(typeof folder == "undefined") return;
			    this.options.setting.showLoading('Loading ...',$('#page-wrapper').find('.page-content'));
			    require([folder+'/views/lists'],function(Lists){
			    
			    	var objLists = new Lists({setting:that.options.setting});
			    	var objBreadCrumb = new BreadCrumb({title:folder,setting:that.options.setting,show:show});
			    	$('#page-wrapper').find('.page-content').html(objLists.$el);
			 
			    	 $('#page-wrapper').find('.page-content').prepend(objBreadCrumb.$el);
			    	
			    })
			},
			render: function () {
				this.$el.html(this.template({})); 
				var that = this;
				this.$el.find('.accordion-toggle').on('click',function(){
					$(this).next('.nav-col').slideToggle();
				})
			},
			getMenu:function(){ 
				var that = this; 
				var total = this.options.setting.modules.length;
				var iterator = 0;
				var html = "<li class='nav-search'> <span></span> </li>";
				var which_child = "";
				console.log(this.app.modules );
				if(typeof this.app.modules == "undefined"){
					return;
				}
				
				var departments = this.app.modules.filter(function(el){
					
					return el.childof == "management";
				})
				var settings = this.options.setting.modules.filter(function(el){
					
					return el.childof == "setting";
				}) 
				 var dashboard = this.options.setting.modules.filter(function(el){
					 return el.name == "dashboard";
				}) 
				var others = this.options.setting.modules.filter(function(el){
					 return el.childof == "";
				}) 
				if(typeof dashboard[0] !="undefined" && dashboard[0].name){
					html += ' <li data-folder="'+dashboard[0].name+'" >';
						html += '  <a   data-folder="'+dashboard[0].name+'">';
							html += '     <i class="fa fa-dashboard"></i> '+dashboard[0].text;
								html += '</a>';
									html += '</li>';
				}
				 
					html += '<li class="panel">';
					html +=  '  <a href="javascript:;" data-parent="#side" data-toggle="collapse" class="accordion-toggle" data-target="#ul_management">';
					html +=   '  <i class="fa fa-bar-chart-o"></i> Management <i class="fa fa-caret-down"></i>';
					html +=  '  </a> <ul class="collapse nav nav-col" id="ul_management">';
				  _.each(departments,function(value, key, list){
						var text = value.text;
						var name = value.name;
				      	html += ' <li data-folder="'+name+'" class=" ">';
					    html +=' <a  data-folder="'+name+'" data-show="n">';
	                    html +='  <i class="fa fa-'+name+'" data-show="n"></i>'+text
	                    html +=' </a>  </li>'; 
                   }) 
                      html += '</ul></li>'
                	    html += '<li class="panel">'
      					html +=  '  <a href="javascript:;" data-parent="#side" data-toggle="collapse" class="accordion-toggle" data-target="#ul_setting">';
      					html +=   '  <i class="fa fa-bar-chart-o"></i> Setting <i class="fa fa-caret-down"></i>';
      					html +=  '  </a> <ul class="collapse nav nav-col" id="ul_setting">';
      				  _.each(settings,function(value, key, list){
      						var text = value.text;
      						var name = value.name;
      				      	html += ' <li data-folder="'+name+'" class=" ">';
      					    html +=' <a  data-folder="'+name+'" data-show="n">';
      	                    html +='  <i class="fa fa-'+name+'" data-show="n"></i>'+text
      	                    html +=' </a>  </li>'; 
                         }) 
                        html += '</ul></li>'
                        	 _.each(others,function(value, key, list){
         						var text = value.text;
         						var name = value.name;
         				      	html += ' <li data-folder="'+name+'" class=" ">';
         					    html +=' <a  data-folder="'+name+'" data-show="n">';
         	                    html +='  <i class="fa fa-'+name+'" data-show="n"></i>'+text
         	                    html +=' </a>  </li>'; 
                            }) 
				return html;
			}, 
			getBranchName:function(){ 
				if(this.app.current_branch !=""){
					return this.app.current_branch;
				}else if(typeof this.app.branches[0] !="undefined"){
            		return this.app.branches[0].name;
            	}else if(this.app.users.isfranchise == "1"){
            		return "Main Franchise";
            	}
            },
			checkUndefined:function(id){
				if(typeof id!="undefined") return id;
				else return false;
			}
		});
	});
