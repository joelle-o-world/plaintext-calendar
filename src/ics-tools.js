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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelActiveEvents = exports.readICSProperty = exports.insertEvents = exports.calendarWrap = exports.encodeICSEvent = exports.parseICSEvent = exports.extractICSEvents = void 0;
function extractICSEvents(str) {
    var reg, result, endIndex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reg = /BEGIN:VEVENT/gi;
                _a.label = 1;
            case 1:
                if (!((result = reg.exec(str)) !== null)) return [3 /*break*/, 3];
                endIndex = str.indexOf("END:VEVENT", result.index);
                if (endIndex == -1)
                    throw "Bad ICS file";
                return [4 /*yield*/, str.slice(result.index + "BEGIN:VEVENT".length, endIndex)];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
exports.extractICSEvents = extractICSEvents;
function parseICSEvent(str) {
    var out = {};
    for (var _i = 0, _a = str.split(/\r?\n/); _i < _a.length; _i++) {
        var line = _a[_i];
        var colonindex = line.indexOf(':');
        if (colonindex == -1) {
            continue;
        }
        var key = line.slice(0, colonindex);
        var value = line.slice(colonindex + 1);
        if (out[key])
            console.warn('duplicate keys in event', key);
        out[key] = value;
    }
    return out;
}
exports.parseICSEvent = parseICSEvent;
function encodeICSEvent(ev, addWrappers) {
    if (addWrappers === void 0) { addWrappers = false; }
    var lines = [];
    for (var key in ev)
        if (typeof ev[key] === 'string')
            lines.push(key + ':' + ev[key]);
    if (addWrappers)
        lines = __spreadArrays(['BEGIN:VEVENT'], lines, ['END:VEVENT']);
    return lines.join('\r\n');
}
exports.encodeICSEvent = encodeICSEvent;
/**
 * Hacky function to put ICS events inside a calendar with suitable headers.
 */
function calendarWrap(str) {
    var header = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nPRODID:adamgibbons/ics\r\nMETHOD:PUBLISH\r\nX-PUBLISHED-TTL:PT1H\r\n";
    var footer = "END:VCALENDAR";
    return "" + header + str + footer;
}
exports.calendarWrap = calendarWrap;
/**
 * Insert already encoded events into an existing .ics calendar string.
 * The insert is made before the first event in the calendar.
 * */
function insertEvents(insert, into) {
    var i = into.indexOf('BEGIN:VEVENT');
    return into.slice(0, i) + insert + '\r\n' + into.slice(i);
}
exports.insertEvents = insertEvents;
function readICSProperty(str, fieldName) {
    for (var _i = 0, _a = str.split(/\r?\n/); _i < _a.length; _i++) {
        var line = _a[_i];
        var colonindex = line.indexOf(':');
        if (colonindex == -1)
            continue;
        if (line.slice(0, colonindex) == fieldName) {
            return line.slice(colonindex + 1);
            ;
        }
    }
}
exports.readICSProperty = readICSProperty;
function cancelActiveEvents(str) {
    var cancellations = '';
    for (var _i = 0, _a = extractICSEvents(str); _i < _a.length; _i++) {
        var e = _a[_i];
        //const UID = readICSProperty(e, 'UID');
        var STATUS = readICSProperty(e, 'STATUS');
        var parsed = parseICSEvent(e);
        if (STATUS != "CANCELLED") {
            cancellations += encodeICSEvent(__assign(__assign({}, parsed), { METHOD: "CANCEL", STATUS: "CANCELLED", SEQUENCE: '1', DTSTART: "20090227T235200Z", DTEND: "20090227T235200Z" }), true) + '\r\n';
        }
        //if(STATUS != "CANCELLED") {
        //cancellations += `BEGIN:VEVENT\r\nMETHOD:CANCEL\r\nSTATUS:CANCELLED\r\nSEQUENCE:2\r\nUID:${UID}\r\nDTSTART:20140625T123000Z\r\nEND:VEVENT\r\n`
        //}
    }
    return cancellations;
}
exports.cancelActiveEvents = cancelActiveEvents;
