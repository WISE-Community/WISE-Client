import { labelArraysAreTheSame, labelsAreTheSame } from './label';
let label1Text: any = 'Label 1';
let label2Text: any = 'Label 2';
let label1PointX: number = 1;
let label1PointY: number = 11;
let label1TextX: number = 111;
let label1TextY: number = 1111;
let label2PointX: number = 2;
let label2PointY: number = 22;
let label2TextX: number = 222;
let label2TextY: number = 2222;
let color1: string = 'blue';
let color2: string = 'red';
const label1 = createLabel(
  label1Text,
  label1PointX,
  label1PointY,
  label1TextX,
  label1TextY,
  color1
);
const label2 = createLabel(
  label2Text,
  label2PointX,
  label2PointY,
  label2TextX,
  label2TextY,
  color2
);

function createLabel(
  text: string = '',
  pointX: number = 100,
  pointY: number = 100,
  textX: number = 200,
  textY: number = 200,
  color: string = color1,
  canEdit: boolean = true,
  canDelete: boolean = true
): any {
  return {
    text: text,
    color: color,
    pointX: pointX,
    pointY: pointY,
    textX: textX,
    textY: textY,
    canEdit: canEdit,
    canDelete: canDelete
  };
}

fdescribe('Label', () => {
  test_labelsAreTheSame();
  test_labelArraysAreTheSame();
});

function test_labelsAreTheSame() {
  describe('labelsAreTheSame()', () => {
    it('should check if labels are the same when they are both null', () => {
      expectLabelsAreTheSame(null, null, true);
    });
    it('should check if labels are the same when one is null and one is not null', () => {
      expectLabelsAreTheSame({}, null, false);
    });
    it(`should check if labels are the same when both are not null and do not have the same
      values`, () => {
      expectLabelsAreTheSame(label1, label2, false);
    });
    it(`should check if labels are the same when both are not null and do have the same
      values`, () => {
      const label3 = createLabel(
        label1Text,
        label1PointX,
        label1PointY,
        label1TextX,
        label1TextY,
        color1
      );
      expectLabelsAreTheSame(label1, label3, true);
    });
  });
}

function test_labelArraysAreTheSame() {
  function expectLabelArraysAreTheSame(labels1: any[], labels2: any[], expectedResult) {
    expect(labelArraysAreTheSame(labels1, labels2)).toEqual(expectedResult);
  }
  it('should check if label arrays are the same when they are both null', () => {
    expectLabelArraysAreTheSame(null, null, true);
  });
  it('should check if label arrays are the same when one is null and the other is not null', () => {
    expectLabelArraysAreTheSame([label1], null, false);
  });
  it(`should check if label arrays are the same when both are not null and contain different
      labels`, () => {
    expectLabelArraysAreTheSame([label1], [label2], false);
  });
  it(`should check if label arrays are the same when both are not null and contain the same
      labels`, () => {
    expectLabelArraysAreTheSame([label1, label2], [label1, label2], true);
  });
}

function expectLabelsAreTheSame(label1: any, label2: any, expectedResult: any) {
  expect(labelsAreTheSame(label1, label2)).toEqual(expectedResult);
}
