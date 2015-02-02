/* 
 * Name: Notification Dialog
 * Date: 04 June 2014
 * Author: Pir Abdul Wakeel
 * Description: Used to fetch all notifications , anouncement
 * Dependency: Notificaiton Model
 */

define(['backbone',  'leaves/models/leave'], function (Backbone, ModelLeave) {
	'use strict';
	return Backbone.Collection.extend({
            
            model:ModelLeave,
            url: 'api/leaves'
           
           
             
	});
});