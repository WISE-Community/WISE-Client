import { Anonymizer } from './Anonymizer';

describe('Anonymizer', () => {
  it('should assign a valid anonymous name based on the index of the provided id', () => {
    const ids = [100, 200, 300];

    const anonymizer100 = new Anonymizer(100, ids);
    // Since 100 is at index 0, it should be mapped to the first animal (Tiger)
    expect(anonymizer100.getName('Student')).toEqual('Student Tiger');

    const anonymizer200 = new Anonymizer(200, ids);
    // 200 is at index 1 -> Lion
    expect(anonymizer200.getName('Student')).toEqual('Student Lion');

    const anonymizer300 = new Anonymizer(300, ids);
    // 300 is at index 2 -> Fox
    expect(anonymizer300.getName('Student')).toEqual('Student Fox');
  });

  it('should append numeric suffixes when the number of ids exceeds the available name options (86)', () => {
    // There are 86 predefined internal names, so we create 87 ids to trigger the suffix logic.
    const manyIds = Array.from({ length: 87 }, (_, i) => i);

    // The very first user (index 0) will now be "Tiger 1" instead of "Tiger"
    const firstAnonymizer = new Anonymizer(0, manyIds);
    expect(firstAnonymizer.getName('Student')).toEqual('Student Tiger 1');

    // The 86th user (index 85, the last of the first batch) will be "Yeti 1"
    const endOfFirstBatch = new Anonymizer(85, manyIds);
    expect(endOfFirstBatch.getName('Student')).toEqual('Student Yeti 1');

    // The 87th user (index 86) overflows into the second batch and becomes "Tiger 2"
    const overflowAnonymizer = new Anonymizer(86, manyIds);
    expect(overflowAnonymizer.getName('Student')).toEqual('Student Tiger 2');
  });

  it('should append higher numeric suffixes dynamically if ids continue to increase vastly', () => {
    // Let's create an array of 200 ids (which will overflow into the 3rd batch since 86 * 2 = 172)
    const massiveIds = Array.from({ length: 200 }, (_, i) => i);

    // Index 171 is the end of the second batch (Yeti 2)
    const endOfSecondBatch = new Anonymizer(171, massiveIds);
    expect(endOfSecondBatch.getName('Student')).toEqual('Student Yeti 2');

    // Index 172 starts the third batch (Tiger 3)
    const startOfThirdBatch = new Anonymizer(172, massiveIds);
    expect(startOfThirdBatch.getName('Student')).toEqual('Student Tiger 3');
  });

  it('should support a custom prefix name', () => {
    const ids = [10, 20];
    const anonymizer = new Anonymizer(10, ids);
    expect(anonymizer.getName('Participant')).toEqual('Participant Tiger');
  });
});
