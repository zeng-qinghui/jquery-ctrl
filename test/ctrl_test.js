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

    module('jQuery.ctrl', {
        // This will run before each test in this module.
        setup: function () {
            $.ctrl('test', function (model) {
                model.testBinding = 'Binding Success';

                model.testBoolTrue = true;
                model.testBoolFalse = false;

                model.testCollections = [
                    {key: 'Row0', value: 'Row0Value'},
                    {key: 'Row1', value: 'Row1Value'},
                    {key: 'Row2', value: 'Row2Value'}
                ];

                model.testOptions = ['Row0','Row1','Row2'];
                model.testSelect = 'Row1';

                model.testSrc = 'http://jquery.com/jquery-wp-content/themes/jquery/images/logo-jquery.png';

                model.testHref = 'http://jquery.com/';

                model.testDisabled = true;

                model.testStyle = {'color': '#0F0'};
            });
        }
    });

    test('Ctrl', function () {
        expect(12);
        // Not a bad test to run on collection methods.
        strictEqual($('#qunit-binding input').val(), 'Binding Success', 'Input binding');
        strictEqual($('#qunit-binding i').text(), 'Binding Success', 'Html binding');
        $('#qunit-binding input').val('Binding and Update Success');
        $('#qunit-binding input').change();
        strictEqual($('#qunit-binding i').text(), 'Binding and Update Success', 'Html binding update');

        strictEqual($('#qunit-if>div').text(), 'True', 'If');

        strictEqual($('#qunit-repeat li').length, 3, 'Repeat');

        strictEqual($('#qunit-options option').length, 3, 'Options Show');
        strictEqual($('#qunit-options select').val(), 'Row1', 'Options Select');
        $('#qunit-options select').val('Row2');
        $('#qunit-options select').change();
        strictEqual($('#qunit-options i').text(), 'Row2', 'Select binding update');

        strictEqual($('#qunit-src img').attr('src'), 'http://jquery.com/jquery-wp-content/themes/jquery/images/logo-jquery.png', 'Src');

        strictEqual($('#qunit-href a').attr('href'), 'http://jquery.com/', 'Href');

        strictEqual($('#qunit-disabled button').attr('disabled'), 'disabled', 'Disabled');

        strictEqual($('#qunit-style div').css('color'), 'rgb(0, 255, 0)', 'Css');
    });

}(jQuery));
