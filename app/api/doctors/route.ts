import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import DoctorModel from "@/lib/models/Doctor";

export async function GET() {
    try {
        await dbConnect();
        
        const doctors = await DoctorModel.find({})
            .populate('specialty', 'name') 
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

        // Vérifier si l'email existe déjà
        const existingDoctor = await DoctorModel.findOne({ email });
        if (existingDoctor) {
            return NextResponse.json(
                { message: 'Un médecin avec cet email existe déjà' },
                { status: 409 }
            );
        }

        // Créer le nouveau médecin SANS champ 'id'
        const newDoctor = new DoctorModel({
            name,
            email,
            phone,
            password,
            specialty,
            // createdAt est géré automatiquement par timestamps
        });

        await newDoctor.save();

        console.log("Nouveau médecin enregistré:", newDoctor);
        
        return NextResponse.json(
            {
                message: 'Médecin enregistré avec succès',
                doctor: {
                    id: newDoctor._id, // Utilisez _id comme identifiant
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
        
        if (error.code === 11000) {
            // Cette erreur ne devrait plus se produire après suppression de l'index
            return NextResponse.json(
                { 
                    message: 'Erreur de duplication - Contactez l\'administrateur',
                    error: 'Problème d\'index dans la base de données'
                },
                { status: 500 }
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