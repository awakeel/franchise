/* 
 * Name: Notification Dialog
 * Date: 04 June 2014
 * Author: Pir Abdul Wakeel
 * Description: Used to fetch all notifications , anouncement
 * Dependency: Notificaiton Model
 */

define(['backbone',  'products/models/product'], function (Backbone, ModelProduct) {
	'use strict';
	return Backbone.Collection.extend({
            
            model:ModelProduct,
            url: 'api/products'
           
           
             
	});
});