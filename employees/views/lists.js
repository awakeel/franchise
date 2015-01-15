define(['text!employees/tpl/lists.html','employees/collections/employees','employees/views/list','employees/models/employee'],
	function (template,Employees,Employee,EmployeeModel) {
		'use strict';
		return Backbone.View.extend({  
			tagName:"div",
			className:"col-lg-13",
			events:{
				"keyup #txtsearchemployees":"searchEmployees",
				"click .close-p":"closePopup",
				//"click .save-p":"saveToken",
				"click .delete-p":"deleteToken",
				"click .add-new":'addNew'
			},
            initialize: function () {
				this.template = _.template(template);
				this.request = null;
				this.fetched = 0;
				this.searchText = '';
				this.setting = this.options.setting;
				this.offsetLength = 10;
				this.objEmployees = new Employees();
				this.render();
				
			}, 
			render: function () { 
				this.$el.html(this.template({}));
				$(window).scroll(_.bind(this.lazyLoading, this));
                $(window).resize(_.bind(this.lazyLoading, this));
                this.fetchEmployees();
                //this.fillJobTypes();
                var that = this;
                var id = null;
               
                
			},
			 
			fetchEmployees:function(){
				var that = this;
				var _data = {}; 
				var spin = this.setting.showLoading('Saving info please wait',this.$el,{top:'30%'});
				 _data['search'] = this.searchText;
				// _data['specific'] = 0;
				// _data['jobtypeid'] = that.jobtypeFilter;
				// this.objjobtypes.reset();
				 that.$el.find('tbody').empty();
				 if(this.request)
	                    this.request.abort();
				 this.request = this.objEmployees.fetch({data: _data, success: function(data) {
					_.each(data.models,function(model){
						var objEmployee = new Employee({model:model,page:that,setting:that.setting});
						that.$el.find('tbody').append(objEmployee.$el);
					})
					that.offsetLength = data.length;
					that.fetched = that.fetched + data.length;
					
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
				require(['employees/views/addupdate'],function(AddUpdate){
					var objAddUpdate = new AddUpdate({page:that});
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
            searchEmployees:function(ev){ 
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
			                          that.fetchEmployees();
		                         }
                           }else{
		                   
		                        this.searchText = text;
		                          clearTimeout(that.timer); // Clear the timer so we don't end up with dupes.
		                            that.timer = setTimeout(function() { // assign timer a new timeout 
		                                if (text.length < 2) return;
		                                that.searchText = text;
		                                that.fetchEmployees(that.langaugeFilter);
		                           }, 500); // 2000ms delay, tweak for faster/slower
                          }
            },
            save:function(_f,_l,_p,_e,_pas,_add,_about,_type,_b_id,view){
            	 
            	var objEmployeeModel = new EmployeeModel();
            	objEmployeeModel.set('firstname',_f);
            	objEmployeeModel.set('lastname',_l);
            	objEmployeeModel.set('phone',_p);
            	objEmployeeModel.set('email',_e);
            	objEmployeeModel.set('password',_pas);
            	objEmployeeModel.set('branchid',_b_id);
            	objEmployeeModel.set('address',_add);
            	objEmployeeModel.set('about',_about);
            	objEmployeeModel.set('type',_type);
            	var model = objEmployeeModel.save(); 
            	this.objEmployees.add(objEmployeeModel);  
                var last_model = this.objEmployees.last();
                //this.closePopup();
                var objEmployee = new Employee({model:objEmployeeModel,page:this,setting:this.setting});
				this.$el.find('tbody').prepend(objEmployee.$el);
				view.closeView();
				this.setting.successMessage();
            }
           
            
		});
	});
