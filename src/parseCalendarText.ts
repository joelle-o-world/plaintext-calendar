import config from './config'
import {splitLines, unindent, decrementIndent} from './util';
import {HoursMinutes, add, toMinutes} from './HoursMinutes';
import {parseTimeTag} from './parseTimeTag';
import {parseDurationTag} from './parseDurationTag'

export interface TimeSpan {
  startTime: HoursMinutes;
  endTime: HoursMinutes;
}

export interface Event {
  startTime: HoursMinutes;
  endTime: HoursMinutes;
  parentEvent: Event|null;
  indentedness: number;
  explicitEndTime: boolean;
  explicitDuration: boolean;
  description: string;
}

export interface Warning {
  message: string;
  lineNumber?: number;
  characterNumber?: number;
  errorCode?: number
}

export function parseCalendarText(txt: string) {

  let previous: Event
  let events:Event[] = []

  let warnings = [];
  const warn = (message:string) => warnings.push({message})


  // loop through lines
  for(let line of splitLines(txt)) {
    let [message, indentedness] = unindent(line)
    let parentEvent = getParentEvent(events, indentedness)
    

    let previousEndTime = getPreviousEndTime(events, indentedness);
    
    let {time, duration} = parseLine(message);
    const explicitDuration = !!duration;
    const explicitEndTime = !!time && !!time.endTime;
  
    if(time || duration) {
      let startTime = time && time.startTime ? time.startTime : previousEndTime;
      let endTime: HoursMinutes
      if(time && time.endTime)
        endTime = time.endTime;
      else if(duration)
        endTime = add(startTime, duration)
      else
        endTime = add(startTime, config.defaultEventDuration)

      let newEvent = {
        startTime, 
        endTime, 
        message, 
        indentedness, 
        previousEvent: previous,
        parentEvent,
        description: '',
        explicitEndTime,
        explicitDuration,
      }
      events.push(newEvent)

      // Extend parent event duration if necessary
      if(parentEvent && toMinutes(endTime) > toMinutes(parentEvent.endTime)) {
        if(parentEvent.explicitEndTime || parentEvent.explicitDuration)
          warn("Oh no, a schedule overflow has occurred!");
        else
          parentEvent.endTime = {...endTime}
      }
    }

    // Append description
    if(parentEvent) { 
      if(!parentEvent.description)
        parentEvent.description = ''
      parentEvent.description += decrementIndent(line, parentEvent.indentedness + config.tabWidth)
    }
  }

  return {events, warnings}
}

export default parseCalendarText;

function parseLine(line:string) {
  // Find any time-tags

  return {
    time: parseTimeTag(line),
    duration: parseDurationTag(line),
  }
}

function getParentEvent(events: Event[], indentedness:number): Event|null {
  // Iterate backwards through events
  for(let i=events.length-1; i >= 0; --i) {
    if(events[i].indentedness < indentedness)
      return events[i]
  }

  // Otherwise,
  return null
}

function getPreviousEndTime(events: Event[], indentedness: number):HoursMinutes {
  // Iterate backwards through events
  for(let i=events.length-1; i >= 0; --i) {
    if(events[i].indentedness == indentedness) {
      return events[i].endTime;
    } else if(events[i].indentedness < indentedness)
      return events[i].startTime;
  }

  // Otherwise
  return config.dayStartsAt;
}
