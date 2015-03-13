/* 
 * Name: Notification Dialog
 * Date: 04 June 2014
 * Author: Pir Abdul Wakeel
 * Description: Used to fetch all notifications , anouncement
 * Dependency: Notificaiton Model
 */

define(['backbone',  'tasks/models/task'], function (Backbone, ModelTask) {
	'use strict';
	return Backbone.Collection.extend({ 
            model:ModelTask,
            url: 'api/tasks' 
	});
});