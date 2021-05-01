import parseCalendarText from './parseCalendarText'
import {parseDurationTag} from './parseDurationTag'



test('parseDurationTag', () => {
  expect(parseDurationTag('~30m')).toStrictEqual({hours: 0, minutes: 30});
});


test('Sequences of events', () => {
  let {events} = parseCalendarText('@2am ~5h Practice Trombone');
  expect(events).toHaveLength(1);

  expect(events[0]).toMatchObject({
    startTime: {hours: 2, minutes:0},
    endTime: {hours: 7, minutes: 0},
    message: "@2am ~5h Practice Trombone",
  })
});

const trombonePracticeRegimen = `
Trombone Practice @2am
  ~1h30m Scales & Arpeggios
  ~3h practice Bohemian Rhapsody
`

test('Nested events', () => {
  let [a, b, c] = parseCalendarText(
    trombonePracticeRegimen
  ).events;

  expect(b.parentEvent).toBe(a)
  expect(c.parentEvent).toBe(a)
  expect(a.startTime).toStrictEqual({hours: 2, minutes:0})
  expect(a.endTime).toStrictEqual(c.endTime);
})


test('Nested overflow warnings', () => {
  const {warnings} = parseCalendarText(`
    Become rich ~30m
      Stare at the wall ~5h
  `);
  expect(warnings.length).toBeGreaterThan(0)
});


test('nested descriptions', () => {
  const [a] = parseCalendarText(`
    Toot a flute @2:22
      It's a hoot!
  `).events

  expect(a.description).toBe("It's a hoot!")
});

test('header dates', () => { 
  const {events} = parseCalendarText('# 2020-03-13\n @2pm Hello');
  expect(events[0].day).toStrictEqual(new Date('2020-03-13'))
  expect(events[0].startDatetime).toStrictEqual(new Date('2020-03-13 14:00'))
});
