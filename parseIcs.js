function * extractEvents(str) {
  const reg = /BEGIN:VEVENT/gi
  let result;
  while((result = reg.exec(str)) !== null) {
    let endIndex = str.indexOf("END:VEVENT", result.index);
    if(endIndex == -1)
      throw "Bad ICS file"
    yield str.slice(result.index + "BEGIN:VEVENT".length, endIndex  );
  }
}

function extractUID(str) {
  const reg = /UID:(.+)/gi

  let result = reg.exec(str);
  if(result) {
    return result[1];
  } else 
    return null
}

function extractValue(str, fieldName) {
  for(let line of str.split(/\r?\n/)) {
    let colonindex = line.indexOf(':');
    if(colonindex == -1)
      continue;
    if(line.slice(0, colonindex) == fieldName) {
      return line.slice(colonindex+1);;
    }
  }
}

function parseEvent(str) {
  let out = {};
  for(let line of str.split(/\r?\n/)) {
    let colonindex = line.indexOf(':');
    if(colonindex == -1) {
      continue
    }
    let key = line.slice(0, colonindex);
    let value = line.slice(colonindex + 1);
    if(out[key])
      console.warn('duplicate keys in event', key);
    out[key] = value;
  }
  return out;
}
function encodeEvent(ev, addWrappers=false) {
  let lines = [];
  for(let key in ev)
    if(typeof ev[key] === 'string')
      lines.push(key+':'+ev[key])

  if(addWrappers)
    lines = ['BEGIN:VEVENT', ...lines, 'END:VEVENT'];

  return lines.join('\r\n');
}



function cancelActiveEvents(str) {
  let cancellations = ''
  let numberOfCancellations = 0
  for(let e of extractEvents(str)) {
    const UID = extractValue(e, 'UID');
    const STATUS = extractValue(e, 'STATUS');
    const parsed = parseEvent(e)
    if(e.STATUS != "CANCELLED") {
      numberOfCancellations++;
      cancellations += encodeEvent({
        ...parsed,
        METHOD: "CANCEL",
        STATUS: "CANCELLED",
        SEQUENCE: 1,
        DTSTART: "20090227T235200Z",
        DTEND: "20090227T235200Z"
      }, true) + '\r\n'
    }
    //if(STATUS != "CANCELLED") {
      //cancellations += `BEGIN:VEVENT\r\nMETHOD:CANCEL\r\nSTATUS:CANCELLED\r\nSEQUENCE:2\r\nUID:${UID}\r\nDTSTART:20140625T123000Z\r\nEND:VEVENT\r\n`
    //}
  }

  return cancellations
}

/**
 * Insert new events into an existing .ics string
 * */
function insertEvents(insert, into) {
  let i = into.indexOf('BEGIN:VEVENT');
  return into.slice(0, i) + insert + '\r\n' + into.slice(i);
}

function calendarWrap(str) {
  let header = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nPRODID:adamgibbons/ics\r\nMETHOD:PUBLISH\r\nX-PUBLISHED-TTL:PT1H\r\n"

  let footer = "END:VCALENDAR"

  return `${header}${str}${footer}`
}


module.exports = {cancelActiveEvents, insertEvents};
