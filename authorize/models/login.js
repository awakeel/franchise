/* 
 * Name: Login Model
 * Date: 04 June 2014
 * Author: Pir Abdul Wakeel
 * Description: This Notification Model depend on notification. 
 */

define(['backbone'], function (Backbone) {
	'use strict';
	return Backbone.Model.extend({
		idAttribute: "_id",
		urlRoot:'/api/login',
        initialize:function(){
                    
        },
        url:'api/login'
	});
});
