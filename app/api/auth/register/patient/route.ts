import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/dbConnect';
import PatientModel from '@/lib/models/Patient';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { firstName, lastName, email, phone, dateOfBirth, wilaya, commune, gender, password } = body;

    if (!firstName || !email || !phone || !dateOfBirth || !wilaya || !password) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    const existing = await PatientModel.findOne({ email: email.toLowerCase() }).lean();
    if (existing) {
      return NextResponse.json({ error: 'Un compte avec cet email existe déjà' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const patient = await PatientModel.create({
      firstName, lastName, email: email.toLowerCase(),
      phone, dateOfBirth, wilaya, commune, gender, passwordHash,
    });

    const name = `${patient.firstName}${patient.lastName ? ' ' + patient.lastName : ''}`;
    return NextResponse.json(
      { message: 'Compte créé avec succès', user: { id: (patient._id as any).toString(), role: 'patient', email: patient.email, name } },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Patient register error:', err);
    if (err.code === 11000) return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
