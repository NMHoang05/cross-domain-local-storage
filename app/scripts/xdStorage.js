/**
 * Created by dagan on 07/04/2014.
 */
'use strict';
/* global console, XdUtils */
window.xdStorage = window.xdStorage || (function () {
  var MESSAGE_NAMESPACE = 'cross-domain-local-message';
  var options = {
    iframeId: 'cross-domain-iframe',
    iframeUrl: undefined,
    initCallback: function () {}
  };
  var requestId = -1;
  var iframe;
  var requests = {};
  var wasInit = false;
  var iframeReady = true;

  function applyCallback(data) {
    if (requests[data.id]) {
      requests[data.id](data);
      delete requests[data.id];
    }
  }

  function receiveMessage(event) {
    var data;
    try {
      data = JSON.parse(event.data);
    } catch (err) {
      //not our message, can ignore
    }
    if (data && data.namespace === MESSAGE_NAMESPACE) {
      if (data.id === 'iframe-ready') {
        iframeReady = true;
        options.initCallback();
      } else {
        applyCallback(data);
      }
    }
  }

  function buildMessage(type, action, key, value, callback) {
    requestId++;
    requests[requestId] = callback;
    var data = {
      namespace: MESSAGE_NAMESPACE,
      id: requestId,
      type: type,
      action: action,
      key: key,
      value: value
    };
    iframe.contentWindow.postMessage(JSON.stringify(data), '*');
  }

  function init(customOptions) {
    options = XdUtils.extend(customOptions, options);
    var temp = document.createElement('div');

    if (window.addEventListener) {
      window.addEventListener('message', receiveMessage, false);
    } else {
      window.attachEvent('onmessage', receiveMessage);
    }

    temp.innerHTML = '<iframe id="' + options.iframeId + '" src=' + options.iframeUrl + ' style="display: none;"></iframe>';
    document.body.appendChild(temp);
    iframe = document.getElementById(options.iframeId);
  }

  function isApiReady() {
    if (!wasInit) {
      console.log('You must call xdLocalStorage.init() before using it.');
      return false;
    }
    if (!iframeReady) {
      console.log('You must wait for iframe ready message before using the api.');
      return false;
    }
    return true;
  }

  return {
    //callback is optional for cases you use the api before window load.
    init: function (customOptions) {
      if (!customOptions.iframeUrl) {
        throw 'You must specify iframeUrl';
      }
      if (wasInit) {
        console.log('xdLocalStorage was already initialized!');
        return;
      }
      wasInit = true;
      if (document.readyState === 'complete') {
        init(customOptions);
      } else {
        window.onload = function () {
          init(customOptions);
        };
      }
    },
    wasInit: function () {
      return wasInit;
    },
    local: {
      setItem: function (key, value, callback) {
        if (!isApiReady()) {
          return;
        }
        buildMessage('local', 'set', key, value, callback);
      },

      getItem: function (key, callback) {
        if (!isApiReady()) {
          return;
        }
        buildMessage('local', 'get', key,  null, callback);
      },
      removeItem: function (key, callback) {
        if (!isApiReady()) {
          return;
        }
        buildMessage('local', 'remove', key,  null, callback);
      },
      key: function (index, callback) {
        if (!isApiReady()) {
          return;
        }
        buildMessage('local', 'key', index,  null, callback);
      },
      getSize: function(callback) {
        if(!isApiReady()) {
          return;
        }
        buildMessage('local', 'size', null, null, callback);
      },
      getLength: function(callback) {
        if(!isApiReady()) {
          return;
        }
        buildMessage('local', 'length', null, null, callback);
      },
      clear: function (callback) {
        if (!isApiReady()) {
          return;
        }
        buildMessage('local', 'clear', null,  null, callback);
      }
    },
    session: {
      setItem: function (key, value, callback) {
        if (!isApiReady()) {
          return;
        }
        buildMessage('session', 'set', key, value, callback);
      },

      getItem: function (key, callback) {
        if (!isApiReady()) {
          return;
        }
        buildMessage('session', 'get', key,  null, callback);
      },
      removeItem: function (key, callback) {
        if (!isApiReady()) {
          return;
        }
        buildMessage('session', 'remove', key,  null, callback);
      },
      key: function (index, callback) {
        if (!isApiReady()) {
          return;
        }
        buildMessage('session', 'key', index,  null, callback);
      },
      getSize: function(callback) {
        if(!isApiReady()) {
          return;
        }
        buildMessage('session', 'size', null, null, callback);
      },
      getLength: function(callback) {
        if(!isApiReady()) {
          return;
        }
        buildMessage('session', 'length', null, null, callback);
      },
      clear: function (callback) {
        if (!isApiReady()) {
          return;
        }
        buildMessage('session', 'clear', null,  null, callback);
      }
    }
  };
})();
