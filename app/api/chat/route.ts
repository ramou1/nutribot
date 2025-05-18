import { streamText, UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createDietAgent } from '@/lib/agents/diet-agent';
import { createRestaurantAgent } from '@/lib/agents/restaurant-agent';

const positiveResponses = ['sim', 'quero', 'ok', 'claro', 'pode ser', 'gostaria', 'yes'];

function isPositiveResponse(message: string): boolean {
  const normalizedMessage = message.toLowerCase().trim();
  return positiveResponses.some(response =>
    normalizedMessage === response ||
    normalizedMessage.includes(response)
  );
}

function isRestaurantQuestion(message: string): boolean {
  const normalizedMessage = message.toLowerCase().trim();
  const hasRecommendation =
    normalizedMessage.includes('recomendações') ||
    normalizedMessage.includes('recomendacoes') ||
    normalizedMessage.includes('sugestões') ||
    normalizedMessage.includes('sugestoes');

  return hasRecommendation &&
    normalizedMessage.includes('restaurantes') &&
    normalizedMessage.includes('dieta');
}

// Adicionar função para remover as tags de URL
function removeUrlTags(text: string): string {
  return text.replace(/<URL>|<\/URL>/g, '');
}

// Função para processar a resposta do GPT e remover as tags de URL
async function processGPTResponse(response: Response): Promise<Response> {
  const reader = response.body?.getReader();
  if (!reader) return response;

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value);
            const cleanText = removeUrlTags(text);
            controller.enqueue(encoder.encode(cleanText));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    }),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    }
  );
}

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
    const lastMessage = truncatedMessages[truncatedMessages.length - 1];
    const previousMessage = truncatedMessages[truncatedMessages.length - 2];

    // Check if user is asking for restaurant recommendations
    const isAskingForRestaurants =
      previousMessage?.content &&
      isRestaurantQuestion(previousMessage.content) &&
      isPositiveResponse(lastMessage.content);

    if (isAskingForRestaurants) {
      console.log('Detectada solicitação de restaurantes');
      const { recommendations, success } = await createRestaurantAgent(truncatedMessages);
      return recommendations;
    }

    // If not asking for restaurants, use the Diet Agent
    const dietResponse = await createDietAgent(truncatedMessages);

    if (dietResponse.type === 'askingForRestaurants') {
      console.log('Diet Agent sinalizou pedido de recomendações');
      const { recommendations, success } = await createRestaurantAgent(truncatedMessages);
      return recommendations;
    }

    return dietResponse.toDataStreamResponse();

  } catch (error) {
    console.error('Erro no processamento:', error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
