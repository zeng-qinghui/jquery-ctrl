(function ($) {
    /*
     ======== A Handy Little QUnit Reference ========
     http://api.qunitjs.com/

     Test methods:
     module(name, {[setup][ ,teardown]})
     test(name, callback)
     expect(numberOfAssertions)
     stop(increment)
     start(decrement)
     Test assertions:
     ok(value, [message])
     equal(actual, expected, [message])
     notEqual(actual, expected, [message])
     deepEqual(actual, expected, [message])
     notDeepEqual(actual, expected, [message])
     strictEqual(actual, expected, [message])
     notStrictEqual(actual, expected, [message])
     throws(block, [expected], [message])
     */

    module('Binding', {
        // This will run before each test in this module.
        setup: function () {
            $.ctrl('test-binding', function (model) {
                model.testBinding = 'Binding Success';
                model.testObjectBinding = {value:'Binding Success'};
            });
        }
    });

    test('Common and object', function () {
        expect(12);
        strictEqual($('#qunit-binding .common input').attr('title'), 'Binding Success', 'Attribute binding common');
        strictEqual($('#qunit-binding .common input').val(), 'Binding Success', 'Input binding common');
        strictEqual($('#qunit-binding .common i').text(), 'Binding Success', 'Html binding common');
        $('#qunit-binding .common input').val('Binding and Update Success');
        $('#qunit-binding .common input').change();
        strictEqual($('#qunit-binding .common i').text(), 'Binding and Update Success', 'Html binding update common');
        strictEqual($('#qunit-binding .common input').val(), 'Binding and Update Success', 'Input binding update common');
        strictEqual($('#qunit-binding .common input').attr('title'), 'Binding and Update Success', 'Attribute binding update common');

        strictEqual($('#qunit-binding .object input').attr('title'), 'Binding Success', 'Attribute binding by object');
        strictEqual($('#qunit-binding .object input').val(), 'Binding Success', 'Input binding by object');
        strictEqual($('#qunit-binding .object i').text(), 'Binding Success', 'Html binding by object');
        $('#qunit-binding .object input').val('Binding and Update Success');
        $('#qunit-binding .object input').change();
        strictEqual($('#qunit-binding .object i').text(), 'Binding and Update Success', 'Html binding update by object');
        strictEqual($('#qunit-binding .object input').val(), 'Binding and Update Success', 'Input binding update by object');
        strictEqual($('#qunit-binding .object input').attr('title'), 'Binding and Update Success', 'Attribute binding update by object');
    });

    module('If',{
        setup:function(){
            $.ctrl('test-if',function(model){
                model.testBoolTrue = true;

                model.testBoolObjectTrue = {value:true};
            });
        }
    });

    test('Common and Object', function () {
        expect(2);
        strictEqual($('#qunit-if>div:first').text().trim(), 'True', 'If common');
        strictEqual($('#qunit-if>div:eq(1)').text().trim(), 'True', 'If by object');
    });

    module('Repeat',{
        setup:function(){
            $.ctrl('test-repeat',function(model){
                model.testCollections = [
                    {key: 'Row0', value: 'Row0Value'},
                    {key: 'Row1', value: 'Row1Value'},
                    {key: 'Row2', value: 'Row2Value'}
                ];

                model.testLevelsCollections = [
                    {key: 'RowO0', row:{value:'RowO0Value',sub:[{key:'s01',value:'s01Value'}]}},
                    {key: 'RowO1', row:{value:'RowO1Value',sub:[{key:'s02',value:'s02Value'},{key:'s03',value:'s03Value'}]}}
                ];
            });
        }
    });

    test('Common and LevelsCollections', function () {
        expect(2);
        strictEqual($('#qunit-repeat>ul:eq(0) li').length, 3, 'Common Repeat');
        strictEqual($('#qunit-repeat>ul:eq(1) li.sub').length, 3, 'LevelsCollections Repeat');
    });


    module('Options',{
        setup:function(){
            $.ctrl('test-options',function(model){
                model.testOptions = ['Row0','Row1','Row2'];
                model.testSelect = 'Row1';

                model.testGroupOptions = [{'GroupA':['Row0']},{'GroupB':['Row1','Row2']}];
                model.testGroupSelect = 'Row1';
            });
        }
    });

    test('Common and Group', function () {
        expect(7);
        strictEqual($('#qunit-options .common option').length, 3, 'Options Show');
        strictEqual($('#qunit-options .common select').val(), 'Row1', 'Options Select');
        $('#qunit-options .common select').val('Row2');
        $('#qunit-options .common select').change();
        strictEqual($('#qunit-options .common i').text(), 'Row2', 'Select binding update');

        strictEqual($('#qunit-options .group option').length, 3, 'Options Show');
        strictEqual($('#qunit-options .group optgroup').length, 2, 'Options Group Show');
        strictEqual($('#qunit-options .group select').val(), 'Row1', 'Options Select');
        $('#qunit-options .group select').val('Row2');
        $('#qunit-options .group select').change();
        strictEqual($('#qunit-options .group i').text(), 'Row2', 'Select binding update');
    });

    module('Src and Href',{
        setup:function(){
            $.ctrl('test-src_href',function(model){
                model.testSrc = 'http://jquery.com/jquery-wp-content/themes/jquery/images/logo-jquery.png';
                model.testHref = 'http://jquery.com/';
                model.testObjectSrc = {value:'http://jquery.com/jquery-wp-content/themes/jquery/images/logo-jquery.png'};
                model.testObjectHref = {value:'http://jquery.com/'};
            });
        }
    });

    test('Src and Href', function () {
        expect(4);
        strictEqual($('#qunit-src_href img:eq(0)').attr('src'), 'http://jquery.com/jquery-wp-content/themes/jquery/images/logo-jquery.png', 'Src');
        strictEqual($('#qunit-src_href a:eq(0)').attr('href'), 'http://jquery.com/', 'Href');
        strictEqual($('#qunit-src_href img:eq(1)').attr('src'), 'http://jquery.com/jquery-wp-content/themes/jquery/images/logo-jquery.png', 'Src');
        strictEqual($('#qunit-src_href a:eq(1)').attr('href'), 'http://jquery.com/', 'Href');
    });

    module('Disabled',{
        setup:function(){
            $.ctrl('test-disabled',function(model){
                model.testDisabled = true;
                model.testObjectDisabled = {value:true};
            });
        }
    });

    test('Disabled', function () {
        expect(2);
        strictEqual($('#qunit-disabled button:eq(0)').attr('disabled'), 'disabled', 'Disabled');
        strictEqual($('#qunit-disabled button:eq(1)').attr('disabled'), 'disabled', 'Object Disabled');
    });


    module('Style',{
        setup:function(){
            $.ctrl('test-style',function(model){
                model.testStyle = {'color': '#0F0'};
                model.testObjectStyle = {value:{'color': '#0F0'}};
            });
        }
    });

    test('Style', function () {
        expect(2);
        strictEqual($('#qunit-style div:eq(0)').css('color'), 'rgb(0, 255, 0)', 'Css');
        strictEqual($('#qunit-style div:eq(1)').css('color'), 'rgb(0, 255, 0)', 'Object Css');
    });

    module('Event',{
        setup:function(){
            $.ctrl('test-event',function(model){
                model.message = 'Wait For Click';
                model.click = function(param){
                    model.message = 'Clicked with param '+param;
                };
            });
        }
    });

    test('Event',function(){
        expect(1);
        $('#qunit-event button').click();
        strictEqual($('#qunit-event span').html(),'Clicked with param OK','Event');
    });
}(jQuery));
