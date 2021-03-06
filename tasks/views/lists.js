define(['text!tasks/tpl/lists.html','tasks/collections/tasks','tasks/views/list','tasks/models/task'],
	function (template,ColTasks,ViewTask,ModelTask) {
		'use strict';
		return Backbone.View.extend({  
			tagName:"div",
			className:"checklist",
			events:{
			 
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
				this.render();
				
			}, 
			render: function () { 
				this.$el.html(this.template({}));
				return;
				this.app.showLoading('Loading Tasks....',this.$el);
				//$(window).scroll(_.bind(this.lazyLoading, this));
               // $(window).resize(_.bind(this.lazyLoading, this));
                this.fetchTasks(); 
                var that = this;
                var id = null;
               
                
			},
			 
			fetchTasks:function(){ 
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
						var objTask = new ViewTask({model:model,page:that,setting:that.setting});
						that.$el.find('table tbody').append(objTask.$el);
						 
					})
					if(data.length < 1){
						var trNoRecord = '<tr id="tr_norecord"><td colspan="2">  <div class="col-lg-9 pull-right"><P> No Task Found ';
						 
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
                    this.fetchJobTypes(this.offsetLength);
                }
            },
            searchjobtypes:function(ev){ 
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
		                          that.fetchJobTypes();
	                         }
                            }else{
	                          this.searchText = text;
	                          clearTimeout(that.timer); // Clear the timer so we don't end up with dupes.
	                            that.timer = setTimeout(function() { // assign timer a new timeout 
	                                if (text.length < 3) return;
	                                that.searchText = text;
	                                that.fetchJobTypes(that.langaugeFilter);
	                           }, 500); // 2000ms delay, tweak for faster/slower
                            }
            } ,
            getGlobalJobTypes:function(){
            	 var url = "api/globaljobtypes";
				 var that = this;
				  
            	 jQuery.getJSON(url, function(tsv, state, xhr) {
                     var jobtypes = jQuery.parseJSON(xhr.responseText);
                     _.each(jobtypes,function(value,key,list){
                    	 that.app.globaljobtypes.push(value.name);
                     }); 
                    //  that.addNew()
                 });
            }
           
            
		});
	});

define(['text!jobtypes/tpl/lists.html','jobtypes/collections/jobtypes','jobtypes/views/list','jobtypes/models/jobtype','typeahead'],
	function (template,JobTypes,JobType,JobTypeModel) {
		'use strict';
		return Backbone.View.extend({  
			tagName:"div",
			className:"col-lg-12",
			events:{
				"keyup #txtsearchjobtype":"searchjobtypes", 
				"click .delete-p":"deleteToken", 
				'click .add-new-jobtype':'addNew',
			},
            initialize: function () {
				this.template = _.template(template);
				this.request = null;
				this.fetched = 0;
				this.searchText = '';
				this.setting = this.options.setting;
				this.app = this.options.setting;
				this.franchiseid = this.app.user_franchise_id;
				this.offsetLength = 10;
				this.objJobTypes = new JobTypes();
				this.render();
				
			}, 
			render: function () { 
				this.$el.html(this.template({}));
				this.app.showLoading('Loading Job types....',this.$el);
				//$(window).scroll(_.bind(this.lazyLoading, this));
               // $(window).resize(_.bind(this.lazyLoading, this));
                this.fetchJobTypes(); 
                var that = this;
                var id = null;
               
                
			},
			 
			fetchJobTypes:function(){ 
				var that = this;
				var _data = {}; 
				 _data['search'] = this.searchText;
				 _data['franchiseid'] = this.franchiseid; 
				 that.setting.jobTypes = {};
				 if(this.request)
	                    this.request.abort();
				
				 this.request = this.objJobTypes.fetch({data: _data, success: function(data) {
					 that.$el.find('tbody').empty();
					_.each(data.models,function(model){
						var objJobType = new JobType({model:model,page:that,setting:that.setting});
						that.$el.find('tbody').append(objJobType.$el);
						that.setting.jobTypes[model.attributes['id']] = model.attributes['name'];
					})
					if(data.length < 1){
						var trNoRecord = '<tr id="tr_norecord"><td colspan="5">  <div class="col-lg-9 pull-right"><P> No Job Types Found ';
						 
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
					 var id = null;
					 if($.isEmptyObject(that.app.globaljobtypes)){
						 that.getGlobalJobTypes();
					 }else{
						// that.addNew();
					 }
					 that.app.showLoading(false,that.$el);
				}}) 
				
			},
			addNew:function(){
				var that = this;
				this.app.showLoading('Wait...',this.$el);
				require(['jobtypes/views/addupdate'],function(AddUpdate){
					var objAddUpdate = new AddUpdate({page:that,id:123});
					that.$el.html(objAddUpdate.$el);
				})
				this.app.showLoading(false,this.$el);
				 
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
                    this.fetchJobTypes(this.offsetLength);
                }
            },
            searchjobtypes:function(ev){ 
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
		                          that.fetchJobTypes();
	                         }
                            }else{
	                          this.searchText = text;
	                          clearTimeout(that.timer); // Clear the timer so we don't end up with dupes.
	                            that.timer = setTimeout(function() { // assign timer a new timeout 
	                                if (text.length < 3) return;
	                                that.searchText = text;
	                                that.fetchJobTypes(that.langaugeFilter);
	                           }, 500); // 2000ms delay, tweak for faster/slower
                            }
            } ,
            getGlobalJobTypes:function(){
            	 var url = "api/globaljobtypes";
				 var that = this;
				  
            	 jQuery.getJSON(url, function(tsv, state, xhr) {
                     var jobtypes = jQuery.parseJSON(xhr.responseText);
                     _.each(jobtypes,function(value,key,list){
                    	 that.app.globaljobtypes.push(value.name);
                     }); 
                    //  that.addNew()
                 });
            }
           
            
		});
	});
