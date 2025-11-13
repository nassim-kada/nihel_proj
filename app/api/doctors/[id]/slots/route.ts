import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import DoctorModel from "@/lib/models/Doctor";
import { Types } from "mongoose";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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
            { new: true }
        );

        if (!updatedDoctor) {
            return NextResponse.json(
                { error: "Docteur non trouvé." },
                { status: 404 }
            );
        }

        const addedSlot = updatedDoctor.availableSlots.find(
            slot => slot.date === newSlot.date && slot.times[0] === newSlot.times[0]
        );
        
        return NextResponse.json(addedSlot, { status: 201 });

    } catch (error) {
        console.error("Error adding doctor slot:", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur lors de l'ajout du créneau." },
            { status: 500 }
        );
    }
}

function generateTimeSlots(startTime: string, endTime: string): string[] {
    const slots: string[] = [];
    let currentTime = startTime;
    
    while (currentTime < endTime) {
        slots.push(currentTime);
        
        const [hours, minutes] = currentTime.split(':').map(Number);
        let newHours = hours;
        let newMinutes = minutes + 30;
        
        if (newMinutes >= 60) {
            newHours += 1;
            newMinutes -= 60;
        }
        
        currentTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
        
        if (currentTime >= endTime) break;
    }
    
    return slots;
}