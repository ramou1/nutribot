import { UIMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { POSITIVE_RESPONSES, RESPONSE_KEYWORDS, RECIPE_KEYWORDS } from '../types/restaurant';

export type DietAgentResponse = {
  type: 'askingForRestaurants';
  dietPlan: string;
  toDataStreamResponse: () => Response;
} | {
  type: 'diet';
  response: ReturnType<typeof streamText>;
  toDataStreamResponse: () => Response;
};

export const DIET_AGENT_PROMPT = `Você é um Nutricionista Virtual especializado em criar planos alimentares personalizados e receitas saudáveis.

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

- Se o usuário pedir diretamente por receitas, você DEVE:
  1. Criar uma receita detalhada baseada nas preferências/restrições mencionadas
  2. Listar todos os ingredientes com quantidades
  3. Fornecer instruções passo a passo para preparar a receita
  4. Incluir dicas de preparo e armazenamento
  5. Explicar os benefícios nutricionais da receita
  6. Criar um plano alimentar que inclua esta receita
  7. Perguntar se o usuário gostaria de receber recomendações de restaurantes compatíveis com a dieta

- Em HIPÓTESE ALGUMA, sugira restaurantes que não sejam os que estão no banco de dados
- Crie APENAS um plano para UM DIA, não para a semana inteira
- Ao criar o plano alimentar, sempre inclua as seções "Café da manhã:", "Almoço:" e "Jantar:"
- Para cada refeição, sugira apenas UMA opção principal com no máximo 1 alternativa
- Ao perguntar sobre recomendações de restaurantes, use exatamente a frase: "Gostaria de receber recomendações de restaurantes compatíveis com esta dieta?"

Exemplos de resposta quando pedem receitas:

Usuário: "Me sugira uma receita sem lactose e sem glúten"
Resposta: "Claro! Vou te ensinar a fazer um delicioso Bowl de Quinoa com Legumes Assados:

Ingredientes:
- 1 xícara de quinoa
- 2 xícaras de água
- 2 cenouras médias em cubos
- 1 abobrinha em cubos
- 1 berinjela em cubos
- 1 pimentão vermelho em tiras
- 2 colheres de sopa de azeite de oliva
- Sal e pimenta a gosto
- Ervas frescas (tomilho, alecrim) a gosto

Modo de Preparo:
1. Pré-aqueça o forno a 200°C
2. Lave bem a quinoa e cozinhe em água por 15-20 minutos
3. Tempere os legumes com azeite, sal, pimenta e ervas
4. Asse os legumes por 25-30 minutos, virando na metade do tempo
5. Monte o bowl com a quinoa na base e os legumes por cima

Dicas:
- Você pode preparar uma quantidade maior e armazenar na geladeira por até 3 dias
- Para variar, adicione proteínas como frango grelhado ou grão de bico

Benefícios Nutricionais:
- Quinoa: proteína completa, sem glúten, rica em fibras
- Legumes: vitaminas, minerais e antioxidantes
- Azeite: gorduras boas para o coração

Agora, vou criar um plano alimentar saudável incluindo esta receita:

Café da manhã:
- Mingau de aveia com leite de amêndoas e banana
Alternativa: Smoothie de frutas vermelhas com leite de coco

Almoço:
- Bowl de Quinoa com Legumes Assados (nossa receita!)
Alternativa: Salada de folhas com atum e abacate

Jantar:
- Filé de frango grelhado com purê de batata doce e brócolis
Alternativa: Sopa de legumes com quinoa

Gostaria de receber recomendações de restaurantes compatíveis com esta dieta?"

Mantenha um tom profissional e acolhedor, focando em educação nutricional e bem-estar.`;

function isRecipeRequest(message: string): boolean {
  const normalizedMessage = message.toLowerCase().trim();
  
  // Check if message contains recipe request indicators
  const hasRecipeIndicator = RECIPE_KEYWORDS.REQUEST_INDICATORS.some(indicator => 
    normalizedMessage.includes(indicator)
  );

  // Check if message contains dietary restrictions (optional)
  const hasDietaryRestrictions = RECIPE_KEYWORDS.DIETARY_RESTRICTIONS.some(restriction => 
    normalizedMessage.includes(restriction)
  );

  // Return true if the message contains recipe indicators
  return hasRecipeIndicator;
}

export function createDietAgent(messages: UIMessage[]): DietAgentResponse {
  // Get the last message
  const lastMessage = messages[messages.length - 1];
  
  // Check if it's a recipe request
  const isRequestingRecipe = isRecipeRequest(lastMessage.content);

  // If it's a recipe request, we'll use the diet agent with the recipe prompt
  if (isRequestingRecipe) {
    console.log('Detectada solicitação de receita');
    const response = streamText({
      model: openai('gpt-4'),
      messages: [
        {
          role: 'system',
          content: DIET_AGENT_PROMPT
        },
        ...messages
      ],
      temperature: 0.7,
      maxTokens: 1500
    });

    return {
      type: 'diet',
      response,
      toDataStreamResponse: () => response.toDataStreamResponse()
    };
  }

  // Verifica se é uma resposta para recomendações de restaurantes
  const previousMessage = messages[messages.length - 2];
  
  // Função para encontrar o último plano de dieta nas mensagens
  const findLastDietPlan = (messages: UIMessage[]): string | null => {
    return messages
      .slice()
      .reverse()
      .find(m => 
        m.role === 'assistant' && 
        m.content.includes('Café da manhã:') && 
        m.content.includes('Almoço:') && 
        m.content.includes('Jantar:')
      )?.content || null;
  };
  
  // Verifica se a mensagem anterior é sobre recomendações de restaurantes de forma mais flexível
  const isRestaurantQuestion = (message: string): boolean => {
    const normalizedMessage = message.toLowerCase().trim();
    return (
      normalizedMessage.includes('recomendações') && 
      normalizedMessage.includes('restaurantes') && 
      normalizedMessage.includes('dieta')
    ) || (
      normalizedMessage === 'gostaria de receber recomendações de restaurantes compatíveis com esta dieta?'
    );
  };
  
  const isPositiveResponse = (message: string): boolean => {
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
  };

  // Verifica se o usuário está pedindo recomendações (seja inicialmente ou após mudar de ideia)
  const isAskingForRestaurants = 
    // Caso 1: Resposta direta à pergunta sobre recomendações
    (previousMessage?.content && 
     isRestaurantQuestion(previousMessage.content) && 
     isPositiveResponse(lastMessage.content)) ||
    // Caso 2: Usuário mudou de ideia e quer recomendações
    isPositiveResponse(lastMessage.content);

  if (isAskingForRestaurants) {
    // Procura o último plano de dieta válido
    const lastDietPlan = findLastDietPlan(messages);

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

    // Return a response object that signals we want restaurant recommendations
    return {
      type: 'askingForRestaurants',
      dietPlan: lastDietPlan,
      toDataStreamResponse: () => new Response(
        JSON.stringify({
          role: 'assistant',
          content: 'Buscando recomendações de restaurantes baseadas no seu plano alimentar...'
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    };
  }

  // Se não está pedindo recomendações, continua com o fluxo normal
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