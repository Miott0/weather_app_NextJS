import { NextRequest, NextResponse } from "next/server";

export async function GET(request: any) {

    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const lat = searchParams.get('lat')
    const long = searchParams.get('long')

    let url = ""

    if(address){
        url = 
        "https://api.openweathermap.org/data/2.5/weather?q=" + 
        address + 
        "&appid=09eaf8d4faa80345af0d50f286f75d05";
        
        
    }else{
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=09eaf8d4faa80345af0d50f286f75d05`;
    }

    const res = await fetch(url)
    const data = await res.json()

    return NextResponse.json({ data })
    
}