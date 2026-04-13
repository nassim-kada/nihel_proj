import mongoose from 'mongoose';
import fetch from 'node-fetch';

async function test() {
  await mongoose.connect('mongodb://localhost:27017/medcall');
  const Doctor = mongoose.connection.db.collection('doctors');
  
  const docs = await Doctor.find({}).toArray();
  if (docs.length === 0) {
     console.log("No doctors found in DB!");
     process.exit(0);
  }
  
  const testDoc = docs[0];
  console.log("Testing with doctor ID: ", testDoc._id.toString());
  console.log("Current mapLocation:", testDoc.mapLocation);
  
  const res = await fetch(`http://localhost:3000/api/doctors/${testDoc._id.toString()}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mapLocation: { lat: 36.5, lng: 3.5 } })
  });
  
  const result = await res.json();
  console.log("API Response mapLocation:", result.mapLocation);
  
  const updatedDoc = await Doctor.findOne({ _id: testDoc._id });
  console.log("MongoDB Verification mapLocation:", updatedDoc.mapLocation);
  process.exit(0);
}
test().catch(e => { console.error(e); process.exit(1); });
