![CoxaUI](ogimage.png)

# CoxaUI

Kit de componentes de interface para padronização dos projetos web do **Coritiba Foot Ball Club (SAF)**. Sem dependências de build — importe via CDN e comece a usar.

---

## Instalação via CDN

Adicione as duas linhas abaixo no `<head>` da sua página:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/coxa-ui/coxa-ui.css">

<!-- JS (defer recomendado) -->
<script src="https://cdn.jsdelivr.net/npm/coxa-ui/coxa-ui.js" defer></script>
```

> O CoxaUI auto-injeta o **Tabler Icons v3** e o **SweetAlert2 v11** — você não precisa importá-los separadamente.

---

## Estrutura básica de página

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Minha Aplicação</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/coxa-ui/coxa-ui.css">
  <script src="https://cdn.jsdelivr.net/npm/coxa-ui/coxa-ui.js" defer></script>
</head>
<body>
<div class="app-layout">
  <aside class="sidebar" id="sidebar">
    <!-- Navegação lateral -->
  </aside>
  <div class="overlay" id="overlay" onclick="closeSidebar()"></div>
  <div class="content-col">
    <header>
      <button class="menu-btn" onclick="toggleSidebar()">
        <i class="ti ti-menu-2"></i>
      </button>
      <div class="hdr-page">Título da Página</div>
      <div class="hdr-right">
        <button class="btn btn-ghost btn-sm" onclick="toggleDark()">
          <i class="ti ti-moon" id="darkIcon"></i>
        </button>
      </div>
    </header>
    <main class="main">
      <!-- Conteúdo -->
    </main>
    <footer>
      <span>Minha App &copy; 2025</span>
    </footer>
  </div>
</div>
</body>
</html>
```

---

## O que você pode fazer com o CoxaUI

### Componentes visuais

| Componente | Descrição |
|---|---|
| **Botões** | `btn-primary`, `btn-secondary`, `btn-danger`, `btn-ghost`, `btn-sm`, `btn-lg` |
| **Badges** | `badge-success`, `badge-danger`, `badge-warning`, `badge-info`, `badge-neutral`, `badge-sm`, `badge-lg` |
| **Alertas** | `alert-success`, `alert-danger`, `alert-warning`, `alert-info` |
| **Cards** | `card-item` com `card-header` e `card-body` |
| **Stat Cards** | `stat-card` com `stat-label`, `stat-value`, `stat-trend` |
| **Tabelas** | `table` dentro de `tbl-wrap`, com `tbl-toolbar` e dropdown de ações |
| **Formulários** | `form-control`, `form-label`, `form-group`, `input-icon-wrap`, `chk-wrap`, validação `is-invalid` |
| **Progresso** | `progress` + `progress-bar` com variantes `progress-success`, `progress-warning`, `progress-danger` |
| **Tabs** | `.tabs` + `.tab` + `.tab-panel` — controlado via `switchTab()` |
| **Acordeão** | `.accordion` + `.accordion-item` + `.accordion-btn` — controlado via `initAccordion()` |
| **Timeline** | `.timeline` + `.tl-item` com pontos coloridos `tl-dot-success`, `tl-dot-info`, `tl-dot-warning` |
| **Spinners** | `.spinner`, `.spinner-sm`, `.spinner-lg`, `.spinner-inline` |
| **Dropdowns** | `.act-dd` + `.act-dd-btn` + `.act-dd-menu` — controlado via `initDropdowns()` |
| **Modais** | `.modal-overlay` + `.modal-box` — controlado via `openModal()` / `closeModal()` |

### Layout

- **App layout** com sidebar colapsável, header fixo, área de conteúdo e footer
- **Modo escuro** automático via `html.dark` — persiste em `localStorage`
- **Responsivo** — sidebar vira drawer em telas pequenas

### Ícones

Tabler Icons v3 auto-importados — use `<i class="ti ti-nome"></i>`. Mais de 5.000 ícones disponíveis em [tabler.io/icons](https://tabler.io/icons).

### JavaScript API

| Função | Descrição |
|---|---|
| `toggleSidebar()` | Abre/fecha o sidebar |
| `closeSidebar()` | Fecha o sidebar |
| `toggleDark()` | Alterna modo escuro |
| `coxaToast(icon, msg)` | Toast notification via SweetAlert2 |
| `coxaConfirm(form, title, text, icon, confirmText, color)` | Diálogo de confirmação |
| `openModal(id)` | Abre modal pelo ID |
| `closeModal(id)` | Fecha modal pelo ID |
| `initModalOverlayClose(id)` | Fecha modal ao clicar fora |
| `initTableSearch(inputId, selector)` | Filtro de busca em tabela |
| `switchTab(btn, panelId)` | Troca aba ativa |
| `initAccordion()` | Inicializa acordeão |
| `initPageSpinner()` | Spinner de navegação global |
| `copyToClipboard(text, el?)` | Copia texto para clipboard |
| `mkSlug(text)` | Gera slug a partir de texto |
| `updateClock()` | Relógio ao vivo (`#live-clock`) |
| `updateElapsed()` | Tempo decorrido (`[data-entrada]`) |
| `toggleSelRow(chk)` | Seleção de linha em tabela |
| `toggleSelAll(chk)` | Selecionar/desmarcar tudo |
| `clearSel()` | Limpa seleção em massa |

---

## Cores da marca

```css
--primary:    #006B3C  /* Verde Coritiba */
--accent:     #fad716  /* Amarelo Coritiba */
--danger:     #ea580c  /* Laranja (nunca vermelho) */
--info:       #2563eb
--warning:    #d97706
```

---



## Repositório

[github.com/CORITIBA-SAF-TECH/coxa-ui](https://github.com/CORITIBA-SAF-TECH/coxa-ui)