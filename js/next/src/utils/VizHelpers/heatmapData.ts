const nCol = 8;
const nRow = 2;
const alphabet: Array<any> = [];
let counter = 0;
Array.from(Array(64)).forEach(()=>{
  counter += 1;
  alphabet.push(counter);
});
// const alphabet = [
//   "1",
//   "2",
//   "3",
//   "4",
//   "5",
//   "6",
//   "7",
//   "8",
//   "9",
//   "10",
//   "11",
//   "12",
//   "1",
//   "N",
//   "O",
//   "P",
//   "Q",
//   "R",
//   "S",
//   "T",
//   "U",
//   "V",
//   "W",
//   "X",
//   "Y",
//   "Z",
// ];

type HeatmapData = { x: string; y: string; value: number }[];

let heatmapData: HeatmapData = [];

for (let x = 0; x < nCol; x++) {
  for (let y = 0; y < nRow; y++) {
    heatmapData.push({
      x: alphabet[x],
      y: alphabet[y],
      value: Math.random() * 40,
    });
  }
}

export { heatmapData };
