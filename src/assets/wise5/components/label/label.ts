/**
 * Check if the two arrays of labels contain the same values
 * @param labels1 an array of label objects
 * @param labels2 an array of label objects
 * @return whether the labels contain the same values
 */
export function labelArraysAreTheSame(labels1: any[], labels2: any[]): boolean {
  if (bothObjectsAreNull(labels1, labels2)) {
    return true;
  } else if (oneObjIsNullAndOtherIsNotNull(labels1, labels2)) {
    return false;
  } else {
    return labelArrayContentsAreTheSame(labels1, labels2);
  }
}

export function labelArrayContentsAreTheSame(labels1: any[], labels2: any[]): boolean {
  if (labels1.length != labels2.length) {
    return false;
  } else {
    for (let l = 0; l < labels1.length; l++) {
      if (!labelsAreTheSame(labels1[l], labels2[l])) {
        return false;
      }
    }
  }
  return true;
}

function bothObjectsAreNull(obj1: any, obj2: any): boolean {
  return obj1 == null && obj2 == null;
}

function oneObjIsNullAndOtherIsNotNull(obj1: any, obj2: any): boolean {
  return (obj1 == null && obj2 != null) || (obj1 != null && obj2 == null);
}

/**
 * Check if two labels contain the same values
 * @param label1 a label object
 * @param label2 a label object
 * @return whether the labels contain the same values
 */
export function labelsAreTheSame(label1: any, label2: any): boolean {
  if (bothObjectsAreNull(label1, label2)) {
    return true;
  } else if (oneObjIsNullAndOtherIsNotNull(label1, label2)) {
    return false;
  } else {
    return labelFieldsAreTheSame(label1, label2);
  }
}

function labelFieldsAreTheSame(label1: any, label2: any): boolean {
  return (
    label1.text === label2.text &&
    label1.pointX === label2.pointX &&
    label1.pointY === label2.pointY &&
    label1.textX === label2.textX &&
    label1.textY === label2.textY &&
    label1.color === label2.color
  );
}

export function makeSureValueIsWithinLimit(value: number, limit: number): number {
  if (value < 0) {
    value = 0;
  } else if (value > limit) {
    value = limit;
  }
  return value;
}
