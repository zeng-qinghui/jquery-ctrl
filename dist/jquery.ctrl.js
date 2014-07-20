/*! jQuery Ctrl - v0.1.0 - 2014-07-20
* https://github.com/zengohm/jquery-ctrl
* Copyright (c) 2014 Zeng Ohm; Licensed MIT */
(function($) {

  // Collection method.
  $.fn.ctrl = function() {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.ctrl = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.ctrl.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.ctrl.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].ctrl = function(elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

}(jQuery));
