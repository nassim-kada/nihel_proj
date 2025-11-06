// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Booking from "@/lib/models/Booking"
import { IBooking } from "@/types/booking"; 

// GET: Fetch all bookings
export async function GET() {
    try {
        await dbConnect();

        const bookings = await Booking.find({})
            .populate('doctorId', 'name specialty') // Populate doctor info
            .sort({ appointmentDate: 1, appointmentTime: 1 })
            .lean();

        return NextResponse.json(bookings, { status: 200 });

    } catch (error) {
        console.error("Erreur lors de la récupération des réservations:", error);
        
        return NextResponse.json(
            { success: false, error: "Erreur interne du serveur lors de la récupération des réservations." },
            { status: 500 }
        );
    }
}

// POST: Create a new booking
export async function POST(request: Request) {
    try {
        await dbConnect(); 

        const body: IBooking = await request.json();
        
        // Validate required fields based on your model
        if (!body.doctorId || !body.appointmentDate || !body.appointmentTime || !body.patientName || !body.patientPhone || !body.fee) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: "Champs de réservation requis manquants: doctorId, appointmentDate, appointmentTime, patientName, patientPhone, fee" 
                },
                { status: 400 } 
            );
        }

        const newBooking = await Booking.create(body);

        // Populate the doctor info in the response
        await newBooking.populate('doctorId', 'name specialty');

        return NextResponse.json(
            { success: true, data: newBooking }, 
            { status: 201 }
        );

    } catch (error) {
        console.error("Erreur de sauvegarde de la réservation:", error);
        
        // Handle validation errors
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