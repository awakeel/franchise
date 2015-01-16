define(['text!employees/tpl/addupdate.html'],
	function (template,Services) {
		'use strict';
		return Backbone.View.extend({  
			 events:{
				 'click .close-p':"closeView", 
				 "click .save-p":"save"
			 },
			  initialize: function () {
				this.template = _.template(template); 
				this.render();
			},
			render: function () {  
				 console.log(this.options)
				this.$el.html(this.template( ));
				
			},
			closeView:function(){
				 this.options.page.$el.find('#employees').modal('hide');
				 this.undelegateEvents();
				 this.$el.remove();
				 this.$el.removeData().unbind(); 
				 this.remove();  
				 Backbone.View.prototype.remove.call(this);
			},
			getRoles:function(){
				var URL = "api/allroles";
	            var that = this;
	            var str = "";
	            jQuery.getJSON(URL,  function (tsv, state, xhr) {
	                var _json = jQuery.parseJSON(xhr.responseText);
	               var all = _json;
	                _.each(all,function(value,key,list){
	                	 str += '<div class="radio">';
	      	            str +='<label> <input type="radio" checked=""';
	      	            str +='	value="'+value.id+'" id="optionfulltime" name="optionsrole"> '+value.name;
	      	         
	      	            str +='</label>';
	      	            str +='</div>';
	                }) 
	                that.$el.find('.role-area').append(str);
	            } );
	         
			},
			getServices:function(){
				var str = "";
				 var that = this;
				 console.log(this.options.page.setting.jobTypes);
				_.each(this.options.page.setting.jobTypes,function(value,key,list){ 
					console.log(value);
					str+='<div class="checkbox">';
					str+='<label> <input type="checkbox" value="'+key+'">'+list[key];
						str+='</label>';
							str+='</div>';
				});
				return str;
			},
			getJobTypes:function(){
				var str = "";
				 var that = this;
				 
				_.each(this.options.page.setting.services,function(value,key,list){ 
					console.log(value);
					str+='<div class="checkbox">';
					str+='<label> <input type="checkbox" value="'+key+'">'+list[key];
						str+='</label>';
							str+='</div>';
				});
				return str;
			},
			save:function(){
				if(!this.options.id){
					var _f = this.$el.find('#txtfirstname').val();
					var _l = this.$el.find('#txtlastname').val();
					var _p = this.$el.find('#txtphone').val();
					var _e = this.$el.find('#txtemail').val();
					var _pas = this.$el.find('#txtpassword').val();
					var _about = 'about';//this.$el.find('#txtabout').val();
					var _add = this.$el.find('#txtaddress').val();
					 
					var _type = this.$el.find('input[name=optionstype]:checked').val() 
					this.options.page.save(_f,_l,_p,_e,_pas,_add,_about,_type,1,this);
				}else{
					this.options.page.saveToken(this.options.id,this.$el.find('#txtname').val(),1,this.$el.find('#txtcomments').val(),this);
				}
				
			}
		 
		});
	});
