define(['text!schedulelist/tpl/lists.html','schedulelist/collections/schedulelists','schedulelist/views/list','schedulelist/models/schedulelist','swal' ],
	function (template,ScheduleLists,ScheduleList,ScheduleListModel,swal) {
		'use strict';
		return Backbone.View.extend({  
			tagName:"div",
			className:"col-lg-12",
			events:{
				"keyup #txtschedulelist":"searchschedulelist", 
				"click .delete-p":"deleteToken", 
				"click .add-new":"addNew"
			},
            initialize: function () {
				this.template = _.template(template);
				this.request = null;
				this.fetched = 0;
				this.searchText = '';
				this.setting = this.options.setting;
				this.app = this.options.setting;
				this.franchiseid = this.app.user_franchise_id;
				this.branchid = this.app.user_branch_id;
				this.offsetLength = 20;
				this.objScheduleLists = new ScheduleLists();
				this.render();
				this.app.getTiming(this.branchid);
				
			}, 
			render: function () { 
				this.$el.html(this.template({}));
				this.app.showLoading('Loading Schedules....',this.$el);
				$(window).scroll(_.bind(this.lazyLoading, this));
                $(window).resize(_.bind(this.lazyLoading, this));
                this.fetchSchedules(); 
                var that = this;
                var id = null;
               
                
			},
			 
			fetchSchedules:function(offset){ 
				var that = this;
				var _data = {}; 
				 _data['search'] = this.searchText;
				 _data['branchid'] = this.branchid; 
				 that.setting.jobTypes = {};
				 if(this.request)
	                    this.request.abort();
				 
					 if(offset){
							
						 _data['offset'] = this.offsetLength + offset;
					 }else{
						 that.$el.find('tbody').empty();
					 } 
				     this.request = this.objScheduleLists.fetch({data: _data, success: function(data) {
				    	 if(!offset){
				    		 that.$el.find('tbody').empty();
				    	 }
					_.each(data.models,function(model){
						var objScheduleList = new ScheduleList({model:model,page:that,setting:that.setting});
						that.$el.find('tbody').append(objScheduleList.$el);
					})
					var more = "";
					if(offset){
						more = " more";
					}
					if(data.length == 0){
						var trNoRecord = '<tr id="tr_norecord"><td colspan="1">  <div class="col-lg-9 pull-right"><P> No '+more+' Schedule Found ';
						trNoRecord += '</div></td>';	
						trNoRecord += '</tr>';
						that.$el.find("table tbody").append(trNoRecord);
					}
					that.app.showLoading(false,that.$el);
					that.offsetLength = data.length;
					that.fetched = that.fetched + data.length;
					
					if (data.length > 0) {
	                       that.$el.find("tbody tr:last").attr("data-load", "true");
	                       that.$el.find("tbody").append("<tr id='tr_loading'><td colspan='1'><div class='gridLoading fa fa-spinner spinner' style='text-align:center; margin-left:auto;'></div></td>");
	                         
	                 } 
					 var id = null;
					 that.app.showLoading(false,that.$el);
				}}) 
				
			},
			addNew:function(){
				var that = this;
				require(['schedulelist/views/createschedule'],function(AddUpdate){
					var objAddUpdate = new AddUpdate({id:1,page:that});
					that.$el.html(objAddUpdate.$el);
				})
			},
			 
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
                    this.fetchSchedules(this.offsetLength);
                }
            },
            searchschedulelist:function(ev){ 
            	 this.searchText = ''; 
                 this.timer = 0;
                 var that = this;
                 var text = $(ev.target).val(); 
                 var code = ev.keyCode ? ev.keyCode : ev.which;
                 var nonKey =[17, 40 , 38 , 37 , 39 , 16, 46];
                 if ((ev.ctrlKey==true)&& (code == '65' || code == '97')) {
                       return;
                 }
                 if($.inArray(code, nonKey)!==-1) return;
                      if(code == 8 || code == 46){
                             if(!text || text.length > 3){ 
	                        	 that.searchText = text;
		                          that.fetchSchedules();
	                         }
                       }else{
	                   
	                        this.searchText = text;
	                          clearTimeout(that.timer); // Clear the timer so we don't end up with dupes.
	                            that.timer = setTimeout(function() { // assign timer a new timeout 
	                                if (text.length < 3) return;
	                                that.searchText = text;
	                                that.fetchSchedules();
	                           }, 500); // 2000ms delay, tweak for faster/slower
                 }
            } 
           
           
            
		});
	});
