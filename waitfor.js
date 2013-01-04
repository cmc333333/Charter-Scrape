//  Loves them DSLs
function waitfor(milliseconds) {
  return {
    'then': function(fn) {
      window.setTimeout(fn, milliseconds);
    }
  };
}
