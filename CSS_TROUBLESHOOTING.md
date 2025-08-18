# 🔧 Solução de Problemas CSS - Vida Level Up

## ❌ Erros Comuns e Soluções

### **1. "Unknown at rule @custom-variant"**

**Problema:**
```
Unknown at rule @custom-variant
```

**Causa:**
- `@custom-variant` é uma funcionalidade experimental do CSS
- Não é suportada pela maioria dos navegadores e editores

**Solução:**
- ❌ **NÃO use:** `@custom-variant dark (&:is(.dark *));`
- ✅ **Use:** O sistema já configurado com `darkMode: "class"` no Tailwind

### **2. "Unknown at rule @apply"**

**Problema:**
```
Unknown at rule @apply
```

**Causa:**
- O editor não reconhece as diretivas do Tailwind CSS
- Falta de configuração do VS Code/Cursor

**Solução:**
1. **Instale a extensão:** `bradlc.vscode-tailwindcss`
2. **Configure o VS Code:** Use os arquivos em `.vscode/`
3. **Reinicie o editor** após instalar a extensão

### **3. "Unknown at rule @layer"**

**Problema:**
```
Unknown at rule @layer
```

**Causa:**
- Mesmo problema do `@apply`
- Editor não reconhece diretivas do Tailwind

**Solução:**
- Mesma solução do problema `@apply`
- Instale a extensão do Tailwind CSS

### **4. "Unknown at rule @theme"**

**Problema:**
```
Unknown at rule @theme
```

**Causa:**
- Diretiva experimental do Tailwind
- Pode não ser necessária no seu projeto

**Solução:**
- Remova se não estiver usando
- Use variáveis CSS normais se necessário

## 🛠️ Configuração do Editor

### **Extensões Necessárias**

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### **Configuração do VS Code**

Arquivo: `.vscode/settings.json`
```json
{
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  "css.customData": [".vscode/css_custom_data.json"],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### **Dados Customizados CSS**

Arquivo: `.vscode/css_custom_data.json`
```json
{
  "version": 1.1,
  "atDirectives": [
    {
      "name": "@tailwind",
      "description": "Tailwind CSS directive"
    },
    {
      "name": "@apply",
      "description": "Apply Tailwind utilities"
    },
    {
      "name": "@layer",
      "description": "Define CSS layer"
    }
  ]
}
```

## ✅ Sistema de Tema Funcionando

### **Como Funciona**

1. **ThemeProvider** adiciona/remove classe `dark` no `<html>`
2. **Tailwind** detecta a classe e aplica estilos escuros
3. **Variáveis CSS** mudam automaticamente
4. **Classes** como `dark:bg-slate-800` funcionam perfeitamente

### **Exemplo de Uso**

```tsx
// Componente com tema escuro
<div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
  <h1>Meu Título</h1>
  <p>Meu texto</p>
</div>
```

### **Toggle de Tema**

```tsx
// No cabeçalho
<ThemeToggle />
// Botões: ☀️ (claro) | 💻 (sistema) | 🌙 (escuro)
```

## 🚀 Comandos Úteis

### **Instalar Extensões**

```bash
# VS Code (via CLI)
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
```

### **Reiniciar Editor**

```bash
# VS Code
Ctrl+Shift+P > "Developer: Reload Window"

# Cursor
Ctrl+Shift+P > "Developer: Reload Window"
```

### **Verificar Configuração**

```bash
# Verificar se Tailwind está funcionando
npm run dev
# Acesse http://localhost:3000
# Teste o toggle de tema no cabeçalho
```

## 📝 Checklist de Verificação

- [ ] Extensão Tailwind CSS instalada
- [ ] Arquivos `.vscode/` configurados
- [ ] Editor reiniciado após instalação
- [ ] `darkMode: "class"` no `tailwind.config.ts`
- [ ] ThemeProvider funcionando
- [ ] Toggle de tema visível no cabeçalho
- [ ] Sem erros de CSS no console

## 🎯 Resultado Esperado

Após seguir este guia:

- ✅ **Sem erros** de "Unknown at rule"
- ✅ **Autocompletar** do Tailwind funcionando
- ✅ **Tema escuro** alternando corretamente
- ✅ **IntelliSense** para classes CSS
- ✅ **Formatação automática** do código

## 🔄 Se os Problemas Persistirem

1. **Delete a pasta `.vscode/`** e recrie
2. **Desinstale e reinstale** a extensão do Tailwind
3. **Limpe o cache** do VS Code/Cursor
4. **Verifique** se não há conflitos com outras extensões
5. **Teste** em um novo workspace

---

**💡 Dica:** Sempre que adicionar novas diretivas CSS, atualize o arquivo `css_custom_data.json`!
