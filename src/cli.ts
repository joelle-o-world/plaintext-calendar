import fs from 'fs'
import parseCalendarText from './parseCalendarText';
import convertToICS from './convertToICS';
import child_process from 'child_process';

const filepath = process.argv[2];
const outputPath = filepath + '.ics'

fs.readFile(filepath, {encoding: 'utf8'}, async (err, file) => {
  if(err)
    throw err;

  const {events, warnings} = parseCalendarText(file, {filepath});

  const oldFile = fs.existsSync(outputPath) ? 
    fs.readFileSync(outputPath, {encoding: 'utf8'}) 
      : undefined;

  let icsFile = await convertToICS(events, oldFile);

  fs.writeFileSync(outputPath, icsFile, {encoding:'utf8'})


  if(events.length || oldFile)
    child_process.exec(`open ${outputPath}`)
})

