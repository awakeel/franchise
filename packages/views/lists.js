define(['text!packages/tpl/lists.html','packages/collections/packages','packages/views/list','packages/models/package'],
	function (template,ColTasks,ViewTask,ModelTask) {
		'use strict';
		return Backbone.View.extend({  
			tagName:"div",
			className:"checklist",
			events:{
			 'click .choosepackage':'changePackages'
			},
            initialize: function () {
				this.template = _.template(template);
				this.request = null;
				this.fetched = 0;
				this.searchText = ''; 
				this.app = this.options.app || this.options.setting;
				this.franchiseid = this.app.user_franchise_id;
				this.employeeid = this.app.user_employee_id;
				this.branchid = this.app.user_branch_id;
				this.offsetLength = 10;
				this.objTasks = new ColTasks();
				this.render(false);
				
			}, 
			changePackages:function(){
				  var that = this;
	              require(['packages/views/addupdate'],function(pricing){
                	that.$el.find('#pricing').html(new pricing({app:that.app,page:that}).$el);
                	that.$el.find('#mdlpricing').modal('show');
                })
			},
			
			render: function () { 
				this.$el.html(this.template({}));
				this.$el.find('#mdlpricing').modal('hide');
				this.$el.find('table tbody').empty();
				//$(window).scroll(_.bind(this.lazyLoading, this));
               // $(window).resize(_.bind(this.lazyLoading, this));
                this.fetchPackages(); 
                this.app.showLoading('Loading Packages....',this.$el);
                var that = this;
                var id = null;
                if(this.options.show == "b"){
                	this.changePackages();
                }
    				
                
			},
			 
			fetchPackages:function(){ 
				var that = this;
				var _data = {}; 
				 _data['branchid'] = this.branchid;
				 _data['franchiseid'] = this.franchiseid;  
				 _data['employeeid'] = this.employeeid;  
				 
				 if(this.request)
	                    this.request.abort(); 
				   this.request = this.objTasks.fetch({data: _data, success: function(data) {
					 that.$el.find('table tbody').empty();
					_.each(data.models,function(model){
						var objTask = new ViewTask({model:model,page:that,setting:that.app});
						that.$el.find('table tbody').append(objTask.$el);
						 
					})
					if(data.length < 1){
						var trNoRecord = '<tr id="tr_norecord"><td colspan="2">  <div class="col-lg-9 pull-right"><P> Nothing Found ';
						 
						trNoRecord += '</div></td>';	
						trNoRecord += '</tr>';
						that.$el.find("table tbody").append(trNoRecord);
					}
					that.app.showLoading(false,that.$el);
					that.offsetLength = data.length;
					that.fetched = that.fetched + data.length;
					
					 if (that.fetched < parseInt(11)) {
                      //  that.$el.find("tbody tr:last").attr("data-load", "true");
                       // that.$el.find("tbody").append("<tr id='tr_loading'><td colspan='6'><div class='gridLoading fa fa-spinner spinner' style='text-align:center; margin-left:auto;'></div></td>");
                         
                     }  
				}}) 
				
			} ,
			 
			lazyLoading: function() {
                var $w = $(window);
                var th = 200;
                var filters = this.$el.find('tbody tr:last').prev();
                var inview = filters.filter(function() {
                    var $e = $(this),
                            wt = $w.scrollTop(),
                            wb = wt + $w.height(),
                            et = $e.offset().top,
                            eb = et + $e.height();
                    return eb >= wt - th && et <= wb + th;
                });
                if (inview.length && inview.attr("data-load") && this.$el.height() > 0) {
                    inview.removeAttr("data-load"); 
                    this.$el.find("#tr_loading").remove();
                    this.fetchPackages(this.offsetLength);
                }
            } 
           
            
		});
	});
 