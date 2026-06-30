const mongoose = require('mongoose');
require('dotenv').config();

console.log('URL:', process.env.ATLASDB_URL);

mongoose
  .connect(process.env.ATLASDB_URL)
  .then(() => {
    console.log('✅ Connected Successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err);
  });
