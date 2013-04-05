/**
 * Author : Christian Schlosrich
 * http://www.github.com/ChristianDen/pop.js
 */
;(function(window){

	'use strict';

	/**
	 * Create a new instance of Pop
	 * @param options Optional parameters for defining css classes for visible and hidden dialogues.
	 * @constructor
	 */
	var Pop = function(options){

		/**
		 * INSTANCE PROPERTIES
		 */
		var o = options || {},
			current,
			itr,
			isWizard = false,
			self = this;

		/**
		 * STATIC PROPERTIES
		 */
		Pop.VERSION = '1.0';
		Pop.NAME = 'Pop.js';
		Pop.CLASS_VISIBLE = o.classVisible || 'visible';
		Pop.CLASS_HIDDEN = o.classHidden || 'hidden';

		EventDispatcher.call(this);

		/**
		* INSTANCE METHODS
		*/

		/**
		 * Opens a dialogue based on element or id
		 * @param elementOrId
		 * @param data
		 */
		self.open = function(elementOrId, data){
			self.close();

			current = createDialogue(elementOrId, data);
			current.open();
		};

		/**
		 * Closes the current open dialogue (if any)
		 */
		self.close = function(){

			if(!current){
				return;
			}

			isWizard = false;
			current.close();
			current = null;
		};

		/**
		 * Adds dialogues into a queue so we can display them sequentially using next() and previous();
		 * @param elementOrId
		 * @param data
		 */

		self.add = function(elementOrId, data){

			if(!itr){
				itr = new ArrayIterator();
			}

			itr.push(createDialogue(elementOrId, data));
		};

		/**
		 * Starts a series of keyboard controlled wizard like dialogues if at least two have been added using the add() method
		 */
		self.start = function(){

			if(!itr){
				return;
			}

			self.close();
			isWizard = true;

			itr.reset();
			current = itr.next();
			current.open();
		};

		/**
		 * Progresses to the next dialogue (if any)
		 */
		self.next = function(){

			if(!isWizard || !itr.hasNext()){
				return;
			}

			current.close();
			current = itr.next();
			current.open();
		};

		/**
		 * Progresses to the previous dialogue (if any)
		 */
		self.previous = function(){

			if(!isWizard || !itr.hasPrevious()){
				return;
			}

			current.close();
			current = itr.previous();
			current.open();
		};

		/**
		 * Progresses to the first dialogue (if any)
		 */
		self.first = function(){

			if(!isWizard || itr.getSize() == 1){
				return;
			}

			current.close();
			current = itr.first();
			current.open();
		};

		/**
		 * Progresses to the last dialogue (if any)
		 */
		self.last = function(){

			if(!isWizard || itr.getSize() == 1){
				return;
			}

			current.close();
			current = itr.last();
			current.open();
		};

		/**
		 * Handling keyboard events
		 * @param e
		 */
		var keyDownHandler = function(e){

			switch(e.keyCode){

				// Esc close any open dialogue
				case 27:
					self.close();
				break;

				// up
				case 38:
					self.first();
				break;

				// dn
				case 40:
					self.last();
				break;

				// left
				case 37:
					self.previous();
				break;

				// right
				case 39:
					self.next();
				break;
			}
		};

		var dialogOpenHandler = function(e){
			self.dispatchEvent(self.clone(e));
		};

		var dialogCloseHandler = function(e){
			self.dispatchEvent(self.clone(e));
		};

		/**
		 * Create a new instance of a Pop.Dialogue
		 * @param elementOrId
		 * @param data
		 * @returns {Pop.Dialogue}
		 */
		var createDialogue = function(elementOrId, data){

			if(!elementOrId){
				throw new Error('Too few arguments.');
			}

			var el = Pop.getTarget(elementOrId);

			var d = new Pop.Dialogue(el, data || null);
			d.addEventListener('open', dialogOpenHandler);
			d.addEventListener('close', dialogCloseHandler);
			return d;
		};

		window.addEventListener('keydown', keyDownHandler, false);
	};

	/**
	* STATIC METHODS
	*/

	/**
	 * Adds a class to an element
	 * @param element
	 * @param className
	 */
	Pop.addClass = function(element, className) {

		// Using HTML5 classList API - if available
		if(!!element.classList){
			element.classList.add(className);
			return;
		}

		// Fallback
		className = className.replace(/(^\s+|\s+$)/g, '');
		element.className = element.className.replace(/(^\s+|\s+$)/g, '');
		element.className += ' ' + className;
	};

	/**
	 * Removes a class from an element
	 * @param element
	 * @param className
	 */
	Pop.removeClass = function(element, className){

		// Using HTML5 classList API - if available
		if(!!element.classList){
			element.classList.remove(className);
			return;
		}

		// Fallback
		var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
		element.className = element.className.replace(reg, ' ');
		element.className = element.className.replace(/(^\s+|\s+$)/g, '');
	};

	/**
	 * Returns true if element contains supplied class
	 * @param element
	 * @param className
	 * @returns {boolean}
	 */
	Pop.hasClass = function(element, className){
		// Using HTML5 classList API - if available
		if(!!element.classList){
			return element.classList.contains(className);
		}

		// Fallback
		return !!element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	};

	/**
	 * Identifies the element or id
	 * @param target
	 * @returns {*}
	 */
	Pop.getTarget = function(target){

		if(!target){
			throw new Error(Pop.NAME + ': too few arguments.');
		}

		var el;

		/**
		 * Checking if target is a String id
		 */
		if(Object.prototype.toString.apply(target)  === '[object String]'){
			if(!!document.querySelector){
				el = document.querySelector(target);
			} else{
				el = document.getElementById(target);
			}
		} else if('nodeType' in target){  // Checking if target is an HTMLElement
			el = target;
		}

		if(!el){
			throw new Error(Pop.NAME + ': unknown element ' + target);
		}

		return el;
	};

	// Exposing Pop to global scope
	window.Pop = Pop;

})(window);