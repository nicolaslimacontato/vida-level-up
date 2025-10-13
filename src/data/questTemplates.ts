import { Quest } from "@/types/rpg";

export interface QuestTemplate {
    title: string;
    description: string;
    category: Quest["category"];
    icon: string;
    xpReward: number;
    coinReward: number;
    type: "daily" | "weekly";
    tags?: string[];
}

/**
 * Biblioteca de templates de quests prontos para usar
 * Organizados por categoria e tipo (daily/weekly)
 */
export const QUEST_TEMPLATES: QuestTemplate[] = [
    // ========== EXERCÍCIO E SAÚDE ==========
    {
        title: "Caminhar 30 minutos",
        description: "Uma caminhada leve para manter o corpo ativo e a mente clara",
        category: "daily",
        icon: "🚶‍♂️",
        xpReward: 25,
        coinReward: 10,
        type: "daily",
        tags: ["exercício", "saúde", "ar livre"]
    },
    {
        title: "Fazer exercícios por 45 minutos",
        description: "Treino completo para fortalecer corpo e mente",
        category: "daily",
        icon: "💪",
        xpReward: 50,
        coinReward: 25,
        type: "daily",
        tags: ["exercício", "força", "cardio"]
    },
    {
        title: "Correr 5km",
        description: "Corrida moderada para melhorar resistência cardiovascular",
        category: "daily",
        icon: "🏃‍♂️",
        xpReward: 75,
        coinReward: 35,
        type: "daily",
        tags: ["corrida", "cardio", "resistência"]
    },
    {
        title: "Yoga ou alongamento",
        description: "Sessão de yoga ou alongamento para flexibilidade e relaxamento",
        category: "daily",
        icon: "🧘‍♀️",
        xpReward: 30,
        coinReward: 15,
        type: "daily",
        tags: ["yoga", "alongamento", "relaxamento"]
    },
    {
        title: "Subir escadas por 10 minutos",
        description: "Exercício cardiovascular simples e eficaz",
        category: "daily",
        icon: "🪜",
        xpReward: 20,
        coinReward: 8,
        type: "daily",
        tags: ["cardio", "simples", "casa"]
    },

    // ========== ESTUDO E APRENDIZADO ==========
    {
        title: "Ler por 30 minutos",
        description: "Leitura de livro, artigo ou material educacional",
        category: "daily",
        icon: "📚",
        xpReward: 40,
        coinReward: 20,
        type: "daily",
        tags: ["leitura", "aprendizado", "conhecimento"]
    },
    {
        title: "Estudar uma nova habilidade",
        description: "Dedicar tempo para aprender algo novo (curso, tutorial, etc)",
        category: "daily",
        icon: "🎓",
        xpReward: 60,
        coinReward: 30,
        type: "daily",
        tags: ["estudo", "habilidade", "desenvolvimento"]
    },
    {
        title: "Pratique um idioma",
        description: "Estudar ou praticar um idioma estrangeiro",
        category: "daily",
        icon: "🌍",
        xpReward: 35,
        coinReward: 18,
        type: "daily",
        tags: ["idioma", "prática", "comunicação"]
    },
    {
        title: "Assistir documentário educativo",
        description: "Expandir conhecimento através de conteúdo educativo",
        category: "daily",
        icon: "🎬",
        xpReward: 30,
        coinReward: 15,
        type: "daily",
        tags: ["documentário", "educativo", "conhecimento"]
    },
    {
        title: "Resolver quebra-cabeças mentais",
        description: "Sudoku, palavras-cruzadas, quebra-cabeças para exercitar a mente",
        category: "daily",
        icon: "🧩",
        xpReward: 25,
        coinReward: 12,
        type: "daily",
        tags: ["quebra-cabeça", "mental", "lógica"]
    },

    // ========== TRABALHO E PRODUTIVIDADE ==========
    {
        title: "Organizar workspace",
        description: "Manter ambiente de trabalho limpo e organizado",
        category: "daily",
        icon: "🗂️",
        xpReward: 20,
        coinReward: 10,
        type: "daily",
        tags: ["organização", "produtividade", "ambiente"]
    },
    {
        title: "Completar 3 tarefas importantes",
        description: "Focar nas tarefas mais importantes do dia",
        category: "daily",
        icon: "✅",
        xpReward: 45,
        coinReward: 22,
        type: "daily",
        tags: ["produtividade", "tarefas", "foco"]
    },
    {
        title: "Planejar o próximo dia",
        description: "Fazer planejamento detalhado para o dia seguinte",
        category: "daily",
        icon: "📋",
        xpReward: 15,
        coinReward: 8,
        type: "daily",
        tags: ["planejamento", "organização", "produtividade"]
    },
    {
        title: "Fazer uma pausa de 10 minutos a cada hora",
        description: "Manter produtividade com pausas regulares",
        category: "daily",
        icon: "⏰",
        xpReward: 25,
        coinReward: 12,
        type: "daily",
        tags: ["pausas", "produtividade", "saúde"]
    },

    // ========== SOCIAL E RELACIONAMENTOS ==========
    {
        title: "Ligar para família ou amigos",
        description: "Manter contato com pessoas importantes na sua vida",
        category: "daily",
        icon: "📞",
        xpReward: 30,
        coinReward: 15,
        type: "daily",
        tags: ["social", "família", "amigos"]
    },
    {
        title: "Fazer uma boa ação",
        description: "Ajudar alguém ou fazer algo positivo para outros",
        category: "daily",
        icon: "🤝",
        xpReward: 40,
        coinReward: 20,
        type: "daily",
        tags: ["ajuda", "bondade", "social"]
    },
    {
        title: "Conversar com um colega",
        description: "Interação social positiva no trabalho ou estudos",
        category: "daily",
        icon: "💬",
        xpReward: 20,
        coinReward: 10,
        type: "daily",
        tags: ["social", "trabalho", "interação"]
    },

    // ========== CASA E ORGANIZAÇÃO ==========
    {
        title: "Limpar uma área da casa",
        description: "Manter ambiente doméstico organizado e limpo",
        category: "daily",
        icon: "🧹",
        xpReward: 25,
        coinReward: 12,
        type: "daily",
        tags: ["casa", "limpeza", "organização"]
    },
    {
        title: "Cozinhar uma refeição saudável",
        description: "Preparar comida nutritiva e gostosa",
        category: "daily",
        icon: "👨‍🍳",
        xpReward: 35,
        coinReward: 18,
        type: "daily",
        tags: ["cozinha", "saúde", "alimentação"]
    },
    {
        title: "Fazer a cama",
        description: "Começar o dia com organização e disciplina",
        category: "daily",
        icon: "🛏️",
        xpReward: 10,
        coinReward: 5,
        type: "daily",
        tags: ["organização", "disciplina", "simples"]
    },
    {
        title: "Regar as plantas",
        description: "Cuidar do jardim ou plantas de casa",
        category: "daily",
        icon: "🌱",
        xpReward: 15,
        coinReward: 8,
        type: "daily",
        tags: ["plantas", "jardim", "cuidado"]
    },

    // ========== HOBBIES E CRIATIVIDADE ==========
    {
        title: "Tocar um instrumento",
        description: "Praticar música para relaxar e se expressar",
        category: "daily",
        icon: "🎸",
        xpReward: 40,
        coinReward: 20,
        type: "daily",
        tags: ["música", "hobby", "criatividade"]
    },
    {
        title: "Desenhar ou pintar",
        description: "Expressar criatividade através da arte",
        category: "daily",
        icon: "🎨",
        xpReward: 35,
        coinReward: 18,
        type: "daily",
        tags: ["arte", "criatividade", "expressão"]
    },
    {
        title: "Escrever no diário",
        description: "Refletir sobre o dia e organizar pensamentos",
        category: "daily",
        icon: "📝",
        xpReward: 25,
        coinReward: 12,
        type: "daily",
        tags: ["escrita", "reflexão", "diário"]
    },
    {
        title: "Fazer artesanato",
        description: "Criar algo com as próprias mãos",
        category: "daily",
        icon: "✂️",
        xpReward: 30,
        coinReward: 15,
        type: "daily",
        tags: ["artesanato", "criatividade", "mãos"]
    },

    // ========== QUESTS SEMANAIS ==========
    {
        title: "Completar 5 exercícios diferentes",
        description: "Variar atividades físicas durante a semana",
        category: "weekly",
        icon: "🏋️‍♀️",
        xpReward: 150,
        coinReward: 75,
        type: "weekly",
        tags: ["exercício", "variedade", "semanal"]
    },
    {
        title: "Ler 3 capítulos de um livro",
        description: "Progresso consistente na leitura",
        category: "weekly",
        icon: "📖",
        xpReward: 120,
        coinReward: 60,
        type: "weekly",
        tags: ["leitura", "progresso", "semanal"]
    },
    {
        title: "Organizar uma área da casa",
        description: "Projeto maior de organização doméstica",
        category: "weekly",
        icon: "🏠",
        xpReward: 100,
        coinReward: 50,
        type: "weekly",
        tags: ["organização", "casa", "projeto"]
    },
    {
        title: "Conectar-se com 3 pessoas",
        description: "Manter relacionamentos sociais ativos",
        category: "weekly",
        icon: "👥",
        xpReward: 90,
        coinReward: 45,
        type: "weekly",
        tags: ["social", "relacionamentos", "semanal"]
    },
    {
        title: "Aprender algo completamente novo",
        description: "Explorar um novo hobby ou habilidade",
        category: "weekly",
        icon: "🌟",
        xpReward: 200,
        coinReward: 100,
        type: "weekly",
        tags: ["aprendizado", "novo", "desafio"]
    }
];

/**
 * Filtrar templates por categoria
 */
export function getTemplatesByCategory(category: string): QuestTemplate[] {
    if (category === "all") return QUEST_TEMPLATES;
    return QUEST_TEMPLATES.filter((template) => template.category === category);
}

/**
 * Filtrar templates por tipo (daily/weekly)
 */
export function getTemplatesByType(type: "daily" | "weekly"): QuestTemplate[] {
    return QUEST_TEMPLATES.filter((template) => template.type === type);
}

/**
 * Buscar templates por texto (título, descrição ou tags)
 */
export function searchTemplates(query: string): QuestTemplate[] {
    const lowerQuery = query.toLowerCase();
    return QUEST_TEMPLATES.filter(
        (template) =>
            template.title.toLowerCase().includes(lowerQuery) ||
            template.description.toLowerCase().includes(lowerQuery) ||
            template.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
}

/**
 * Converter template em Quest
 */
export function templateToQuest(template: QuestTemplate): Omit<Quest, "id" | "completed"> {
    return {
        title: template.title,
        description: template.description,
        xpReward: template.xpReward,
        coinReward: template.coinReward,
        category: template.category,
        progress: 0,
        maxProgress: 1,
    };
}
