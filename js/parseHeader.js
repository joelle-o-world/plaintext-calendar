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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDateFromFilepath = exports.parseVimwikiHeader = exports.parseMarkdownHeader = exports.extractHeaderDate = exports.parseHeader = void 0;
var path_1 = require("path");
var extractDate_1 = __importDefault(require("./extractDate"));
function parseHeader(str) {
    return parseMarkdownHeader(str) || parseVimwikiHeader(str) || null;
}
exports.parseHeader = parseHeader;
exports.default = parseHeader;
function extractHeaderDate(str) {
    var parse = parseHeader(str);
    if (parse) {
        var headerDate = extractDate_1.default(parse.headerText);
        if (headerDate) {
            return __assign(__assign({}, parse), { headerDate: headerDate });
        }
        else
            return null;
    }
    else
        return null;
}
exports.extractHeaderDate = extractHeaderDate;
function parseMarkdownHeader(str) {
    var res = /^(#+)\s+/.exec(str);
    if (res)
        return {
            headerText: str.slice(res[0].length),
            headerLevel: res[1].length,
        };
    else
        return null;
}
exports.parseMarkdownHeader = parseMarkdownHeader;
function parseVimwikiHeader(str) {
    var headerLevel = 0;
    while (str[0] == '=' && str[str.length - 1] == '=') {
        ++headerLevel;
        str = str.slice(1, -1);
    }
    if (headerLevel > 0)
        return {
            headerLevel: headerLevel,
            headerText: str.trim(),
        };
    else
        return null;
}
exports.parseVimwikiHeader = parseVimwikiHeader;
function extractDateFromFilepath(filepath) {
    var filename = path_1.basename(filepath, path_1.extname(filepath));
    return extractDate_1.default(filename);
}
exports.extractDateFromFilepath = extractDateFromFilepath;
