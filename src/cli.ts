import {readFile} from 'fs'
import parseCalendarText from './parseCalendarText';
import {extractDateFromFilepath} from './parseHeader';

const filepath = process.argv[2];

readFile(filepath, {encoding: 'utf8'}, (err, file) => {
  if(err)
    throw err;

  let filenameDate = extractDateFromFilepath(filepath)

  parseCalendarText(file, {filenameDate});
})
