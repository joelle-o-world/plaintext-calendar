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
var parseCalendarText_1 = __importDefault(require("./parseCalendarText"));
var parseDurationTag_1 = require("./parseDurationTag");
test('parseDurationTag', function () {
    expect(parseDurationTag_1.parseDurationTag('~30m')).toStrictEqual({ hours: 0, minutes: 30 });
});
test('Sequences of events', function () {
    var events = parseCalendarText_1.default('@2am ~5h Practice Trombone').events;
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
        startTime: { hours: 2, minutes: 0 },
        endTime: { hours: 7, minutes: 0 },
        message: "@2am ~5h Practice Trombone",
    });
});
var trombonePracticeRegimen = "\nTrombone Practice @2am\n  ~1h30m Scales & Arpeggios\n  ~3h practice Bohemian Rhapsody\n";
test('Nested events', function () {
    var _a = __read(parseCalendarText_1.default(trombonePracticeRegimen).events, 3), a = _a[0], b = _a[1], c = _a[2];
    expect(b.parentEvent).toBe(a);
    expect(c.parentEvent).toBe(a);
    expect(a.startTime).toStrictEqual({ hours: 2, minutes: 0 });
    expect(a.endTime).toStrictEqual(c.endTime);
});
test('Nested overflow warnings', function () {
    var warnings = parseCalendarText_1.default("\n    Become rich ~30m\n      Stare at the wall ~5h\n  ").warnings;
    expect(warnings.length).toBeGreaterThan(0);
});
test('nested descriptions', function () {
    var _a = __read(parseCalendarText_1.default("\n    Toot a flute @2:22\n      It's a hoot!\n  ").events, 1), a = _a[0];
    expect(a.description).toBe("It's a hoot!");
});
test('header dates', function () {
    var events = parseCalendarText_1.default('# 2020-03-13\n @2pm Hello').events;
    expect(events[0].day).toStrictEqual(new Date('2020-03-13'));
    expect(events[0].startDatetime).toStrictEqual(new Date('2020-03-13 14:00'));
});
