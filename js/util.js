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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitLines = exports.decrementIndent = exports.unindent = void 0;
var config_1 = __importDefault(require("./config"));
function unindent(line) {
    var indentedness = 0;
    var i = 0;
    for (i = 0; i < line.length; ++i) {
        if (line[i] == ' ')
            ++indentedness;
        else if (line[i] == '\t')
            indentedness += config_1.default.tabWidth;
        else
            break;
    }
    return [
        line.slice(i),
        indentedness,
    ];
}
exports.unindent = unindent;
function decrementIndent(line, ammount) {
    var _a = __read(unindent(line), 2), str = _a[0], n = _a[1];
    return ' '.repeat(Math.max(0, n - ammount)) + str;
}
exports.decrementIndent = decrementIndent;
function splitLines(str) {
    return str.split('\n');
}
exports.splitLines = splitLines;
