import { Event } from "./parseCalendarText";
import { createEvents } from "ics";
import { insertEvents, cancelActiveEvents } from "./ics-tools";
import { dateArray } from "./HoursMinutes";
import config from "./config";

export function convertToICS(
  events: Event[],
  oldFile?: string
): Promise<string> {
  return new Promise((fulfil, reject) => {
    let preparedEvents = events.map((event) => ({
      title: event.message,
      description: event.description,
      start: dateArray(event.startDatetime),
      end: dateArray(event.endDatetime),
      location: config.useDescriptionAsLocation ? event.description : undefined,
    }));

    createEvents(preparedEvents, (err, icsString) => {
      if (err) reject(err);
      else {
        if (oldFile) {
          let cancellations = cancelActiveEvents(oldFile);
          icsString = insertEvents(cancellations, icsString);
        }
        fulfil(icsString);
      }
    });
  });
}

export default convertToICS;
