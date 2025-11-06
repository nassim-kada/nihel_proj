// app/api/doctors/[id]/slots/route.ts (Code Complet)

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import DoctorModel from "@/lib/models/Doctor";
import { Types } from "mongoose";

// GET: Get all available slots for a doctor
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { id: doctorId } = await params;

        if (!Types.ObjectId.isValid(doctorId)) {
            return NextResponse.json(
                { error: "Format d'ID de docteur invalide." },
                { status: 400 }
            );
        }

        const doctor = await DoctorModel.findById(doctorId).select("availableSlots");

        if (!doctor) {
            return NextResponse.json(
                { error: "Docteur non trouvé." },
                { status: 404 }
            );
        }

        // doctor.availableSlots inclura désormais les _id générés
        return NextResponse.json(doctor.availableSlots, { status: 200 });

    } catch (error) {
        console.error("Error fetching doctor slots:", error);
        return NextResponse.json(
            { error: "Échec de la récupération des créneaux du docteur." },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { id: doctorId } = await params;


        if (!Types.ObjectId.isValid(doctorId)) {
            return NextResponse.json(
                { error: "Format d'ID de docteur invalide." },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { date, startTime, endTime } = body;

        if (!date || !startTime || !endTime) {
            return NextResponse.json(
                { error: "Les champs date, startTime et endTime sont obligatoires." },
                { status: 400 }
            );
        }

        const newSlot = {
            date: date,
            times: generateTimeSlots(startTime, endTime) 
        };
        

        const updatedDoctor = await DoctorModel.findByIdAndUpdate(
            doctorId,
            { $push: { availableSlots: newSlot } },
            { new: true } // Important: retourne la version mise à jour
        );

        if (!updatedDoctor) {
            return NextResponse.json(
                { error: "Docteur non trouvé." },
                { status: 404 }
            );
        }

        // 3. Trouver le slot nouvellement ajouté (qui a maintenant son _id)
        const addedSlot = updatedDoctor.availableSlots.find(
            // Le dernier élément du tableau est le nouveau slot
            slot => slot.date === newSlot.date && slot.times[0] === newSlot.times[0]
        );
        
        // Si la recherche est fiable, utilisez simplement le dernier élément si possible.
        // Sinon, on retourne le slot trouvé.
        return NextResponse.json(addedSlot, { status: 201 });

    } catch (error) {
        console.error("Error adding doctor slot:", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur lors de l'ajout du créneau." },
            { status: 500 }
        );
    }
}

// Helper function to generate time slots between start and end time
function generateTimeSlots(startTime: string, endTime: string): string[] {
    const slots: string[] = [];
    let currentTime = startTime;
    
    while (currentTime < endTime) {
        slots.push(currentTime);
        
        // Add 30 minutes to current time
        const [hours, minutes] = currentTime.split(':').map(Number);
        let newHours = hours;
        let newMinutes = minutes + 30;
        
        if (newMinutes >= 60) {
            newHours += 1;
            newMinutes -= 60;
        }
        
        currentTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
        
        // Stop if next slot would exceed end time
        if (currentTime >= endTime) break;
    }
    
    return slots;
}