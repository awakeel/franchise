/* 
 * Name: Notification Dialog
 * Date: 04 June 2014
 * Author: Pir Abdul Wakeel
 * Description: Used to fetch all notifications , anouncement
 * Dependency: Notificaiton Model
 */

define(['backbone',  'jobtypes/models/jobtype'], function (Backbone, ModelJobType) {
	'use strict';
	return Backbone.Collection.extend({
            
            model:ModelJobType,
            url: 'api/jobtypes'
           
           
             
	});
});