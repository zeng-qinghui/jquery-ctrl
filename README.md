# jQuery Ctrl [![Build Status](https://travis-ci.org/zengohm/jquery-ctrl.svg?branch=master)](https://travis-ci.org/zengohm/jquery-ctrl)

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

### Value
```html
<div jq-ctrl="myCtrl">
  Hello, {{demo}}!
  <input type="text" jq-model="demo" />
  <button title="{{btn.message}}">{{btn.show}}</button>
</div>
<script>
jQuery(function($) {
  $.ctrl('myCtrl',function(model){
    model.demo = 'World';
    model.btn = {message:'Click',show:'Click Me!'};
  });
});
</script>
```

You will get

```html
<div jq-ctrl="myCtrl">
  Hello, World!
  <input type="text" jq-model="demo" value="World" />
  <button title="Click">Click Me!</button>
</div>
```

If you type in the input, the word 'World' will change on the same time.

### If
```html
<div jq-ctrl="myCtrl">
  I feel
  <span jq-if="happyPoint>5">good</span>
  <span jq-if="happyPoint<=5">not good</span>
</div>
<script>
jQuery(function($) {
  $.ctrl('myCtrl',function(model){
    model.happyPoint = 7;
  });
});
</script>
```

Yow will get

```html
<div jq-ctrl="myCtrl">
    I feel
    <span jq-if="fine">good</span>
</div>
```

### Repeat
```html
<div jq-ctrl="myCtrl">
    <ul>
        <li jq-repeat="num in numbers">{{num}}</li>
    </ul>
    <ul>
        <li jq-repeat="game in games">{{game.id}}:{{game.name}}</li>
    </ul>
    <ul>
        <li jq-repeat="continent in continents">
            <dl>
                <dt>{{continent.name}}</dt>
                <dd jq-repeat="country in continent.countries">{{country}}</dd>
            </dl>
        </li>
    </ul>
</div>
<script>
jQuery(function($) {
  $.ctrl('myCtrl',function(model){
    model.numbers = [0,1,2,3];
    model.games = [{id:'game01',name:'Football'},{id:'game02',name:'Basketball'}];
    model.continents = [
        {name:'Asia',countries:['China','Pakistan']},
        {name:'European',countries:['French','Germany']}
    ];
  });
});
</script>
```

You will get

```html
<div jq-ctrl="myCtrl">
    <ul>
        <li>0</li>
        <li>1</li>
        <li>2</li>
        <li>3</li>
    </ul>
    <ul>
        <li>game01:Football</li>
        <li>game02:Basketball</li>
    </ul>
    <ul>
        <li>
            <dl>
                <dt>Asia</dt>
                <dd>China</dd>
                <dd>Pakistan</dd>
            </dl>
        </li>
        <li>
            <dl>
                <dt>European</dt>
                <dd>French</dd>
                <dd>Germany</dd>
            </dl>
        </li>
    </ul>
</div>
```


### Options
```html
<div jq-ctrl="myCtrl">
    <dl>
        <dt>Array</dt>
        <dd><select jq-model="number" jq-options="numbers"></select></dd>
        <dd>The number selected is {{number}}.</dd>
        
        <dt>Object</dt>
        <dd><select jq-model="game" jq-options="id,name in games"></select></dd>
        <dd>The game selected is {{game}}.</dd>
        
        <dt>Group</dt>
        <dd><select jq-model="country" jq-options="countries"></select></dd>
        <dd>The country selected is {{country}}.</dd>
    </dl>
</div>
<script>
jQuery(function($) {
  $.ctrl('myCtrl',function(model){
    model.numbers = [0,1,2,3];
    model.number = 2;
    model.games = [
	{'id':'game01','name':'Football'},
	{'id':'game02','name':'Basketball'}
    ];
    model.game = 'game02';
    model.countries = [
        {'Asia':['China','Pakistan']},
        {'European':['French','Germany']}
    ];
    model.country = 'China';
  });
});
</script>
```

You will get
```html
<div jq-ctrl="myCtrl">
    <dl>
        <dt>Array</dt>
        <dd>
            <select jq-model="number">
                <option>0</option>
                <option>1</option>
                <option selected="selected">2</option>
                <option>3</option>
            </select>
        </dd>
        <dd>The number selected is 2.</dd>
        
        <dt>Object</dt>
        <dd>
            <select jq-model="game">
                <option value="game01">Football</option>
                <option value="game02" selected="selected">Basketball</option>
            </select>
         </dd>
        <dd>The game selected is game02.</dd>
        
        <dt>Group</dt>
        <dd>
            <select jq-model="country">
                <optgroup label="Asia">
                    <option selected="selected">China</option>
                    <option>Pakistan</option>
                </optgroup>
                <optgroup label="European">
                    <option>French</option>
                    <option>Germany</option>
                </optgroup>
            </select>
        </dd>
        <dd>The country selected is China.</dd>
    </dl>
</div>
```

If you change the select, the word will change on the same time.


### Src / href / Disabled
```html
<div jq-ctrl="myCtrl">
    <a jq-href="{{jqueryLink}}">
        <img jq-src="{{jqueryImage}}" />
    </a>
    <button jq-disabled="btnDisabled">You cannot click me</button>
</div>
<script>
jQuery(function($) {
  $.ctrl('myCtrl',function(model){
    model.jqueryLink = 'http://jquery.com';
    model.jqueryImage = 'http://jquery.com/jquery-wp-content/themes/jquery/images/logo-jquery.png';
    model.btnDisabled = true;
  });
});
</script>
```

You will get

```html
<div jq-ctrl="myCtrl">
    <a jq-href="{{jqueryLink}}" href="http://jquery.com">
        <img jq-src="{{jqueryImage}}" src="http://jquery.com/jquery-wp-content/themes/jquery/images/logo-jquery.png">
    </a>
    <button jq-disabled="btnDisabled" disabled="disabled">You cannot click me</button>
</div>
```

### Style
```html
<div jq-ctrl="myCtrl">
    <span jq-style="style">jQuery.ctrl</span>
</div>
<script>
jQuery(function($) {
  $.ctrl('myCtrl',function(model){
    model.style = {color:'#0f0'};
  });
});
</script>
```

You will get

```html
<div jq-ctrl="myCtrl">
    <span jq-style="style" style="color:#0f0">jQuery.ctrl</span>
</div>
```

### Event
Support click, keypress, keyup, keydown, dbclick, mousedown, mouseup, onmouseover, onmousemove, onmouseout

```html
<div jq-ctrl="myCtrl">
    Click Times: {{clickTimes}}
    <button jq-click="click()">Click Me</button>
</div>
<script>
jQuery(function($) {
  $.ctrl('myCtrl',function(model){
    model.clickTimes = 0;
    model.click = function(){
        model.clickTimes++;
    };
  });
});
</script>
```

You will get
```html
<div jq-ctrl="myCtrl">
    Click Times: 0
    <button jq-click="click()">Click Me</button>
</div>
```

The count will plus 1 when you click the button.

