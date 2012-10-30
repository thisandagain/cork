/**
 * Storage engine for cork.
 *
 * @package cork
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Constructor
 */
function Engine () {
    this.storage = Object.create(null);
};

Engine.prototype.get = function (key) {
    if (typeof this.storage[key] === 'undefined') return null;
    return this.storage[key];
};

Engine.prototype.set = function (key, value) {
    this.storage[key] = value;
};

/**
 * Export
 */
module.exports = Engine;