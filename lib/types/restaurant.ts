export type MealType = 'cafe-da-manha' | 'almoco' | 'jantar';

export interface Restaurant {
  url: string;
  keywords: string[];
  mealTypes: MealType[];
}

export interface MealMatch {
  restaurant: Restaurant;
  matchCount: number;
  matchedItems: string[];
  mealType: MealType;
  matchedSection: string;
}

export const MEAL_TYPES: Record<MealType, string> = {
  'cafe-da-manha': 'Café da manhã',
  'almoco': 'Almoço',
  'jantar': 'Jantar'
};

export const COMMON_WORDS = new Set([
  'e', 'ou', 'com', 'de', 'da', 'do', 'das', 'dos', 
  'no', 'na', 'nos', 'nas', 'um', 'uma', 'uns', 'umas', 
  'o', 'a', 'os', 'as', 'ao', 'aos'
]);

export const MEAL_KEYWORDS = {
  BREAKFAST: ['omelete', 'ovos'] as string[],
  LUNCH: ['frango', 'peito de frango'] as string[],
  SALAD: ['salada', 'vegetais'] as string[],
  SEAFOOD: ['peixe', 'salmao'] as string[]
};

export const RESPONSE_KEYWORDS = {
  WANT_INDICATORS: [
    'quero', 'gostaria', 'preciso', 'desejo', 'pode', 'queria',
    'me mostra', 'me mostre', 'mostra', 'mostre', 'manda', 'mande'
  ] as const,
  RECOMMENDATION_WORDS: [
    'recomendações', 'recomendacoes', 'sugestões', 'sugestoes', 
    'restaurantes', 'lugares', 'opções', 'opcoes'
  ] as const
} as const;

export const POSITIVE_RESPONSES = [
  'sim', 'quero', 'ok', 'claro', 'pode ser', 'gostaria', 'yes', 'mudei de ideia',
  'agora quero', 'agora eu quero', 'agora gostaria', 'me mostre', 'pode mostrar',
  'quero ver', 'gostaria de ver', 'me manda', 'manda', 'pode mandar',
  'recomendacoes', 'recomendações', 'sugestoes', 'sugestões'
] as const;

export const MESSAGES = {
  NO_RESTAURANTS_FOUND: "Desculpe, não encontrei restaurantes que correspondam exatamente à sua dieta. Você gostaria de especificar melhor suas preferências?",
  NO_MAIN_MEAL_RESTAURANTS: "Desculpe, não encontrei restaurantes para as refeições principais que correspondam à sua dieta. Você gostaria de especificar melhor suas preferências?",
  RECOMMENDATIONS_HEADER: "🍽️ **Recomendações de Restaurantes para Hoje**\n\nSelecionei os melhores restaurantes para suas refeições principais:\n\n",
  DAILY_TIP: "\n💡 **Dica do dia:**\nLembre-se de informar que está seguindo uma dieta ao fazer seu pedido."
} as const;

export const RECOMMENDATION_MESSAGES = {
  BREAKFAST: 'Experimente os ovos aqui!',
  LUNCH: 'Ótima opção para pratos com frango!',
  SALAD: 'Excelentes opções de saladas e vegetais!',
  SEAFOOD: 'Especialidade em peixes e frutos do mar!',
  DEFAULT: 'Cardápio alinhado com sua dieta!'
} as const;

export const RECIPE_KEYWORDS = {
  REQUEST_INDICATORS: [
    'receita', 'recipe', 'como fazer', 'preparo', 'preparar',
    'cozinhar', 'fazer', 'ensina', 'ensine'
  ] as const,
  DIETARY_RESTRICTIONS: [
    'sem lactose', 'sem gluten', 'sem leite', 'vegano',
    'vegetariano', 'low carb', 'sem açúcar', 'sem acucar'
  ] as const
} as const;

export const CONFIG = {
  MIN_KEYWORD_LENGTH: 3,
  MIN_MATCH_COUNT: 1,
  MAX_MESSAGES_TO_CHECK: 8,
  MAIN_MEAL_TYPES: ['cafe-da-manha', 'almoco', 'jantar'] as MealType[]
} as const; 