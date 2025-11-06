// app/api/doctors/[id]/slots/[slotId]/route.ts (Code Complet)

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import DoctorModel from "@/lib/models/Doctor";
import { Types } from "mongoose";

// --- DELETE Request Handler (Supprimer un slot de disponibilité par son _id) ---
export async function DELETE(
    request: Request,
    { params }: { params: { id: string, slotId: string } }
) {
    try {
        await dbConnect();

        const { id: doctorId } = await params;
        const { slotId } = await params;

        if (!Types.ObjectId.isValid(doctorId) || !Types.ObjectId.isValid(slotId)) {
            return NextResponse.json(
                { error: "Format d'ID de docteur ou de slot invalide." },
                { status: 400 }
            );
        }

        // Utiliser $pull pour retirer le sous-document (slot) du tableau
        const updatedDoctor = await DoctorModel.findByIdAndUpdate(
            doctorId,
            { 
                $pull: {
                    availableSlots: { 
                        _id: new Types.ObjectId(slotId) 
                    }
                }
            },
            { new: true }
        ).select('-password'); 

        if (!updatedDoctor) {
            return NextResponse.json(
                { error: "Docteur non trouvé." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Slot de disponibilité supprimé avec succès." },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error during slot deletion: ", error); 
        return NextResponse.json(
            { error: "Échec de la suppression du slot (Erreur interne du serveur)." },
            { status: 500 }
        );
    }
}