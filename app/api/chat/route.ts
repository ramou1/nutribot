import { streamText, UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "Messages are required" }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key is required" }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Truncate to the last 8 messages
    let truncatedMessages = messages.slice(-8);

    const result = streamText({
      model: openai('gpt-4'),
      system: `Você é a NutriBot, uma assistente nutricionista especializada em ajudar pessoas a encontrarem opções alimentares adequadas às suas necessidades específicas.

Suas principais responsabilidades são:
- Coletar informações sobre restrições alimentares (alergias, intolerâncias)
- Entender preferências pessoais e objetivos de saúde
- Recomendar pratos específicos dos cardápios de restaurantes parceiros
- Sugerir adaptações possíveis em pratos existentes
- Fornecer informações nutricionais aproximadas
- Manter um histórico de pedidos para refinar recomendações futuras

Você deve:
- Manter o foco em nutrição e alimentação saudável
- Ser profissional e acolhedora
- Fornecer informações precisas e baseadas em evidências
- Respeitar restrições alimentares e preferências do usuário
- Sugerir alternativas quando necessário
- Explicar os benefícios nutricionais das recomendações

Se o usuário tentar desviar do assunto de nutrição, gentilmente redirecione a conversa para o tema de alimentação saudável e bem-estar.`,
      messages: truncatedMessages,
      maxTokens: 500,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to get response from OpenAI" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
