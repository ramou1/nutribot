# NutriBot - Assistente de Dieta Personalizada

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fseu-usuario%2Fnutribot)

## 📋 Sobre o Projeto

NutriBot é um assistente nutricional inteligente que utiliza LLM (Large Language Model) para auxiliar clientes a encontrarem opções alimentares adequadas às suas necessidades específicas. O sistema foi desenvolvido com Next.js e OpenAI para proporcionar uma experiência personalizada e eficiente.

### 🎯 Funcionalidades Principais

- Coleta de informações sobre restrições alimentares (alergias, intolerâncias)
- Análise de preferências pessoais e objetivos de saúde
- Recomendação de pratos específicos dos cardápios de restaurantes parceiros
- Sugestão de adaptações possíveis em pratos existentes
- Fornecimento de informações nutricionais aproximadas
- Histórico de pedidos para refinar recomendações futuras

### 🥗 Restrições Alimentares Suportadas

O NutriBot está preparado para auxiliar pessoas com as seguintes restrições alimentares:

- Diabéticos
- Alérgicos à proteína do leite
- Intolerantes à lactose
- Veganos
- Vegetarianos
- Celíacos
- Pessoas com Síndrome do Intestino Irritável

### 💡 Benefícios

- **Para Clientes**: Recebem recomendações personalizadas baseadas em suas necessidades específicas
- **Para Restaurantes**: Podem atender melhor públicos com necessidades alimentares específicas

## 🚀 Como Executar

1. Clone o repositório
2. Crie um arquivo `.env` baseado no `.env.sample` e adicione as variáveis de ambiente necessárias
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Execute o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse a aplicação em `http://localhost:3000`

## 🛠️ Tecnologias Utilizadas

- Next.js
- OpenAI
- TypeScript
- Tailwind CSS

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
