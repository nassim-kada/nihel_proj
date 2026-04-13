
import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import DoctorModel from "@/lib/models/Doctor";

export async function GET(
    request: NextRequest,
    // 1. Indiquer que 'params' est une Promesse
    { params }: { params: Promise<{ id: string }> } 
) {
    try {
        await dbConnect(); 
        
        // 2. Utiliser 'await' pour résoudre la promesse
        const { id: doctorId } = await params;
        
        const doctor = await DoctorModel.findById(doctorId).populate('specialty').lean();

        if (!doctor) {
            return NextResponse.json(
                { error: "Docteur non trouvé." }, 
                { status: 404 }
            );
        }

        return NextResponse.json(doctor, { status: 200 });

    } catch (error) {
        // ... (votre gestion d'erreur est correcte) ...
        if (error instanceof Error && error.name === 'CastError') {
            console.error("Invalid Doctor ID format:", error);
            return NextResponse.json(
                { error: "Format d'ID de docteur invalide." },
                { status: 400 }
            );
        }
        
        console.error("can't fetch doctor id: ", error); 
        return NextResponse.json(
            { error: "Échec de la récupération des données du docteur (Erreur interne du serveur)." },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    // 3. Indiquer que 'params' est une Promesse (aussi pour PATCH)
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect(); 
        
        // 4. Utiliser 'await' (aussi pour PATCH)
        const { id: doctorId } = await params;

        let body;
        try {
            body = await request.json(); 
        } catch (e) {
            return NextResponse.json(
                { error: "Le corps de la requête est vide ou n'est pas un JSON valide." },
                { status: 400 }
            );
        }
        
        // ... (le reste de votre logique est correcte) ...
        if (Object.keys(body).length === 0) {
            return NextResponse.json(
                { error: "Aucun champ fourni pour la mise à jour." },
                { status: 400 }
            );
        }

        const updateData: any = {};
        
        if (body.maxPatients !== undefined) {
            updateData.patients = parseInt(body.maxPatients);
        }
        if (body.location !== undefined) {
            updateData.clinic = body.location.trim();
        }
        if (body.fee !== undefined) {
            updateData.fee = body.fee.trim();
        }
        if (body.location !== undefined) {
            updateData.location = body.location.trim();
        }
        if (body.experience !== undefined) {
            updateData.experience = parseInt(body.experience);
        }
        if (body.mapLocation !== undefined) {
            updateData['mapLocation.lat'] = parseFloat(body.mapLocation.lat);
            updateData['mapLocation.lng'] = parseFloat(body.mapLocation.lng);
        }

        console.log("🔄 Mise à jour du docteur:", { doctorId, updateData });

        const updatedDoctor = await DoctorModel.findByIdAndUpdate(
            doctorId,
            { $set: updateData }, 
            { new: true, runValidators: true } 
        ).select('-password'); 

        if (!updatedDoctor) {
            return NextResponse.json(
                { error: "Docteur non trouvé pour la mise à jour." },
                { status: 404 }
            );
        }

        const responseData = {
            ...updatedDoctor.toObject(),
            maxPatients: updatedDoctor.patients,
            location: updatedDoctor.location || updatedDoctor.clinic
        };

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        // ... (votre gestion d'erreur est correcte) ...
        if (error instanceof Error && error.name === 'CastError') {
            console.error("Invalid Doctor ID or update value format:", error);
            return NextResponse.json(
                { error: "Format d'ID ou de valeur de mise à jour invalide." },
                { status: 400 }
            );
        }
        
        if (error instanceof Error && error.name === 'ValidationError') {
            console.error("Mongoose Validation Error:", error.message);
            return NextResponse.json(
                { error: `Erreur de validation des données: ${error.message}` },
                { status: 400 }
            );
        }

        console.error("Error during doctor data update: ", error); 
        return NextResponse.json(
            { error: "Échec de la mise à jour des données du docteur (Erreur interne du serveur)." },
            { status: 500 }
        );
    }
}