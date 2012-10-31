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
    nock    = require('nock'),

    cork    = require(__dirname + '/../lib/index.js');

/**
 * Setup
 */
var iterations = 10;
for (var i = 0; i < iterations + 1; i++) {
    nock('http://api.test.com').get('/status').reply(200, 'hello world');
}

cork.register('test', {
    base:       'http://api.test.com',
    throttle:   50,
    method:     'get',
});

/**
 * Suite
 */
async.auto({

    single:     function (callback) {
        cork.request('test', {
            uri: '/status'
        }, callback);
    },

    load:       function (callback) {
        var a = [];
        for (var i = 0; i < iterations; i++) {
            a.push(function (callback) {
                cork.request('test', {
                    uri: '/status'
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

        test('Single request', function (t) {
            t.type(obj.single, 'string', 'Results should be an string');
            t.equal(obj.single, 'hello world', 'Results should be of expected value');
            t.end();
        });

        test('Load request', function (t) {
            t.type(obj.load[0], 'string', 'Results should be an string');
            t.equal(obj.load.length, iterations, 'Results should be of expected length');
            t.end();
        });

        callback();
    }]

}, function (err, obj) {
    test('Catch errors', function (t) {
        t.equal(err, null, 'Errors should be null');
        t.end();
    });
});