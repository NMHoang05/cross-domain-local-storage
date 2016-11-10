/**
 * Created by dagan on 07/04/2014.
 */
'use strict';
/* global XdUtils */
(function () {

  var MESSAGE_NAMESPACE = 'cross-domain-local-message';

  var defaultData = {
    namespace: MESSAGE_NAMESPACE
  };

  function postData(id, data) {
    var mergedData = XdUtils.extend(data, defaultData);
    mergedData.id = id;
    parent.postMessage(JSON.stringify(mergedData), '*');
  }

  var local = {
    getData: function(id, key)
    {
      var value = localStorage.getItem(key);
      var data = {
        key: key,
        value: value
      };
      postData(id, data);
    },

    setData: function(id, key, value) {
      localStorage.setItem(key, value);
      var checkGet = localStorage.getItem(key);
      var data = {
        success: checkGet === value
      };
      postData(id, data);
    },

    removeData: function(id, key) {
      localStorage.removeItem(key);
      postData(id, {});
    },

    getKey: function(id, index) {
      var key = localStorage.key(index);
      postData(id, {key: key});
    },

    getSize: function(id) {
      var size = JSON.stringify(localStorage).length;
      postData(id, {size: size});
    },

    getLength: function(id) {
      var length = localStorage.length;
      postData(id, {length: length});
    },

    clear: function(id) {
      localStorage.clear();
      postData(id, {});
    }
  };

  var session = {
    getData: function(id, key)
    {
      var value = sessionStorage.getItem(key);
      var data = {
        key: key,
        value: value
      };
      postData(id, data);
    },

    setData: function(id, key, value) {
      sessionStorage.setItem(key, value);
      var checkGet = sessionStorage.getItem(key);
      var data = {
        success: checkGet === value
      };
      postData(id, data);
    },

    removeData: function(id, key) {
      sessionStorage.removeItem(key);
      postData(id, {});
    },

    getKey: function(id, index) {
      var key = sessionStorage.key(index);
      postData(id, {key: key});
    },

    getSize: function(id) {
      var size = JSON.stringify(sessionStorage).length;
      postData(id, {size: size});
    },

    getLength: function(id) {
      var length = sessionStorage.length;
      postData(id, {length: length});
    },

    clear: function(id) {
      sessionStorage.clear();
      postData(id, {});
    }
  };

  function receiveMessage(event) {
    var data;
    try {
      data = JSON.parse(event.data);
    } catch (err) {
      //not our message, can ignore
    }

    if (data && data.namespace === MESSAGE_NAMESPACE) {
      if (data.type == 'local') {
        if (data.action === 'set') {
          local.setData(data.id, data.key, data.value);
        } else if (data.action === 'get') {
          local.getData(data.id, data.key);
        } else if (data.action === 'remove') {
          local.removeData(data.id, data.key);
        } else if (data.action === 'key') {
          local.getKey(data.id, data.key);
        } else if (data.action === 'size') {
          local.getSize(data.id);
        } else if (data.action === 'length') {
          local.getLength(data.id);
        } else if (data.action === 'clear') {
          local.clear(data.id);
        }
      }
      if (data.type == 'session') {
        if (data.action === 'set') {
          session.setData(data.id, data.key, data.value);
        } else if (data.action === 'get') {
          session.getData(data.id, data.key);
        } else if (data.action === 'remove') {
          session.removeData(data.id, data.key);
        } else if (data.action === 'key') {
          session.getKey(data.id, data.key);
        } else if (data.action === 'size') {
          session.getSize(data.id);
        } else if (data.action === 'length') {
          session.getLength(data.id);
        } else if (data.action === 'clear') {
          session.clear(data.id);
        }
      }
    }
  }

  if (window.addEventListener) {
    window.addEventListener('message', receiveMessage, false);
  } else {
    window.attachEvent('onmessage', receiveMessage);
  }

  function sendOnLoad() {
    var data = {
      namespace: MESSAGE_NAMESPACE,
      id: 'iframe-ready'
    };
    parent.postMessage(JSON.stringify(data), '*');
  }
  //on creation
  sendOnLoad();
})();
