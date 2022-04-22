import HoursMinutes from "./HoursMinutes";

export function parseDurationTag(line: string): null | HoursMinutes {
  let extractResult = /(\s|^)[~](\S+)/.exec(line);
  if (!extractResult || !extractResult[2]) return null;

  // TODO: Maybe use multiple simpler regexps
  let res = /(([\d]+)h)?(([\d]+)m?)?/.exec(extractResult[2]);
  if (!res) return null;

  const hours = res[2] ? parseFloat(res[2]) || 0 : 0;
  const minutes = res[4] ? parseFloat(res[4]) || 0 : 0;

  if (isNaN(hours) || isNaN(minutes)) return null;

  return { hours, minutes };
}
