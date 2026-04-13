import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import PatientModel from '@/lib/models/Patient';
import { verifyAccessToken } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const patient = await PatientModel.findById(id).lean();
    if (!patient) return NextResponse.json({ error: 'Patient non trouvé' }, { status: 404 });
    return NextResponse.json(patient);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const allowed = ['firstName', 'lastName', 'phone', 'wilaya', 'commune', 'gender', 'dateOfBirth', 'profilePhotoUrl'];
    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) update[key] = body[key];
    }
    const patient = await PatientModel.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!patient) return NextResponse.json({ error: 'Patient non trouvé' }, { status: 404 });
    return NextResponse.json(patient);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
