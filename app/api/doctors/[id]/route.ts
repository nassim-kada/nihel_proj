// app/api/doctors/[id]/route.ts (Confirmé)

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import DoctorModel from "@/lib/models/Doctor";
import { CastError } from "mongoose";

// --- GET Request Handler ---
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect(); 
        
        const { id: doctorId } = await params;
        
        const doctor = await DoctorModel.findById(doctorId).lean();

        if (!doctor) {
            return NextResponse.json(
                { error: "Docteur non trouvé." }, 
                { status: 404 }
            );
        }

        return NextResponse.json(doctor, { status: 200 });

    } catch (error) {
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

// --- PATCH Request Handler (Pour mettre à jour les frais) ---
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect(); 
        
        const { id: doctorId } = await params;

        let body;
        try {
            // Tente de parser le corps de la requête.
            body = await request.json(); 
        } catch (e) {
            // Gère l'erreur 'unexpected end of data' si le corps est vide/invalide
            return NextResponse.json(
                { error: "Le corps de la requête est vide ou n'est pas un JSON valide." },
                { status: 400 }
            );
        }

        if (Object.keys(body).length === 0) {
            return NextResponse.json(
                { error: "Aucun champ fourni pour la mise à jour." },
                { status: 400 }
            );
        }

        // Met à jour le document avec les champs fournis dans le corps ({ $set: { fee: '...' } })
        const updatedDoctor = await DoctorModel.findByIdAndUpdate(
            doctorId,
            { $set: body }, 
            { new: true, runValidators: true } 
        ).select('-password'); 

        if (!updatedDoctor) {
            return NextResponse.json(
                { error: "Docteur non trouvé pour la mise à jour." },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedDoctor, { status: 200 });

    } catch (error) {
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