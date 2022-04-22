import { HoursMinutes } from "./HoursMinutes";

export function parseTimeTag(line: string) {
  let res = /(\s|^)@(\S+)/.exec(line);
  if (!res || !res[2]) return null;

  let timeTag = res[2];

  if (timeTag.includes("-")) {
    let [fromStr, toStr] = timeTag.split("-");
    return {
      endTime: parseTime(toStr),
      startTime: parseTime(fromStr),
    };
  } else
    return {
      startTime: parseTime(timeTag),
      endTime: undefined,
    };
}

/**
 * Parse any valid time string
 */
function parseTime(str: string): HoursMinutes {
  let pm = false,
    amExplicit = false;

  switch (str) {
    case "noon":
      return { hours: 12, minutes: 0 };
    case "midnight":
      return { hours: 0, minutes: 0 };
  }

  if (str.slice(-2).toLowerCase() == "pm") {
    pm = true;
    str = str.slice(0, -2);
  }
  if (str.slice(-2) == "am") {
    amExplicit = true;
    str = str.slice(0, -2);
  }

  let [hh, mm = "00"] = str.split(":");
  let hours = parseInt(hh);
  let minutes = parseInt(mm);

  if (isNaN(minutes) || isNaN(hours))
    throw new Error(`Unable to parse time: ${str}`);

  if (pm && hours != 12) hours += 12;

  if (amExplicit && hours == 12) hours = 0;

  return { hours, minutes };
}
