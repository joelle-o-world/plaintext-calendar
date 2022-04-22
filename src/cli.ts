import fs from "fs";
import parseCalendarText from "./parseCalendarText";
import convertToICS from "./convertToICS";
import child_process from "child_process";

const filepath = process.argv[2];
const outputPath = filepath + ".ics";

fs.readFile(filepath, { encoding: "utf8" }, async (err, file) => {
  if (err) throw err;

  const oldFile = fs.existsSync(outputPath)
    ? fs.readFileSync(outputPath, { encoding: "utf8" })
    : undefined;

  const { events, warnings } = parseCalendarText(file, { filepath });

  let icsFile;
  try {
    icsFile = await convertToICS(events, oldFile);
  } catch (err) {
    console.error("Error converting to ICS format:", err);
    return;
  }

  fs.writeFileSync(outputPath, icsFile, { encoding: "utf8" });

  if (events.length || oldFile) child_process.exec(`open ${outputPath}`);
});
