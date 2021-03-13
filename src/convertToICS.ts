import {Event} from './parseCalendarText';
import {createEvents} from 'ics'
import {insertEvents, cancelActiveEvents} from './ics-tools'
import {dateArray} from './HoursMinutes';

export function convertToICS(events: Event[], oldFile?: string) {
  return new Promise((fulfil, reject) => {
    let preparedEvents = events.map(event => ({
      title: event.message,
      description: event.description,
      start: dateArray(event.startDatetime),
      end: dateArray(event.endDatetime),
    }))

    createEvents(preparedEvents, (err, icsString) => {
      if (err)
        reject(err)
      else {
        if(oldFile) {
          let cancellations = cancelActiveEvents(oldFile);
          icsString =  insertEvents(cancellations, icsString);
        }
        fulfil(icsString);
      }
    })
  })
}

