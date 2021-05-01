"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCalendarText = void 0;
var config_1 = __importDefault(require("./config"));
var util_1 = require("./util");
var HoursMinutes_1 = require("./HoursMinutes");
var parseTimeTag_1 = require("./parseTimeTag");
var parseDurationTag_1 = require("./parseDurationTag");
var parseHeader_1 = require("./parseHeader");
var isValidDate_1 = __importDefault(require("./isValidDate"));
function parseCalendarText(txt, options) {
    var e_1, _a;
    if (options === void 0) { options = {}; }
    var events = [];
    var warnings = [];
    var warn = function (message) { return warnings.push({ message: message }); };
    // Default to todays date
    var day = new Date();
    // Parse date from filename
    if (options.filepath) {
        var filepathDate = parseHeader_1.extractDateFromFilepath(options.filepath);
        if (filepathDate && isValidDate_1.default(filepathDate))
            day = filepathDate;
    }
    try {
        // loop through lines
        for (var _b = __values(util_1.splitLines(txt)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var line = _c.value;
            var _d = __read(util_1.unindent(line), 2), message = _d[0], indentedness = _d[1];
            var parentEvent = getParentEvent(events, indentedness);
            var previousEndTime = getPreviousEndTime(events, indentedness);
            var timeTag = parseTimeTag_1.parseTimeTag(message);
            var durationTag = parseDurationTag_1.parseDurationTag(message);
            var explicitDuration = !!durationTag;
            var explicitEndTime = !!timeTag && !!timeTag.endTime;
            var headerInfo = parseHeader_1.extractHeaderDate(line, day);
            if (headerInfo) {
                day = headerInfo.headerDate;
            }
            if (timeTag || durationTag) {
                var startTime = timeTag && timeTag.startTime ? timeTag.startTime : previousEndTime;
                var endTime = void 0;
                if (timeTag && timeTag.endTime)
                    endTime = timeTag.endTime;
                else if (durationTag)
                    endTime = HoursMinutes_1.add(startTime, durationTag);
                else
                    endTime = HoursMinutes_1.add(startTime, config_1.default.defaultEventDuration);
                var newEvent = {
                    startTime: startTime,
                    endTime: endTime,
                    message: message,
                    indentedness: indentedness,
                    parentEvent: parentEvent,
                    description: '',
                    explicitEndTime: explicitEndTime,
                    explicitDuration: explicitDuration,
                    day: day || null,
                    startDatetime: HoursMinutes_1.convertToDate(startTime, day),
                    endDatetime: HoursMinutes_1.convertToDate(endTime, day),
                };
                events.push(newEvent);
                // Extend parent event duration if necessary
                if (parentEvent && HoursMinutes_1.toMinutes(endTime) > HoursMinutes_1.toMinutes(parentEvent.endTime)) {
                    if (parentEvent.explicitEndTime || parentEvent.explicitDuration)
                        warn("Oh no, a schedule overflow has occurred!");
                    else
                        parentEvent.endTime = __assign({}, endTime);
                }
            }
            // Append description
            if (parentEvent) {
                if (!parentEvent.description)
                    parentEvent.description = '';
                parentEvent.description += util_1.decrementIndent(line, parentEvent.indentedness + config_1.default.tabWidth);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return { events: events, warnings: warnings };
}
exports.parseCalendarText = parseCalendarText;
exports.default = parseCalendarText;
function getParentEvent(events, indentedness) {
    // Iterate backwards through events
    for (var i = events.length - 1; i >= 0; --i) {
        if (events[i].indentedness < indentedness)
            return events[i];
    }
    // Otherwise,
    return null;
}
function getPreviousEndTime(events, indentedness) {
    // Iterate backwards through events
    for (var i = events.length - 1; i >= 0; --i) {
        if (events[i].indentedness == indentedness) {
            return events[i].endTime;
        }
        else if (events[i].indentedness < indentedness)
            return events[i].startTime;
    }
    // Otherwise
    return config_1.default.dayStartsAt;
}
