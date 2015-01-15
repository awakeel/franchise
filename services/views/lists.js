define(['text!services/tpl/lists.html','services/collections/services','services/views/list','services/models/service'],
	function (template,Services,Service,ServiceModel) {
		'use strict';
		return Backbone.View.extend({  
			tagName:"div",
			className:"col-lg-13",
			events:{
				"keyup #txtsearchservices":"searchServices",
				//"click .close-p":"closePopup",
				//"click .save-p":"saveToken",
				"click .delete-p":"deleteToken",
				 
			},
            initialize: function () {
				this.template = _.template(template);
				this.request = null;
				this.fetched = 0;
				this.searchText = '';
				this.setting = this.options.setting;
				this.offsetLength = 10;
				this.objServices = new Services();
				this.render();
				this.addNew();
				
			}, 
			render: function () { 
				this.$el.html(this.template({}));
				$(window).scroll(_.bind(this.lazyLoading, this));
                $(window).resize(_.bind(this.lazyLoading, this));
                this.fetchServices();
                //this.fillJobTypes();
                var that = this;
                var id = null;
              
                
			},
			 
			fetchServices:function(){
				var that = this;
				var _data = {}; 
				var spin = this.setting.showLoading('Saving info please wait',this.$el,{top:'30%'});
				 _data['search'] = this.searchText;
				// _data['specific'] = 0;
				// _data['jobtypeid'] = that.jobtypeFilter;
				// this.objjobtypes.reset();
				 that.$el.find('tbody').empty();
				 this.setting.services = {};
				 if(this.request)
	                    this.request.abort();
				 this.request = this.objServices.fetch({data: _data, success: function(data) {
					_.each(data.models,function(model){
						var objService = new Service({model:model,page:that,setting:that.setting});
						that.$el.find('tbody').append(objService.$el);
						that.setting.services[model.attributes['id']] = model.attributes['name'];
					})
					that.offsetLength = data.length;
					that.fetched = that.fetched + data.length;
					if(data.length < 1){
						var trNoRecord = '<tr><td colspan="5">  <div class="col-lg-9 pull-right"><P> Boo... You have no service ';
						trNoRecord +='<button type="button" class="btn btn-labeled btn-primary add-new" data-toggle="modal" data-target="#newservice">';
						trNoRecord +=' <span class="btn-label"><i class="fa fa-add"></i></span>Click me to ';
						trNoRecord += 'add new';
						trNoRecord += '</button> ';
						trNoRecord += '</div></td>';	
						trNoRecord += '</tr>';
						that.$el.find("table tbody").append(trNoRecord);
					}
					//if (that.fetched < parseInt(11)) {
                       // that.$el.find("tbody tr:last").attr("data-load", "true");
                       // that.$el.find("tbody").append("<tr id='tr_loading'><td colspan='6'><div class='gridLoading fa fa-spinner spinner' style='text-align:center; margin-left:auto;'></div></td>");
                         
                    //} 
					spin.stop();
					 var id = null;
					 
				}}) 
				
			},
			addNew:function(){
				var that = this;
				require(['services/views/addupdate'],function(AddUpdate){
					var objAddUpdate = new AddUpdate({page:that});
					that.$el.append(objAddUpdate.$el);
				})
			},
			fillJobTypes:function(){
				 var url = "api/services";
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
            searchServices:function(ev){ 
                     this.searchText = ''; 
                     this.timer = 0;
                     var that = this;
                     var text = $(ev.target).val(); 
                     var code = ev.keyCode ? ev.keyCode : ev.which;
                     var nonKey =[17, 40 , 38 , 37 , 39 , 16,8,46];
                     if ((ev.ctrlKey==true)&& (code == '65' || code == '97')) {
                           return;
                     }
                     if($.inArray(code, nonKey)!==-1) return;
                          if(code == 8 || code == 46){
                                 if(text){ 
		                        	 that.searchText = text;
			                          that.fetchServices();
		                         }
                           }else{
		                   
		                        this.searchText = text;
		                          clearTimeout(that.timer); // Clear the timer so we don't end up with dupes.
		                            that.timer = setTimeout(function() { // assign timer a new timeout 
		                                if (text.length < 2) return;
		                                that.searchText = text;
		                                that.fetchServices(that.langaugeFilter);
		                           }, 500); // 2000ms delay, tweak for faster/slower
                          }
            } 
         
           
            
		});
	});
