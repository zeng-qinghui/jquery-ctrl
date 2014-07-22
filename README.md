# jQuery Ctrl

A simple, lightweight jQuery plugin for model binding

## Download
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/zengohm/jquery-ctrl/master/dist/jquery.ctrl.min.js
[max]: https://raw.github.com/zengohm/jquery-ctrl/master/dist/jquery.ctrl.js

## Getting Started

In your web page:

```html
<div jq-ctrl="myCtrl">
  Hello, {{demo}}!
</div>
<script src="jquery.js"></script>
<script src="dist/jquery.ctrl.min.js"></script>
<script>
jQuery(function($) {
  $.ctrl('myCtrl',function(model){
    model.demo = 'World';
  });
});
</script>
```

You will see

```html
<div jq-ctrl="myCtrl">
  Hello, world!
</div>
```

## Installation
Include script after the jQuery library (unless you are packaging scripts somehow else):
```html
<script src="dist/jquery.ctrl.min.js"></script>
```
The plugin can also be loaded as AMD or CommonJS module.

## Usage

### String
```html
<div jq-ctrl="myCtrl">
  Hello, {{demo}}!
  <button title="{{btnTitle}}">Button</button>
</div>
<script>
jQuery(function($) {
  $.ctrl('myCtrl',function(model){
    model.demo = 'World';
    model.btnTitle = 'Click Me!';
  });
});
</script>
```

### If

### Repeat

### Options

### Src and href

### Style

### Disabled
