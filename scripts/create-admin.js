require('dotenv').config();
const bcrypt = require('bcrypt');
const prisma = require('../src/db');

const [, , username, password] = process.argv;
if (!username || !password) {
  console.error('Usage: node scripts/create-admin.js <username> <password>');
  process.exit(1);
}

bcrypt.hash(password, 12).then((passwordHash) => prisma.adminUser.upsert({
  where: { username },
  update: { passwordHash },
  create: { username, passwordHash }
})).then(() => console.log(`Admin '${username}' is ready.`)).catch(console.error).finally(() => prisma.$disconnect());
