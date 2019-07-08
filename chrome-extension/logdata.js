/* SmtpJS.com - v3.0.0 */
var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };


/* Register event handler receiving message object from extension.
 *
 * This function is not used yet, but it might be useful in the future.
 */
chrome.runtime.onMessage.addListener(msgObj => {
  console.log('msgobj: ' + JSON.stringify(msgObj));

  chrome.storage.local.get(['name'], function(result) {
    console.log('Get store email (cs): ' + result.name);
  });
  chrome.storage.local.get(['email'], function(result) {
    console.log('Get store email (cs): ' + result.email);
  });
  chrome.storage.local.get(['enable'], function(result) {
    console.log('Get store enable (cs): ' + result.enable);
  });
});


const url = new URL(location.href);
const keyword = url.searchParams.get('q')


function saveKeyword() {
  return new Promise((resolve, reject) => {
    //const _now = new Date().toISOString();
    // Support timezone shift and remove the tailing 'Z'
    const _tzoffset = (new Date()).getTimezoneOffset() * 60000;  //offset in milliseconds
    const _now = (new Date(Date.now() - _tzoffset)).toISOString().slice(0, -1);

    let _kwcounter = 0;

    chrome.storage.local.get(['kwcounter'], function(result) {
      console.log(`Get store kwcounter (send): ${result.kwcounter}`);
      console.log('Type: ' + typeof(_kwcounter));
      if (result.kwcounter == undefined) {
        _kwcounter = 1;
      } else {
        _kwcounter = result.kwcounter + 1;
      }
      chrome.storage.local.set({'kwcounter': _kwcounter}, function() {
        console.log(`Save kwcounter ${_kwcounter}`);
      });
      // item index starts from 1
      let _k = _kwcounter.toString();
      console.log('save key: ' + _k);
      // use computed property name
      // https://stackoverflow.com/questions/11692699/
      chrome.storage.local.set({[_k]: {'keyword': keyword, 'datetime': _now}}, function() {
        console.log(`Save item ${_k} ${keyword}`);
        resolve(_k);

        chrome.storage.local.get(_k, function(result) {
          console.log('Just saved keyword: ' + _k + ': ' + result[_k].keyword);
          console.log(result);
        });
      });
    });
  });
}

function getKeyword(index) {
  chrome.storage.local.get(index, function(result) {
    console.log('Get keyword: ' + index + ': ' + result[index].keyword);
    console.log(result);
  });
}

function getGeolocation() {
  // reject and resolve will get a param: position
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

/*
function setGeolocation(position) {
  Latitude = position.coords.latitude;
  Longitude = position.coords.longitude;
  console.log(`Set latitude: ${Latitude}, longitude: ${Longitude}`);
}
*/

/* Geolocation callbacks */
const geoSuccess = function(position) {
  const _latitude = position.coords.latitude;
  const _longitude = position.coords.longitude;
  const _now = new Date().toISOString();
  let _name = '';
  let _email = '';
  let _enable = false;
  let _message = '';
  let _kwcounter = 0;

  chrome.storage.local.get(['name'], function(result) {
    console.log('Get store name (send): ' + result.name);
    _name = result.name;
  });
  chrome.storage.local.get(['email'], function(result) {
    console.log('Get store email (send): ' + result.email);
    _email = result.email;
  });
  chrome.storage.local.get(['enable'], function(result) {
    console.log('Get store enable (send): ' + result.enable);
    _enable = result.enable;

    console.log(`Get latitude: ${_latitude}, longitude: ${_longitude}`);

    if (_enable == true) {
      /* If you want to manipulate (e.g. send email) the collected
       * keyword, _latitude, _longitude, add your codes here.
       */

      // To debug that message is correct or not, comment out Email.send above
      // and uncomment the alert below.
      //alert(_message);
    } else {
      console.log(`Extension is disabled: ${_name}, ${_email}, ${_enable}`);
    }

    // save keyword
    if (_enable == true) {
      chrome.storage.local.get(['kwcounter'], function(result) {
        console.log(`Get store kwcounter (send): ${result.kwcounter}`);
        console.log('Type: ' + typeof(_kwcounter));
        _kwcounter = result.kwcounter + 1;
        chrome.storage.local.set({'kwcounter': _kwcounter}, function() {
          console.log(`Save kwcounter ${_kwcounter}`);
        });
        // item index starts from 1
        let _k = _kwcounter.toString();
        console.log('save key: ' + _k);
        // use computed property name
        // https://stackoverflow.com/questions/11692699/
        chrome.storage.local.set({[_k]: {'keyword': keyword, 'datetime': _now}}, function() {
          console.log(`Save item ${_k} ${keyword}`);

          chrome.storage.local.get(_k, function(result) {
            console.log('Just saved keyword: ' + _k + ': ' + result[_k].keyword);
            console.log(result);
          });
        });
      });
    }
  });
};

const geoError = function(position) {
  console.log('Failed to get geolocation.');
};

/* v1: We define geolocation is necessary info in email */
//navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

/* v2: Sending email is disabled, so geolocation is not necessary */
chrome.storage.local.get(['enable'], function(result) {
  if (result.enable == true) {
    let promiseArray = [];
    promiseArray.push(getGeolocation());
    promiseArray.push(saveKeyword());
    Promise.all(promiseArray)
      .then(values => {
        console.log('Result, geolocation: ' + values[0]);
        console.log('Result, keyword index: ' + values[1]);
      });
  } else {
    console.log('Plugin is disabled, do nothing');
  }
});


/* Send email by launching external email client */
//window.open('mailto:bofu@dt42.io?subject=hellokw&body=' + keyword);
