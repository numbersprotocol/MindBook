/*
 * https://developer.chrome.com/extensions/contentSecurityPolicy
 */

let name = '';
let email = '';
let enable = false;
let kwcounter = 0;  // index to first free space
let bg = chrome.extension.getBackgroundPage();


/* Event handler sending message object to content script.
 *
 * This function is not used yet, but it might be useful in the future.
 */
function send() {
  bg.console.log('Call send');
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(
        tabs[0].id,
        {'name': name, 'email': email, 'enable': enable},
        function(response){
          bg.console.log('response: ' + response);
          $("#debug").text(response);
        });
  });
}

/* Add event listeners once the DOM has fully loaded by listening for the
 * `DOMContentLoaded` event on the document, and adding your listeners to
 * specific elements when it triggers.
 */
document.addEventListener('DOMContentLoaded', function () {
  init();
  //document.querySelector('button').addEventListener('click', getConfigs);
  document.querySelector('input[id=cfgEnable]').addEventListener('change', toggleExtension);
});

/* Initialize extension UI.
 *
 * Set default values to the input fields.
 */
function init() {
  bg.console.log('Call init')

  // init user name
  chrome.storage.local.get(['name'], function(result) {
    if (result.name === undefined) {
      name = '';
    } else {
      name = result.name;
    }
    bg.console.log('Get store name (init): ' + result.name);
    $('#cfgName').val(name);
  });

  // init friend email
  chrome.storage.local.get(['email'], function(result) {
    if (result.email === undefined) {
      email = '';
    } else {
      email = result.email;
    }
    bg.console.log('Get store email (init): ' + result.email);
    $('#cfgEmail').val(email);
  });

  // init extension enablement toggle
  chrome.storage.local.get(['enable'], function(result) {
    if (result.enable === undefined) {
      enable = '';
    } else {
      enable = result.enable;
    }
    bg.console.log('Get store enable (init): ' + result.enable);
    $('#cfgEnable').prop('checked', enable);
  });

  // init keywords counter
  chrome.storage.local.get(['kwcounter'], function(result) {
    if (result.kwcounter === undefined) {
      kwcounter = 0;
    } else {
      kwcounter = result.kwcounter;
    }
    bg.console.log('Get store kwcounter (init): ' + result.kwcounter);
  });
}

/* Store user settings into Chrome storage.
 *
 */
function getConfigs() {
  name = $('#cfgName').val();
  email = $('#cfgEmail').val();
  enable = $('#cfgEnable').is(':checked');
  kwcounter = 0;

  // save settings
  chrome.storage.local.set({'name': name}, function() {
    bg.console.log('Set store name (ext): ' + name);
  });
  chrome.storage.local.set({'email': email}, function() {
    bg.console.log('Set store email (ext): ' + email);
  });
  chrome.storage.local.set({'enable': enable}, function() {
    bg.console.log('Set store enable (ext): ' + enable);
  });
  chrome.storage.local.set({'kwcounter': kwcounter}, function() {
    bg.console.log('Set store kwcounter (ext): ' + kwcounter);
  });

  // verify that settings have been saved correctly
  chrome.storage.local.get(['name'], function(result) {
    bg.console.log('Get store name (ext): ' + result.name);
  });
  chrome.storage.local.get(['email'], function(result) {
    bg.console.log('Get store email (ext): ' + result.email);
  });
  chrome.storage.local.get(['enable'], function(result) {
    bg.console.log('Get store enable (ext): ' + result.enable);
  });
  chrome.storage.local.get(['kwcounter'], function(result) {
    bg.console.log('Get store kwcounter (ext): ' + result.kwcounter);
  });

  /*
  if (enable == true) {
    bg.console.log('Enable is true, send email to content script');
    send();
  }
  */
}

function toggleExtension() {
  let enable = this.checked;

  if (enable == true) {
    bg.console.log('Extension is enabled');
  } else {
    bg.console.log('Extension is disabled');
  }

  chrome.storage.local.set({'enable': enable}, function() {
    bg.console.log('Set store enable (ext): ' + enable);

    chrome.storage.local.get(['enable'], function(result) {
      bg.console.log('Get store enable (ext): ' + result.enable);
    });
  });
}
