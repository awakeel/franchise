define(['jquery', 'backbone', 'underscore',  'text!packages/tpl/addupdate.html'],
	function ($, Backbone, _,   template) {
		'use strict';
		return Backbone.View.extend({
			events:{
				'click .btn-package':'updatePackage'
			},
			initialize: function () {
				this.template = _.template(template);				
				this.render();
						
			},
			updatePackage:function(ev){
				var id = $(ev.target).data('package');
				var URL = "api/savepackage";
				var that = this;
				console.log('hello world');
				$.when($.getJSON(URL,{ sms:$(ev.target).data('sms'),franchiseid:this.options.app.user_franchise_id,packageid:id},  function (tsv, state, xhr) {
				})).then(function() {
					
					 swal({
					      title: "Info?",
					      text: "Your request for "+ $(ev.target).data('title')+" is recieved by admin.",
					      type: "info" ,
					    });
					 
					 that.options.page.fetchPackages();
					 that.options.page.$el.find('#mdlpricing').modal('hide');
					 $('body').removeClass('modal-open');
					 $('.modal-backdrop').remove();
					 
				});
				
				
			},
			render: function () {
				this.$el.html(this.template({}));
				this.getPackages();
			},
			getPackages:function(){
				var str = "";
				var that = this;
				var URL = "api/getallsystempackages";
				$.when($.getJSON(URL,{},  function (tsv, state, xhr) {
				})).then(function(data) {
					_.each(data,function(value,key,list){
						str += '<ul class="list-group col-lg-4">'+
						 ' <li class="list-group-item">'+value.name+'</li>'+
						 ' <li class="list-group-item">email support: '+ value.email+'</li>'+
						  '<li class="list-group-item">SMS : '+value.sms+'</li>'+
						 '<li class="list-group-item"><a href="#"><button data-sms="'+value.sms+'" data-title="'+value.name+'" class="btn btn-lg btn-default btn-silver btn-package" data-package="'+value.id+'">Select Now</button></a></li>'+
						'</ul>';
					});
					that.$el.find('.pricing .row').html(str);
				}); 
			}
		});
	});
