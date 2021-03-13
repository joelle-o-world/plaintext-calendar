export function extractDate(str: string) {
  let date = new Date(str);
  if(date)
    return date;
  else
    return null;
}

export default extractDate;
