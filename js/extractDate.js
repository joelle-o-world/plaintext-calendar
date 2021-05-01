"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWeekday = exports.extractDate = void 0;
var isValidDate_1 = __importDefault(require("./isValidDate"));
function extractDate(str, previousDate) {
    if (previousDate) {
        var weekday = parseWeekday(str);
        if (weekday !== null) {
            var previousWeekday = previousDate.getDay();
            var difference = weekday - previousWeekday;
            if (difference < 0)
                difference += 7;
            var newDate = new Date(previousDate);
            newDate.setDate(previousDate.getDate() + difference);
            if (isValidDate_1.default(newDate))
                return newDate;
        }
    }
    // Parse using built-in date class
    var date = new Date(str);
    if (isValidDate_1.default(date))
        return date;
    else
        return null;
}
exports.extractDate = extractDate;
exports.default = extractDate;
var weekdayRegexps = [
    /sun(day)?/i,
    /mon(day)?/i,
    /tues?(day)?/i,
    /(weds?)|(wednesday)/i,
    /thurs?(day)?/i,
    /fri(day)?/i,
    /sat(urday)?/i,
];
function parseWeekday(str) {
    for (var i = 0; i < weekdayRegexps.length; ++i) {
        var parse = weekdayRegexps[i].test(str);
        if (parse)
            return i; // js counts sunday as 0
    }
    return null;
}
exports.parseWeekday = parseWeekday;
