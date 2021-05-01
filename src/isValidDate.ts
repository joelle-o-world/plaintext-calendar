export function isValidDate(d:any):d is Date {
  return d instanceof Date && !isNaN(d.getTime());
}
export default isValidDate;
