# 🎯 Exemplo de Uso - Vida Level Up

## 🚀 Como Começar

1. **Acesse o Dashboard**: Ao abrir o projeto, você será redirecionado automaticamente para `/dashboard`

2. **Visualize seu Status**: No topo da página, você verá:
   - Seu nível atual
   - XP atual e necessário para o próximo nível
   - Barra de progresso visual
   - XP total acumulado

3. **Complete Quests**: Na lista de quests pendentes:
   - Leia a descrição de cada tarefa
   - Clique em "Marcar como Concluída" quando terminar
   - Ganhe XP imediatamente!

## 🎮 Sistema de Progressão

### Exemplo de Level Up:

- **Nível 1 → 2**: Precisa de 100 XP
- **Nível 2 → 3**: Precisa de 200 XP
- **Nível 3 → 4**: Precisa de 300 XP
- E assim por diante...

### Quests Disponíveis:

- 🏃‍♂️ **Exercitar-se por 30 minutos** = 50 XP
- 📚 **Ler por 20 minutos** = 30 XP
- 💧 **Beber 2L de água** = 25 XP
- 🧘‍♀️ **Meditar por 10 minutos** = 40 XP
- 🧹 **Organizar o ambiente** = 35 XP

## 💡 Dicas para Maximizar XP

1. **Complete todas as quests diárias** para ganhar 180 XP total
2. **Mantenha consistência** - quanto mais quests completar, mais rápido subirá de nível
3. **Monitore seu progresso** usando a barra de XP no topo
4. **Celebre seus level ups** - cada conquista é uma vitória!

## 🔄 Reset Diário

As quests são resetadas automaticamente a cada dia, permitindo que você:

- Mantenha o hábito de completar tarefas
- Acumule XP consistentemente
- Veja seu progresso ao longo do tempo

## 📱 Responsividade

O projeto funciona perfeitamente em:

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile
- ✅ Todos os navegadores modernos

## 🎨 Personalização

### Adicionar Novas Quests:

Edite `src/hooks/useRPG.ts` e adicione no array `INITIAL_QUESTS`:

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

### Modificar Sistema de XP:

Altere a função `getXPForNextLevel`:

```typescript
const getXPForNextLevel = (level: number): number => {
  return level * 150; // Mais XP necessário
};
```

## 🎉 Celebração de Level Up

Quando você sobe de nível:

- Uma notificação especial aparece
- Efeitos visuais animados
- Parabéns personalizados
- Motivação para continuar!

---

**Lembre-se: Cada pequena tarefa completada é um passo em direção ao seu próximo nível! 🚀**
