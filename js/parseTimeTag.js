"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeTag = void 0;
function parseTimeTag(line) {
    var res = /(\s|^)@(\S+)/.exec(line);
    if (!res || !res[2])
        return null;
    var timeTag = res[2];
    if (timeTag.includes('-')) {
        var _a = __read(timeTag.split('-'), 2), fromStr = _a[0], toStr = _a[1];
        return {
            endTime: parseTime(toStr),
            startTime: parseTime(fromStr),
        };
    }
    else
        return {
            startTime: parseTime(timeTag),
            endTime: undefined
        };
}
exports.parseTimeTag = parseTimeTag;
/**
 * Parse any valid time string
 */
function parseTime(str) {
    var pm = false, amExplicit = false;
    switch (str) {
        case 'noon':
            return { hours: 12, minutes: 0 };
        case 'midnight':
            return { hours: 0, minutes: 0 };
    }
    if (str.slice(-2).toLowerCase() == 'pm') {
        pm = true;
        str = str.slice(0, -2);
    }
    if (str.slice(-2) == 'am') {
        amExplicit = true;
        str = str.slice(0, -2);
    }
    var _a = __read(str.split(':'), 2), hh = _a[0], _b = _a[1], mm = _b === void 0 ? '00' : _b;
    var hours = parseInt(hh);
    var minutes = parseInt(mm);
    if (isNaN(minutes) || isNaN(hours))
        throw new Error("Unable to parse time: " + str);
    if (pm && hours != 12)
        hours += 12;
    if (amExplicit && hours == 12)
        hours = 0;
    return { hours: hours, minutes: minutes };
}
