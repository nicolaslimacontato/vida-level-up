# 🎮 Vida Level Up - RPG da Vida Real

Transforme suas tarefas diárias em uma aventura épica! Complete quests, ganhe XP e suba de nível enquanto melhora sua vida.

## ✨ Funcionalidades

- **Sistema de Níveis**: Cada nível requer 100 × nível de XP para subir
- **Quests Diárias**: Tarefas do dia a dia com recompensas de XP
- **Progresso Visual**: Barra de progresso e estatísticas em tempo real
- **Persistência Local**: Seus dados são salvos no navegador
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- **Notificações**: Celebração especial quando você sobe de nível!

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática para melhor desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de UI modernos e acessíveis
- **Lucide React** - Ícones bonitos e consistentes

## 🎯 Como Funciona

1. **Complete Quests**: Marque suas tarefas diárias como concluídas
2. **Ganhe XP**: Cada quest te dá pontos de experiência
3. **Suba de Nível**: Atinga o XP necessário para evoluir
4. **Continue Crescendo**: Quanto mais quests completar, mais forte ficará!

## 📱 Quests Disponíveis

- 🏃‍♂️ **Exercitar-se por 30 minutos** - 50 XP
- 📚 **Ler por 20 minutos** - 30 XP
- 💧 **Beber 2L de água** - 25 XP
- 🧘‍♀️ **Meditar por 10 minutos** - 40 XP
- 🧹 **Organizar o ambiente** - 35 XP

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos
1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd vida-level-up
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── dashboard/         # Página principal do dashboard
│   ├── globals.css        # Estilos globais
│   └── layout.tsx         # Layout principal
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── UserHeader.tsx    # Cabeçalho do usuário
│   ├── QuestList.tsx     # Lista de quests
│   └── LevelUpNotification.tsx # Notificação de level up
├── hooks/                # Hooks personalizados
│   └── useRPG.ts         # Lógica principal do RPG
└── types/                # Definições TypeScript
    └── rpg.ts            # Tipos do sistema RPG
```

## 🎨 Personalização

### Adicionando Novas Quests
Edite o arquivo `src/hooks/useRPG.ts` e adicione novas quests no array `INITIAL_QUESTS`:

```typescript
{
  id: '6',
  title: 'Sua Nova Quest',
  description: 'Descrição da quest',
  xpReward: 45,
  completed: false,
  category: 'daily'
}
```

### Modificando o Sistema de XP
Altere a função `getXPForNextLevel` para mudar a progressão:

```typescript
const getXPForNextLevel = (level: number): number => {
  return level * 150; // Mais XP necessário por nível
};
```

## 🔮 Próximas Funcionalidades

- [ ] Sistema de conquistas
- [ ] Quests semanais e mensais
- [ ] Estatísticas detalhadas
- [ ] Sistema de recompensas
- [ ] Modo multiplayer
- [ ] Backup na nuvem

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature
3. Fazer commit das suas mudanças
4. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- Comunidade Next.js
- Equipe do Tailwind CSS
- Criadores do shadcn/ui
- Todos os contribuidores open source

---

**Divirta-se gamificando sua vida! 🎉**
