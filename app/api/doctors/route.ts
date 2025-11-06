import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import DoctorModel from "@/lib/models/Doctor";

export async function GET() {
    try {
        await dbConnect();
        
        const doctors = await DoctorModel.find({})
            .populate('specialty', 'name')
            .maxTimeMS(5000)
            .lean(); 

        return NextResponse.json(doctors, { status: 200 });

    } catch (error) {
        console.error("Erreur lors de la récupération des docteurs:", error);
        return NextResponse.json(
            { error: "Échec de la récupération des données des docteurs." }, 
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        
        const body = await request.json();
        const { email, password, name, phone, specialty } = body;
        
        if (!email || !password || !name || !phone || !specialty) {
            return NextResponse.json(
                { message: 'Tous les champs sont obligatoires' },
                { status: 400 }
            );
        }

        // Check if email exists with timeout
        let existingDoctor;
        try {
            existingDoctor = await DoctorModel.findOne({ email })
                .maxTimeMS(5000)
                .lean();
        } catch (dbError: any) {
            console.error("Database error during findOne:", dbError);
            
            if (dbError.name === 'MongoNetworkError' || dbError.code === 'ETIMEDOUT') {
                return NextResponse.json(
                    { 
                        message: 'Erreur de connexion à la base de données. Veuillez réessayer.',
                        error: 'Problème de connexion réseau'
                    },
                    { status: 503 }
                );
            }
            
            throw dbError;
        }
        
        if (existingDoctor) {
            return NextResponse.json(
                { message: 'Un médecin avec cet email existe déjà' },
                { status: 409 }
            );
        }

        // Create new doctor
        const newDoctor = new DoctorModel({
            name,
            email,
            phone,
            password,
            specialty,
        });

        await newDoctor.save();

        console.log("Nouveau médecin enregistré:", newDoctor);
        
        return NextResponse.json(
            {
                message: 'Médecin enregistré avec succès',
                doctor: {
                    id: newDoctor._id,
                    name: newDoctor.name,
                    email: newDoctor.email,
                    phone: newDoctor.phone,
                    specialty: newDoctor.specialty
                }
            },
            { status: 201 }
        );
        
    } catch (error: any) {
        console.log("Erreur d'enregistrement:", error);
        
        // Handle duplicate key error for old 'id' field
        if (error.code === 11000) {
            // Check if it's the old 'id' index causing the issue
            if (error.message.includes('id_1') || error.keyPattern?.id !== undefined) {
                return NextResponse.json(
                    { 
                        message: 'Erreur de configuration de la base de données',
                        error: 'Un ancien index "id" existe. Veuillez exécuter: db.doctors.dropIndex("id_1")',
                        details: 'Contactez l\'administrateur pour supprimer l\'ancien index'
                    },
                    { status: 500 }
                );
            }
            
            // Regular duplicate error (email already exists)
            return NextResponse.json(
                { 
                    message: 'Un médecin avec cet email existe déjà',
                    error: 'Email dupliqué'
                },
                { status: 409 }
            );
        }
        
        return NextResponse.json(
            { 
                message: 'Erreur interne du serveur',
                error: error.message || 'Erreur inconnue'
            },
            { status: 500 }
        );
    }
}