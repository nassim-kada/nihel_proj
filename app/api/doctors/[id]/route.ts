// app/api/doctors/[id]/route.ts

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import DoctorModel from "@/lib/models/Doctor";
import { CastError } from "mongoose";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect(); // Ensure the database connection is established
        
        // FIX: The error indicates 'params' needs to be awaited before accessing properties.
        // We await the params object to ensure it is fully resolved.
        const resolvedParams = await params;
        const doctorId = resolvedParams.id;
        
        // Mongoose automatically converts the string ID to an ObjectId when using findById
        const doctor = await DoctorModel.findById(doctorId)

        if (!doctor) {
            // Returns 404 if the ID format is valid but no document is found
            return NextResponse.json(
                { error: "Docteur non trouvé." }, 
                { status: 404 }
            );
        }

        // Returns 200 with the doctor data if found
        return NextResponse.json(doctor, { status: 200 });

    } catch (error) {
        const resolvedParams = await params;
        const doctorId = resolvedParams.id;
        // Handle Mongoose CastError (invalid ID format, e.g., too short)
        if (error instanceof Error && error.name === 'CastError') {
            console.error("Invalid Doctor ID format:", );
            return NextResponse.json(
                { error: "Format d'ID de docteur invalide." },
                { status: 400 } // Use 400 Bad Request for an invalid format
            );
        }
        
        // Handle all other server-side errors (DB connection issue, internal failure, etc.)
        console.error("can't fetch doctor id: ", error); 
        return NextResponse.json(
            { error: "Échec de la récupération des données du docteur (Erreur interne du serveur)." },
            { status: 500 }
        );
    }
}
