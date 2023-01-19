export function copy(obj: any): any {
  return typeof obj === 'undefined' ? undefined : JSON.parse(JSON.stringify(obj));
}
