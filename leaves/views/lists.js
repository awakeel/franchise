define(['text!leaves/tpl/lists.html','leaves/collections/leaves','leaves/views/list','leaves/models/leave','typeahead'],
	function (template,Leaves,Leave,LeaveModel) {
		'use strict';
		return Backbone.View.extend({  
			tagName:"div",
			className:"col-lg-12",
			events:{
				"keyup #txtsearchjobtype":"searchjobtypes",
				//"click .close-p":"closePopup",
				//"click .save-p":"saveToken",
				"click .delete-p":"deleteToken",
				//"click .add-new":'addNew'
			},
            initialize: function () {
				this.template = _.template(template);
				this.request = null;
				this.fetched = 0;
				this.searchText = '';
				this.setting = this.options.setting;
				this.app = this.options.setting;
				this.branchid = null;
				if(typeof this.options.id != "undefined"){
					this.branchid = this.options.id;
				}
				 
				this.offsetLength = 10;
				this.objLeaves = new Leaves();
				this.render();
				
			}, 
			render: function () { 
				this.$el.html(this.template({}));
				this.app.showLoading('Loading Leaves....',this.$el);
				//$(window).scroll(_.bind(this.lazyLoading, this));
               // $(window).resize(_.bind(this.lazyLoading, this));
                this.fetchLeaves();
                //this.fillJobTypes();
                var that = this;
                var id = null;
               
                
			},
			 
			fetchLeaves:function(){ 
				var that = this;
				var _data = {}; 
				 _data['search'] = this.searchText;
				 _data['branchid'] = this.branchid;
				// _data['specific'] = 0;
				// _data['jobtypeid'] = that.jobtypeFilter;
				// this.objjobtypes.reset();
				 
				 that.setting.jobTypes = {};
				 if(this.request)
	                    this.request.abort();
				 that.$el.find('tbody').empty();
				 this.request = this.objLeaves.fetch({data: _data, success: function(data) {
					_.each(data.models,function(model){
						var objLeave = new Leave({model:model,page:that,setting:that.setting});
						that.$el.find('tbody').append(objLeave.$el);
					 })
					if(data.length < 1){
						var trNoRecord = '<tr id="tr_norecord"><td colspan="5">  <div class="col-lg-9 pull-right"><P> Boo... You have no job types ';
						trNoRecord +='<button type="button" class="   add-new" data-toggle="modal" data-target="#newjobtypes">';
						trNoRecord +=' <span class=" "><i class="fa fa-add"></i></span> ';
						trNoRecord += 'add new';
						trNoRecord += '</button> ';
						trNoRecord += '</div></td>';	
						trNoRecord += '</tr>';
						that.$el.find("table tbody").append(trNoRecord);
					}
					that.app.showLoading(false,that.$el);
					that.offsetLength = data.length;
					that.fetched = that.fetched + data.length;
					
					//if (that.fetched < parseInt(11)) {
                       // that.$el.find("tbody tr:last").attr("data-load", "true");
                       // that.$el.find("tbody").append("<tr id='tr_loading'><td colspan='6'><div class='gridLoading fa fa-spinner spinner' style='text-align:center; margin-left:auto;'></div></td>");
                         
                    //} 
					 var id = null;
					 if($.isEmptyObject(that.app.globaljobtypes)){
						 that.getGlobalJobTypes();
					 }else{
						 that.addNew();
					 }
					 that.app.showLoading(false,that.$el);
				}}) 
				
			},
			addNew:function(){
				var that = this;
				require(['leaves/views/addupdate'],function(AddUpdate){
					var objAddUpdate = new AddUpdate({id:1,page:that});
					that.$el.append(objAddUpdate.$el);
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
            searchjobtypes:function(ev){ 
                     this.searchText = ''; 
                     this.timer = 0;
                     var that = this;
                     var text = $(ev.target).val(); 
                     var code = ev.keyCode ? ev.keyCode : ev.which;
                     var nonKey =[17, 40 , 38 , 37 , 39 , 16,8,46];
                     if ((ev.ctrlKey==true)&& (code == '65' || code == '97')) {
                           return;
                     }
                     console.log(nonKey);
                     if($.inArray(code, nonKey)!==-1) return;
                     console.log(code)
                          if(code == 8 || code == 46){
	                                 if(text){ 
			                        	 that.searchText = text;
				                          that.fetchJobTypes();
			                         }
                           }else{
		                   
		                        this.searchText = text;
		                          clearTimeout(that.timer); // Clear the timer so we don't end up with dupes.
		                            that.timer = setTimeout(function() { // assign timer a new timeout 
		                                if (text.length < 2) return;
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
                      that.addNew()
                 });
            }
           
            
		});
	});
