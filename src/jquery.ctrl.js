/*
 * ctrl
 * https://github.com/zengohm/jquery-ctrl
 *
 * Copyright (c) 2014 Zeng Ohm
 * Licensed under the MIT license.
 */

(function ($) {
    var NODE_STATUS_NORMAL = 0;
    var NODE_STATUS_COVER = 1;
    var NODE_STATUS_LAST = 2;

    var modules = {};

    var bindingTypes = {};

    // Static method.
    $.ctrl = function (ctrlName, init) {
        var thisCtrl = {
            model: {},
            init: init,
            ctrl: $('[jq-ctrl="' + ctrlName + '"]')
        };
        modules[ctrlName] = thisCtrl;
        thisCtrl.init(thisCtrl.model);
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
                    initElement($(this));
                }
            });
        };
        initElement(thisCtrl.ctrl);
    };


    bindingTypes.text = function(node,model,onChangeTasks){
        if(node.nodeName.substr(0,1)==='#' && node.data.match(/\{\{\w+\}\}/)){
            var template = node.data;
            onChangeTasks.push(function(){
                node.data = template.replace(/\{\{(\w+)\}\}/g, function (match, key) {
                    return model[key];
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
                $(element).val(model[modelName]);
            });
            onChangeTasks[onChangeTasks.length-1]();
            $(element).bind('keypress change keyup',function(){
                model[modelName] = $(this).val();
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
                element.setAttribute(attribute.substr(3),template.replace(/\{\{(\w+)\}\}/g, function (match, key) {
                    return model[key];
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
                element.setAttribute(attribute, template.replace(/\{\{(\w+)\}\}/g, function (match, key) {
                    return model[key];
                }));
            });
        };

        for (var i = 0; i < attributes.length; i++) {
            if(attributes[i].name.substr(0,3)==='jq-'){
                continue;
            }
            var template = attributes[i].value;
            var attribute = attributes[i].name;
            if(template.match(/\{\{(\w+)\}\}/)){
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
            $(element).css(model[modelName]);
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
            $(element).attr('disabled',model[modelName]);
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
            if(keyName === null){
                for(var i in model[listName]){
                    $(element).append('<option>' + model[listName][i] + '</option>');
                }
            }else{
                for(var k in model[listName]){
                    $(element).append('<option value="' + model[listName][k][keyName] + '">' + model[listName][k]['valueName'] + '</option>');
                }
            }
            $(element).val(model[modelName]);
        });
        onChangeTasks[onChangeTasks.length-1](null);
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
            if(model[query]){
                $(element).insertAfter(startComment);
            }
        });
        onChangeTasks[onChangeTasks.length-1](null);
        return NODE_STATUS_NORMAL;
    };

    bindingTypes.jqRepeat = function(element,model,onChangeTasks){
        var query, match;
        if(typeof(element.getAttribute)!=='function' || !(query = element.getAttribute('jq-repeat')) || !(match = query.match(/(\w+)\s+in\s+(\w+)/))){
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

        var repeatRowDelegate = function(row){
            return template.replace(/\{\{([\w\.]+)\}\}/g,function(match,key){
                if(key.substr(0,rowName.length+1) === (rowName+'.')){
                    return row[key.substr(rowName.length+1)];
                }
            });
        };


        onChangeTasks.push(function(){
            var currentNode = startComment.nextSibling;
            while(currentNode !== endComment){
                currentNode = currentNode.nextSibling;
                $(currentNode).prev().remove();
            }
            var html = '';
            var list = model[modelName];
            for(var i in list){
                html+= repeatRowDelegate(list[i]);
            }
            $(html).insertAfter(startComment);

        });
        onChangeTasks[onChangeTasks.length-1](null);
        return NODE_STATUS_COVER;
    };

}(jQuery));
