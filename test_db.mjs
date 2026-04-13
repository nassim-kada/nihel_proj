import mongoose from 'mongoose';
import fs from 'fs';

async function test() {
  await mongoose.connect('mongodb://localhost:27017/medcall');
  const Doctor = mongoose.connection.db.collection('doctors');
  
  const testDoc = await Doctor.findOne({ name: { $regex: 'Kada', $options: 'i' } });
  if (!testDoc) {
     fs.writeFileSync('test_out.txt', "no doc");
     process.exit(0);
  }
  
  let out = "Before: " + JSON.stringify(testDoc.mapLocation) + "\n";
  
  // Test mongoose schema
  const DocModel = mongoose.model('Doctor', new mongoose.Schema({
    mapLocation: { lat: {type: Number}, lng: {type: Number} }
  }, { strict: false }));
  
  const doc = await DocModel.findById(testDoc._id);
  doc.mapLocation = { lat: 36.3748, lng: 3.8997 };
  await doc.save();
  
  const updated = await Doctor.findOne({ _id: testDoc._id });
  out += "After: " + JSON.stringify(updated.mapLocation);
  
  fs.writeFileSync('test_out.txt', out);
  process.exit(0);
}
test();
