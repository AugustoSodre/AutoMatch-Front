export interface UserPreferences {
  // 1. Demografia e Uso (O "Por quê")
  demographics: {
    familySize: '2' | '3-4' | '5+';
    primaryUse: 'work_commute' | 'travel' | 'ride_hailing' | 'off_road';
    primaryEnvironment: 'city' | 'highway' | 'dirt_road';
  };

  // 2. Capacidade Financeira (O Filtro)
  financials: {
    maxBudget: number; // Valor em Reais (R$)
  };

  // 3. Preferências Técnicas (O "O quê")
  technicalPreferences: {
    // Array de categorias permitidas no seu banco de dados
    categories: Array<'Hatch' | 'Sedan' | 'SUV' | 'Picape' | 'Eletrico' | 'Premium'>;
    vehicleAge: '0km' | 'up_to_3_years' | 'up_to_10_years';
    transmission: 'manual' | 'automatic' | 'indifferent';
  };

  // 4. Pesos e Prioridades (O "Coração" do algoritmo de IA)
  // Valores esperados: 1 (Pouco Importante) a 5 (Indispensável)
  priorities: {
    economy: number;
    power: number;
  };
}
