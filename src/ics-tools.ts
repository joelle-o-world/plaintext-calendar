export function * extractICSEvents(str:string): Generator<string> {
  const reg = /BEGIN:VEVENT/gi
  let result:RegExpExecArray;
  while((result = reg.exec(str)) !== null) {
    let endIndex = str.indexOf("END:VEVENT", result.index);
    if(endIndex == -1)
      throw "Bad ICS file"
    yield str.slice(result.index + "BEGIN:VEVENT".length, endIndex  );
  }
}

export interface ICSEvent {
  [key: string]: string;
}

export function parseICSEvent(str:string):ICSEvent {
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

export function encodeICSEvent(ev:ICSEvent, addWrappers=false) {
  let lines = [];
  for(let key in ev)
    if(typeof ev[key] === 'string')
      lines.push(key+':'+ev[key])

  if(addWrappers)
    lines = ['BEGIN:VEVENT', ...lines, 'END:VEVENT'];

  return lines.join('\r\n');
}

/** 
 * Hacky function to put ICS events inside a calendar with suitable headers.
 */
export function calendarWrap(str: string) {
  let header = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nPRODID:adamgibbons/ics\r\nMETHOD:PUBLISH\r\nX-PUBLISHED-TTL:PT1H\r\n"

  let footer = "END:VCALENDAR"

  return `${header}${str}${footer}`
}

/**
 * Insert already encoded events into an existing .ics calendar string.
 * The insert is made before the first event in the calendar.
 * */
export function insertEvents(insert:string, into:string) {
  let i = into.indexOf('BEGIN:VEVENT');
  return into.slice(0, i) + insert + '\r\n' + into.slice(i);
}

export function readICSProperty(str:string, fieldName:string) {
  for(let line of str.split(/\r?\n/)) {
    let colonindex = line.indexOf(':');
    if(colonindex == -1)
      continue;
    if(line.slice(0, colonindex) == fieldName) {
      return line.slice(colonindex+1);;
    }
  }
}

export function cancelActiveEvents(str: string):string {
  let cancellations = ''
  for(let e of extractICSEvents(str)) {
    //const UID = readICSProperty(e, 'UID');
    const STATUS = readICSProperty(e, 'STATUS');
    const parsed = parseICSEvent(e)
    if(STATUS != "CANCELLED") {
      cancellations += encodeICSEvent({
        ...parsed,
        METHOD: "CANCEL",
        STATUS: "CANCELLED",
        SEQUENCE: '1',
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
