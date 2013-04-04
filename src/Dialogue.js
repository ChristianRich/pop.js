/**
 * @param el
 * @param data
 * @constructor
 */
Pop.Dialogue = function(el, data){
	"use strict";

	EventDispatcher.call(this);

	this.el = el;
	this.data = data || null;

	var self = this;

	self.open = function(){

		if(self.isOpen()){
			return;
		}

		Pop.removeClass(el, Pop.CLASS_HIDDEN);
		Pop.addClass(el, Pop.CLASS_VISIBLE);

		self.dispatchEvent({
			type : 'open',
			data : self.data,
			currentTarget : self.el
		});
	};

	self.close = function(){

		if(!self.isOpen()){
			return;
		}

		Pop.removeClass(el, Pop.CLASS_VISIBLE);
		Pop.addClass(el,Pop.CLASS_HIDDEN);

		self.dispatchEvent({
			type : 'close',
			data : self.data,
			currentTarget : self.el
		});
	};

	self.isOpen = function(){
		return Pop.hasClass(el, Pop.CLASS_VISIBLE);
	};

	self.toString = function(){
		return '[Object Dialogue] ' + el.className;
	}
};