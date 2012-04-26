/*
 * 	exDropDown 0.1.3 - jQuery plugin
 *	written by Cyokodog	
 *
 *	Copyright (c) 2011 Cyokodog (http://d.hatena.ne.jp/cyokodog/)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
(function($){

	var API = function(api){
		var api = $(api),api0 = api[0];
		for(var name in api0)
			(function(name){
				if($.isFunction( api0[name] ))
					api[ name ] = (/^get[^a-z]/.test(name)) ?
						function(){
							return api0[name].apply(api0,arguments);
						} : 
						function(){
							var arg = arguments;
							api.each(function(idx){
								var apix = api[idx];
								apix[name].apply(apix,arg);
							})
							return api;
						}
			})(name);
		return api;
	}

	$.ex = $.ex || {};

	$.ex.dropDown = function(idx , targets , option){
		var o = this,
		c = o.config = $.extend({} , $.ex.dropDown.defaults , option);
		c.targets = targets;
		c.target = c.targets.eq(idx);
		c.index = idx;

		if (c.target.css('position') == 'fixed') {
			c.position = 'fixed';
		}

		c.target.addClass('ex-drop-down');
		if (c.horizonRootMenu) c.target.addClass('ex-dr-horizon');
		if (c.rootStyle) c.target.addClass(c.rootStyle);

		c.pack = $('<div class="ex-dr-pack"/>').appendTo('body');

		o._initContext(c.target , c.pack);

		$(document).click(function(){
			c.pack.hide();
		});

		c.target.add(c.pack).bind('mouseover.ex-dr',function(evt){
			if (c.hideTimer){
				clearTimeout(c.hideTimer);
			}
			if (c.showDelay) {
				var target = $(evt.target);
				var node = target.parents('li.ex-dr').eq(0);
				if (!node.size()) return;
				var timer = setTimeout(function(){
					o.showContext(node);
				},c.showDelay);
				node.one('mouseout',function(){
					clearTimeout(timer);
				});
			}
		}).bind('mouseout.ex-dr',function(evt){
			if (c.hideDelay) {
				c.hideTimer = setTimeout(function(){
					c.pack.hide();
				}, c.hideDelay);
			}
		});
	}
	$.extend($.ex.dropDown.prototype, {
		_initContext : function(context , pack){
			var o = this, c = o.config;
			if (context.hasClass('ex-dr')) return o;
			var isRoot = context.hasClass('ex-drop-down');
			context.addClass('ex-dr');
			context.data('ex-dr-pack' , pack);

			context.find('> li').each(function(){
				var node = $(this);	
				node.addClass('ex-dr');
				var myContext = node.find('> ul');
				if (myContext.size()) {
					node.wrapInner('<span class="ex-dr-label"/>');
					node.addClass('ex-dr-folder').append('<span class="ex-dr-arrow">' + c.arrowText + '</span>');
					myContext.css('margin',0);
					if (c.contextStyle) myContext.addClass(c.contextStyle);
					var myPack = myContext.wrap('<div class="ex-dr-pack"/>').parent();
					pack.append(myPack);
					myPack.hide();
					node.data('ex-dr-pack', myPack);
				}
				if(!node.find('a').size()) node.wrapInner('<a href="javascript:void(0)"/>');
				node.click(function(){
					node.find('a').blur();
					return !o.showContext(node);

				});
			});
			if (!isRoot) {
				context.show().css('position',c.position);
				context.find('> li > ul').hide();
				pack.show();
				var width = context.width();
				context.width(width < c.minWidth ? c.minWidth : width);
			}
			context.find('> li > a').each(function(){
				var link = $(this), arrow = link.find('span.ex-dr-arrow');
				if (c.horizonRootMenu && isRoot) {
					link.css({
						display:'inline-block',
						zoom:1,
						width:c.horizonListWidth == 'auto' ? link.width() : c.horizonListWidth
					});
				}
				else{
					link.css({
						display:'block',
						zoom:1
					});
				}
				if (arrow.size()) {
					var pos = arrow.position();
					arrow
						.before(
							arrow.clone().removeClass('ex-dr-arrow').addClass('ex-dr-arrow-dummy').css({
								'visibility':'hidden'
							})
						)
						.css({
							position:'absolute',
							top:pos.top,
							right:4
						});
				}
			});
			return o;
		},
		_showContext : function(node){
			var o = this, c = o.config;
			var myPack = node.data('ex-dr-pack');
			if (!myPack) return false;
			if (!myPack.is(':hidden')) return true;
			var myContext = myPack.find('> ul');
			o._initContext(myContext , myPack);
			myPack.parent().show().find('> div').hide();
			myPack.find('> div').hide();			
			myPack.show();			

			myContext.hide();

			var win = {
				height : $(window).height(),
				width : $(window).width()
			}
			var offset = node.offset();
			if (c.position == 'fixed') {
				offset.top = offset.top - $(window).scrollTop();
				offset.left = offset.left - $(window).scrollLeft();
			}
			else {
				win.height = win.height + $(window).scrollTop();
				win.width = win.width + $(window).scrollLeft();
			}

			if (c.horizonRootMenu && node.parent().hasClass('ex-drop-down')) {
				myContext.css({
					top : offset.top + node.outerHeight(),
					left : offset.left
				});
			}
			else{
				var css = {
					top : offset.top + c.marginTop,
					left : offset.left + node.outerWidth() + c.marginLeft
				};
				var over = css.top + myContext.outerHeight() - win.height;
				if (over > 0) css.top -= over;
				var over = css.left + myContext.outerWidth() -win.width;
				if (over > 0) css.left = offset.left - node.outerWidth() - c.marginLeft;
				myContext.css({
					top : css.top,
					left : css.left
				});
			}
			myContext.hide().slideDown('fast');

			return true;
		},
		showContext : function(node){
			var o = this, c = o.config;
			if(!o._showContext(node)){
				o.hideContext(node);
				return false;
			}
			return true;
		},
		hideContext : function(node){
			var o = this, c = o.config;
			var ret = false;
			node.siblings().each(function(){
				var myPack = $(this).data('ex-dr-pack');
				if (myPack) myPack.hide();
				ret = true;
			});
			return ret;
		}
	});
	$.ex.dropDown.defaults = {
		api : false,
		marginLeft : -4,
		marginTop : 4,
		horizonRootMenu : false,
		horizonListWidth : 'auto',
		showDelay : 500,
		hideDelay : 1500,
		rootStyle : 'ex-dr-root',
		contextStyle : 'ex-dr-context',
		minWidth : 100,
		arrowText : '&raquo;',
		position : 'absolute'
	}
	$.fn.exDropDown = function(option){
		var targets = this,api = [];
		targets.each(function(idx) {
			var target = targets.eq(idx);
			var obj = target.data('ex-drop-down') || new $.ex.dropDown( idx , targets , option);
			api.push(obj);
			target.data('ex-drop-down',obj);
		});
		return option && option.api ? API(api) : targets;
	}
})(jQuery);
