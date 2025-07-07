import { Shanten } from './src/utils/shanten.js';

// 测试手牌 2333456778899s
const tiles = ['2s', '3s', '3s', '3s', '4s', '5s', '6s', '7s', '7s', '8s', '8s', '9s', '9s'];

// 转换函数
const convertToTiles34Arr = tiles => {
  const arr = Array(34).fill(0);
  tiles.forEach(tile => {
    const num = tile[0] === '0' ? 5 : +tile[0];
    const type = tile[1];
    let idx = { m: 0, p: 9, s: 18 }[type];
    if (idx !== undefined) arr[idx + num - 1]++;
  });
  return arr;
};

const arr = convertToTiles34Arr(tiles);
console.log('手牌:', tiles);
console.log('34数组(索子部分):', arr.slice(18, 27));

const shanten = new Shanten();
console.log('向听数:', shanten.calculateShanten(arr));

// 检查听牌
const res = [];
for (let i = 0; i < 9; i++) {
  if (arr[i + 18] < 4) {
    const tmp = arr.slice();
    tmp[i + 18]++;
    const newShanten = shanten.calculateShanten(tmp);
    console.log(`加入${i+1}s后向听数:`, newShanten);
    if (newShanten === -1) {
      res.push(i + 1);
    }
  }
}
console.log('听牌:', res);
