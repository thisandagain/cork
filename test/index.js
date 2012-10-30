/**
 * Test suite
 *
 * @package cork
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var async   = require('async'),
    test    = require('tap').test,

    cork    = require(__dirname + '/../lib/index.js');

/**
 * Setup
 */
cork.register('diy', {
    throttle:   50,
    base:       'http://localhost:8080',
    json:       {}
});

/**
 * Suite
 */
async.auto({

    single:     function (callback) {
        cork.request('diy', {
            method: 'get',
            uri:    '/status'
        }, callback);
    },

    load:       function (callback) {
        var a = [];
        for (var i = 0; i < 5; i++) {
            a.push(function (callback) {
                cork.request('diy', {
                    method: 'get',
                    uri:    '/status'
                }, callback);
            });
        }

        async.parallel(a, callback);
    },

    test:       ['single', 'load', function (callback, obj) {
        test('Component definition', function (t) {
            t.type(cork, 'object', 'Component should be an object');
            t.type(cork.register, 'function', 'Method should be a function');
            t.type(cork.request, 'function', 'Method should be a function');
            t.end();
        });

        test('Request method', function (t) {
            console.dir(obj.single);
            console.dir(obj.load);
            t.type(obj.single, 'object', 'Results should be an object');
            t.end();
        });

        callback();
    }]

}, function (err, obj) {
    test('Catch errors', function (t) {
        t.equal(err, null, 'Errors should be null');
        t.end();
        process.exit();
    });
});