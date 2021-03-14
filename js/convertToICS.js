"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToICS = void 0;
var ics_1 = require("ics");
var ics_tools_1 = require("./ics-tools");
var HoursMinutes_1 = require("./HoursMinutes");
function convertToICS(events, oldFile) {
    console.log("kjfvkdjnbv", oldFile);
    return new Promise(function (fulfil, reject) {
        var preparedEvents = events.map(function (event) { return ({
            title: event.message,
            description: event.description,
            start: HoursMinutes_1.dateArray(event.startDatetime),
            end: HoursMinutes_1.dateArray(event.endDatetime),
        }); });
        ics_1.createEvents(preparedEvents, function (err, icsString) {
            if (err)
                reject(err);
            else {
                if (oldFile) {
                    var cancellations = ics_tools_1.cancelActiveEvents(oldFile);
                    console.log('## cancellations:', cancellations);
                    icsString = ics_tools_1.insertEvents(cancellations, icsString);
                }
                fulfil(icsString);
            }
        });
    });
}
exports.convertToICS = convertToICS;
exports.default = convertToICS;
