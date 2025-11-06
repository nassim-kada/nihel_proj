// app/api/bookings/[id]/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Booking from "@/lib/models/Booking";
import { Types } from "mongoose";

// PATCH: Update booking status
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const resolvedParams = await params;
        const bookingId = resolvedParams.id;

        if (!Types.ObjectId.isValid(bookingId)) {
            return NextResponse.json(
                { error: "Format d'ID de réservation invalide." },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { status } = body;

        // Use your model's status values: 'pending', 'confirmed', 'cancelled', 'completed'
        if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return NextResponse.json(
                { error: "Statut invalide. Doit être: pending, confirmed, cancelled ou completed." },
                { status: 400 }
            );
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true, runValidators: true }
        ).populate('doctorId', 'name specialty');

        if (!updatedBooking) {
            return NextResponse.json(
                { error: "Réservation non trouvée." },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedBooking, { status: 200 });

    } catch (error) {
        console.error("Error updating booking:", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur lors de la mise à jour de la réservation." },
            { status: 500 }
        );
    }
}

// GET: Get single booking
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const resolvedParams = await params;
        const bookingId = resolvedParams.id;

        if (!Types.ObjectId.isValid(bookingId)) {
            return NextResponse.json(
                { error: "Format d'ID de réservation invalide." },
                { status: 400 }
            );
        }

        const booking = await Booking.findById(bookingId).populate('doctorId', 'name specialty');

        if (!booking) {
            return NextResponse.json(
                { error: "Réservation non trouvée." },
                { status: 404 }
            );
        }

        return NextResponse.json(booking, { status: 200 });

    } catch (error) {
        console.error("Error fetching booking:", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur lors de la récupération de la réservation." },
            { status: 500 }
        );
    }
}