/* 
 * Name: Roles
 * Date: 04 June 2014
 * Author: Pir Abdul Wakeel
 * Description: Used for permissions
 * Dependency:  
 */

define(['backbone',  'roles/models/role'], function (Backbone, ModelJobType) {
	'use strict';
	return Backbone.Collection.extend({ 
            model:ModelJobType,
            url: 'api/roles' 
	});
});