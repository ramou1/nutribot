import { findRestaurantsByDiet, formatRestaurantRecommendations } from '../services/restaurant-service';
import { UIMessage } from 'ai';
import { CONFIG } from '../types/restaurant';

export interface RestaurantAgentResponse {
  recommendations: string;
  success: boolean;
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
  if (!messages?.length) {
    console.warn('Nenhuma mensagem fornecida');
    return {
      recommendations: "Desculpe, não encontrei um histórico de mensagens para basear as recomendações.",
      success: false
    };
  }

  try {
    const lastDietPlan = findLastDietPlan(messages);
    
    if (!lastDietPlan) {
      console.log('Plano de dieta não encontrado nas mensagens');
      return {
        recommendations: "Desculpe, não encontrei um plano de dieta para basear as recomendações. Por favor, peça um plano de dieta primeiro.",
        success: false
      };
    }

    console.log('Plano de dieta encontrado, buscando restaurantes...');
    const restaurants = findRestaurantsByDiet(lastDietPlan);
    
    if (!restaurants.length) {
      console.log('Nenhum restaurante encontrado para o plano de dieta');
      return {
        recommendations: "Desculpe, não encontrei restaurantes que correspondam à sua dieta. Você gostaria de especificar melhor suas preferências?",
        success: false
      };
    }

    console.log(`Encontrados ${restaurants.length} restaurantes compatíveis`);
    const recommendations = formatRestaurantRecommendations(restaurants);

    return {
      recommendations,
      success: true
    };
  } catch (error) {
    console.error('Erro ao buscar recomendações:', error);
    return {
      recommendations: "Desculpe, ocorreu um erro ao buscar as recomendações de restaurantes. Por favor, tente novamente.",
      success: false
    };
  }
} 