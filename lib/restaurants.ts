interface Restaurant {
  url: string;
  name: string;
  dishes: string[];
}

const restaurants: Restaurant[] = [
  {
    url: "https://restaurante1.com",
    name: "Restaurante Italiano",
    dishes: ["pizza margherita", "pizza calabresa", "pizza frango", "lasanha", "espaguete", "ravioli"]
  },
  {
    url: "https://restaurante2.com",
    name: "Restaurante Brasileiro",
    dishes: ["feijoada", "churrasco", "moqueca", "vatapá", "caruru", "acarajé"]
  },
  {
    url: "https://restaurante3.com",
    name: "Restaurante Japonês",
    dishes: ["sushi", "sashimi", "temaki", "yakisoba", "lámen", "gyoza"]
  },
  {
    url: "https://restaurante4.com",
    name: "Restaurante Mexicano",
    dishes: ["tacos", "burrito", "enchilada", "quesadilla", "fajita", "guacamole"]
  },
  {
    url: "https://restaurante5.com",
    name: "Restaurante Árabe",
    dishes: ["kebab", "shawarma", "falafel", "hummus", "tabule", "esfiha"]
  }
];

export function findRestaurantsByDish(dish: string): Restaurant[] {
  // Converte a frase para minúsculas
  const searchTerm = dish.toLowerCase();
  
  // Busca nos pratos de cada restaurante
  return restaurants.filter(restaurant => {
    // Verifica se algum prato do restaurante contém o termo de busca
    return restaurant.dishes.some(dish => 
      dish.toLowerCase().includes(searchTerm)
    );
  });
}

export function getAllRestaurants(): Restaurant[] {
  return restaurants;
}

export function getRestaurantByUrl(url: string): Restaurant | undefined {
  return restaurants.find(r => r.url === url);
} 