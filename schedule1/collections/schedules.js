/* 
 * Name: Notification Dialog
 * Date: 04 June 2014
 * Author: Pir Abdul Wakeel
 * Description: Used to fetch all notifications , anouncement
 * Dependency: Notificaiton Model
 */

define(['backbone',  'schedule/models/schedule'], function (Backbone, ModelSchedule) {
	'use strict';
	return Backbone.Collection.extend({
            
            model:ModelSchedule,
            url: 'api/schedules'
           
           
             
	});
});