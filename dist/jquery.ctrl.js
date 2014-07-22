/*! jQuery Ctrl - v0.1.0 - 2014-07-23
* https://github.com/zengohm/jquery-ctrl
* Copyright (c) 2014 Zeng Ohm; Licensed MIT */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var NODE_STATUS_NORMAL = 0;
    var NODE_STATUS_COVER = 1;
    var NODE_STATUS_LAST = 2;

    var bindingTypes = {};

    var createCtrl = function(modelData,$element){
      return {
          model:new ModelObject(modelData),
          ctrl: $element
      };
    };

    // Static method.
    $.ctrl = function (ctrlName, init) {
        var modelData = {};
        init(modelData);
        var thisCtrl = createCtrl(modelData,$('[jq-ctrl="' + ctrlName + '"]'));
        bindingInit(thisCtrl);
    };

    var bindingInit = function (thisCtrl) {
        thisCtrl.bindings = [];
        thisCtrl.onChangeTasks = [];
        var elementArray = [];
        var initElement = function ($element) {
            $element.contents().andSelf().each(function () {
                if(elementArray.indexOf(this) === -1) {
                    elementArray.push(this);
                    var node_status = NODE_STATUS_NORMAL;
                    for (var type in bindingTypes) {
                        node_status |= bindingTypes[type](this, thisCtrl.model, thisCtrl.onChangeTasks);
                        if (node_status & NODE_STATUS_LAST) {
                            break;
                        }
                    }
                    if(!(node_status & NODE_STATUS_COVER)) {
                        initElement($(this));
                    }
                }
            });
        };
        initElement(thisCtrl.ctrl);
    };


    bindingTypes.text = function(node,model,onChangeTasks){
        if(node.nodeName.substr(0,1)==='#' && node.data.match(/\{\{[\w\.]+\}\}/)){
            var template = node.data;
            onChangeTasks.push(function(){
                node.data = template.replace(/\{\{([\w\.]+)\}\}/g, function (match, key) {
                    return model.get(key);
                });
            });
            onChangeTasks[onChangeTasks.length-1]();
            return NODE_STATUS_COVER | NODE_STATUS_LAST;
        }
        return NODE_STATUS_NORMAL;
    };
    bindingTypes.model = function(element,model,onChangeTasks){
        var modelName;
        if(element.getAttribute && (modelName = element.getAttribute('jq-model'))){
            onChangeTasks.push(function(srcElement){
                if(element === srcElement){
                    return false;
                }
                $(element).val(model.get(modelName));
            });
            onChangeTasks[onChangeTasks.length-1]();
            $(element).bind('keypress change keyup',function(){
                model.set(modelName,$(this).val());
                for(var i in onChangeTasks){
                    onChangeTasks[i](this);
                }
            });
            return NODE_STATUS_COVER;
        }
        return NODE_STATUS_NORMAL;
    };
    bindingTypes.jqAttribute = function(element,model,onChangeTasks){
        if(typeof(element.getAttribute)!=='function'){
            return NODE_STATUS_NORMAL;
        }
        var allowAttributes = ['jq-src','jq-href'];
        var onChangeDelegate = function(element,attribute,template) {
            onChangeTasks.push(function(){
                element.setAttribute(attribute.substr(3),template.replace(/\{\{([\w\.]+)\}\}/g, function (match, key) {
                    return model.get(key);
                }));
            });
        };
        for (var i = 0; i < allowAttributes.length; i++) {
            var template;
            var attribute = allowAttributes[i];
            if(template = element.getAttribute(allowAttributes[i])){
                onChangeDelegate(element,attribute,template);
                onChangeTasks[onChangeTasks.length-1]();
            }
        }
        return NODE_STATUS_NORMAL;
    };
    bindingTypes.otherAttribute = function(element,model,onChangeTasks){
        if(typeof(element.getAttribute)!=='function'){
            return NODE_STATUS_NORMAL;
        }
        var attributes = element.attributes;

        var onChangeDelegate = function(element,attribute,template) {
            onChangeTasks.push(function () {
                element.setAttribute(attribute, template.replace(/\{\{([\w\.]+)\}\}/g, function (match, key) {
                    return model.get(key);
                }));
            });
        };

        for (var i = 0; i < attributes.length; i++) {
            if(attributes[i].name.substr(0,3)==='jq-'){
                continue;
            }
            var template = attributes[i].value;
            var attribute = attributes[i].name;
            if(template.match(/\{\{([\w\.]+)\}\}/)){
                onChangeDelegate(element,attribute,template);
                onChangeTasks[onChangeTasks.length-1](null);
            }
        }
        return NODE_STATUS_NORMAL;
    };
    bindingTypes.jqStyle = function(element,model,onChangeTasks){
        var modelName;
        if(typeof(element.getAttribute)!=='function' || !(modelName = element.getAttribute('jq-style'))){
            return NODE_STATUS_NORMAL;
        }
        onChangeTasks.push(function () {
            $(element).css(model.get(modelName));
        });
        onChangeTasks[onChangeTasks.length-1](null);
        return NODE_STATUS_NORMAL;
    };
    bindingTypes.jqDisabled = function(element,model,onChangeTasks){
        var modelName;
        if(typeof(element.getAttribute)!=='function' || !(modelName = element.getAttribute('jq-disabled'))){
            return NODE_STATUS_NORMAL;
        }
        onChangeTasks.push(function () {
            $(element).attr('disabled',model.get(modelName));
        });
        onChangeTasks[onChangeTasks.length-1](null);
        return NODE_STATUS_NORMAL;
    };
    bindingTypes.jqSelect = function(element,model,onChangeTasks){
        var query;
        if(element.nodeName!=='SELECT' || !(query = element.getAttribute('jq-options'))){
            return NODE_STATUS_NORMAL;
        }
        var match;
        var keyName,valueName,listName;
        if(match = query.match(/(\w+)/)){
            keyName = null;
            valueName = null;
            listName = match[1];
        }else if(match = query.match(/(\w+),(\w)+\s+in\s+(\w+)/)){
            keyName = match[1];
            valueName = match[2];
            listName = match[3];
        }else{
            return NODE_STATUS_NORMAL;
        }

        onChangeTasks.push(function(){
            $(element).empty();
            var modelName = element.getAttribute('jq-model');
            var list = model.get(listName);
            if(list && typeof(list[0])==='object' && Object.keys(list[0]).length===1 && list[0][Object.keys(list[0])[0]]  instanceof Array ) {
                for (var g in list){
                    var $group = $('<optgroup></optgroup>');
                    var groupKey = Object.keys(list[g])[0];
                    $group.attr('label',groupKey);
                    var subList = list[g][groupKey];
                    if(keyName === null){
                        for(var gi in subList){
                            $group.append('<option value="'+subList[gi]+'">' + subList[gi] + '</option>');
                        }
                    }else{
                        for (var gk in subList) {
                            $group.append('<option value="' + subList[gk][keyName] + '">' + subList[gk]['valueName'] + '</option>');
                        }
                    }
                    $(element).append($group);
                }
            }else{
                if(keyName === null) {
                    for(var i in list){
                        $(element).append('<option>' + list[i] + '</option>');
                    }
                }else{
                    for (var k in list) {
                        $(element).append('<option value="' + list[k][keyName] + '">' + list[k]['valueName'] + '</option>');
                    }
                }
            }
            $(element).val(model.get(modelName));
        });
        onChangeTasks[onChangeTasks.length-1](null);
        $(element).removeAttr('jq-options');
        return NODE_STATUS_COVER;
    };
    bindingTypes.jqIf = function(element,model,onChangeTasks){
        var query;
        if(typeof(element.getAttribute)!=='function' || !(query = element.getAttribute('jq-if'))){
            return NODE_STATUS_NORMAL;
        }

        var startComment = document.createComment('jq-if '+query+' start');
        var endComment = document.createComment('jq-if '+query+' end');
        var parent = $(element).parent()[0];
        parent.insertBefore(startComment,element);
        if(element.nextElementSibling){
            parent.insertBefore(endComment,element.nextElementSibling);
        }else{
            parent.appendChild(endComment);
        }
        onChangeTasks.push(function(){
            $(element).remove();
            if(model.get(query)){
                $(element).insertAfter(startComment);
            }
        });
        onChangeTasks[onChangeTasks.length-1](null);
        return NODE_STATUS_NORMAL;
    };

    bindingTypes.jqRepeat = function(element,model,onChangeTasks){
        var query, match;
        if(typeof(element.getAttribute)!=='function' || !(query = element.getAttribute('jq-repeat')) || !(match = query.match(/(\w+)\s+in\s+([\w\.]+)/))){
            return NODE_STATUS_NORMAL;
        }
        var modelName = match[2];
        var rowName = match[1];
        var startComment = document.createComment('jq-if '+query+' start');
        var endComment = document.createComment('jq-if '+query+' end');
        var template = $(element).prop('outerHTML');
        var parent = $(element).parent()[0];
        parent.insertBefore(startComment,element);
        if(element.nextElementSibling){
            parent.insertBefore(endComment,element.nextElementSibling);
        }else{
            parent.appendChild(endComment);
        }

        var repeatRowDelegate = function(subModel){
            var $row = $(template.replace(/\{\{([\w\.]+)\}\}/g,function(match,key){
                return subModel.get(key)?subModel.get(key):match;
            }));
            $row.removeAttr('jq-repeat');
            var subCtrl = createCtrl(subModel.getData(),$row);
            bindingInit(subCtrl);
            return $row;
        };


        onChangeTasks.push(function(){
            var currentNode = startComment.nextSibling;
            while(currentNode !== endComment){
                currentNode = currentNode.nextSibling;
                $(currentNode).prev().remove();
            }
            var list = model.get(modelName);
            for(var i in list){
                var subModel = model.clone();
                subModel.getData()[rowName] = list[i];
                repeatRowDelegate(subModel).insertAfter(startComment);
            }

        });
        onChangeTasks[onChangeTasks.length-1](null);
        return NODE_STATUS_COVER;
    };

    var ModelObject = function(data){
        if(typeof(data) === 'undefined' || !data){
            data = {};
        }
        var model = data;

        this.set = function(key,value){
            var keys = key.split('.');
            var lastKey = keys.pop();
            var current = model;
            for(var i in keys){
                if(typeof(current[keys[i]]) === 'undefined'){
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            current[lastKey] = value;
            return value;
        };

        this.get = function(key){
            var keys = key.split('.');
            var current = model;
            for(var i in keys){
                current = current[keys[i]];
                if(!current){
                    return null;
                }
            }
            return current;
        };

        this.subModel = function(key){
            return new ModelObject(this.get(key));
        };

        this.getData = function(){
            return model;
        };

        this.clone = function(){
            return new ModelObject($.extend(true,{},model));
        };
    };
}));
