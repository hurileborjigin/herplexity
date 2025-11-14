import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';

// export async function POST(req) {
//     const { searchInput, searchType } = await req.json();
//     const resultCount = 5;

//     if (searchInput) {
//         const result = await axios.get('https://api.search.brave.com/res/v1/web/search?q=' + searchInput + '&count=' + resultCount, {
//             headers: {
//                 'Accept': 'application/json',
//                 'Accept-Encoding': 'gzip',
//                 'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY
//             }
//         })
//         console.log(result.data)

//         return NextResponse.json(result.data)
//     }
//     else {
//         return NextResponse.json({
//             error: 'Please pass the user search input.'
//         })
//     }
// }


export async function POST(req) {
    const { searchInput } = await req.json();
    if (!searchInput) {
        return NextResponse.json({ error: "searchInput required" }, { status: 400 });
    }

    try {
        const result = await axios.get(
            `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchInput)}&count=5`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY
                }
            }
        );
        return NextResponse.json(result.data);
    } catch (error) {
        console.error("Brave API error", error.response?.data || error.message);
        return NextResponse.json(
            { error: "Brave API request failed", detail: error.response?.data },
            { status: error.response?.status || 500 }
        );
    }
}
