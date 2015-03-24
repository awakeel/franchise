define(['text!revenue/tpl/lists.html','revenue/collections/revenues','revenue/views/list','revenue/models/revenue','daterangepicker'],
	function (template,ColRevenue,ViewRevenue,ModelRevenue,daterangepicker) {
		'use strict';
		return Backbone.View.extend({  
			tagName:"div",
			className:"col-lg-12 ",
			events:{
			  "change #ddlservices":"changeListing",
			  "change #ddlemployees":"changeListing"
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
				this.objRevenues = new ColRevenue();
				this.render();
				this.fetchServices();
				this.fetchEmployees();
				
			}, 
			render: function () { 
				this.$el.html(this.template({}));
				
				 $(window).scroll(_.bind(this.lazyLoading, this));
                 $(window).resize(_.bind(this.lazyLoading, this));
                this.fetchRevenue(); 
                var that = this;
                var id = null;
                this.$el.find('#reportrange').daterangepicker(
                	    {
                	      ranges: {
                	         'Today': [moment(), moment()],
                	         'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                	         'Last 7 Days': [moment().subtract('days', 6), moment()],
                	         'Last 30 Days': [moment().subtract('days', 29), moment()],
                	         'This Month': [moment().startOf('month'), moment().endOf('month')],
                	         'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                	      },
                	      startDate: moment().subtract('days', 29),
                	      endDate: moment()
                	    },
                	    function(start, end) {
                	    	that.datesearch = start.format('YYYYMMDD') +'#'+end.format('YYYYMMDD');
                	    	that.fetchRevenue();
                	        that.$el.find('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                	    }
                	);
                
			},
			changeListing:function(ev){
				var id = ev.target.value
				this.serviceid = 0;
				this.employeeidd = 0;
				
				if(id != "0"){
					if($(ev.target).attr('id') == "ddlemployees"){
						this.employeeidd = id;
					}else{
						this.serviceid = id;
					}
				}
				this.fetchRevenue();
			},
			fetchRevenue:function(offset){ 
				var that = this;
				var _data = {}; 
				  if(this.serviceid){
					  _data['serviceid'] = this.serviceid;
				  }
				  if(this.employeeidd){
					  _data['employeeid'] = this.employeeidd;
				  }
				 _data['branchid'] = this.branchid;
				 _data['franchiseid'] = this.franchiseid;  
				// _data['employeeid'] = this.employeeid; 
				 if(that.datesearch){
					 _data['datesearch'] = this.datesearch;
				 }
				 if(!offset){
					 that.$el.find('table tbody').empty();
				 }else{
					 _data['offset'] = this.offsetLength + offset;
				 }
				 
				 this.app.showLoading('Loading Revenue....',this.$el);
				 if(this.request)
	                    this.request.abort(); 
				   this.request = this.objRevenues.fetch({data: _data, success: function(data) {
					 
					_.each(data.models,function(model){
						var objRevenue = new ViewRevenue({model:model,page:that,setting:that.app});
						that.$el.find('table tbody').append(objRevenue.$el);
						 
					})
					var more = "";
					if(offset){
						more = " more";
					}
					if(data.length < 1){
						var trNoRecord = '<tr id="tr_norecord"><td colspan="1">  <div class="col-lg-9 pull-right"><P> No '+more+' Revenue Found ';
						 
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
                    this.fetchRevenue(this.offsetLength);
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
            }  ,
            fetchServices:function(){
				 var URL = "api/services";
		         var that = this;
		         
		         that.$el.find("#ddlservices").html("<option value='0' data-price = '0' data-time = '0'> Select Service </option>");
		          jQuery.getJSON(URL,{franchiseid:this.app.user_franchise_id,jobtypeid:this.jobtypeid},  function (tsv, state, xhr) {
	                var _json = jQuery.parseJSON(xhr.responseText);
		                 that.$el.find("#ddlservices").append(_.map(_json,function(value,key,list){ return "<option data-price="+value.price+" data-time="+value.time+" value="+value.id+">"+value.name+"</option>";}).join());
		                 
		          }); 
		     },
		      
		     fetchEmployees:function(branchid){
		    	  
					 var URL = "api/employees";
					 var that = this;
					 this.$el.find("#ddlemployees").html("<option value='0'> Select Employee </option>");
				      jQuery.getJSON(URL,{frachiseid:this.app.user_franchise_id,jobtypeid:this.jobtypeid},  function (tsv, state, xhr) {
		                var _json = jQuery.parseJSON(xhr.responseText);
		                that.$el.find("#ddlemployees").append(_.map(_json,function(value,key,list){   
		                	 return "<option value="+value.id+"  >"+value.firstname + ' ' + value.lastname+  "</option>";
		                	 }).join());  
				      });
		     }
		});
	}); 
