# 🌙 Modo Escuro - Vida Level Up

## ✨ Funcionalidades do Modo Escuro

### 🎨 **Tema Automático**

- **Detecção automática** da preferência do sistema
- **Persistência** da escolha do usuário no localStorage
- **Transições suaves** entre temas (300ms)

### 🔄 **Toggle Manual**

- **Botão de alternância** no cabeçalho
- **Ícones dinâmicos**: Sol ☀️ para modo claro, Lua 🌙 para modo escuro
- **Posicionamento** na navegação principal

### 🎯 **Elementos Suportados**

#### **Cabeçalho**

- Fundo: `white` → `slate-900`
- Bordas: `slate-200` → `slate-700`
- Texto: `slate-800` → `white`
- Navegação: `slate-600` → `slate-400`

#### **Dashboard**

- Fundo: `slate-50/100` → `slate-900/800`
- Cards: `white` → `slate-800`
- Bordas: `slate-200` → `slate-700`
- Textos: `slate-800` → `white`

#### **Quests**

- Cards pendentes: `white` → `slate-700`
- Cards concluídos: `green-50` → `green-900/20`
- Bordas: `slate-200` → `slate-600`
- Textos: `slate-800` → `white`

#### **Status do Usuário**

- Gradiente: `slate-900/800` → `slate-800/700`
- Bordas: `slate-700` → `slate-600`
- Elementos internos: `slate-800/50` → `slate-700/50`

## 🛠️ **Implementação Técnica**

### **Hook useTheme**

```typescript
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Carregar tema do localStorage
  // Detectar preferência do sistema
  // Aplicar classes CSS
  // Persistir escolhas
}
```

### **Componente ThemeToggle**

```typescript
export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Ícones dinâmicos
  // Estados de loading
  // Transições suaves
}
```

### **Classes CSS Responsivas**

```css
/* Exemplo de implementação */
.bg-white.dark\:bg-slate-800
  .text-slate-800.dark\:text-white
  .border-slate-200.dark\:border-slate-700;
```

## 🎨 **Paleta de Cores**

### **Modo Claro**

- **Primário**: `slate-50` → `slate-100`
- **Secundário**: `white`
- **Texto**: `slate-800`
- **Bordas**: `slate-200`
- **Acentos**: `blue-600`, `green-600`, `yellow-600`

### **Modo Escuro**

- **Primário**: `slate-900` → `slate-800`
- **Secundário**: `slate-800`
- **Texto**: `white`
- **Bordas**: `slate-700`
- **Acentos**: `blue-400`, `green-400`, `yellow-400`

## 🚀 **Como Usar**

### **1. Toggle Manual**

- Clique no botão 🌙/☀️ no cabeçalho
- O tema muda instantaneamente
- Sua escolha é salva automaticamente

### **2. Preferência do Sistema**

- O tema segue automaticamente a configuração do seu sistema
- Windows: Configurações > Sistema > Tela > Modo escuro
- macOS: Preferências do Sistema > Geral > Aparência

### **3. Persistência**

- Sua escolha é salva no navegador
- Na próxima visita, o tema será aplicado automaticamente
- Funciona em todas as páginas do projeto

## 🔧 **Personalização**

### **Adicionar Novos Elementos**

```typescript
// Exemplo de card com tema escuro
<div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
  <h2 className="text-slate-800 dark:text-white">Título</h2>
  <p className="text-slate-600 dark:text-slate-300">Descrição</p>
</div>
```

### **Cores Customizadas**

```typescript
// No tailwind.config.ts
colors: {
  custom: {
    light: "#ffffff",
    dark: "#1e293b"
  }
}
```

### **Animações**

```css
/* Transições suaves */
.transition-colors.duration-300 .transition-all.duration-200;
```

## 📱 **Responsividade**

- ✅ **Desktop**: Toggle visível na navegação
- ✅ **Tablet**: Toggle visível na navegação
- ✅ **Mobile**: Toggle visível na navegação
- ✅ **Todos os navegadores**: Suporte completo

## 🎉 **Benefícios**

1. **Experiência do Usuário**: Escolha entre temas
2. **Acessibilidade**: Melhor contraste em ambientes escuros
3. **Bateria**: Economia em dispositivos OLED
4. **Estética**: Visual moderno e profissional
5. **Consistência**: Mesma funcionalidade em ambos os temas

---

**Aproveite o modo escuro para uma experiência ainda mais imersiva! 🌙✨**
