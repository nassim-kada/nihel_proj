import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
    mapLocation: {
      lat: { type: Number },
      lng: { type: Number },
    }
}, { strict: false });

const Doctor = mongoose.model('Doctor', DoctorSchema);

async function test() {
  await mongoose.connect('mongodb://localhost:27017/medcall');
  const testDoc = await Doctor.findOne();
  if(!testDoc) {
    console.log("no doc"); process.exit();
  }
  
  testDoc.mapLocation = { lat: 36.123, lng: 3.456 };
  await testDoc.save();
  
  const fetched = await Doctor.findById(testDoc._id).lean();
  console.log("Saved mapLocation:", fetched.mapLocation);
  process.exit();
}
test();
