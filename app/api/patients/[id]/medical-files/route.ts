import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import PatientModel from '@/lib/models/Patient';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { name, url, fileType } = await req.json();
    if (!name || !url) return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });

    const patient = await PatientModel.findByIdAndUpdate(
      id,
      { $push: { medicalFiles: { name, url, fileType, uploadedAt: new Date() } } },
      { new: true }
    ).lean();

    if (!patient) return NextResponse.json({ error: 'Patient non trouvé' }, { status: 404 });
    const files = (patient as any).medicalFiles;
    return NextResponse.json(files[files.length - 1], { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const fileId = req.nextUrl.searchParams.get('fileId');
    if (!fileId) return NextResponse.json({ error: 'fileId manquant' }, { status: 400 });

    await PatientModel.findByIdAndUpdate(id, { $pull: { medicalFiles: { _id: fileId } } });
    return NextResponse.json({ message: 'Fichier supprimé' });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
