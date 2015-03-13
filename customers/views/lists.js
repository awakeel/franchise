define(['text!customers/tpl/lists.html','customers/collections/customers','customers/views/list','customers/models/customer','daterangepicker'],
	function (template,ColCustomers,ViewCustomer,ModelCustomer,daterangepicker) {
		'use strict';
		return Backbone.View.extend({  
			tagName:"div",
			className:"col-lg-12 , cslg",
			events:{
			 "change #ddlcustomertype":'changeCustomer',
			 "keyup #txtsearchcustomers":"searchCustomers",
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
				this.offsetLength = 20;
				this.datesearch = null;
				this.objCustomers = new ColCustomers();
				this.render();
				
			}, 
			render: function () { 
				this.$el.html(this.template({}));
				 $(window).scroll(_.bind(this.lazyLoading, this));
                 $(window).resize(_.bind(this.lazyLoading, this));
                this.fetchCustomers(); 
                
			},
			changeCustomer:function(ev){
				var type = ev.target.value;
				this.type = type;
				this.fetchCustomers();
			},
			fetchCustomers:function(offset){ 
				var that = this;
				var _data = {}; 
				 _data['branchid'] = this.branchid;
				 _data['franchiseid'] = this.franchiseid;  
				 _data['employeeid'] = this.employeeid; 
				 if(!that.type){
					 _data['type'] = '1';
				 }else{
					 _data['type'] = that.type;
				 }
				 _data['search'] = this.searchText;
				 if(!offset){
					 that.$el.find('table tbody').empty();
				 }else{
					 _data['offset'] = this.offsetLength + offset;
				 }
				 
				 this.app.showLoading('Loading Revenue....',this.$el);
				 if(this.request)
	                    this.request.abort(); 
				   this.request = this.objCustomers.fetch({data: _data, success: function(data) {
					 
					_.each(data.models,function(model){
						var objCustomer = new ViewCustomer({model:model,page:that,setting:that.app});
						that.$el.find('table tbody').append(objCustomer.$el);
						 
					})
					var more = "";
					if(offset){
						more = " more";
					}
					if(data.length < 1){
						var trNoRecord = '<tr id="tr_norecord"><td colspan="1">  <div class="col-lg-9 pull-right"><P> No '+more+' customers Found ';
						 
						trNoRecord += '</div></td>';	
						trNoRecord += '</tr>';
						that.$el.find("table tbody").append(trNoRecord);
					}
					that.app.showLoading(false,that.$el);
					that.offsetLength = that.offsetLength +  data.length;
					that.fetched = that.fetched + data.length;
					
					if (data.length > 0) {
	                       that.$el.find("tbody tr:last").attr("data-load", "true");
	                       that.$el.find("tbody").append("<tr id='tr_loading'><td colspan='1'><div class='gridLoading fa fa-spinner spinner' style='text-align:center; margin-left:auto;'></div></td>");
	                         
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
                    this.fetchCustomers(this.offsetLength);
                }
            },
            searchCustomers:function(ev){ 
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
		                          that.fetchCustomers();
	                         }
                            }else{
	                          this.searchText = text;
	                          clearTimeout(that.timer); // Clear the timer so we don't end up with dupes.
	                            that.timer = setTimeout(function() { // assign timer a new timeout 
	                                if (text.length < 3) return;
	                                that.searchText = text;
	                                that.fetchCustomers(that.langaugeFilter);
	                           }, 500); // 2000ms delay, tweak for faster/slower
                            }
            }  
           
            
		});
	}); 
