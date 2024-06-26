// See also https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack
const fileName = (sourceFromStacktrace(0) || '')
  .replace(/(:\d+)+\)?/, '')
  // Remove anything prior to the last slash (Unix/Windows)
  // from the last frame
  .replace(/.+[/\\]/, '');

export function extractStacktrace (e, offset) {
  offset = offset === undefined ? 4 : offset;

  if (e && e.stack) {
    const stack = e.stack.split('\n');
    if (/^error$/i.test(stack[0])) {
      stack.shift();
    }
    if (fileName) {
      const include = [];
      for (let i = offset; i < stack.length; i++) {
        if (stack[i].indexOf(fileName) !== -1) {
          break;
        }
        include.push(stack[i]);
      }
      if (include.length) {
        return include.join('\n');
      }
    }
    return stack[offset];
  }
}

export function sourceFromStacktrace (offset) {
  let error = new Error();

  // Support: Safari <=7, IE 11
  // Not all browsers generate the `stack` property for `new Error()`
  // See also https://github.com/qunitjs/qunit/issues/636
  if (!error.stack) {
    try {
      throw error;
    } catch (err) {
      error = err;
    }
  }

  return extractStacktrace(error, offset);
}
