/**
 * Created by dagan on 07/04/2014.
 * Modified by hoang on 11/24/2016
 */
'use strict';
/* global console, XdUtils */
window.xdStorage = window.xdStorage || (function () {
  var MESSAGE_NAMESPACE = 'cross-domain-local-message';
  var options = {
    iframeId: 'cross-domain-iframe',
    iframeUrl: undefined,
    sessionAutoSync: false,
    initCallback: function () {},
    sessionSyncNotify: null
  };
  var requestId = -1;
  var iframe;
  var requests = {};
  var wasInit = false;
  var autoSync = false;
  var iframeReady = false;

  function applyCallback(data) {
    if (data.id == null) {
      if (typeof options.sessionSyncNotify == 'function') {
        options.sessionSyncNotify(data);
      }
      return;
    }
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
      return;
    }
    if (data && data.namespace === MESSAGE_NAMESPACE) {
      if (data.id === 'iframe-ready') {
        iframeReady = true;
        if (options.sessionAutoSync) {
          buildMessage('session', 'option', 'auto-sync', true, function() {
            buildMessage('session', 'sync', '',  null, null);
          });
        }
        options.initCallback();
      } else {
        if (!data.normal_response) {
          console.log("Error: " + data.error);
        }
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

    var tmp = Array.prototype.toJSON;
    if (tmp) {
      delete Array.prototype.toJSON; // avoid conflict with older version of Prototype
      iframe.contentWindow.postMessage(JSON.stringify(data), '*');
      Array.prototype.toJSON = tmp
    } else {
      iframe.contentWindow.postMessage(JSON.stringify(data), '*');
    }
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
      console.log('You must call xdStorage.init() before using it.');
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
        console.log('xdStorage was already initialized!');
        return;
      }
      wasInit = true;
      if (document.readyState === 'complete') {
        init(customOptions);
      } else {
        (function(opts) {
          var loaded = false;
          function onloadWindow() {
            if (loaded) return;
            loaded = true;

            init(opts);
          }
          // Mozilla, Opera and webkit nightlies currently support this event
          if ( document.addEventListener ) {
            // Use the handy event callback
            document.addEventListener( "DOMContentLoaded", onloadWindow, false );

            // A fallback to window.onload, that will always work
            window.addEventListener( "load", onloadWindow, false );

            // If IE event model is used
          } else if ( document.attachEvent ) {
            // ensure firing before onload,
            // maybe late but safe also for iframes
            document.attachEvent( "onreadystatechange", onloadWindow );

            // A fallback to window.onload, that will always work
            window.attachEvent( "onload", onloadWindow );
          }
        })(customOptions);
      }
    },
    version: '3.0.14',
    wasInit: function () {
      return wasInit;
    },
    autoSync: function(flag) {
      if (flag == null) return autoSync;
      autoSync = flag;
      buildMessage('session', 'option', 'auto-sync', flag, null);
    },
    sessionSyncNotifier: function(func) {
      options.sessionSyncNotify = func;
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
      },
      sync: function (keys, callback) {
        if (!isApiReady()) {
          return;
        }
        buildMessage('session', 'sync', keys,  null, callback);
      }
    }
  };
})();
