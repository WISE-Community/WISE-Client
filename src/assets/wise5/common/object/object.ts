export function copy(obj: any): any {
  return typeof obj === 'undefined' ? undefined : JSON.parse(JSON.stringify(obj));
}

// https://stackoverflow.com/a/11197343
export function extend(...args: any[]): any {
  for (var i = 1; i < args.length; i++) {
    for (var key in args[i]) {
      if (args[i].hasOwnProperty(key)) {
        args[0][key] = args[i][key];
      }
    }
  }
  return arguments[0];
}

export function serverSaveTimeComparator(
  object1: { serverSaveTime: number },
  object2: { serverSaveTime: number }
): number {
  return object1.serverSaveTime - object2.serverSaveTime;
}
