import { 
  Restaurant, 
  MealType, 
  MealMatch, 
  MEAL_TYPES, 
  COMMON_WORDS,
  MEAL_KEYWORDS,
  MESSAGES,
  RECOMMENDATION_MESSAGES,
  CONFIG
} from '../types/restaurant';
import { restaurantDatabase } from '../data/restaurants';

class RestaurantService {
  private static extractKeywords(text: string): string[] {
    if (!text) return [];

    const normalizedText = text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const words = normalizedText.split(/[\s,]+/);
    return words.filter(word => 
      word.length >= CONFIG.MIN_KEYWORD_LENGTH && 
      !COMMON_WORDS.has(word)
    );
  }

  private static extractMealSection(dietPlan: string, section: string): string {
    if (!dietPlan || !section) return '';

    try {
      const sectionMatch = dietPlan.match(
        new RegExp(`${section}:([^]*?)(?=(${Object.values(MEAL_TYPES).join('|')}|Lanches|Bebidas|Dicas|$))`, 'i')
      );
      return sectionMatch ? sectionMatch[1].trim() : '';
    } catch (error) {
      console.error('Erro ao extrair seção da dieta:', error);
      return '';
    }
  }

  private static findMatchingItems(keywords: string[], restaurantKeywords: string[]): string[] {
    if (!keywords?.length || !restaurantKeywords?.length) return [];

    const matchedItems = new Set<string>();
    const normalizedRestaurantKeywords = new Map(
      restaurantKeywords.map(k => [k, k.toLowerCase()])
    );
    
    keywords.forEach(keyword => {
      restaurantKeywords.forEach(restaurantKeyword => {
        const normalizedRestaurantKeyword = normalizedRestaurantKeywords.get(restaurantKeyword);
        if (normalizedRestaurantKeyword?.includes(keyword) || 
            keyword.includes(normalizedRestaurantKeyword!)) {
          matchedItems.add(restaurantKeyword);
        }
      });
    });

    return Array.from(matchedItems);
  }

  private static validateRestaurantUrl(url: string): boolean {
    return restaurantDatabase.some(restaurant => restaurant.url === url);
  }

  private static formatMealRecommendation(match: MealMatch): string {
    if (!match?.restaurant?.url || !match.matchedItems?.length) {
      return '';
    }

    // Validar se o restaurante existe no banco de dados
    if (!RestaurantService.validateRestaurantUrl(match.restaurant.url)) {
      console.error(`Restaurante com URL ${match.restaurant.url} não encontrado no banco de dados`);
      return '';
    }

    let text = `${match.restaurant.url}\n\n💡 `;
    text += RestaurantService.getRecommendationMessage(match.matchedItems);
    text += '\n\n';
    text += RestaurantService.formatMatchedItems(match.matchedItems);
    text += '\n---\n';
    return text;
  }

  private static getRecommendationMessage(matchedItems: string[]): string {
    if (!matchedItems?.length) return RECOMMENDATION_MESSAGES.DEFAULT;

    const hasItem = (items: string[]) => 
      items.some(item => matchedItems.some(m => m.toLowerCase().includes(item)));

    if (hasItem(MEAL_KEYWORDS.BREAKFAST)) {
      return RECOMMENDATION_MESSAGES.BREAKFAST;
    } else if (hasItem(MEAL_KEYWORDS.LUNCH)) {
      return RECOMMENDATION_MESSAGES.LUNCH;
    } else if (hasItem(MEAL_KEYWORDS.SALAD)) {
      return RECOMMENDATION_MESSAGES.SALAD;
    } else if (hasItem(MEAL_KEYWORDS.SEAFOOD)) {
      return RECOMMENDATION_MESSAGES.SEAFOOD;
    }
    return RECOMMENDATION_MESSAGES.DEFAULT;
  }

  private static formatMatchedItems(items: string[]): string {
    if (!items?.length) return '';

    const uniqueItems = [...new Set(items)]
      .sort()
      .filter(item => 
        !COMMON_WORDS.has(item.toLowerCase()) && 
        item.length >= CONFIG.MIN_KEYWORD_LENGTH
      );

    return `🎯 Pratos recomendados:\n${uniqueItems.map(item => `• ${item}`).join('\n')}`;
  }

  private static findMatchingRestaurantForMeal(mealType: MealType, keywords: string[]): MealMatch | null {
    // Filtrar apenas restaurantes que oferecem este tipo de refeição
    const availableRestaurants = restaurantDatabase.filter(r => r.mealTypes.includes(mealType));
    
    if (!availableRestaurants.length) {
      console.warn(`Nenhum restaurante encontrado para ${mealType}`);
      return null;
    }

    // Encontrar o melhor match baseado nas keywords
    const matches = availableRestaurants.map(restaurant => {
      const matchedItems = RestaurantService.findMatchingItems(keywords, restaurant.keywords);
      return {
        restaurant,
        matchCount: matchedItems.length,
        matchedItems,
        mealType,
        matchedSection: keywords.join(' ')
      } as MealMatch;
    })
    .filter(match => match.matchCount >= CONFIG.MIN_MATCH_COUNT)
    .sort((a, b) => b.matchCount - a.matchCount);

    return matches.length > 0 ? matches[0] : null;
  }

  public static findRestaurantsByDiet(dietDescription: string): MealMatch[] {
    if (!dietDescription) {
      console.warn('Descrição da dieta não fornecida');
      return [];
    }

    try {
      const matches: MealMatch[] = [];

      // Processar apenas refeições principais usando restaurantes existentes
      for (const mealType of CONFIG.MAIN_MEAL_TYPES) {
        const section = RestaurantService.extractMealSection(dietDescription, MEAL_TYPES[mealType]);
        if (!section) continue;

        const keywords = RestaurantService.extractKeywords(section);
        if (!keywords.length) {
          console.warn(`Nenhuma keyword encontrada para ${mealType}`);
          continue;
        }

        console.log(`Keywords para ${mealType}:`, keywords);

        const bestMatch = RestaurantService.findMatchingRestaurantForMeal(mealType, keywords);
        if (bestMatch) {
          console.log(`Match encontrado para ${mealType}:`, bestMatch.restaurant.url);
          matches.push(bestMatch);
        }
      }

      console.log('Total de matches encontrados:', matches.length);
      return matches;
    } catch (error) {
      console.error('Erro ao buscar restaurantes:', error);
      return [];
    }
  }

  public static formatRestaurantRecommendations(restaurants: MealMatch[]): string {
    if (!restaurants?.length) {
      return MESSAGES.NO_RESTAURANTS_FOUND;
    }

    // Verificar se há restaurantes para refeições principais
    const hasMainMeals = CONFIG.MAIN_MEAL_TYPES.some(type => 
      restaurants.some(r => r.mealType === type)
    );

    if (!hasMainMeals) {
      return MESSAGES.NO_MAIN_MEAL_RESTAURANTS;
    }

    let response = MESSAGES.RECOMMENDATIONS_HEADER;

    // Mostrar apenas refeições principais, usando apenas restaurantes do banco
    for (const type of CONFIG.MAIN_MEAL_TYPES) {
      const match = restaurants.find(r => r.mealType === type);
      if (match) {
        response += `**${MEAL_TYPES[type]}**\n\n`;
        response += RestaurantService.formatMealRecommendation(match);
      }
    }

    response += MESSAGES.DAILY_TIP;
    return response;
  }
}

export const { findRestaurantsByDiet, formatRestaurantRecommendations } = RestaurantService; 