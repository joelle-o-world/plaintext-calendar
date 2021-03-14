"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToICS = void 0;
var ics_1 = require("ics");
var ics_tools_1 = require("./ics-tools");
var HoursMinutes_1 = require("./HoursMinutes");
var config_1 = __importDefault(require("./config"));
function convertToICS(events, oldFile) {
    return new Promise(function (fulfil, reject) {
        var preparedEvents = events.map(function (event) { return ({
            title: event.message,
            description: event.description,
            start: HoursMinutes_1.dateArray(event.startDatetime),
            end: HoursMinutes_1.dateArray(event.endDatetime),
            location: config_1.default.useDescriptionAsLocation ? event.description : undefined,
        }); });
        ics_1.createEvents(preparedEvents, function (err, icsString) {
            if (err)
                reject(err);
            else {
                if (oldFile) {
                    var cancellations = ics_tools_1.cancelActiveEvents(oldFile);
                    icsString = ics_tools_1.insertEvents(cancellations, icsString);
                }
                fulfil(icsString);
            }
        });
    });
}
exports.convertToICS = convertToICS;
exports.default = convertToICS;
