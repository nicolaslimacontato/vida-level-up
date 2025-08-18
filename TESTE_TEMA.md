# 🧪 Teste do Sistema de Tema

## 🔍 **Como Testar o Modo Escuro/Claro**

### **1. Acesse o Projeto**

```bash
npm run dev
# Acesse http://localhost:3000
```

### **2. Verifique o Toggle de Tema**

- **Localização**: Cabeçalho, lado direito da navegação
- **Componentes**:
  - 🌙 **Botão Lua**: Muda para modo escuro
  - ☀️ **Botão Sol**: Muda para modo claro
  - 🔄 **Botão Reset**: Força o tema claro

### **3. Teste de Funcionamento**

#### **Teste 1: Toggle Básico**

1. Clique no botão principal (🌙/☀️)
2. Verifique se o tema muda
3. Clique novamente para voltar

#### **Teste 2: Reset Forçado**

1. Mude para modo escuro
2. Clique no botão 🔄 (reset)
3. Verifique se volta para modo claro

#### **Teste 3: Persistência**

1. Mude o tema
2. Recarregue a página (F5)
3. Verifique se o tema persiste

### **4. Indicadores Visuais**

#### **Modo Claro** ☀️

- Fundo: `slate-50` → `slate-100`
- Cards: `white`
- Texto: `slate-800`
- Bordas: `slate-200`

#### **Modo Escuro** 🌙

- Fundo: `slate-900` → `slate-800`
- Cards: `slate-800`
- Texto: `white`
- Bordas: `slate-700`

### **5. Debug no Console**

Abra o DevTools (F12) e verifique:

```javascript
// Logs esperados:
"Trocando tema de light para dark";
"Aplicando tema: dark";
"Trocando tema de dark para light";
"Aplicando tema: light";
```

### **6. Verificação do DOM**

No DevTools, verifique se as classes estão sendo aplicadas:

```html
<!-- Modo claro -->
<html class="light">
  <!-- Modo escuro -->
  <html class="dark"></html>
</html>
```

### **7. Problemas Comuns**

#### **Tema não muda:**

1. Verifique se há erros no console
2. Confirme se as classes CSS estão sendo aplicadas
3. Teste o botão de reset

#### **Tema não persiste:**

1. Verifique se o localStorage está funcionando
2. Confirme se o hook está sendo executado

#### **Hidratação incorreta:**

1. Aguarde o componente montar completamente
2. Verifique se `mounted` está `true`

### **8. Comandos de Debug**

```javascript
// No console do navegador:
localStorage.getItem("vida-level-up-theme"); // Deve retornar 'light' ou 'dark'
document.documentElement.classList.contains("dark"); // true/false
document.documentElement.classList.contains("light"); // true/false
```

### **9. Solução de Problemas**

#### **Se o tema não voltar para claro:**

1. Use o botão 🔄 (reset)
2. Limpe o localStorage: `localStorage.removeItem('vida-level-up-theme')`
3. Recarregue a página

#### **Se as transições não funcionarem:**

1. Verifique se o CSS está sendo carregado
2. Confirme se as classes `transition-*` estão aplicadas

### **10. Status Esperado**

✅ **Funcionando Corretamente:**

- Toggle entre temas funciona
- Transições suaves (300ms)
- Persistência no localStorage
- Detecção automática do sistema
- Indicadores visuais corretos

❌ **Problemas:**

- Tema não alterna
- Transições não funcionam
- Tema não persiste
- Hidratação incorreta

---

**Teste todos os cenários e reporte qualquer problema encontrado! 🧪✨**
