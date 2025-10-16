import { MainQuest } from "@/types/rpg";

export interface MainQuestTemplate {
    title: string;
    description: string;
    category: "mensal" | "trimestral" | "semestral" | "anual";
    xpReward: number;
    coinReward: number;
    steps: Array<{
        title: string;
        description: string;
        xpReward: number;
        coinReward: number;
    }>;
}

export const MAIN_QUEST_TEMPLATES: MainQuestTemplate[] = [
    // MISSÕES ANUAIS (1000+ XP)
    {
        title: "Completar Certificação Profissional",
        description: "Obtenha uma certificação importante na sua área de trabalho",
        category: "anual",
        xpReward: 1500,
        coinReward: 500,
        steps: [
            {
                title: "Escolher a certificação",
                description: "Pesquise e defina qual certificação fazer",
                xpReward: 100,
                coinReward: 50,
            },
            {
                title: "Planejar cronograma",
                description: "Crie um plano de estudos detalhado",
                xpReward: 150,
                coinReward: 75,
            },
            {
                title: "Estudar por 3 meses",
                description: "Dedique-se aos estudos por pelo menos 3 meses",
                xpReward: 400,
                coinReward: 150,
            },
            {
                title: "Fazer a prova",
                description: "Realize o exame da certificação",
                xpReward: 500,
                coinReward: 200,
            },
            {
                title: "Obter o certificado",
                description: "Receba oficialmente a certificação",
                xpReward: 350,
                coinReward: 125,
            },
        ],
    },
    {
        title: "Ler 12 Livros",
        description: "Leia um livro por mês durante o ano todo",
        category: "anual",
        xpReward: 1200,
        coinReward: 400,
        steps: [
            {
                title: "Escolher os livros",
                description: "Selecione 12 livros que deseja ler",
                xpReward: 100,
                coinReward: 50,
            },
            {
                title: "Ler 3 livros",
                description: "Complete os primeiros 3 livros",
                xpReward: 300,
                coinReward: 100,
            },
            {
                title: "Ler 6 livros",
                description: "Complete a metade dos livros",
                xpReward: 300,
                coinReward: 100,
            },
            {
                title: "Ler 9 livros",
                description: "Complete 9 livros",
                xpReward: 300,
                coinReward: 100,
            },
            {
                title: "Ler 12 livros",
                description: "Complete todos os 12 livros",
                xpReward: 200,
                coinReward: 50,
            },
        ],
    },
    {
        title: "Aprender um Idioma",
        description: "Domine um novo idioma até conseguir conversação fluente",
        category: "anual",
        xpReward: 1400,
        coinReward: 450,
        steps: [
            {
                title: "Escolher o idioma",
                description: "Defina qual idioma quer aprender",
                xpReward: 100,
                coinReward: 50,
            },
            {
                title: "Estudar o básico",
                description: "Aprenda vocabulário e gramática básica",
                xpReward: 300,
                coinReward: 100,
            },
            {
                title: "Praticar conversação",
                description: "Comece a conversar no idioma",
                xpReward: 400,
                coinReward: 150,
            },
            {
                title: "Fazer curso avançado",
                description: "Complete um curso de nível intermediário",
                xpReward: 400,
                coinReward: 150,
            },
            {
                title: "Alcançar fluência",
                description: "Consiga conversar fluentemente",
                xpReward: 200,
                coinReward: 50,
            },
        ],
    },
    {
        title: "Economizar R$ 10.000",
        description: "Acumule uma reserva financeira de R$ 10.000",
        category: "anual",
        xpReward: 1000,
        coinReward: 300,
        steps: [
            {
                title: "Fazer orçamento",
                description: "Analise sua renda e gastos",
                xpReward: 100,
                coinReward: 50,
            },
            {
                title: "Economizar R$ 2.500",
                description: "Acumule o primeiro quarto da meta",
                xpReward: 250,
                coinReward: 75,
            },
            {
                title: "Economizar R$ 5.000",
                description: "Alcance metade da meta",
                xpReward: 250,
                coinReward: 75,
            },
            {
                title: "Economizar R$ 7.500",
                description: "Chegue aos 75% da meta",
                xpReward: 250,
                coinReward: 75,
            },
            {
                title: "Economizar R$ 10.000",
                description: "Complete a meta total",
                xpReward: 150,
                coinReward: 50,
            },
        ],
    },

    // MISSÕES SEMESTRAIS (600-800 XP)
    {
        title: "Perder 10kg",
        description: "Alcance uma perda de peso saudável de 10kg",
        category: "semestral",
        xpReward: 700,
        coinReward: 250,
        steps: [
            {
                title: "Consultar especialista",
                description: "Procure um médico ou nutricionista",
                xpReward: 100,
                coinReward: 50,
            },
            {
                title: "Criar plano alimentar",
                description: "Desenvolva uma dieta adequada",
                xpReward: 150,
                coinReward: 75,
            },
            {
                title: "Perder 3kg",
                description: "Alcance a primeira perda significativa",
                xpReward: 150,
                coinReward: 50,
            },
            {
                title: "Perder 7kg",
                description: "Chegue próximo da meta",
                xpReward: 150,
                coinReward: 50,
            },
            {
                title: "Perder 10kg",
                description: "Complete a meta de perda de peso",
                xpReward: 150,
                coinReward: 50,
            },
        ],
    },
    {
        title: "Correr uma Maratona",
        description: "Complete uma maratona de 42km",
        category: "semestral",
        xpReward: 800,
        coinReward: 300,
        steps: [
            {
                title: "Começar a treinar",
                description: "Inicie um programa de corrida",
                xpReward: 100,
                coinReward: 50,
            },
            {
                title: "Correr 10km",
                description: "Complete uma corrida de 10km",
                xpReward: 200,
                coinReward: 75,
            },
            {
                title: "Correr 21km",
                description: "Complete uma meia maratona",
                xpReward: 250,
                coinReward: 100,
            },
            {
                title: "Treinar 35km",
                description: "Complete um treino de 35km",
                xpReward: 150,
                coinReward: 75,
            },
            {
                title: "Correr 42km",
                description: "Complete a maratona oficial",
                xpReward: 100,
                coinReward: 50,
            },
        ],
    },
    {
        title: "Montar Portfólio Profissional",
        description: "Crie um portfólio completo com seus melhores trabalhos",
        category: "semestral",
        xpReward: 600,
        coinReward: 200,
        steps: [
            {
                title: "Organizar trabalhos",
                description: "Reúna todos os seus projetos",
                xpReward: 100,
                coinReward: 50,
            },
            {
                title: "Criar site/portfólio",
                description: "Desenvolva a estrutura do portfólio",
                xpReward: 200,
                coinReward: 75,
            },
            {
                title: "Adicionar 5 projetos",
                description: "Inclua pelo menos 5 trabalhos",
                xpReward: 150,
                coinReward: 50,
            },
            {
                title: "Otimizar design",
                description: "Melhore a apresentação visual",
                xpReward: 100,
                coinReward: 25,
            },
            {
                title: "Publicar online",
                description: "Coloque o portfólio no ar",
                xpReward: 50,
                coinReward: 25,
            },
        ],
    },

    // MISSÕES TRIMESTRAIS (400-600 XP)
    {
        title: "Aprender a Tocar um Instrumento",
        description: "Domine o básico de um instrumento musical",
        category: "trimestral",
        xpReward: 500,
        coinReward: 150,
        steps: [
            {
                title: "Escolher o instrumento",
                description: "Defina qual instrumento quer aprender",
                xpReward: 50,
                coinReward: 25,
            },
            {
                title: "Aprender o básico",
                description: "Domine as notas e acordes básicos",
                xpReward: 150,
                coinReward: 50,
            },
            {
                title: "Tocar 3 músicas",
                description: "Execute 3 músicas completas",
                xpReward: 150,
                coinReward: 50,
            },
            {
                title: "Tocar em público",
                description: "Apresente-se para outras pessoas",
                xpReward: 100,
                coinReward: 25,
            },
        ],
    },
    {
        title: "Criar um Blog",
        description: "Desenvolva um blog sobre um tema de seu interesse",
        category: "trimestral",
        xpReward: 450,
        coinReward: 125,
        steps: [
            {
                title: "Definir o tema",
                description: "Escolha o nicho do seu blog",
                xpReward: 50,
                coinReward: 25,
            },
            {
                title: "Configurar o blog",
                description: "Crie a plataforma e domínio",
                xpReward: 100,
                coinReward: 50,
            },
            {
                title: "Escrever 10 posts",
                description: "Publique pelo menos 10 artigos",
                xpReward: 200,
                coinReward: 50,
            },
            {
                title: "Alcançar 100 leitores",
                description: "Tenha pelo menos 100 seguidores",
                xpReward: 100,
                coinReward: 25,
            },
        ],
    },
    {
        title: "Fazer um Curso Online",
        description: "Complete um curso online completo",
        category: "trimestral",
        xpReward: 400,
        coinReward: 100,
        steps: [
            {
                title: "Escolher o curso",
                description: "Selecione um curso relevante",
                xpReward: 50,
                coinReward: 25,
            },
            {
                title: "Completar 25%",
                description: "Assista um quarto do curso",
                xpReward: 100,
                coinReward: 25,
            },
            {
                title: "Completar 50%",
                description: "Chegue na metade do curso",
                xpReward: 100,
                coinReward: 25,
            },
            {
                title: "Completar 100%",
                description: "Finalize todo o curso",
                xpReward: 150,
                coinReward: 25,
            },
        ],
    },

    // MISSÕES MENSAIS (200-400 XP)
    {
        title: "Desenvolver um Hábito",
        description: "Crie e mantenha um hábito positivo por 30 dias",
        category: "mensal",
        xpReward: 300,
        coinReward: 100,
        steps: [
            {
                title: "Definir o hábito",
                description: "Escolha o hábito que quer desenvolver",
                xpReward: 50,
                coinReward: 25,
            },
            {
                title: "Manter por 7 dias",
                description: "Pratique o hábito por uma semana",
                xpReward: 100,
                coinReward: 25,
            },
            {
                title: "Manter por 21 dias",
                description: "Continue por três semanas",
                xpReward: 100,
                coinReward: 25,
            },
            {
                title: "Manter por 30 dias",
                description: "Complete um mês inteiro",
                xpReward: 50,
                coinReward: 25,
            },
        ],
    },
    {
        title: "Organizar a Casa",
        description: "Faça uma organização completa do seu espaço",
        category: "mensal",
        xpReward: 250,
        coinReward: 75,
        steps: [
            {
                title: "Fazer inventário",
                description: "Liste todos os itens da casa",
                xpReward: 50,
                coinReward: 25,
            },
            {
                title: "Organizar um cômodo",
                description: "Complete a organização de uma sala",
                xpReward: 100,
                coinReward: 25,
            },
            {
                title: "Organizar metade da casa",
                description: "Organize 50% dos cômodos",
                xpReward: 75,
                coinReward: 25,
            },
            {
                title: "Finalizar organização",
                description: "Complete toda a organização",
                xpReward: 25,
                coinReward: 25,
            },
        ],
    },
    {
        title: "Aprender uma Habilidade Digital",
        description: "Domine uma nova ferramenta ou software",
        category: "mensal",
        xpReward: 280,
        coinReward: 90,
        steps: [
            {
                title: "Escolher a ferramenta",
                description: "Defina qual software quer aprender",
                xpReward: 50,
                coinReward: 25,
            },
            {
                title: "Aprender o básico",
                description: "Domine as funcionalidades principais",
                xpReward: 100,
                coinReward: 25,
            },
            {
                title: "Fazer projeto prático",
                description: "Crie algo usando a ferramenta",
                xpReward: 80,
                coinReward: 25,
            },
            {
                title: "Dominar a ferramenta",
                description: "Use-a de forma avançada",
                xpReward: 50,
                coinReward: 15,
            },
        ],
    },
];

// Funções utilitárias para filtrar templates
export const getTemplatesByCategory = (category: string): MainQuestTemplate[] => {
    if (category === "all") return MAIN_QUEST_TEMPLATES;
    return MAIN_QUEST_TEMPLATES.filter(template => template.category === category);
};

export const searchTemplates = (query: string): MainQuestTemplate[] => {
    const lowercaseQuery = query.toLowerCase();
    return MAIN_QUEST_TEMPLATES.filter(template =>
        template.title.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery)
    );
};

// Converter template para MainQuest
export const templateToMainQuest = (template: MainQuestTemplate): Omit<MainQuest, "id"> => {
    return {
        title: template.title,
        description: template.description,
        xpReward: template.xpReward,
        coinReward: template.coinReward,
        completed: false,
        steps: template.steps.map(step => ({
            ...step,
            id: `step-${Date.now()}-${Math.random()}`,
            completed: false
        }))
    };
};
