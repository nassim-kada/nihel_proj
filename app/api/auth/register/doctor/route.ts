import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/dbConnect';
import DoctorModel from '@/lib/models/Doctor';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      type, hospital, firstName, lastName, phone, dateOfBirth, email, wilaya, commune, password, gender,
      specialty, subSpecialties, diplomas, medicalOrderNumber, experience, languages, diplomaFileUrl,
      clinicName, clinicAddress, clinicWilaya, clinicCommune, clinicPhone, website, consultationSchedule, clinicPhotoUrl,
    } = body;

    if (!firstName || !email || !phone || !password || !specialty) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    if (!mongoose.isValidObjectId(specialty)) {
      return NextResponse.json({ error: 'Spécialité invalide' }, { status: 400 });
    }

    const existing = await DoctorModel.findOne({ email: email.toLowerCase() }).lean();
    if (existing) {
      return NextResponse.json({ error: 'Un médecin avec cet email existe déjà' }, { status: 409 });
    }

    const fullName = `${firstName}${lastName ? ' ' + lastName : ''}`;

    const doctor = await DoctorModel.create({
      name: fullName, firstName, lastName,
      email: email.toLowerCase(), phone, specialty, passwordHash: password,
      type, hospital, dateOfBirth, wilaya, commune, gender,
      subSpecialties: subSpecialties || [],
      diplomas: diplomas || [],
      medicalOrderNumber,
      experience: experience ? parseInt(experience) : 0,
      languages: languages || [],
      diplomaFileUrl,
      clinicName, clinicAddress, clinicWilaya, clinicCommune, clinicPhone, website,
      consultationSchedule: consultationSchedule || [],
      clinicPhotoUrl,
    });

    return NextResponse.json(
      { message: 'Compte médecin créé avec succès', user: { id: (doctor._id as any).toString(), role: 'doctor', email: doctor.email, name: doctor.name } },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Doctor register error:', err);
    if (err.code === 11000) return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 });
    return NextResponse.json({ error: 'Erreur serveur: ' + (err.message || 'Inconnue') }, { status: 500 });
  }
}
