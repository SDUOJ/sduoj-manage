function time2hour(timediff) {
  timediff /= 1000;
  let h = parseInt(timediff / 3600);
  timediff -= h * 3600;
  let m = parseInt(timediff / 60);
  timediff -= m * 60;
  let s = timediff;
  h = (h < 10 ? '0' : '') + h;
  m = (m < 10 ? '0' : '') + m;
  s = (s < 10 ? '0' : '') + s;
  return [h, m, s].join(':');
}

function time2minute(timediff) {
  timediff /= 1000;
  const h = parseInt(timediff / 3600);
  timediff -= h * 3600;
  const m = parseInt(timediff / 60);
  timediff -= m * 60;
  return h * 60 + m;
}

function time2date(timestamp = +new Date()) {
  if (timestamp) {
    var time = new Date(timestamp);
    var y = time.getFullYear();
    var M = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
  } else {
    return '';
  }
}

export default {
  time2hour,
  time2date,
  time2minute
}