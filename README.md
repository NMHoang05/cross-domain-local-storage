(README is not updated, I apologize for being lazy)

it's similar to cross-domain-local-storage,
but instead of: xdLocalStorage.setItem
use: xdStorage.local.setItem

if you want to use cross domain session storage:
xdStorage.session.setItem

...etc

the session storage can be synchronize between tabs
use xdStorage.session.sync() to get session data from other tabs.
xdStorage.autoSync(true) to automatically notify changes to other tabs whenever session data in this tab changes.

callback function sessionSyncNotify has been added: this function is called whenever session storage receives a sync from other tab.
the "data" parameter of this function contains keys and a hash (keys, values) that have been changed. (a "null" value depicts removing of corresponding key)

added support for setItem, getItem, removeItem with multiple keys, just pass an array of string to parameter "key" and "value". 

## Limitations

Apple has updated the defaults on Safari 7+ both on desktop and mobile to block 3rd party data. The option is now called "Block cookies and other website data" which refers to things like localstorage which are now completely isolated by domain.

This implies that unfortunately this library will not be able to share cross domain information on Safari 7+. 

`Session storage still works.`

(iOS-only problem) you will **not be able to sync session storage** between tabs as javascript _`is paused`_ within inactive tabs.

Cross Domain Storage (Local & Session)
======================================

1. [Problem](#problem)
2. [Solution](#solution)
3. [Why not use cookies?](#why-not-use-cookies)
4. [Installation](#installation)
5. [Usage](#usage)
6. [API](#api)
8. [Angular Support](#angular-support)
9. [Demo](#demo)
10. [Tests](#tests)


## Problem

As for now, standard HTML5 Web Storage (a.k.a Local Storage) doesn't now allow cross domain data sharing.
This may be a big problem in an organization which have a lot of sub domains and wants to share client data between them.

## Solution

xdLocalStorage is a lightweight js library which implements LocalStorage interface and support cross domain storage by using iframe post message communication.

## Why not use cookies?

Although cookies can be shared between sub domains, cookies have the overhead of being sent to the server on each request.
They're also have a size limit (4K for all cookies together)

## Installation

Download latest release from [here](https://github.com/ofirdagan/cross-domain-local-storage/releases) or use bower (recommended)
```sh
bower install xdLocalStorage --save
```

## Usage

- Create an empty html with the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="xdLocalStoragePostMessageApi.min.js"></script>
</head>
<body>
    This is the magical iframe
</body>
</html>
```

- On your client page (the page you will read/store your data from) add:

```html
 <!-- if you use angular continue reading.. there's angular support -->
 <script src="scripts/xdLocalStorage.min.js"></script>
```

- Init xdLocalStorage

```js
    xdLocalStorage.init(
        {
            /* required */
            iframeUrl:'path to your html from step 1',
            //an option function to be called right after the iframe was loaded and ready for action
            initCallback: function () {
                console.log('Got iframe ready');
            }
        }
    );
```

## API

```js
    // Store
    xdLocalStorage.setItem(key, value, function (data) { /* callback */ });

    // Retrieve
    xdLocalStorage.getItem(key, function (data) { /* callback */ });

    // Remove
    xdLocalStorage.removeItem(key, function (data) { /* callback */ });

    // Key Name
    xdLocalStorage.key(index, function (data) { /* callback */ });

    // Clear All
    xdLocalStorage.clear(function (data) { /* callback */ });
```

## Angular Support

*UPDATE:*  Since version 2.0.0 the xdLocalStorage service supoprts promise interface hence no more annoying callbacks :)

- import `ng-xdLocalStorage.min.js` instead of `xdLocalStorage.min.js`

- include xdLocalStorage module and call init in a run block.

```js
angular.module('yourModule', ['xdLocalStorage']).run(function (xdLocalStorage) {
    xdLocalStorage.init(
     {
        /* required */
        iframeUrl:'path to your html from step 1'
    }).then(function () {
        //an option function to be called once the iframe was loaded and ready for action
        console.log('Got iframe ready');
    });
});

```

- inject xdLocalStorage where ever you want and use the API

```js
angular.module('yourModule').run(function(xdLocalStorage) {
    xdLocalStorage.getItem(key).then(function (response) {
    	console.log(response.value);
    });
});

```

## Demo

**Here's the <a href="https://rawgit.com/ofirdagan/cross-domain-local-storage/master/app/index.html" target="_blank">demo</a>**

## Tests

I covered the basic API with tests [here](https://github.com/ofirdagan/cross-domain-local-storage/blob/master/test/specs/xdStorage.js)
