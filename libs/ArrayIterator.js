/**
 * Java style Array iterator featuring stack peek, shuffle, reverse and null iterator. (c) Christian Schlosrich 2012.
 * You may create a null iterator and add elements as you go
 * @param {Array} data to be iterated over (omitting this arg results in a null iterator)
 */
var ArrayIterator = function(data){

	if(!(this instanceof arguments.callee)){
		throw new Error('Constructor called as a function.');
	}

	/**
	 * If a data argument is passed but not of type Array throw an Error
	 */
	if(data && Object.prototype.toString.apply(data) !== '[object Array]'){
		throw new TypeError('ArrayIterator expected data type Array for argument \'data\'.');
	}

	// Assign the data or create a null iterator
	this.data = data || [];
	this.index = -1;
};

ArrayIterator.prototype = {

	/**
	 * Adds an element to the end of the iterator
	 * @param o
	 */
	push : function(o){
		this.data.push(o);
	},

	/**
	 * Adds an element to the given index of the iterator. Throws an exception if the index exceeds the current length
	 * @param o
	 * @param index
	 */
	insertAt : function(o, index){

		// Throwing an error if index exceeds current data length.
		// This is strictly not necessary but for an iterator it doesn't seem right to have 'holes' in the data
		if(index > this.data.length){
			throw new Error('Out of range ' + index);
		}

		this.data[index] = o;
	},

	/**
	 * Adds an element to the beginning of the iterator
	 * @param o
	 */
	unshift : function(o){
		this.data.unshift(o);
	},

	/**
	 * Removes the first element of the iteratior and returns that element
	 */
	shift : function(){
		return this.data.shift();
	},

	/**
	 * Removes the first element of the iterator and returns that element
	 */
	pop : function(){
		return this.data.pop();
	},

	/**
	 * Returns the next element (if any)
	 * @return {*}
	 */
	next : function(){
		if(this.hasNext()){
			return this.data[++this.index];
		}

		return null;
	},

	/**
	 * Returns the previous element (if any)
	 * @return {*}
	 */
	previous : function(){
		if(this.hasPrevious()){
			return this.data[--this.index];
		}

		return null;
	},

	/**
	 * Returns the first element
	 * @returns {null}
	 */
	first : function(){
		if(this.isNull()){
			return null;
		}

		this.reset();
		return this.next();
	},

	/**
	 * Returns the last element
	 * @returns {null}
	 */
	last : function(){
		if(this.isNull()){
			return null;
		}

		this.index = this.getSize() - 1;
		return this.data[this.index];
	},

	/**
	 * Returns the next element (if any) without mutation of the iterator
	 * @return {*}
	 */
	peekNext : function(){
		if(this.hasNext()){
			return this.data[this.index + 1];
		}

		return null;
	},

	/**
	 * Returns the previous element (if any) without mutation of the iterator
	 * @return {*}
	 */
	peekPrevious : function(){
		if(this.hasPrevious()){
			return this.data[this.index - 1];
		}

		return null;
	},

	/**
	 * Returns true if the iterator contains a next element (and is not a null iterator).
	 * @return {Boolean}
	 */
	hasNext : function(){
		if(this.isNull()){
			return false;
		}

		return this.index + 1 < this.data.length;
	},

	/**
	 * Returns true if the iterator contains a previous element (and is not a null iterator).
	 * @return {Boolean}
	 */
	hasPrevious : function(){
		if(this.isNull()){
			return false;
		}

		return this.index > 0;
	},

	/**
	 * Resets the iterator so next() returns the first element
	 * @return {void}
	 */
	reset : function(){
		this.index = -1;
		return this;
	},

	/**
	 * Returns the number of items contained
	 * @return {Number}
	 */
	getSize : function(){
		return this.data.length;
	},

	/**
	 * Returns true if the iterator does not contain any elements (aka null iterator)
	 * @return {Boolean}
	 */
	isNull : function(){
		return this.data.length === 0;
	},

	/**
	 * Clones the iterator but keeps the reference to the elements intact (aka shallow clone)
	 * @return {ArrayIterator}
	 */
	clone : function(){
		return new ArrayIterator(this.data);
	},

	/**
	 * Reverses the elements in the collection
	 * @return {ArrayIterator}
	 */
	reverse : function(){
		if(this.isNull()){
			return null;
		}

		this.data.reverse();
		return this;
	},

	/**
	 * Shuffles the elements in the collection
	 * @return {ArrayIterator}
	 */
	shuffle : function(){
		if(this.isNull()){
			return null;
		}

		var len = this.data.length;
		var i = len;

		while(i--) {
			var p = parseInt(Math.random() * len);
			var t = this.data[i];
			this.data[i] = this.data[p];
			this.data[p] = t;
		}

		return this;
	},

	/**
	 * Returns a String representation of the elements currently contained in the collection (for debugging purposes)
	 * @return {String}
	 */
	dump : function(){

		if(this.isNull()){
			return this.toString();
		}

		var res = this.toString() + '\n';

		for(var i = 0; i < this.data.length; i++){
			res += '\n' + this.data[i];
		}

		return res;
	},

	/**
	 * Returns a String represenation of the ArrayIterator
	 * @return {String}
	 */
	toString : function(){
		var res = '[ArrayIterator]';

		if(this.name){
			res += ' name: ' + this.name + ',';
		}

		res += ' size: ' + this.getSize() + ', index: ' + this.index + ', hasNext: ' + this.hasNext() + ', hasPrevious: ' + this.hasPrevious();
		return res;
	}
};