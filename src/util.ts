import config from "./config";

export function unindent(line: string): [string, number] {
  let indentedness = 0;
  let i = 0;
  for (i = 0; i < line.length; ++i) {
    if (line[i] == " ") ++indentedness;
    else if (line[i] == "\t") indentedness += config.tabWidth;
    else break;
  }

  return [line.slice(i), indentedness];
}

export function decrementIndent(line: string, ammount: number) {
  let [str, n] = unindent(line);
  return " ".repeat(Math.max(0, n - ammount)) + str;
}

export function splitLines(str: string) {
  return str.split("\n");
}
