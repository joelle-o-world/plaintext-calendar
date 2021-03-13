import {basename, extname} from 'path';
import extractDate from './extractDate';

export function parseHeader(str: string) {
  return parseMarkdownHeader(str) || parseVimwikiHeader(str) || null;
}
export default parseHeader

export function extractHeaderDate(str: string) {
  let parse = parseHeader(str);
  if(parse) {
    let headerDate = extractDate(parse.headerText);
    if(headerDate) {
      return {
        ...parse,
        headerDate
      }
    } else 
      return null
  } else
    return null
}

export function parseMarkdownHeader(str: string) {
  let res = /^(#+)\s+/.exec(str);
  if(res)
    return {
      headerText: str.slice(res[0].length),
      headerLevel: res[1].length,
    }
  else
    return null
}


export function parseVimwikiHeader(str: string) {
  let headerLevel = 0;
  while(str[0] == '=' && str[str.length-1] == '=') {
    ++headerLevel;
    str = str.slice(1,-1)
  }

  if(headerLevel > 0) 
    return {
      headerLevel,
      headerText: str.trim(),
    }
  else
    return null;
}


export function extractDateFromFilepath(filepath: string) {
  let filename = basename(filepath, extname(filepath))
  return extractDate(filename);
}
