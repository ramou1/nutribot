import { streamText, UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createDietAgent } from '@/lib/agents/diet-agent';
import { createRestaurantAgent } from '@/lib/agents/restaurant-agent';
import { POSITIVE_RESPONSES, RESPONSE_KEYWORDS, RECIPE_KEYWORDS } from '@/lib/types/restaurant';

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

function isPositiveResponse(message: string): boolean {
  const normalizedMessage = message.toLowerCase().trim();
  
  // Verifica respostas diretas da lista de respostas positivas
  if (POSITIVE_RESPONSES.some(response => normalizedMessage.includes(response))) {
    return true;
  }

  // Verifica se a mensagem contém palavras relacionadas a querer/pedir recomendações
  const hasWantIndicator = RESPONSE_KEYWORDS.WANT_INDICATORS.some(word => 
    normalizedMessage.includes(word)
  );
  const hasRecommendationWord = RESPONSE_KEYWORDS.RECOMMENDATION_WORDS.some(word => 
    normalizedMessage.includes(word)
  );
  
  return hasWantIndicator && hasRecommendationWord;
}

function isRecipeRequest(message: string): boolean {
  const normalizedMessage = message.toLowerCase().trim();
  
  // Check if message contains recipe request indicators
  const hasRecipeIndicator = RECIPE_KEYWORDS.REQUEST_INDICATORS.some(indicator => 
    normalizedMessage.includes(indicator)
  );

  return hasRecipeIndicator;
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

    // First check if it's a recipe request
    if (isRecipeRequest(lastMessage.content)) {
      console.log('Detectada solicitação de receita');
      const dietResponse = await createDietAgent(truncatedMessages);
      return dietResponse.toDataStreamResponse();
    }

    // Then check for restaurant recommendations
    // Check if user is asking for restaurant recommendations
    const isAskingForRestaurants = 
      // Caso 1: Resposta direta à pergunta sobre recomendações
      (previousMessage?.content && 
       isRestaurantQuestion(previousMessage.content) && 
       isPositiveResponse(lastMessage.content)) ||
      // Caso 2: Usuário mudou de ideia e quer recomendações
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
    console.error('Error in chat route:', error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
