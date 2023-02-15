export function getIntersectOfArrays(array1: any[], array2: any[]): any[] {
  return array1.filter((n) => {
    return array2.includes(n);
  });
}
