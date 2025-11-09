import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Convertir le File en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // --- DÉBUT DE LA MODIFICATION ---
    // Déterminer le resource_type en fonction du type de fichier
    // Si c'est un PDF, utilisez 'raw'. Sinon, laissez 'auto' gérer les images/vidéos.
    const resource_type = file.type === 'application/pdf' ? 'raw' : 'auto';
    // --- FIN DE LA MODIFICATION ---

    // Upload vers Cloudinary en utilisant upload_stream
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'doctor-app', 
          resource_type: resource_type, // <-- Utiliser la variable
          access_mode: 'public' 
        },
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer); 
    });

    return NextResponse.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Erreur upload Cloudinary:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    );
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const { public_id } = await request.json();
    
    if (!public_id) {
      return NextResponse.json(
        { error: 'Public ID manquant' },
        { status: 400 }
      );
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, (error: any, result: any) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return NextResponse.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Erreur suppression Cloudinary:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}