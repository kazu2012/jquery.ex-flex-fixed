/*
 * 	exFlexFixed 0.1.0 - jQuery plugin
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
		c._offset = c.target.offset();
		c._margin = {
			top : parseInt(c.target.css('margin-top')),
			bottom : parseInt(c.target.css('margin-bottom'))
		}
		c._targetHeight = c.target.outerHeight();

		c._cont = c.container ? $(c.container) : o._getContainer();
		c._contBottom = c._cont.offset().top + c._cont.outerHeight();
		c._leftPos = (c.target.offset().left - parseInt(c.target.css('margin-left')))- c._cont.offset().left + 1;
		c._win = $(window);
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
			c._win.
				scroll(function(){
					var scrollTop = c._win.scrollTop();
					var viewDff = 0;
					if (c._win.height() < c._targetHeight){
						viewDff = c._targetHeight - c._win.height() + c._margin.top + c._margin.bottom;
					}
					var downTop = (c._offset.top - c._margin.top) - scrollTop;
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
					prevTop = nextTop;
					o._setLeft();
				}).
				resize(function(){
					o._setLeft();
				});
		},
		_setLeft : function(){
			var o = this, c = o.config;
			c.target.css('left',c._cont.offset().left + c._leftPos - c._win.scrollLeft());
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

