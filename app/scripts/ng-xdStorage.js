/**
 * Created by Ofir_Dagan on 4/8/14.
 */
'use strict';
/* global xdStorage */

angular.module('xdStorage', [])
  .service('xdStorage', ['$q', '$rootScope', function ($q, $rootScope) {
    var iframeReady = false;
    var apiReady = $q.defer();

    var unregister = $rootScope.$watch(function () {
      return iframeReady;
    }, function () {
      apiReady.resolve(true);
      unregister();
    });

    function waitForApi() {
      if (!xdStorage.wasInit()) {
        throw 'You must init xdStorage in app config before use';
      }
      return apiReady.promise;
    }
    function action(method) {
      var args = Array.prototype.slice.call(arguments, 1);
      return waitForApi().then(function () {
        var defer = $q.defer();
        xdStorage[method].apply(this, args.concat(function () {
          var result = arguments[0];
          $rootScope.$apply(function () {
            defer.resolve(result);
          });
        }));
        return defer.promise;
      });
    }
    return {
      init: function (options) {
        var defer = $q.defer();
        options.initCallback = function () {
          $rootScope.$apply(function () {
            iframeReady = true;
            defer.resolve();
          });
        };
        xdStorage.init(options);
        return defer.promise;
      },
      local: {
        setItem: function (key, value) {
          return action('local', 'setItem', key, value);
        },
        getItem: function (key) {
          return action('local', 'getItem', key);
        },
        removeItem: function (key) {
          return action('local', 'removeItem', key);
        },
        key: function (index) {
          return action('local', 'key', index);
        },
        clear: function () {
          return action('local', 'clear');
        }
      },
      session: {
        setItem: function (key, value) {
          return action('session', 'setItem', key, value);
        },
        getItem: function (key) {
          return action('session', 'getItem', key);
        },
        removeItem: function (key) {
          return action('session', 'removeItem', key);
        },
        key: function (index) {
          return action('session', 'key', index);
        },
        clear: function () {
          return action('session', 'clear');
        },
        sync: function () {
          return action('session', 'sync');
        }
      }
    };
  }]);