/*
 * ctrl
 * https://github.com/zengohm/jquery-ctrl
 *
 * Copyright (c) 2014 Zeng Ohm
 * Licensed under the MIT license.
 */

(function ($) {
    var modules = {};
    // Static method.
    $.ctrl = function (ctrlName, init) {
        var thisCtrl = {
            model: {},
            init: init,
            ctrl: $('[jq-ctrl="' + ctrlName + '"]'),
            bindings: {}
        };
        modules[ctrlName] = thisCtrl;
        thisCtrl.init(thisCtrl.model);

        var bindingModel = {};
        var fixedHtml = thisCtrl.ctrl.html().replace(/\{\{([\w\.]+)\}\}/g,function(tag,match){
            bindingModel[match]=tag;
            return '<!-- jq-model ['+match+'] Start -->'+tag+'<!-- jq-model ['+match+'] End -->';
        });
        thisCtrl.ctrl.html(fixedHtml);
        for(var match in bindingModel){
            if(typeof(thisCtrl.model[match])!='undefined'){
                var filter = ':contains({{'+match+'}})';
                thisCtrl.ctrl.find(filter).andSelf(filter).contents().filter(function(){
                    return this.nodeName == '#comment' && this.data == ' jq-model ['+match+'] Start ';
                }).each(function(){
                    if(typeof(thisCtrl.bindings[match]) === 'undefined'){
                        thisCtrl.bindings[match] = [];
                    }
                    thisCtrl.bindings[match].push($(this).parent().contents()[$(this).parent().contents().index(this)+1]);
                });
            }
        }


        thisCtrl.ctrl.find('[jq-model]').each(function(){
            var modelName = $(this).attr('jq-model');
            if(typeof(thisCtrl.bindings[modelName]) === 'undefined'){
                thisCtrl.bindings[modelName] = [];
            }
            thisCtrl.bindings[modelName].push(this);

            $(this).bind('keyup keypress change',function(){
                var self = this;
                thisCtrl.model[modelName] = $(this).val();
                $(thisCtrl.bindings[modelName]).each(function(){
                    if(this == self){
                        return true;
                    }
                    if(this.nodeName === '#text'){
                        this.textContent = thisCtrl.model[modelName];
                    }else{
                        $(this).val(thisCtrl.model[modelName]);
                    }
                });
            });
        });

        for(var modelName in thisCtrl.bindings){
            for(var i in thisCtrl.bindings[modelName]){
                var obj = thisCtrl.bindings[modelName][i];
                if(obj.nodeName === '#text'){
                    obj.textContent = thisCtrl.model[modelName];
                }else{
                    $(obj).val(thisCtrl.model[modelName]);
                }
            }
        }
    };

}(jQuery));
