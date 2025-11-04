import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import DoctorModel from "@/lib/models/Doctor";
export async function GET(){
    try{
        await dbConnect();
        const doctors = await DoctorModel.find({});
        return NextResponse.json(doctors, { status: 200 }); 
    }catch(error){
        console.error("Erreur lors de la récupération des docteurs:", error);
        
        return NextResponse.json(
            { error: "Échec de la récupération des données des docteurs." },
            { status: 500 }
        );
    }
}