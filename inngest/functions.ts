import { inngest } from "./client";
import { supabase } from '@/services/supabase'

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.email}!` };
    },
);


export const llmModel = inngest.createFunction(
    { id: 'llm-model' },
    { event: 'llm-model' },
    async ({ event, step }) => {

        const aiResp = await step.ai.infer('generate-ai-llm-model-call',
            {
                model: step.ai.models.gemini({
                    model: 'gemini-2.5-flash',
                    apiKey: process.env.GEMINI_API_KEY
                }),
                body: {
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text:
                                        `Depends on user input sources, summarize and search about the topic ` +
                                        `and return markdown. User input: ${event.data.searchInput}`,
                                },
                                {
                                    text: `Search results JSON:\n${JSON.stringify(event.data.searchResult)}`,
                                },
                            ],
                        },
                    ],
                }
            }
        )
        console.log(aiResp)

        const saveToDB = await step.run('saveToDB', async () => {
            const aiText =
                aiResp.candidates?.[0]?.content?.parts
                    ?.map((p: any) => p.text ?? "")
                    .join("") ?? "";
            console.log(aiText)

            const { data, error } = await supabase
                .from('Chats')
                .update({ aiResponse: aiText })
                .eq('libId', event.data.libId)
                .select()
            console.log(data)

            return aiResp

        })
    }



)