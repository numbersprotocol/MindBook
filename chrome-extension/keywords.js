let bg = chrome.extension.getBackgroundPage();

/* Add event listeners once the DOM has fully loaded by listening for the
 * `DOMContentLoaded` event on the document, and adding your listeners to
 * specific elements when it triggers.
 */
document.addEventListener('DOMContentLoaded', function () {
  createCSVContent(mockup=false).then(createKeywordsDownloadLink);
  listKeywords();
  //document.getElementById('share').addEventListener('click', share);
  document.getElementById('clear').addEventListener('click', clear);
});

function listKeywords() {
  let _c = 0;
  chrome.storage.local.get(['kwcounter'], function(result) {
    // item index starts from 1
    // TODO: query by using key list instead of for loop
    for (let i = 1; i <= result.kwcounter; i++) {
      let _k = i.toString();
      chrome.storage.local.get(_k, function(item) {
        let itemstr = item[_k];
        let i_keyword = itemstr.keyword;
        let i_datetime = itemstr.datetime;
        $('#kwlist').append(`<tr><td class="tb-datetime">${i_datetime}</td><td class="tb-keyword">${i_keyword}</td></tr>`);
        //bg.console.log(`item ${i}`);
        //bg.console.log(item);
      });
    }
  });
}

function share() {
  bg.console.log('Call share');
}

/* content: c11,c12\nc21,c22\nc31,c32\n...
 */
function createKeywordsDownloadLink(content) {
  bg.console.log('Call createKeywordsDownloadLink');

  let link = document.getElementById('save');
  link.download = 'google-search-keywords.csv';
  link.href = 'data:text/csv,' + content;
  //document.body.appendChild(link);
}

/* Get a keyword item from storage by the given index
 * and convert the item to CSV content format: c1,c2\n
 */
function getKeywordsFromStorage(index) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(index, function(item) {
      let itemstr = item[index];
      let i_keyword = itemstr.keyword;
      let i_datetime = itemstr.datetime;
      let content = i_datetime + ',' + i_keyword + '\n';
      resolve(content);
    });
  });
}

function createCSVContent(mockup=false) {
  return new Promise((resolve, reject) => {
    if (mockup == true) {
      resolve('r1,to be or not to be\nr2,that is a question\n');
    } else {
      let keywordPromiseArray = [];
      chrome.storage.local.get(['kwcounter'], function(result) {
        for (let i = 1; i <= result.kwcounter; i++) {
          keywordPromiseArray.push(getKeywordsFromStorage(i.toString()));
        }
        Promise.all(keywordPromiseArray)
          .then(function(values) {
            bg.console.log('Promise all');
            bg.console.log(values);
            resolve(values.join(''));
          });
      });
    }
  });
}

function clear() {
  bg.console.log('Call clear');

  let _name = '';
  let _email = '';
  let _enable = false;
  let _settings = {};

  getSettings().then(values => {
    bg.console.log('Values');
    bg.console.log(values);
    [_settings.name, _settings.email, _settings.enable] = values;
    _settings.kwcounter = 0;
    bg.console.log(`Settings ${_name} ${_email} ${_enable}`);
    bg.console.log(_settings);

    return new Promise((resolve, reject) => {
      resolve();
    });
  })
  .then(() => {
    return clearStorage();
  })
  .then(() => {
    return setSettings(_settings);
  })
  .then((values) => {
    bg.console.log('Restore settings');
    bg.console.log(values);
  });
}

/* Promise wrapper of storage clear function.
 */
function clearStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.clear(() => {
      bg.console.log('Clear storage');
      resolve();
    });
  });
}

/* Get settings (an array) consisting of
 *   - user name
 *   - friend email
 *   - extension toggle status
 */
function getSettings() {
  return new Promise((resolve, reject) => {
    let pName = new Promise((resolve, reject) => {
      chrome.storage.local.get(['name'], function(result) {
        if (result !== undefined) {
          _name = result.name;
          resolve(result.name);
        } else { reject('Failed to get user name'); }
      });
    });

    let pEmail = new Promise((resolve, reject) => {
      chrome.storage.local.get(['email'], function(result) {
        if (result !== undefined) {
          _email = result.email;
          resolve(result.email);
        } else { reject('Failed to get friend email'); }
      });
    });

    let pEnable = new Promise((resolve, reject) => {
      chrome.storage.local.get(['enable'], function(result) {
        if (result !== undefined) {
          _enable = result.enable;
          resolve(result.enable);
        } else { reject('Failed to get extention toggle status'); }
      });
    });

    let pSettings = [pName, pEmail, pEnable];
    Promise.all(pSettings).then(values => { resolve(values); });
  });
}

/* Set settings by using a dict
 *   - name: user name
 *   - email: friend email
 *   - enable: extension toggle status
 *   - kwcounter: keywords counter (0 by default)
 */
function setSettings(s) {
  return new Promise((resolve, reject) => {
    let pName = new Promise((resolve, reject) => {
      chrome.storage.local.set({'name': s.name}, function() {
        bg.console.log('Set user name: ' + s.name);
        resolve(s.name);
      });
    });

    let pEmail = new Promise((resolve, reject) => {
      chrome.storage.local.set({'email': s.email}, function() {
        bg.console.log('Set friend email: ' + s.email);
        resolve(s.email);
      });
    });

    let pEnable = new Promise((resolve, reject) => {
      chrome.storage.local.set({'enable': s.enable}, function() {
        bg.console.log('Set extension toggle status: ' + s.enable);
        resolve(s.enable);
      });
    });

    let pKwcounter = new Promise((resolve, reject) => {
      chrome.storage.local.set({'kwcounter': s.kwcounter}, function() {
        bg.console.log('Set keywords counter: ' + s.kwcounter);
        resolve(s.kwcounter);
      });
    });

    let pSettings = [pName, pEmail, pEnable, pKwcounter];
    Promise.all(pSettings).then(values => { resolve(values); });
  });
}
