define([ 'jquery', 'bootstrap', 'backbone', 'app', 'flex',
			'views/main_container' ], function(jquery, bootstrap, Backbone,
			app, flex, Container) {
		var Router = Backbone.Router.extend({
			routes : {
				'' : 'dashboard'
			},
			initialize : function() {
				this.dashboard();
			},
			dashboard : function() { 
				var settings = app.load(this.loadPages);
			} 
			

		});
		return Router;
	})