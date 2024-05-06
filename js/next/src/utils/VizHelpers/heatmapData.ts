const nCol = 16;
const nRow = 4;
const alphabet: Array<any> = [];
let counter = 0;
Array.from(Array(64)).forEach(()=>{
  counter += 1;
  alphabet.push(counter);
});


type HeatmapData = { x: string; y: string; value: number }[];

let heatmapData: HeatmapData = [];

for (let x = 0; x < nCol; x++) {
  for (let y = 0; y < nRow; y++) {
    heatmapData.push({
      x: alphabet[x],
      y: alphabet[y],
      value: x % 4 === 2 ? 0 : y * (x % 4),
    });
  }
}

export { heatmapData };
