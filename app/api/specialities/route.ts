import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import SpecialityModel from "@/lib/models/Speciality";
import { ISpecialityDocument } from "@/types/speciality";
export async function GET(){
    try{
        await dbConnect();
        const specialities :ISpecialityDocument[]=await SpecialityModel.find({});
        return NextResponse.json(specialities,{status:200})
    }catch(error){
        console.log("can't get specialite",error)
        return NextResponse.json(
            {error:"can't get speciality from database"},
            {status:500}
        )
    }
}