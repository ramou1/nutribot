import { UIMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export type DietAgentResponse = {
  type: 'askingForRestaurants';
  dietPlan: string;
  toDataStreamResponse: () => Response;
} | {
  type: 'diet';
  response: ReturnType<typeof streamText>;
  toDataStreamResponse: () => Response;
};

export const DIET_AGENT_PROMPT = `Você é um Nutricionista Virtual especializado em criar planos alimentares personalizados.

Suas responsabilidades principais são:
1. Coletar informações sobre:
   - Objetivos (perda de peso, ganho de massa, saúde geral)
   - Restrições alimentares e alergias
   - Preferências alimentares

2. Criar um plano alimentar para UM ÚNICO DIA que inclua:
   - Uma refeição específica para cada período do dia
   - Porções recomendadas
   - Alternativas para cada refeição
   - Explicações nutricionais

3. Fornecer orientações sobre:
   - Horários ideais para cada refeição
   - Como preparar os alimentos
   - Dicas para manter a dieta
   - Benefícios nutricionais dos alimentos recomendados

4. Ao final do plano alimentar diário, pergunte se o usuário gostaria de receber recomendações de restaurantes compatíveis com a dieta.

IMPORTANTE:
- Se o usuário pedir diretamente por restaurantes SEM ter um plano de dieta, você DEVE:
  1. Explicar gentilmente que precisamos criar um plano alimentar primeiro
  2. Criar um plano baseado nas preferências mencionadas (ex: vegano, vegetariano, low-carb, etc)
  3. Só então oferecer recomendações de restaurantes
- Em HIPÓTESE ALGUMA, sugira restaurantes que não sejam os que estão no banco de dados
- Crie APENAS um plano para UM DIA, não para a semana inteira
- Ao criar o plano alimentar, sempre inclua as seções "Café da manhã:", "Almoço:" e "Jantar:"
- Para cada refeição, sugira apenas UMA opção principal com no máximo 1 alternativa
- Ao perguntar sobre recomendações de restaurantes, use exatamente a frase: "Gostaria de receber recomendações de restaurantes compatíveis com esta dieta?"

Exemplos de resposta quando pedem restaurantes diretamente:

Usuário: "Quero restaurantes veganos"
Resposta: "Entendo que você está procurando restaurantes veganos! Para te ajudar melhor, vou criar um plano alimentar vegano personalizado. Assim, poderemos encontrar os restaurantes mais adequados para suas necessidades.

Aqui está um plano alimentar vegano para seu dia:

Café da manhã:
- Mingau de aveia com leite vegetal, banana e canela
Alternativa: Smoothie de frutas vermelhas com leite de amêndoas e chia

Almoço:
- Bowl de quinoa com grão de bico, legumes assados e molho tahine
Alternativa: Salada de lentilhas com vegetais grelhados e abacate

Jantar:
- Curry de legumes com tofu e arroz integral
Alternativa: Wrap de vegetais grelhados com homus

Gostaria de receber recomendações de restaurantes compatíveis com esta dieta?"

Mantenha um tom profissional e acolhedor, focando em educação nutricional e bem-estar.`;

export function createDietAgent(messages: UIMessage[]): DietAgentResponse {
  // Verifica se é uma resposta para recomendações de restaurantes
  const lastMessage = messages[messages.length - 1];
  const previousMessage = messages[messages.length - 2];
  
  const positiveResponses = ['sim', 'quero', 'ok', 'claro', 'pode ser', 'gostaria', 'yes'];
  
  // Verifica se a mensagem anterior é sobre recomendações de restaurantes de forma mais flexível
  const isRestaurantQuestion = (message: string): boolean => {
    const normalizedMessage = message.toLowerCase().trim();
    return normalizedMessage.includes('recomendações') && 
           normalizedMessage.includes('restaurantes') && 
           normalizedMessage.includes('dieta');
  };
  
  const isAskingForRestaurants = 
    previousMessage?.content && isRestaurantQuestion(previousMessage.content) &&
    positiveResponses.some(response => 
      lastMessage.content.toLowerCase().trim() === response ||
      lastMessage.content.toLowerCase().includes(response)
    );

  if (isAskingForRestaurants) {
    // Find the last diet plan
    const lastDietPlan = messages
      .slice()
      .reverse()
      .find(m => 
        m.role === 'assistant' && 
        m.content.includes('Café da manhã:') && 
        m.content.includes('Almoço:') && 
        m.content.includes('Jantar:')
      )?.content || '';

    if (!lastDietPlan) {
      // Se não encontrou plano de dieta, força a criação de um
      const response = streamText({
        model: openai('gpt-4'),
        messages: [
          {
            role: 'system',
            content: DIET_AGENT_PROMPT
          },
          ...messages
        ],
        maxTokens: 1000
      });

      return {
        type: 'diet',
        response,
        toDataStreamResponse: () => response.toDataStreamResponse()
      };
    }

    console.log('Encontrou plano de dieta:', !!lastDietPlan);

    // Return a simple response object that signals we want restaurant recommendations
    return {
      type: 'askingForRestaurants',
      dietPlan: lastDietPlan,
      toDataStreamResponse: () => new Response(
        JSON.stringify({
          role: 'assistant',
          content: 'Buscando recomendações de restaurantes...'
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    };
  }

  const response = streamText({
    model: openai('gpt-4'),
    messages: [
      {
        role: 'system',
        content: DIET_AGENT_PROMPT
      },
      ...messages
    ],
    maxTokens: 1000
  });

  return {
    type: 'diet',
    response,
    toDataStreamResponse: () => response.toDataStreamResponse()
  };
} 