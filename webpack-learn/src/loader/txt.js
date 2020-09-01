module.exports = function (txt) {
  if (txt) {
    txt = txt.split('\n').join(';');
    console.log('--- compose-loader output:', txt);
  }

  return txt;
}