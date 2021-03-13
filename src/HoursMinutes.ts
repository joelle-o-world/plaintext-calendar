
export interface HoursMinutes {
  hours: number;
  minutes: number;
}
export default HoursMinutes
export function normalise({hours, minutes}:HoursMinutes): HoursMinutes {
  minutes += (hours % 1) * 60;
  hours = Math.floor(hours)
  while(minutes >= 60) {
    minutes -= 60
    ++hours
  }
  return {hours, minutes}
}

export function add(...args:HoursMinutes[]) {
  let total = {hours: 0, minutes: 0}

  for(let {hours, minutes} of args) {
    total.hours += hours
    total.minutes += minutes
  }

  return normalise(total)
}

export function toMinutes({hours, minutes}:HoursMinutes) {
  return hours * 60 + minutes
}
