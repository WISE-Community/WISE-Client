import { mergeBucket } from './bucket';

const bucket1 = {
  id: 'bucket1',
  type: 'bucket',
  value: 'Bucket A',
  items: []
};
const bucket2 = {
  id: 'bucket2',
  type: 'bucket',
  value: 'Bucket B',
  items: []
};
const bucket3 = {
  id: 'bucket3',
  type: 'bucket',
  value: 'Bucket C',
  items: []
};
const choice1 = {
  id: 'choice1',
  type: 'choice',
  value: 'Choice A'
};
const choice2 = {
  id: 'choice2',
  type: 'choice',
  value: 'Choice B'
};
const choice3 = {
  id: 'choice3',
  type: 'choice',
  value: 'Choice C'
};

describe('Bucket', () => {
  describe('mergeBucket()', () => {
    mergeBucket_BucketExists_MergeChoices();
    mergeBucket_BucketDoesNotExist_AddBucket();
  });
});

function mergeBucket_BucketExists_MergeChoices() {
  it('should merge bucket when the bucket is not in the existing buckets array', () => {
    const buckets = [bucket1, bucket2];
    const mergedBuckets = mergeBucket(buckets, bucket3);
    expect(mergedBuckets.length).toEqual(3);
    expect(mergedBuckets[0].id).toEqual('bucket1');
    expect(mergedBuckets[1].id).toEqual('bucket2');
    expect(mergedBuckets[2].id).toEqual('bucket3');
  });
}

function mergeBucket_BucketDoesNotExist_AddBucket() {
  it('should merge bucket when the bucket is in the existing buckets array', () => {
    bucket1.items.push(choice1);
    bucket1.items.push(choice2);
    const buckets = [bucket1, bucket2];
    const anotherBucket1 = {
      id: 'bucket1',
      type: 'bucket',
      value: 'Bucket A',
      items: [choice2, choice3]
    };
    const mergedBuckets = mergeBucket(buckets, anotherBucket1);
    expect(mergedBuckets.length).toEqual(2);
    expect(mergedBuckets[0].id).toEqual('bucket1');
    expect(mergedBuckets[1].id).toEqual('bucket2');
    expect(mergedBuckets[0].items.length).toEqual(3);
    expect(mergedBuckets[0].items[0].id).toEqual('choice1');
    expect(mergedBuckets[0].items[1].id).toEqual('choice2');
    expect(mergedBuckets[0].items[2].id).toEqual('choice3');
  });
}
