const bcrypt = require('bcryptjs');

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  console.log('Hash generated:', hash);
  const match = await bcrypt.compare('admin123', hash);
  console.log('Self-verify:', match);
  
  // Generate all hashes
  const passwords = ['admin123','agent123','courrier123','secret123','drh123'];
  for (const p of passwords) {
    const h = await bcrypt.hash(p, 10);
    console.log(`${p}: ${h}`);
  }
}
main();
