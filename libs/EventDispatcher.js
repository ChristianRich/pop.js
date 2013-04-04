/**
 * @author mrdoob / http://mrdoob.com/
 */

var EventDispatcher = function () {

	var listeners = {};

	this.addEventListener = function ( type, listener ) {
		if ( listeners[ type ] === undefined ) {
			listeners[ type ] = [];
		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {
			listeners[ type ].push( listener );
		}
	};
	
	this.hasEventListener = function( type ){
		if(!listeners[ type ]){
			return false;
		}

		return !!listeners[ type ].length;
	};
	
	this.removeEventListener = function ( type, listener ) {
		if(!this.hasEventListener( type )){
			return;
		}
		
		var index = listeners[ type ].indexOf( listener );

		if ( index !== - 1 ) {
			listeners[ type ].splice( index, 1 );
		}
	};

	this.dispatchEvent = function ( event ) {
		var listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;

			for ( var i = 0, l = listenerArray.length; i < l; i ++ ) {
				listenerArray[ i ].call( this, event );
			}
		}
	};

	this.clone = function(event){
		var n = {};
		for(var key in event) n[key] = event[key];
		return n;
	};
};