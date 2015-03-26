/* ======================================================
//
//   Prototype 拡張
//     IE8 は ECMAScript5 のメソッドが実装されていない。それらの機能の一部を補う。
//     各コードは MDN から拝借している。
//     - Array#indexOf
//     - Array#lastIndexOf
//     - Array#forEach
//     - Array#map
//     - Array#filter
//     - Array#some
//     - Array#every
//     - String#startsWith
//     - String#endsWith
//     - String#contains
//     - String#trim
//     - Function#bind
//
// ====================================================== */

!function() {


  /* ======================================================
  // Array
  // ------------------------------------------------------ */

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(aSearchElement, aFromIndex) {
      if (typeof aFromIndex != 'number') {
        aFromIndex = 0;
      } else if (aFromIndex < 0) {
        aFromIndex = this.length + aFromIndex;
      }
      for (var i = aFromIndex, n = this.length; i < n; i++) {
        if (this[i] === aSearchElement) {
          return i;
        }
      }
      return -1;
    }
  }

  if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(aSearchElement, aFromIndex) {
      if (typeof aFromIndex != 'number') {
        aFromIndex = this.length - 1;
      } else if (aFromIndex < 0) {
        aFromIndex = this.length + aFromIndex;
      }
      for (var i = aFromIndex; i >= 0; i--) {
        if (this[i] === aSearchElement) {
          return i;
        }
      }
      return -1;
    }
  }

  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(aCallback, aThisObject) {
      for (var i = 0, n = this.length; i < n; i++) {
        aCallback.call(aThisObject, this[i], i, this);
      }
    }
  }

  if (!Array.prototype.map) {
    Array.prototype.map = function(aCallback, aThisObject) {
      var ret = [];
      for (var i = 0, n = this.length; i < n; i++) {
        ret.push(aCallback.call(aThisObject, this[i], i, this));
      }
      return ret;
    }
  }

  if (!Array.prototype.filter) {
    Array.prototype.filter = function(aCallback, aThisObject) {
      var ret = [];
      for (var i = 0, n = this.length; i < n; i++) {
        if (aCallback.call(aThisObject, this[i], i, this)) {
          ret.push(this[i]);
        }
      }
      return ret;
    }
  }

  if (!Array.prototype.some) {
    Array.prototype.some = function(aCallback, aThisObject){
      for (var i = 0, n = this.length; i < n; i++) {
        if (aCallback.call(aThisObject, this[i], i, this)) return true;
      }
      return false;
    }
  }

  if (!Array.prototype.every) {
    Array.prototype.every = function(aCallback, aThisObject){
      for (var i = 0, n = this.length; i < n; i++) {
        if(!aCallback.call(aThisObject, this[i], i, this)) return false;
      }
      return true;
    }
  }


  /* ======================================================
  // String
  // ------------------------------------------------------ */

  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
    };
  }

  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
      position = position || this.length;
      position = position - searchString.length;
      var lastIndex = this.lastIndexOf(searchString);
      return lastIndex !== -1 && lastIndex === position;
    };
  }

  if (!String.prototype.contains) {
    String.prototype.contains = function (searchString, position) {
      return String.prototype.indexOf.call(this, searchString, position) !== -1;
    };
  }

  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g,'');
    };
  }


  /* ======================================================
  // Function
  // ------------------------------------------------------ */

  if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }
      var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
              ? this
              : oThis,
            aArgs.concat(Array.prototype.slice.call(arguments)));
        };
      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();
      return fBound;
    };
  }


}();
