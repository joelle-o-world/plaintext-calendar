
const fs = require('fs');
const path = require('path');
const ics = require('ics');
const child_process = require('child_process')
const {cancelActiveEvents, insertEvents} = require('./parseIcs')

const filepath = process.argv[2]
const dir = path.dirname(filepath)
const events = []

function handleEvent(line, from, to) {


  events.push({
    title: line,
    description: line,
    location:filepath,

    start: [from.getFullYear(), from.getMonth()+1, from.getDate(), from.getHours(), from.getMinutes()],

    end: [to.getFullYear(), to.getMonth()+1, to.getDate(), to.getHours(), to.getMinutes()],

  });
}

function flushEvents() {
  ics.createEvents(events, (err, val) => {
    if(err)
      throw err;

    const calfile = path.resolve(dir, `${datestr}.ics`)
    const oldFileExists = fs.existsSync(calfile)
    if(oldFileExists) {
      const oldFile = fs.readFileSync(calfile, 'utf-8');
      let cancellations = cancelActiveEvents(oldFile);
      val = insertEvents(cancellations, val)
    }

    // Switch the method to request
    //let i = val.indexOf('METHOD:');
    //let j = val.indexOf('\r', i);
    //val = val.slice(0, i) + 'METHOD:REQUEST' + val.slice(j)
    //
    fs.writeFileSync(calfile, val)

    if(events.length || oldFileExists)
      child_process.exec(`open ${calfile}`)
  })
}

const datestr = path.basename(filepath, '.wiki')
let today = new Date(datestr);

fs.readFile(filepath, 'utf-8',  (err, str) => {
  if(err)
    throw err;

  let t = {hh: 9, mm: 0}

  for(let line of str.split('\n')) {
    let duration = extractDuration(line)
    let time = extractTime(line);

    if(time || duration) {
      let timeParsed = parseTime(time);
      let durationParsed = parseDuration(duration)

      const from = timeParsed.from || t;
      let to
      if(timeParsed.to) {
        to = timeParsed.to;
      } else if(durationParsed) {
        to = add(from, durationParsed);
      } else
        to = add(from, {hh:1, mm:0})
      handleEvent(line, makeDateTime(from), makeDateTime(to))

      t = to
    }
  }

  flushEvents();
})

function extractTime(str) {
  let res = /(\s|^)@(\S+)/.exec(str);
  if(res)
    return res[2]
  else
    return null
}

function extractDuration(str) {
  let res = /(\s|^)[~](\S+)/.exec(str);
  if(res)
    return res[2]
  else
    return null
}

function parseTime(str) {
  if(!str)
    return {from: undefined, to: undefined}

  const parse = (s) => {
    let pm=false, hh, mm;
    //if(s.slice(-2) == 'am') {
      //am = true
      //s = s.slice(0, -2)
    //}
    if(s.slice(-2) == 'pm') {
      pm = true
      s = s.slice(0, -2)
    }

    let [h, m='00'] = s.split(':');
    hh = parseInt(h);
    mm = parseInt(m);

    if(!isNaN(hh)) {
      return {hh: hh + (pm ? 12 : 0), mm}
    }
  }

  let [from, to] = str.split('-');
  from = parse(from);
  if(to)
    to = parse(to);

  return {from, to}
}

function parseDuration(str) {
  if(!str)
    return null
  let res = /(([\d]+)h)?(([\d]+)m?)?/.exec(str);
  if(!res)
    return null

  const hh = res[2] ? (parseFloat(res[2]) || 0) : 0
  const mm = res[4] ? (parseFloat(res[4]) || 0) : 0

  if(isNaN(hh) || isNaN(mm))
    return null
  return { hh, mm }
}

function normalise({hh, mm}) {
  mm += (hh % 1) * 60
  hh = Math.floor(hh)
  while(mm >= 60) {
    mm -= 60
    hh++
  }

  return {hh, mm}
}

function add(a, b) {
  return normalise({
    hh: a.hh + b.hh,
    mm: a.mm + b.mm,
  })
}

function makeDateTime({hh, mm}) {
  let date = new Date(today)
  date.setHours(hh);
  date.setMinutes(mm);

  return date
}
