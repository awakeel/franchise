/* 
 * Name: Notification Dialog
 * Date: 04 June 2014
 * Author: Pir Abdul Wakeel
 * Description: Used to fetch all notifications , anouncement
 * Dependency: Notificaiton Model
 */

define(['backbone',  'services/models/service'], function (Backbone, ModelService) {
	'use strict';
	return Backbone.Collection.extend({
            
            model:ModelService,
            url: 'api/services'
           
           
             
	});
});