define(['jquery', 'backbone', 'underscore',  'text!templates/header.html'],
        function($, Backbone, _,  template) {
            'use strict';
            return Backbone.View.extend({
                tagName: 'div',
                events: {
                    'click .dep-change':'changeDepartment',
                    'click .logout_open': 'logout',
                    'click .change-packages':'changePackages'
                },
                initialize: function() { 
                    this.template = _.template(template);
                    this.app = this.options.setting;
                    this.render();
                },
                logout:function(){
                	this.app.users = {};
    				Backbone.history.length = 0;
    				 var URL = "api/logout";
    		            var that = this;
    		            jQuery.getJSON(URL,  function (tsv, state, xhr) {
    		                var _json = jQuery.parseJSON(xhr.responseText);
    		                require(['authorize/views/login'],function(login){
	                        	$('body').html(new login({app:that.app}).$el);
	                        })
    		            });  
    			},
    			changePackages:function(){
    				  var that = this;
    	              require(['views/pricing'],function(pricing){
                      	that.$el.find('#pricing').html(new pricing({app:that.app}).$el);
                      	that.$el.find('#mdlpricing').modal('show');
                      })
	         	},
    			changeDepartment:function(ev){
	    			 var branchid = $(ev.target).data('id');
	    			 var data = this.app.data;
	    			 Backbone.history.length = 0;
	    			 if(typeof this.app.branches !="undefined")
	    			     var branch = this.app.branches.filter(function(el){
	    				 return el.id == branchid;
	    			 }); 
	    			 require([ 'app' ], function(app) {
		 	              var settings = app.load(data,branch[0].name);
		        		  app.getUser(branchid);
	                 });
    			 },
                render: function() {
                    this.$el.html(this.template({}));
                    $("#sidebar-toggle").click(function(e) {
                	     e.preventDefault();
                	     $(".navbar-side").toggleClass("collapsed");
                	     $("#page-wrapper").toggleClass("collapsed");
                    });
                	$(".portlet-widgets .fa-chevron-down, .portlet-widgets .fa-chevron-up").click(function() {
                	    $(this).toggleClass("fa-chevron-down fa-chevron-up");
                	});
                },
                getDepartments:function(id){
                	return;
                	var that = this;
                	var str = "";
                	var login = "";
                	var check_id = false;
                	if(this.app.user_branch_id){
                		check_id = true;
                		id = this.app.user_branch_id;
                	}
                	var name = "";
                	if(typeof that.options.setting.branches[0] !="undefined"){
                		name = that.options.setting.branches[0].name;
                	}
                	_.each(this.app.branches,function(value,key,list){
                	     if(check_id == true && id == value.id){
                	    	 login  ='(<small  data-id="'+value.id+'" style="cursor:pointer"> Currently Logged In</small>)';
                	     }else if(check_id == false && name == value.name){
                			 login  ='(<small  data-id="'+value.id+'" style="cursor:pointer"> Currently Logged In</small>)';
                		 }else{
                			 login  ='<button  class="dep-change btn btn-sm btn-primary" data-id="'+value.id+'" style="cursor:pointer"> Auto Login</button> ';
                		 }
        		          str+='<li   data-id="'+value.id+'"> <a> <div class="row"> <div class="col-xs-2">  </div>';
        		          str+='<div class="col-xs-10">  <p> <strong>'+value.name+'</strong>: '+login+' </p>  </div>';
        		          str+='</div> </a> </li>';
                	});
                    return str;
                },
                getUserName:function(){
                	if(this.app.current_branch !=""){
    					return this.app.current_branch;
    				}else if(typeof this.app.branches[0] !="undefined"){
                		return this.app.branches[0].name;
                	}else if(this.app.users.isfranchise == "1"){
                		return this.app.users.company;
                	}
                },
                getTitle: function(obj) {
                    var title = $(obj.target).parent("li").find("a").text();
                    return title;
                },
                loadNotifications: function() {
                     $(".add_dialogue" ).animate({top:"-600px"});
                      $(".quick-add").removeClass( "active" );
                      if (this.$el.find(".messages_dialogue").css('display')!="none") {
                    	  this.$el.find(".messages_dialogue").slideUp();
                          return false;
                      }
                    this.$el.find('.lo-confirm a.lo-no').click();
                    this.$el.find( ".add_dialogue" ).animate({top:"-600px"});
                    var that = this;
                    this.$el.find(".messages_dialogue").slideDown('fast');
                    $(".quick-add").removeClass( "active" );
                    this.$el.find('.announcement_dialogue').hide();
                    this.$el.find(".messages_dialogue").html(new Notifications({newMessages : this.newMessages,isModel:false}).el)
                    this.$el.find(".messages_dialogue").append("<div class='viewallmsgs' style='margin:0px;padding:0px;height:40px'><div style='text-align:center'><a class='btn-blue' style='margin-top:5px;'><span class='view-all'>View All Messages </span></a></div></div>");
                    this.$el.find(".messages_dialogue").append("<div class='btm-thumb'></div>");
                    this.$el.find(".messages_dialogue").find(".btm-thumb").on('click',function(){
                        that.$el.find(".messages_dialogue").slideUp('fast');
                    });
                    this.$el.find(".messages_dialogue").find(".view-all").on("click",function(){
                         
                    that.$el.find(".messages_dialogue").addClass('popmodel').html(new Notifications({isModel:true,newMessages : that.newMessages}).el)
                    that.$el.find(".popmodel").css({
	                    "position": "absolute",
	                    "height":$(window).height() - 200+ "px",
	                    "top": "70px",
	                    "left": ((($(window).width() -  that.$el.find(".popmodel").outerWidth()) / 2) + $(window).scrollLeft() + "px")});
	                    that.$el.find(".overlay").show();
	                    that.$el.find(".messages_dialogue").find(".all-notification").css("height",$(window).height() - 230 + "px");
                    });
                },
                hideMessageDialog:function(ev){
                   this.$el.find(".messages_dialogue").removeAttr('style');
                   this.$el.find(".messages_dialogue").removeClass('popmodel').hide();
                   $(ev.target).hide();
                },
                updateNotfication:function(){
                    var URL = "/pms/io/user/notification/?BMS_REQ_TK="+app.get('bms_token')+"&type=latest";
                    var that = this;
                    jQuery.getJSON(URL,  function(tsv, state, xhr){
                        var data = jQuery.parseJSON(xhr.responseText);
                        if(data[0]=="err" && data[1]=="SESSION_EXPIRED"){
                            that.timeOut = true;
                           }
                        if(app.checkError(data)){return false;}
                        if(that.firstTime == false){
                            var dt = new Date();
                            var time = dt;//{'h':dt.getHours() ,'m':dt.getMinutes() ,'s': dt.getSeconds()}
                            that.criticalMessageTime = time;
                        }
                        if(that.newMessages < data['notify.unread.count'] && that.firstTime == false){
                            that.$el.find('.messagesbtn').addClass('swing');
                            that.$el.find('.messagesbtn sup').css({"top":"-4px",left:"22px"});
                            setTimeout(function(){
                                 that.$el.find('.messagesbtn').removeClass('swing');
                                 that.$el.find('.messagesbtn sup').css({"top":"5px",left:"70px"});
                            },5000)
                           
                            
                        }else{
                            that.$el.find('.messagesbtn').removeClass('swing');
                            that.$el.find('.messagesbtn sup').css({"top":"5px",left:"70px"});
                        }
                        that.newMessages = data['notify.unread.count'];
                        that.$el.find('.messagesbtn sup').show();
                        that.$el.find('.messagesbtn sup').html(data['notify.unread.count']);
                         if(data['system.message'] != "" && that.isForceHide == false){
                             that.$el.find(".announcementbtn").show();
                             that.$el.find('.announcement_dialogue').show();
                            that.$el.find('.announcement_dialogue').find('p').html(data['system.message']);
                         }else{
                             that.$el.find('.announcement_dialogue').find('p').html(data['system.message']);
                             that.$el.find('.announcement_dialogue').hide()
                             if(that.isForceHide==true && data['system.message'] != "")
                                 that.$el.find('.announcementbtn').show(); 
                             else
                                 that.$el.find('.announcementbtn').hide();
                         }

                        if(data['notify.unread.count'] == "0" || data['notify.unread.count']== 0){
                            that.$el.find('.messagesbtn sup').hide();
                        }
                        that.firstTime = true;
                        that.$el.find('.announcement_dialogue').find('.date').html(that.getTimeAgo(that.criticalMessageTime));
                    });
               },
               getTimeAgo:function(date){ 
                    return moment(date).fromNow(); 
               },
               setIsActiveTab:function(){
                        var hidden = "hidden";

                        // Standards:
                        if (hidden in document)
                            document.addEventListener("visibilitychange", onchange);
                        else if ((hidden = "mozHidden") in document)
                            document.addEventListener("mozvisibilitychange", onchange);
                        else if ((hidden = "webkitHidden") in document)
                            document.addEventListener("webkitvisibilitychange", onchange);
                        else if ((hidden = "msHidden") in document)
                            document.addEventListener("msvisibilitychange", onchange);
                        // IE 9 and lower:
                        else if ('onfocusin' in document)
                            document.onfocusin = document.onfocusout = onchange;
                        // All others:
                        else
                            window.onpageshow = window.onpagehide 
                                = window.onfocus = window.onblur = onchange;

                        function onchange (evt) {
                            var v = 'visible', h = 'hidden',
                                evtMap = { 
                                    focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h 
                                };

                            evt = evt || window.event;
                            if (evt.type in evtMap)
                                document.body.className = evtMap[evt.type];
                            else        
                                document.body.className = this[hidden] ? "hidden" : "visible";
                        }
               },
               toggleAnnouncement:function(){
                   this.$el.find('.announcement_dialogue').slideToggle();
               },
               closeAnnouncement:function(){
                   this.isForceHide = true;
                   this.$el.find('.announcement_dialogue').hide();
               },
               quickAdd:function(){
                   var that = this;
                   //this.$el.find('.add_dialogue').slideToggle('fast');
                   //this.$el.find('.announcement_dialogue').hide();
                   if(this.isQuickMenuLoaded == true) return;
                   this.isQuickMenuLoaded = true;
                   
                   this.$el.find('.add_dialogue div').css('top','47%'); 
                   require(["common/quickadd"], function(quickadd) {
                         var mPage = new quickadd({page:that});
                        /// that.app.showLoading(false, that.$el.find('.add_dialogue'));
                          that.$el.find('.add_dialogue').html(mPage.$el);
                    });
               } 
              

            });
        });
