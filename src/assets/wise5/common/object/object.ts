export function copy(obj: any): any {
  return typeof obj === 'undefined' ? undefined : JSON.parse(JSON.stringify(obj));
}

export function serverSaveTimeComparator(
  object1: { serverSaveTime: number },
  object2: { serverSaveTime: number }
): number {
  return object1.serverSaveTime - object2.serverSaveTime;
}
