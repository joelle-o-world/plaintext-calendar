"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDurationTag = void 0;
function parseDurationTag(line) {
    var extractResult = /(\s|^)[~](\S+)/.exec(line);
    if (!extractResult || !extractResult[2])
        return null;
    // jesus christ
    var res = /(([\d]+)h)?(([\d]+)m?)?/.exec(extractResult[2]);
    var hours = res[2] ? (parseFloat(res[2]) || 0) : 0;
    var minutes = res[4] ? (parseFloat(res[4]) || 0) : 0;
    if (isNaN(hours) || isNaN(minutes))
        return null;
    return { hours: hours, minutes: minutes };
}
exports.parseDurationTag = parseDurationTag;
