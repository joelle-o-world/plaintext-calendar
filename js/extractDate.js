"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDate = void 0;
function extractDate(str) {
    var date = new Date(str);
    if (date)
        return date;
    else
        return null;
}
exports.extractDate = extractDate;
exports.default = extractDate;
