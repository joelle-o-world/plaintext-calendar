export interface HoursMinutes {
  hours: number;
  minutes: number;
}
export default HoursMinutes;
export function normalise({ hours, minutes }: HoursMinutes): HoursMinutes {
  minutes += (hours % 1) * 60;
  hours = Math.floor(hours);
  while (minutes >= 60) {
    minutes -= 60;
    ++hours;
  }
  return { hours, minutes };
}

export function add(...args: HoursMinutes[]) {
  let total = { hours: 0, minutes: 0 };

  for (let { hours, minutes } of args) {
    total.hours += hours;
    total.minutes += minutes;
  }

  return normalise(total);
}

export function toMinutes({ hours, minutes }: HoursMinutes) {
  return hours * 60 + minutes;
}

export function convertToDate({ hours, minutes }: HoursMinutes, date: Date) {
  // NOTE: This function may need to get complex to handle time zones etc

  let result = new Date(date);
  result.setHours(hours);
  result.setMinutes(minutes);

  return result;
}

export type DateArray = [
  number, // Year
  number, // Month
  number, // Day
  number, // Hours
  number // Minutes
];

export function convertToDateArray(hhmm: HoursMinutes, day: Date): DateArray {
  let date = convertToDate(hhmm, day);

  return dateArray(date);
}

export const dateArray = (date: Date): DateArray => [
  date.getFullYear(),
  date.getMonth() + 1,
  date.getDate(),
  date.getHours(),
  date.getMinutes(),
];
