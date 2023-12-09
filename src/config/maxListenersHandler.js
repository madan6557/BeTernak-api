const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// Fungsi untuk menampilkan jumlah listener saat ini
const displayCurrentListeners = () => {
  const numberOfListeners = myEmitter.listenerCount('myEvent');
  console.log(`Jumlah listener untuk event 'myEvent': ${numberOfListeners}`);
};

// Atur jumlah maksimum listener
myEmitter.setMaxListeners(10);

// // Tambahkan listener yang melebihi batas
// for (let i = 0; i < 15; i++) {
//   myEmitter.on('myEvent', () => {
//     console.log(`Event myEvent terjadi! - Listener ke-${i}`);
//     displayCurrentListeners();
//   });
// }

// console.log('Jumlah listener sekarang:', myEmitter.listenerCount('myEvent'));