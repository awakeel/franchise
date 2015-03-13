/* 
 * Name: Notification Dialog
 * Date: 04 June 2014
 * Author: Pir Abdul Wakeel
 * Description: Used to fetch all notifications , anouncement
 * Dependency: Notificaiton Model
 */

define(['backbone',  'revenue/models/revenue'], function (Backbone, ModelRevenue) {
	'use strict';
	return Backbone.Collection.extend({ 
            model:ModelRevenue,
            url: 'api/revenue' 
	});
});