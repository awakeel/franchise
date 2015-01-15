/* 
 * Name: Notification Dialog
 * Date: 04 June 2014
 * Author: Pir Abdul Wakeel
 * Description: Used to fetch all notifications , anouncement
 * Dependency: Notificaiton Model
 */

define(['backbone',  'employees/models/employee'], function (Backbone, ModelEmployee) {
	'use strict';
	return Backbone.Collection.extend({
           urlRoot: '/api/employees',
           
            model:ModelEmployee,
            url: function () {
                return 'api/employees';
            },
           
             
	});
});