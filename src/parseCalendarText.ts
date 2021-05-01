import config from './config'
import {splitLines, unindent, decrementIndent} from './util';
import {HoursMinutes, add, toMinutes, convertToDate} from './HoursMinutes';
import {parseTimeTag} from './parseTimeTag';
import {parseDurationTag} from './parseDurationTag'
import {extractHeaderDate, extractDateFromFilepath} from './parseHeader';
import isValidDate from './isValidDate';

export interface TimeSpan {
  startTime: HoursMinutes;
  endTime: HoursMinutes;
}

export interface Event {
  startTime: HoursMinutes;
  endTime: HoursMinutes;
  day: Date|null;
  startDatetime: Date,
  endDatetime: Date,
  parentEvent: Event|null;
  indentedness: number;
  explicitEndTime: boolean;
  explicitDuration: boolean;
  message: string;
  description: string;
}

export interface Warning {
  message: string;
  lineNumber?: number;
  characterNumber?: number;
  errorCode?: number
}

export interface ParseCalendarTextOptions {
  filepath?: string;
}

export function parseCalendarText(
  txt: string, 
  options:ParseCalendarTextOptions={}
) {

  let events:Event[] = []

  let warnings:Warning[] = [];
  const warn = (message:string) => warnings.push({message})

  // Default to todays date
  let day = new Date();

  // Parse date from filename
  if(options.filepath) {
    let filepathDate = extractDateFromFilepath(options.filepath);
    if(filepathDate && isValidDate(filepathDate))
      day = filepathDate
  }

  // loop through lines
  for(let line of splitLines(txt)) {
    let [message, indentedness] = unindent(line)
    let parentEvent = getParentEvent(events, indentedness)
    
    let previousEndTime = getPreviousEndTime(events, indentedness);
    
    const timeTag = parseTimeTag(message)
    const durationTag = parseDurationTag(message)
    const explicitDuration = !!durationTag;
    const explicitEndTime = !!timeTag && !!timeTag.endTime;

    const headerInfo = extractHeaderDate(line, day)
    if(headerInfo) {
      day = headerInfo.headerDate;
    }

    if(timeTag || durationTag) {
      let startTime = timeTag && timeTag.startTime ? timeTag.startTime : previousEndTime;
      let endTime: HoursMinutes
      if(timeTag && timeTag.endTime)
        endTime = timeTag.endTime;
      else if(durationTag)
        endTime = add(startTime, durationTag)
      else
        endTime = add(startTime, config.defaultEventDuration)

      let newEvent:Event = {
        startTime, 
        endTime, 
        message, 
        indentedness, 
        parentEvent,
        description: '',
        explicitEndTime,
        explicitDuration,
        day: day||null,
        startDatetime: convertToDate(startTime, day),
        endDatetime: convertToDate(endTime, day),
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
