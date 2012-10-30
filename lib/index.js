/**
 * API utility belt for request.
 *
 * @package cork
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var Adapter = require('./adapter.js'),
    Engine  = require('./engine.js');

/**
 * Constructor
 */
function Cork () {
    var self = this;
    self.engine = new Engine();
};

Cork.prototype.register = function (ns, args) {
    var self = this;

    var instance = new Adapter(args);
    self.engine.set(ns, instance);
};

Cork.prototype.request = function (ns, request, callback) {
    var self = this;

    var instance = self.engine.get(ns);
    instance.queue.push(request, callback);
};

/**
 * Export
 */
module.exports = new Cork();