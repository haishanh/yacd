// steal from https://github.com/sindresorhus/pretty-bytes/blob/master/index.js

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export default number => {
  if (number < 1000) {
    return number + ' B';
  }
  const exponent = Math.min(
    Math.floor(Math.log10(number) / 3),
    UNITS.length - 1
  );
  number = Number((number / Math.pow(1000, exponent)).toPrecision(3));
  const unit = UNITS[exponent];
  return number + ' ' + unit;
};
