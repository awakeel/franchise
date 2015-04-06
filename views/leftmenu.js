define(['jquery', 'backbone','bootstrap', 'underscore',  'text!templates/leftmenu.html','views/breadcrumb','swal'],
	function ($, Backbone,bootstrap, _,   template,BreadCrumb,sweetalert) {
		'use strict';
		return Backbone.View.extend({
			 
                tagName: 'footer',
                className:"clearfix",
                
                events: {
                   'click .navbar-side li':'openWorkspace',
                    "click .fa-sign-out":"logout"	,
                    'change #ddlmenubranches':'changeDepartment'
                },

			initialize: function () {
				this.language = this.options.setting.language;
				this.template = _.template(template); 
				this.app = this.options.setting;
			
				this.render();
				this.getDepartments();
				 			
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
			getDepartments:function(){
				var str = "";
				var that = this;
				var URL = "api/branchbyemployee";
				var str = "";
				$.when($.getJSON(URL,{employeeid:this.app.user_employee_id},  function (tsv, state, xhr) {
				})).then(function(data) {
					
					_.each(data,function(value,key,list){
						var selected = "";
						console.log(that.app.user_branch_id  + 'branchid');
						if(that.app.user_branch_id == value.id){
							selected ="selected";
						}
						 str+='<option '+selected+' value='+value.id+'>'+value.name+'</option>';
					});
					
					that.$el.find('#ddlmenubranches').append(str);
					if(data.length==0){
						that.$el.find('#ddlmenubranches').hide();
					}
				}); 
			} ,
			changeDepartment:function(ev){
	   			 var branchid = ev.target.value;
	   			 var name= this.$el.find("#ddlmenubranches option:selected").text();
	   			 var data = this.app.data;
	   			 Backbone.history.length = 0;
	   			 if(typeof this.app.branches !="undefined")
				     var branch = this.app.branches.filter(function(el){
					 return el.id == branchid;
				 });
	   			 require([ 'app' ], function(app) {
	 	              var settings = app.load(data,name);
	        		  app.getUser(branchid);
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
			    	var isemployee = false;
			    	if($(ev.target).text().trim().toLowerCase() == "employee calendar"){
			    		isemployee = true;
			    	}

			    	var objLists = new Lists({show:show,setting:that.options.setting,isemployee:isemployee});
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
			getMenu:function(i){ 
				  var that = this;
				if(typeof this.app.modules == "undefined"){
					 var URL = "api/modules";
		             var data = {};
		             if(this.app.user_branch_id){
		            	 data = {branchid:this.app.user_branch_id} 
		             }
		             jQuery.getJSON(URL,data,  function (tsv, state, xhr) {
		                 var _json = jQuery.parseJSON(xhr.responseText);
		                 that.app.modules = _json;
		                 return that.showMenu(i);
		             }); 
				}else{
					return that.showMenu(i);
				}
			}, 
			showMenu:function(i){
				
				var that = this; 
				var total = this.options.setting.modules.length;
				var iterator = 0;
				var html = "<li class='nav-search'> <span></span> </li>";
				var which_child = "";
				if(!this.app.modules || typeof this.app.modules[0] == "undefined"){
					if(i==1) return false;
					
					setTimeout(function(){
						that.getMenu(1);
					},1000);
					 
				}
				var departments;
				try {
				    var departments = this.app.modules.filter(function(el){
							
							return el.childof == "management";
					}) 
				} catch (e) {
					swal({
					      title: "Info?",
					      text: "Problem selecting department, department may not have modules, try to refresh the application",
					      type: "info" ,
					   });
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
				 var bookings = this.options.setting.modules.filter(function(el){
					 return el.childof == "booking";
				}) 
				 var schedules = this.options.setting.modules.filter(function(el){
					 return el.childof == "schedule";
				}) 
				 var packages = this.options.setting.modules.filter(function(el){
					 return el.childof == "packages";
				}) 
				var others = this.options.setting.modules.filter(function(el){
					 return el.childof == "" && el.text !="";
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
                   
                            html += '</ul></li>';
      				        html += '<li class="panel">'
        					html +=  '<a href="javascript:;" data-parent="#side" data-toggle="collapse" class="accordion-toggle" data-target="#ul_booking">';
        					html +=  '<i class="fa fa-bar-chart-o"></i> Booking <i class="fa fa-caret-down"></i>';
        					html +=  '</a> <ul class="collapse nav nav-col" id="ul_booking">';
        					 
        					_.each(bookings,function(value, key, list){
        						var text = value.text;
        						var name = value.name;
        				      	html += '<li data-folder="'+name+'" class=" ">';
        					    html +=' <a  data-folder="'+name+'" data-show="n">';
        	                    html +=' <i class="fa fa-'+name+'" data-show="n"></i>'+text
        	                    html +=' </a></li>'; 
                           }) 
                           html += '</ul></li>'; 
       				        html += '<li class="panel">'
         					html +=  '<a href="javascript:;" data-parent="#side" data-toggle="collapse" class="accordion-toggle" data-target="#ul_schedules">';
         					html +=  '<i class="fa fa-bar-chart-o"></i> Schedules <i class="fa fa-caret-down"></i>';
         					html +=  '</a> <ul class="collapse nav nav-col" id="ul_schedules">';
         					 
         					_.each(schedules,function(value, key, list){
         						var text = value.text;
         						var name = value.name;
         				      	html += '<li data-folder="'+name+'" class=" ">';
         					    html +=' <a  data-folder="'+name+'" data-show="n">';
         	                    html +=' <i class="fa fa-'+name+'" data-show="n"></i>'+text
         	                    html +=' </a></li>'; 
                            }) 
                            html += '</ul></li>';
         					
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
         					   
         					    html += '<li class="panel">'
               					html +=  '  <a href="javascript:;" data-parent="#side" data-toggle="collapse" class="accordion-toggle" data-target="#ul_packages">';
               					html +=   '  <i class="fa fa-bar-chart-o"></i> Packages <i class="fa fa-caret-down"></i>';
               					html +=  '  </a> <ul class="collapse nav nav-col" id="ul_packages">';
               				    _.each(packages,function(value, key, list){
               						var text = value.text;
               						var name = value.name;
               				      	html += ' <li data-folder="'+name+'" class=" ">';
               					    html +=' <a  data-folder="'+name+'" data-show="'+value.description+'">';
               	                    html +='  <i class="fa fa-'+name+'" data-show="'+value.description+'"></i>'+text
               	                    html +=' </a>  </li>'; 
                                 }) 
                                  
           					
           				   html += '</ul></li>'
      				    	 _.each(others,function(value, key, list){
         						var text = value.text;
         						var name = value.name;
         				      	html += ' <li data-folder="'+name+'" class=" ">';
         					    html +=' <a  data-folder="'+name+'" data-show="n">';
         	                    html +='  <i class="fa fa-desktop data-show="n"></i>'+text
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
            		return this.app.users.company;
            	}
            },
			checkUndefined:function(id){
				if(typeof id!="undefined") return id;
				else return false;
			}
		});
	});
