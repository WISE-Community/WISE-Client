import { Choice, mergeChoices } from './choice';

export class Bucket {
  id: string;
  items?: Choice[];
  value: string;

  constructor(id: string, value: string) {
    this.id = id;
    this.value = value;
  }
}

/**
 * Merge a bucket into the array of buckets. If the bucket id already exists in the array, merge
 * the choices in the bucket. If the bucket does not already exist in the array, add the bucket.
 * The array of buckets will be modified.
 * @param {array} buckets an array of buckets
 * @param {object} bucket the bucket
 * @return {array} an array of buckets
 */
export function mergeBucket(buckets: any[], bucket: any): any[] {
  let bucketFound = false;
  for (const tempBucket of buckets) {
    if (tempBucket.id === bucket.id) {
      bucketFound = true;
      tempBucket.items = mergeChoices(tempBucket.items, bucket.items);
    }
  }
  if (!bucketFound) {
    buckets.push(bucket);
  }
  return buckets;
}
