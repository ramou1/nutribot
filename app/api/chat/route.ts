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
      console.log('Detectada solicitação de restaurantes:', {
        previousMessage: previousMessage.content,
        userResponse: lastMessage.content,
        isRestaurantQuestion: isRestaurantQuestion(previousMessage.content),
        isPositiveResponse: isPositiveResponse(lastMessage.content)
      });
      
      // Use the Restaurant Agent to get recommendations
      const { recommendations, success } = await createRestaurantAgent(truncatedMessages);
      
      if (!success) {
        console.log('Falha ao obter recomendações de restaurantes');
        return streamText({
          model: openai('gpt-4'),
          messages: [
            {
              role: 'assistant',
              content: 'Desculpe, não foi possível encontrar recomendações de restaurantes no momento. Por favor, tente novamente.'
            }
          ],
          maxTokens: 100
        }).toDataStreamResponse();
      }

      console.log('Recomendações obtidas com sucesso');
      return streamText({
        model: openai('gpt-4'),
        messages: [
          {
            role: 'assistant',
            content: recommendations
          }
        ],
        maxTokens: 1000
      }).toDataStreamResponse();
    }

    // If not asking for restaurants, use the Diet Agent
    const dietResponse = await createDietAgent(truncatedMessages);
    
    if (dietResponse.type === 'askingForRestaurants') {
      console.log('Diet Agent sinalizou pedido de recomendações');
      // Use the Restaurant Agent to get recommendations
      const { recommendations, success } = await createRestaurantAgent(truncatedMessages);
      
      if (!success) {
        console.log('Falha ao obter recomendações de restaurantes');
        return streamText({
          model: openai('gpt-4'),
          messages: [
            {
              role: 'assistant',
              content: 'Desculpe, não foi possível encontrar recomendações de restaurantes no momento. Por favor, tente novamente.'
            }
          ],
          maxTokens: 100
        }).toDataStreamResponse();
      }

      console.log('Recomendações obtidas com sucesso');
      return streamText({
        model: openai('gpt-4'),
        messages: [
          {
            role: 'assistant',
            content: recommendations
          }
        ],
        maxTokens: 1000
      }).toDataStreamResponse();
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
