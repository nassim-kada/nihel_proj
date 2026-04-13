const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/medcall').then(async () => {
  const doctors = await mongoose.connection.db.collection('doctors').find({}, { projection: { name: 1, mapLocation: 1, location: 1, clinic: 1 } }).toArray();
  console.log(JSON.stringify(doctors, null, 2));
  process.exit(0);
});
