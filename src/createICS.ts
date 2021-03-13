import {Event} from './parseCalendarText';
import {createEvents} from 'ics'
import {convertToDateArray} from './HoursMinutes';

export function createDayICS(events: Event[], day: Date) {
  return new Promise((fulfil, reject) => {
    let preparedEvents = events.map(event => ({
      title: event.message,
      description: event.description,
      start: convertToDateArray(event.startTime, day),
      end: convertToDateArray(event.endTime, day),
    }))

    createEvents(preparedEvents, (err, value) => {
      if (err)
        reject(err)
      else
        fulfil(value);
    })
  })
}

