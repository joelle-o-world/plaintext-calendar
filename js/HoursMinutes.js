"use strict";
var __values =
  (this && this.__values) ||
  function (o) {
    var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
        },
      };
    throw new TypeError(
      s ? "Object is not iterable." : "Symbol.iterator is not defined."
    );
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateArray =
  exports.convertToDateArray =
  exports.convertToDate =
  exports.toMinutes =
  exports.add =
  exports.normalise =
    void 0;
function normalise(_a) {
  var hours = _a.hours,
    minutes = _a.minutes;
  minutes += (hours % 1) * 60;
  hours = Math.floor(hours);
  while (minutes >= 60) {
    minutes -= 60;
    ++hours;
  }
  return { hours: hours, minutes: minutes };
}
exports.normalise = normalise;
function add() {
  var e_1, _a;
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var total = { hours: 0, minutes: 0 };
  try {
    for (
      var args_1 = __values(args), args_1_1 = args_1.next();
      !args_1_1.done;
      args_1_1 = args_1.next()
    ) {
      var _b = args_1_1.value,
        hours = _b.hours,
        minutes = _b.minutes;
      total.hours += hours;
      total.minutes += minutes;
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  return normalise(total);
}
exports.add = add;
function toMinutes(_a) {
  var hours = _a.hours,
    minutes = _a.minutes;
  return hours * 60 + minutes;
}
exports.toMinutes = toMinutes;
function convertToDate(_a, date) {
  // NOTE: This function may need to get complex to handle time zones etc
  var hours = _a.hours,
    minutes = _a.minutes;
  var result = new Date(date);
  result.setHours(hours);
  result.setMinutes(minutes);
  return result;
}
exports.convertToDate = convertToDate;
function convertToDateArray(hhmm, day) {
  var date = convertToDate(hhmm, day);
  return exports.dateArray(date);
}
exports.convertToDateArray = convertToDateArray;
exports.dateArray = function (date) {
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
};
