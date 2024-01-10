const csvArraySample = {
  delimitedString: `Column 1,Column 2,"Column 3","Column4"
First,33.8,92.8,"13,515"
Second,10.7,,"21,113"
3,22.4,72.3,"26,641"
"4",,89.7,"26,852"`,
  convertedArray: [
    ['Column 1', 'Column 2', 'Column 3', 'Column4'],
    ['First', 33.8, 92.8, 13515],
    ['Second', 10.7, '', 21113],
    [3, 22.4, 72.3, 26641],
    [4, '', 89.7, 26852]
  ]
};
export default csvArraySample;
