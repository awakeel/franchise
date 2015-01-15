/* 
 * Name: Notification Dialog
 * Date: 04 June 2014
 * Author: Pir Abdul Wakeel
 * Description: Used to fetch all notifications , anouncement
 * Dependency: Notificaiton Model
 */

define(['backbone',  'language/models/language'], function (Backbone, ModelLanguage) {
	'use strict';
	return Backbone.Collection.extend({
            
            model:ModelLanguage,
            url: 'api/languagetranslate'
           
           
             
	});
});