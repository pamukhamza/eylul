// Parola hash üretici
// Kullanım: node scripts/hash.js <parola>
const bcrypt = require("bcryptjs");

const pwd = process.argv[2];
if (!pwd) {
  console.error("Kullanim: node scripts/hash.js <parola>");
  process.exit(1);
}

const hash = bcrypt.hashSync(pwd, 12);
console.log(hash);
