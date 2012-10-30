/**
 * Request adapter.
 *
 * @package cork
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var _       = require('lodash'),
    async   = require('async'),
    request = require('request');

/**
 * Executes a task from the adapter queue.
 *
 * @param {Object} Task
 *
 * @return {Object}
 */
var execute = function (task, callback) {
    request(task, function (err, response, body) {
        callback(err, body);
    });
}

/**
 * Constructor
 */
function Adapter (args) {
    var self = this;

    // Setup instance
    _.extend(self, args);
    _.defaults(self, {
        base:       null,
        throttle:   0
    });

    // Throttled request method
    var limiter = _.throttle(execute, self.throttle);

    // Create queue
    self.queue = async.queue(function (obj, callback) {
        // Assemble task
        var task = Object.create(null);
        _.extend(task, self, obj);
        if (self.base !== null) task.uri = self.base + task.uri;

        // Clean-up
        delete task.base;
        delete task.throttle;

        // Process task through the limiter method
        limiter(task, callback);
    }, 1);
};

/**
 * Export
 */
module.exports = Adapter;
