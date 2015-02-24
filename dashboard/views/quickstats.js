define([ 'text!dashboard/tpl/quickstats.html','app'],
	function (  template,app) {
		'use strict';
		return Backbone.View.extend({  
			className:"row",
	            events: {
	                 
	             },

			initialize: function () {
				this.template = _.template(template);		
				this.app = app;
				this.render();
				 
				 			
			},
			render: function () {
				this.$el.html(this.template({}));
				this.loadMenu();
				this.app.getTiming(this.app.user_branch_id);
			}, 
			loadMenu:function(){
				var isBranch = false;
				var isJobType = false;
				var isEmployees = false;
				var isServices = false;
				var modules = this.app.modules.filter(function(el){
					if(el.name == 'branches')
					    return el.name;
					if(el.name == 'jobtypes')
						return el.name;
					if(el.name == 'employees')
						return el.name;
					if(el.name == "services")
						return el.name;
				})
				var str = "";
				var that = this;
				_.each(modules, function(value,key,list){
					
					str += '<div class="col-lg-2 col-sm-6">';
							str +='<div class="circle-tile">';
								str +='<a>';
								str +='<div class="circle-tile-heading '+value.name+'">';
									str +='<i class="fa fa-users fa-fw fa-3x"></i>';
								str +='</div>';
								str +='</a>';
								str +='<div class="circle-tile-content '+value.name+'">';
								str +='<div class="circle-tile-description text-faded">';
								str +=value.text;
								str +='</div>';
				       str +='<div class="circle-tile-number text-faded quickstats-'+value.name+'">';
				       	str +='';
				       	str +='<span id="sparklineA"><canvas width="29" height="24" style="display: inline-block; width: 29px; height: 24px; vertical-align: top;"></canvas></span>';
				       		str +='</div>';
				       	str +='<a class="circle-tile-footer show-page" style="cursor:pointer" data-folder="'+value.name+'">More Info <i class="fa fa-chevron-circle-right"></i></a>';
				       	str +='</div>';
				       str +='</div>';
				       str +='</div>';
				});
				this.$el.html(str);
				this.$el.find('.show-page').on('click',function(ev){
					that.showPage(ev);
				});
				this.quickstats();
			},
			showPage:function(ev){
				var folder = $(ev.target).data('folder');
				 if(typeof folder == "undefined") return;
				 var that = this;
				    this.app.showLoading('Loading ...',$('#page-wrapper').find('.page-content'));
				    require([folder+'/views/lists','views/breadcrumb'],function(Lists,BreadCrumb){
				    
				    	var objLists = new Lists({setting:that.app});
				    	var objBreadCrumb = new BreadCrumb({title:folder,setting:that.app,show:''});
				    	$('#page-wrapper').find('.page-content').html(objLists.$el);
				    	 $('#page-wrapper').find('.page-content').prepend(objBreadCrumb.$el);
				    	
				    })
			},
			quickstats:function(){
			 	    var URL = "api/dashboard/quickstats";
		            var that = this;
		            jQuery.getJSON(URL,  function (tsv, state, xhr) {
		                var _json = jQuery.parseJSON(xhr.responseText);
		                _json = _json[0];
		                that.$el.find('.quickstats-branches').html(_json.dep);
		                that.$el.find('.quickstats-employees').html(_json.emp);
		                that.$el.find('.quickstats-sch').html(_json.sch);
		                that.$el.find('.quickstats-jobtypes').html(_json.job);
		                that.$el.find('.quickstats-services').html(_json.ser);
		            } ); 
			}
			
		});
	});
