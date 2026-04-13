async function run() {
  const res = await fetch(`http://localhost:3000/api/doctors`, { cache: 'no-store' });
  const docList = await res.json();
  const testDoc = docList.find(d => d.name.includes("Kada"));
  if(!testDoc) {
    console.log("no doc"); process.exit(0);
  }
  
  console.log("Initial mapLocation:", testDoc.mapLocation);
  
  const patchRes = await fetch(`http://localhost:3000/api/doctors/${testDoc._id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: "Bouira",
      mapLocation: { lat: 36.3748, lng: 3.8997 } // coordinates of Bouira center
    })
  });
  const updated = await patchRes.json();
  console.log("PATCH response mapLocation:", updated.mapLocation);
  console.log("PATCH response clinic:", updated.clinic, " location:", updated.location);
  
  const getRes = await fetch(`http://localhost:3000/api/doctors/${testDoc._id}`);
  const finalDoc = await getRes.json();
  console.log("GET response mapLocation:", finalDoc.mapLocation);
  
  process.exit(0);
}
run();
