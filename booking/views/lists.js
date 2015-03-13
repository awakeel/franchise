define(['text!booking/tpl/lists.html','booking/collections/bookings','booking/views/list','schedulelist/models/schedulelist' ],
	function (template,BookingLists,BookingList,BookingModel) {
		'use strict';
		return Backbone.View.extend({  
			tagName:"div",
			className:"col-lg-12",
			events:{
				"click .delete-p":"deleteToken", 
				"click .add-new":"addNew",
				'keyup #txtsearchbooking':"searchBooking"
			},
            initialize: function () {
				this.template = _.template(template);
				this.request = null;
				this.searchText = '';
				this.app = this.options.setting;
				this.franchiseid = this.app.user_franchise_id;
				this.branchid = this.app.user_branch_id;
				this.offsetLength = 20;
				this.objBookingLists = new BookingLists();
				this.render();
				this.$el.css('padding','0px')
			}, 
			render: function () { 
				this.$el.html(this.template({}));
				this.app.showLoading('Loading Booking...',this.$el);
				$(window).scroll(_.bind(this.lazyLoading, this));
                $(window).resize(_.bind(this.lazyLoading, this));
                this.fetchBookings(); 
                var that = this;
                var id = null;
               
                this.app.getTiming(this.branchid);
             
			},
			 
			fetchBookings:function(offset){ 
				 var that = this;
				 var _data = {}; 
				 if(this.options.customer){
					 _data['customer'] = this.options.customer;
				 }
				 _data['search'] = this.searchText;
				 _data['branchid'] = this.branchid;
				 if(this.options.dashboard == true){
					 _data['today'] = true;
				 }
				 if(this.request)
	                    this.request.abort();
				 if(offset){
					
					 _data['offset'] = this.offsetLength + offset;
				 }else{
					 that.$el.find('tbody').empty();
				 }
				   this.request = this.objBookingLists.fetch({data: _data, success: function(data) {
					_.each(data.models,function(model){
						var objBookingList = new BookingList({model:model,page:that,app:that.app});
						that.$el.find('tbody').append(objBookingList.$el);
					})
					var more = "";
					if(offset){
						more = " more";
					}
					if(data.length == 0){
						var trNoRecord = '<tr id="tr_norecord"><td colspan="1">';
							trNoRecord += '<div class="col-lg-9 pull-right"><P>No '+more+' booking found ';
						trNoRecord += '</div></td>';	
						trNoRecord += '</tr>';
						that.$el.find("table tbody").append(trNoRecord);
					} 
					that.app.showLoading(false,that.$el);
					that.offsetLength = data.length;
					that.fetched = that.fetched + data.length;
					if (data.length > 0) {
                       that.$el.find("tbody tr:last").attr("data-load", "true");
                       that.$el.find("tbody").append("<tr id='tr_loading'><td colspan='6'><div class='gridLoading fa fa-spinner spinner' style='text-align:center; margin-left:auto;'></div></td>");
                         
                     } 
					 var id = null;
					 that.app.showLoading(false,that.$el);
				}}) 
				
			},
			addNew:function(){
				var that = this;
				this.$el.find('#newbooking').parent().remove();
				require(['booking/views/newbooking'],function(AddUpdate){
					var objAddUpdate = new AddUpdate({id:1,page:that,app:that.app});
					that.$el.append(objAddUpdate.$el);
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
                    this.fetchBookings(this.offsetLength);
                }
            },
            searchBooking:function(ev){ 
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
		                          that.fetchBookings();
	                         }
                       }else{
	                   
	                        this.searchText = text;
	                          clearTimeout(that.timer); // Clear the timer so we don't end up with dupes.
	                            that.timer = setTimeout(function() { // assign timer a new timeout 
	                                if (text.length < 3) return;
	                                that.searchText = text;
	                                that.fetchBookings();
	                           }, 500); // 2000ms delay, tweak for faster/slower
                 }
            } 
           
           
            
		});
	});
