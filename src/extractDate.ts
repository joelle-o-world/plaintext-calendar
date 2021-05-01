import isValidDate from "./isValidDate";

export function extractDate(str: string, previousDate?: Date) {
  if(previousDate) {
    let weekday = parseWeekday(str);
    if(weekday !== null) {
      let previousWeekday = previousDate.getDay();
      let difference = weekday - previousWeekday;
      if(difference < 0)
        difference += 7;


      let newDate = new Date(previousDate);
      newDate.setDate(previousDate.getDate() + difference);

      if(isValidDate(newDate))
        return newDate
    }
  }

  // Parse using built-in date class
  let date = new Date(str);
  if(isValidDate(date))
    return date;
  else
    return null;
}

export default extractDate;

const weekdayRegexps = [
  /sun(day)?/i,
  /mon(day)?/i,
  /tues?(day)?/i,
  /(weds?)|(wednesday)/i,
  /thurs?(day)?/i,
  /fri(day)?/i,
  /sat(urday)?/i,
]
export function parseWeekday(str: string):number|null {
  for(let i=0; i < weekdayRegexps.length; ++i) {
    let parse = weekdayRegexps[i].test(str);
    if(parse)
      return i; // js counts sunday as 0
  }
  return null;
}
