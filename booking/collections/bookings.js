/* 
 * Name: Notification Dialog
 * Date: 04 June 2014
 * Author: Pir Abdul Wakeel
 * Description: Used to fetch all notifications , anouncement
 * Dependency: Notificaiton Model
 */

define(['backbone',  'booking/models/booking'], function (Backbone, ModelBooking) {
	'use strict';
	return Backbone.Collection.extend({
            
            model:ModelBooking,
            url: 'api/booking'
           
           
             
	});
});