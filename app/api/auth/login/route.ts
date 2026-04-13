import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/dbConnect';
import DoctorModel from '@/lib/models/Doctor';
import PatientModel from '@/lib/models/Patient';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    if (role === 'doctor') {
      const doctor = await DoctorModel.findOne({ email: email.toLowerCase() })
        .select('+password +passwordHash')
        .lean() as any;

      if (!doctor) {
        return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
      }

      let isValid = false;
      if (doctor.passwordHash) {
        isValid = await bcrypt.compare(password, doctor.passwordHash);
      } else if (doctor.password) {
        // Legacy plain-text — migrate on first login
        isValid = doctor.password === password;
        if (isValid) {
          const hash = await bcrypt.hash(password, 10);
          await DoctorModel.updateOne({ _id: doctor._id }, { $set: { passwordHash: hash }, $unset: { password: '' } });
        }
      }

      if (!isValid) {
        return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
      }

      return NextResponse.json({
        user: { id: doctor._id.toString(), role: 'doctor', email: doctor.email, name: doctor.name },
      });
    }

    if (role === 'patient') {
      const patient = await PatientModel.findOne({ email: email.toLowerCase() })
        .select('+passwordHash')
        .lean() as any;

      if (!patient) {
        return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
      }

      const isValid = await bcrypt.compare(password, patient.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
      }

      const name = `${patient.firstName}${patient.lastName ? ' ' + patient.lastName : ''}`;
      return NextResponse.json({
        user: { id: patient._id.toString(), role: 'patient', email: patient.email, name },
      });
    }

    return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
