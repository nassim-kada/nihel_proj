// app/api/bookings/[id]/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Booking from "@/lib/models/Booking";
import { Types } from "mongoose";

// PATCH: Update booking status OR appointmentType
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id: bookingId } = await params;
        // const {id: bookingId}= await params;]
        
        
        if (!Types.ObjectId.isValid(bookingId)) {
            return NextResponse.json(
                { error: "Format d'ID de réservation invalide." },
                { status: 400 }
            );
        }

        const body = await request.json();
        // FIX 1: Récupérer la valeur à partir de la clé que le client envoie ('appointementType')
        const { status, appointementType } = body; 

        // Build update object dynamically
        const updateData: any = {};

        // Validate and add status if provided (Inchangé)
        if (status !== undefined) {
            if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
                return NextResponse.json(
                    { error: "Statut invalide. Doit être: pending, confirmed, cancelled ou completed." },
                    { status: 400 }
                );
            }
            updateData.status = status;
        }

        // Validate and add appointementType if provided
        if (appointementType !== undefined) {
            // FIX 2: Utiliser les valeurs EXACTES (chaîne) de l'énumérateur Mongoose
            const validTypes = [
                'Consultation', 
                'Consultation de Controle ', // Note: avec l'espace de fin
                'Examen', 
                'Radiologie/Imagerie', 
                'Urgence', 
                'Intervention'
            ];
            
            // Note: On utilise trim() pour la validation côté serveur pour plus de robustesse.
            const typeToValidate = appointementType.trim();

            if (!validTypes.map(t => t.trim()).includes(typeToValidate)) {
                return NextResponse.json(
                    { error: "Type de rendez-vous invalide." },
                    { status: 400 }
                );
            }
            // FIX 3: La clé de mise à jour DOIT correspondre à la clé Mongoose
            updateData.appointementType = appointementType;
        }

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "Aucune donnée à mettre à jour." },
                { status: 400 }
            );
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            updateData,
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

// GET: Get single booking (Inchangé)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id: bookingId } = await params;

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