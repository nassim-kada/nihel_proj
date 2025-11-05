// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Booking from "@/lib/models/Booking"
import { IBooking } from "@/types/booking"; 

export async function POST(request: Request) {
    try {
        await dbConnect(); 

        
        const body: IBooking = await request.json();
        
       
        if (!body.doctorId || !body.appointmentDate || !body.appointmentTime || !body.patientName) {
            return NextResponse.json(
                { success: false, error: "Champs de réservation requis manquants." },
                { status: 400 } 
            );
        }
        const newBooking = await Booking.create(body);

        return NextResponse.json(
            { success: true, data: newBooking }, 
            { status: 201 } // 201 Created
        );

    } catch (error) {
        console.error("Erreur de sauvegarde de la réservation:", error);
        
        // Gérer les erreurs de validation Mongoose ou les erreurs internes
        if (error instanceof Error && (error as any).name === 'ValidationError') {
            return NextResponse.json(
                { success: false, error: "Erreur de validation des données." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Erreur interne du serveur lors de la sauvegarde." },
            { status: 500 }
        );
    }
}