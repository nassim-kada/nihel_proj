import mongoose from 'mongoose';
import fs from 'fs';

async function test() {
  try {
    await mongoose.connect('mongodb://localhost:27017/medcall');
    const d = await mongoose.connection.db.collection('doctors').find({}).toArray();
    const res = JSON.stringify(d.map(doc => ({ id: doc._id, name: doc.name, location: doc.location, clinic: doc.clinic, mapLocation: doc.mapLocation })), null, 2);
    fs.writeFileSync('test_out.txt', res);
  } catch(e) {
    fs.writeFileSync('test_out.txt', e.toString());
  }
  process.exit(0);
}
test();
