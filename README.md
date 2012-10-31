## cork
#### An API utility belt for request.

[![Build Status](https://secure.travis-ci.org/thisandagain/cork.png)](http://travis-ci.org/thisandagain/cork)

Cork is a minimal layer that sits on top of the [request](https://github.com/mikeal/request) module and adds a few patterns that make working with 3rd party APIs simpler.

### Installation
```bash
npm install cork
```

### Basic Use
```javascript
var cork = require('cork');

// First, let's register a new service with the name "buzz" and a few defaults
cork.register('buzz', {
    'method':   'get',
    'headers':  {
        'x-api-key': 'someApiKeyGoesHere'
    },
    'json':     {}
    'timeout':  20000
});

// Next, let's make a request based on that service
cork.request('buzz', {
    'uri':      'https://api.geek.com/some/resource'
}, function (err, body) {
    console.dir(body); // Woo!
});

// Neato! But let's say we want to create another request and override some of the defaults
cork.request('buzz', {
    'method':   'post'
    'uri':      'https://api.geek.com/some/other/resource',
    'json':     {
        'foo': 'bar'
    }
}, function (err, body) {
    console.dir(body); // Huzzah!
});
```

### Base URIs
A base URI can be defined during registration by passing the optional `base` parameter:

```javascript
cork.register('dork', {
    base: 'http://api.nerd.com',
});

cork.request('dork', {
    uri: '/yet/another/resource'
}, function (err, body) {
    // Weee! 
});
```

### API Limits / Throttling
When registering a service, Cork accepts an optional `throttle` parameter which represents a request limit expressed in milliseconds. Any requests that subsequently hit the throttle limit will be queued and processed in FIFO order. For example, let's say that we are working with an API that only accepts 10 requests per second:

```javascript
cork.register('geek', {
    throttle: 100   // 1 request per 100 milliseconds
});
```

### Testing
```bash
npm test
```