/*
 * 	Ex Flex Fixed 0.1.2 - jQuery plugin
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
	$.ex = $.ex || {};

	$.ex.flexFixed = function(idx , targets , option){
		var o = this,
		c = o.config = $.extend({} , $.ex.flexFixed.defaults , option);
		c.targets = targets;
		c.target = c.targets.eq(idx);
		c.index = idx;
		c.target.css('position','fixed');
		c._win = $(window);
		c._baseTop = c.target.offset().top - c._win.scrollTop();
		c._margin = {
			top : parseInt(c.target.css('margin-top')) || 0,
			bottom : parseInt(c.target.css('margin-bottom')) || 0
		}
		c._targetHeight = c.target.outerHeight();
		c._cont = c.container ? $(c.container) : o._getContainer();
		c._contBottom = c._cont.offset().top + c._cont.outerHeight();
		c._baseLeft = (c.target.offset().left - parseInt(c.target.css('margin-left')))- c._cont.offset().left - c._win.scrollLeft();
		o._setEvent();
	}
	$.extend($.ex.flexFixed.prototype, {
		_getContainer : function(){
			var o = this, c = o.config;
			var cont;
			var parents = c.target.parents()
			parents.each(function(idx){
				if (parents.eq(idx).outerHeight() > c._targetHeight + c._margin.top + c._margin.bottom) {
					cont = parents.eq(idx);
					return false;
				}
			});
			return cont ? cont : $('body');
		},
		_setEvent : function(){
			var o = this, c = o.config;
			var nextTop = prevTop = 0;
			var adjustPosition = function(){
				var scrollTop = c._win.scrollTop();
				var viewDff = 0;
				if (c._win.height() < c._targetHeight){
					viewDff = c._targetHeight - c._win.height() + c._margin.top + c._margin.bottom;
				}
				var downTop = (c._baseTop - c._margin.top) - scrollTop;
				if (downTop + viewDff >= 0) {
					nextTop = downTop;
				}
				else {
					var bottomTop = c._contBottom - (scrollTop + c._targetHeight + c._margin.top + c._margin.bottom);
					if (bottomTop + viewDff <= 0) {
						nextTop = bottomTop;
					}
					else {
						nextTop = - viewDff;
					}
				}
				if (prevTop != nextTop) {
					c.target.css('top',nextTop);
				}
					c.target.css('top',nextTop);
				prevTop = nextTop;
				o._setLeft();
			}
			adjustPosition();
			c._win.
				scroll(function(){
					adjustPosition();
				}).
				resize(function(){
					o._setLeft();
				});
		},
		_setLeft : function(){
			var o = this, c = o.config;
			c.target.css('left',c._cont.offset().left + c._baseLeft - c._win.scrollLeft());
		}

	});
	$.ex.flexFixed.defaults = {
		container : null
	}
	$.fn.exFlexFixed = function(option){
		var targets = this;
		targets.each(function(idx) {
			var target = targets.eq(idx);
			var obj = target.data('ex-flex-fixed') || new $.ex.flexFixed( idx , targets , option);
			target.data('ex-flex-fixed',obj);
		});
		return targets;
	}

})(jQuery);

