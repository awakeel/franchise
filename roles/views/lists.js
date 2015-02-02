define(['text!roles/tpl/lists.html','roles/collections/roles','roles/views/list','roles/models/role','swal'],
	function (template,Roles,Role,RoleModel,swal) {
		'use strict';
		return Backbone.View.extend({  
			tagName:"div",
			className:"col-lg-12",
			events:{
			 
				"click .delete-p":"deleteToken",
				"keyup #txtsearchrole":"searchRoles"
				 
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
				this.objRoles = new Roles();
				this.render();
			 
			}, 
			render: function () { 
				this.$el.html(this.template({}));
				this.app.showLoading('Loading roles...',this.$el);
				//$(window).scroll(_.bind(this.lazyLoading, this));
                //$(window).resize(_.bind(this.lazyLoading, this));
                this.fetchRoles();
                //this.fillJobTypes();
                var that = this;
                var id = null;
               this.addNew();
                
			},
			 
			fetchRoles:function(){ 
				var that = this;
				var _data = {}; 
				 _data['search'] = this.searchText;
				 _data['franchiseid'] = this.franchiseid;
				// _data['specific'] = 0;
				// _data['jobtypeid'] = that.jobtypeFilter;
				// this.objjobtypes.reset();
				 that.$el.find('tbody').empty();
				 
				 if(this.request)
	                    this.request.abort();
				 this.request = this.objRoles.fetch({data: _data, success: function(data) {
					_.each(data.models,function(model){
						var objRole = new Role({model:model,page:that,setting:that.setting});
						that.$el.find('tbody').append(objRole.$el);
					 })
					if(data.length < 1){
						var trNoRecord = '<tr><td colspan="5">  <div class="col-lg-9 pull-right"><P> Boo... You have no role ';
					 
						trNoRecord += '</div></td>';	
						trNoRecord += '</tr>';
						that.$el.find("table tbody").append(trNoRecord);
					}
					 
					that.offsetLength = data.length;
					that.fetched = that.fetched + data.length;
					
					//if (that.fetched < parseInt(11)) {
                       // that.$el.find("tbody tr:last").attr("data-load", "true");
                       // that.$el.find("tbody").append("<tr id='tr_loading'><td colspan='6'><div class='gridLoading fa fa-spinner spinner' style='text-align:center; margin-left:auto;'></div></td>");
                         
                    //} 
					that.app.showLoading(false,that.$el);
					 var id = null;
					 
				}}) 
				
			},
			addNew:function(){
				var that = this;
				require(['roles/views/addupdate'],function(AddUpdate){
					var objAddUpdate = new AddUpdate({page:that,isnew:true});
					that.$el.find('.roles').append(objAddUpdate.$el);
				})
				 
                	 
			},
			fillJobTypes:function(){
				 var url = "api/jobtypes";
				 var that = this;
				 var options = "<select value=0>Select jobtype</option>";
                 jQuery.getJSON(url, function(tsv, state, xhr) {
                     var jobtypes = jQuery.parseJSON(xhr.responseText);
                     _.each(jobtypes,function(key){
                    	 var selected = "";
                   	     if(that.setting.selectedjobtype == key.langaugeid)1
                   	     	selected = "selected";
                   	     
                    	  	options +="<option value="+key.id+" "+selected+">"+key.title+"</option>";
                    	  	
                     })
                     that.$el.find(".ddljobtype").html(options);
                     that.$el.find(".ddljobtype").on('change',function(ev){
                    	 that.jobtypeFilter = $(this).val();
                    	 that.fetchjobtypes();
                     })
                 });
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
            searchRoles:function(ev){ 
                     this.searchText = ''; 
                     this.timer = 0;
                     var that = this;
                     var text = $(ev.target).val(); 
                     var code = ev.keyCode ? ev.keyCode : ev.which;
                     var nonKey =[17, 40 , 38 , 37 , 39 , 16, 46];
                     if ((ev.ctrlKey==true)&& (code == '65' || code == '97')) {
                           return;
                     }
                     console.log(nonKey);
                     if($.inArray(code, nonKey)!==-1) return;
                    
                          if(code == 8 || code == 46){
	                                 if(text){ 
			                        	 that.searchText = text;
				                          that.fetchRoles();
			                         }
                           }else{
		                   
		                        this.searchText = text;
		                          clearTimeout(that.timer); // Clear the timer so we don't end up with dupes.
		                            that.timer = setTimeout(function() { // assign timer a new timeout 
		                                if (text.length < 2) return;
		                                that.searchText = text;
		                                that.fetchRoles(that.langaugeFilter);
		                           }, 500); // 2000ms delay, tweak for faster/slower
                          }
            } 
           
           
            
		});
	});
