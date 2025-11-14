import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req){
    const {searchInput, searchResult, libId} = await req.json();

    const inngestRunId = await inngest.send({
        name: "llm-model",
        data: {
            searchInput: searchInput,
            searchResult: searchResult,
            libId: libId
        }
    });

    return NextResponse.json(inngestRunId.ids[0])
}