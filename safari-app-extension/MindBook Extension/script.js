function parseKeyword() {
  return new URL(location.href).searchParams.get('q');
}

function saveKeyword(keyword) {
  /**
   * 1. if kwcounter exists, ++, else, = 1.
   * 2. save {kwcounter: {keyword: keyword, datatime: _now}} to storage.
   */
  if (keyword) {
    safari.extension.dispatchMessage('save', { keyword: keyword, datetime: getCurrentDatetime() });
  }
}

function getCurrentDatetime() {
  // support timezone shift and remove the tailing 'Z'
  const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
  return (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
}

safari.self.addEventListener('message', event => {
  console.log(event);
  if (event.name === 'loaded') {
    if (/* DEBUG: event.message.enabled */ true) {
      saveKeyword(parseKeyword());
    }
  }
})

safari.extension.dispatchMessage('load', { enabled: null });