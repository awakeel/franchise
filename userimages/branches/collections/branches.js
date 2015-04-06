/* 
 * Name: Notification Dialog
 * Date: 04 June 2014
 * Author: Pir Abdul Wakeel
 * Description: Used to fetch all notifications , anouncement
 * Dependency: Notificaiton Model
 */

define(['backbone',  'branches/models/branch'], function (Backbone, ModelBranch) {
	'use strict';
	return Backbone.Collection.extend({
            
            model:ModelBranch,
            url: 'api/branches'
           
           
             
	});
});