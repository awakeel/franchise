define([ 'text!dashboard/tpl/quickstats.html'],
	function (  template) {
		'use strict';
		return Backbone.View.extend({  
			className:"row",
	            events: {
	                 
	             },

			initialize: function () {
				this.template = _.template(template);		
				this.setting = this.options.setting;
				this.render();
				this.quickstats();
				 			
			},
			render: function () {
				this.$el.html(this.template({}));
			}, 
			quickstats:function(){
				    var URL = "api/dashboard/quickstats";
		            var that = this;
		            jQuery.getJSON(URL,  function (tsv, state, xhr) {
		                var _json = jQuery.parseJSON(xhr.responseText);
		                _json = _json[0];
		                that.$el.find('.quickstats-dep').html(_json.dep);
		                that.$el.find('.quickstats-emp').html(_json.emp);
		                that.$el.find('.quickstats-sch').html(_json.sch);
		                that.$el.find('.quickstats-job').html(_json.job);
		                that.$el.find('.quickstats-ser').html(_json.ser);
		            } ); 
			}
			
		});
	});
