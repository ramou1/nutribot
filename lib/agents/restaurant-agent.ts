import { findRestaurantsByDiet, formatRestaurantRecommendations } from '../services/restaurant-service';
import { UIMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { CONFIG } from '../types/restaurant';
import { RestaurantService } from '../services/restaurant-service';

export interface RestaurantAgentResponse {
  recommendations: Response;
  success: boolean;
}

// Função para remover as tags de URL
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

// Função para formatar as recomendações usando GPT
async function formatRecommendationsWithGPT(recommendations: string): Promise<Response> {
  const gptPrompt = `Formate a seguinte recomendação de restaurantes para ficar mais atraente e amigável.
REGRAS IMPORTANTES:
1. NÃO modifique nenhum texto entre marcadores <URL> e </URL>
2. NÃO crie novas URLs ou modifique as existentes
3. Após não manipular as URLS, REMOVA A TAG <URL> e </URL> de cada URL encontrada, mantendo apenas a URL original.
4. Mantenha todos os emojis existentes
5. Mantenha a estrutura de seções (Café da manhã, Almoço, Jantar)
6. Mantenha todos os pratos recomendados exatamente como estão
7. Apenas melhore a apresentação e o tom da mensagem

Recomendação original:
${recommendations.replace(/(http:\/\/[^\s]+)/g, '<URL>$1</URL>')}`;

  const gptResponse = await streamText({
    model: openai('gpt-4'),
    messages: [
      {
        role: 'system',
        content: 'Você é um assistente especializado em formatar recomendações de restaurantes. Você NUNCA deve modificar URLs ou criar novas URLs. Mantenha todas as URLs exatamente como estão entre as tags <URL> e </URL>.'
      },
      {
        role: 'user',
        content: gptPrompt
      }
    ],
    maxTokens: 1000,
    temperature: 0.7
  }).toDataStreamResponse();

  return processGPTResponse(gptResponse);
}

function findLastDietPlan(messages: UIMessage[]): string | null {
  if (!messages?.length) return null;

  // Procura a última mensagem do assistente que contém um plano de dieta
  const dietPlanMessage = messages
    .slice()
    .reverse()
    .slice(0, CONFIG.MAX_MESSAGES_TO_CHECK)
    .find(m => {
      if (m.role !== 'assistant') return false;

      const content = m.content.toLowerCase();
      const hasAllMeals =
        content.includes('café da manhã:') &&
        content.includes('almoço:') &&
        content.includes('jantar:');

      // Verifica se é realmente um plano de dieta e não apenas uma menção
      const hasDietIndicators =
        content.includes('proteína') ||
        content.includes('carboidrato') ||
        content.includes('vegetal') ||
        content.includes('fruta') ||
        content.includes('porção');

      return hasAllMeals && hasDietIndicators;
    });

  return dietPlanMessage?.content || null;
}

export async function createRestaurantAgent(messages: UIMessage[]): Promise<RestaurantAgentResponse> {
  try {
    console.log('Buscando último plano de dieta...');
    const lastDietPlan = findLastDietPlan(messages);

    if (!lastDietPlan) {
      console.log('Plano de dieta não encontrado nas mensagens');
      return {
        recommendations: new Response(
          JSON.stringify({
            role: 'assistant',
            content: "Desculpe, não encontrei um plano de dieta para basear as recomendações. Por favor, peça um plano de dieta primeiro."
          }),
          { headers: { 'Content-Type': 'application/json' } }
        ),
        success: false
      };
    }

    console.log('Plano de dieta encontrado, buscando restaurantes...');
    const restaurants = RestaurantService.findRestaurantsByDiet(lastDietPlan);

    if (!restaurants.length) {
      console.log('Nenhum restaurante encontrado para o plano de dieta');
      return {
        recommendations: new Response(
          JSON.stringify({
            role: 'assistant',
            content: "Desculpe, não encontrei restaurantes que correspondam à sua dieta. Você gostaria de especificar melhor suas preferências?"
          }),
          { headers: { 'Content-Type': 'application/json' } }
        ),
        success: false
      };
    }

    console.log(`Encontrados ${restaurants.length} restaurantes compatíveis`);
    const rawRecommendations = RestaurantService.formatRestaurantRecommendations(restaurants);
    const formattedResponse = await formatRecommendationsWithGPT(rawRecommendations);

    return {
      recommendations: formattedResponse,
      success: true
    };
  } catch (error) {
    console.error('Erro ao buscar recomendações:', error);
    return {
      recommendations: new Response(
        JSON.stringify({
          role: 'assistant',
          content: "Desculpe, ocorreu um erro ao buscar as recomendações de restaurantes. Por favor, tente novamente."
        }),
        { headers: { 'Content-Type': 'application/json' } }
      ),
      success: false
    };
  }
} 