# JonPanel — Visão Geral e Decisões de Arquitetura

> Arquivo de memória de longo prazo. Atualizado ao fim de cada bloco de desenvolvimento.

---

## O que é o JonPanel

**JonPanel** é um shell desktop open-source para Hyprland, construído com AGS v3 + GTK4 + TypeScript/JSX. É um projeto com identidade própria — não uma config pessoal, mas um produto que outras pessoas podem instalar e usar.

**Inspirações principais:**
- OkPanel (JohnOberhauser) — top bar full-width, estética Android/sistema operacional moderno
- colorshell (retrozinndev) — Control Center com sliders, estrutura TypeScript/SCSS

**Diferencial do JonPanel:**
- Suporte nativo a múltiplos temas (sistema de variáveis SCSS)
- Tokyo Night como tema default
- Vibe "sistema operacional moderno" — não r/unixporn clássico

---

## Stack técnica

| Componente | Escolha | Motivo |
|---|---|---|
| Framework | AGS v3 (`aylurs-gtk-shell-git`) | GTK4, TypeScript, ativo |
| Runtime | GJS (GNOME JavaScript) | Nativo do ecossistema AGS |
| Linguagem | TypeScript + JSX | Background React Native do autor |
| Estilo | SCSS com dart-sass | Variáveis, nesting, portabilidade |
| Toolkit | GTK4 + gtk4-layer-shell | Layer shell para Wayland |
| Astal libs | Battery, Network, Bluetooth, Mpris, Hyprland, Notifd, WirePlumber, Tray | Bindings oficiais |
| Package manager | pnpm | Mais eficiente que npm |

---

## Componentes do MVP

### 1. Top Bar (full-width)
- Altura: ~34px, sempre visível
- Fundo: semi-transparente com blur via layerrule Hyprland
- Layout: [workspaces | active window] ←→ [media | bt | net | battery | clock | powermenu]
- Estilo: full-width, sem margin lateral

### 2. Control Center
- Acionado por: clique no clock ou keybind (a definir — `ags message` para `toggleCC`)
- Overlay layer-shell TOP+RIGHT; visibilidade controlada por `services/controlcenter.ts`
- Seções: sliders (volume + brilho) → quick toggles (WiFi, BT, DND, power profile) → notificações
- Substitui: Swaync + scripts OSD atuais

### 3. Notificações (daemon nativo AGS)
- Via `astal-notifd` — AGS registra `org.freedesktop.Notifications` no D-Bus
- Popups flutuantes (TOP+RIGHT, máx 3, auto-dismiss 4s) em `widgets/notifications/`
- Histórico dentro do Control Center via `NotificationList`
- Swaync completamente removido

### 4. OSD
- Overlay flutuante centralizado (ou inferior) — a definir
- Volume: ícone + barra de progresso + percentual
- Brilho: mesmo padrão
- Auto-oculta em 2 segundos

---

## Sistema de temas

### Arquitetura
```
themes/
├── tokyo-night.scss    # default
├── catppuccin.scss     # planejado
├── gruvbox.scss        # planejado
└── rose-pine.scss      # planejado
```

### Variáveis obrigatórias por tema
```scss
// Backgrounds
$bg:        #1a1b26;  // janela principal
$bg-alt:    #16161e;  // superfícies secundárias
$surface:   #1f2335;  // cards, controles

// Foreground
$fg:        #c0caf5;  // texto principal
$fg-muted:  #565f89;  // texto secundário

// Accent
$blue:      #7aa2f7;
$purple:    #bb9af7;
$cyan:      #7dcfff;
$green:     #9ece6a;
$yellow:    #e0af68;
$red:       #f7768e;
$orange:    #ff9e64;

// Border / blur
$border:    rgba(#7aa2f7, 0.3);
$blur-bg:   rgba(#1a1b26, 0.85);
```

### Regra de ouro
Nenhum componente usa cor hexadecimal direta. **Sempre via variável de tema.**

---

## Decisões de arquitetura

### Decisões tomadas

- ✅ **Repo separado** — `github.com/jonatasbarra/jonpanel`
- ✅ **Top bar full-width** — sem pill/floating islands
- ✅ **Notificações via AGS nativo** — Swaync removido; `AstalNotifd` é o daemon D-Bus
- ✅ **Control Center completo** — sliders + toggles + notificações em overlay layer-shell
- ✅ **Múltiplos temas desde o início** — arquitetura SCSS com variáveis por tema
- ✅ **Tokyo Night como default**
- ✅ **pnpm** — package manager do projeto
- ✅ **Blur via layerrule Hyprland** — não CSS blur
- ✅ **Reatividade via `createBinding` e `createComputed`** — API correta do gnim/AGS v3
- ✅ **Listas reativas via `<For>`** — não `.as()` retornando JSX diretamente
- ✅ **SCSS compilado manualmente** com `sass style.scss style.css` — GTK não processa SCSS
- ✅ **Services como singletons** — `services/controlcenter.ts` com `createState` para visibilidade de janelas

### Decisões pendentes

- 🔲 Nome dos workspaces: ícones pacman ou ícones por app?
- 🔲 Posição do OSD: centro inferior ou centro tela?
- 🔲 Animação do Control Center: slide down ou fade + scale?
- 🔲 Config file: YAML? JSON? Só SCSS?
- 🔲 Powermenu: diálogo de confirmação antes de executar ações
- 🔲 Keybind SUPER+N: redirecionar para `ags message toggleCC` (swaync-client removido)

---

## Lições técnicas importantes (AGS v3 / gnim)

- `createBinding(obj, "prop")` — reatividade em propriedade GObject
- `createComputed(() => { ... })` — computed que rastreia múltiplas props reativamente
- `createState(initial)` — `[getter, setter]` para estado local; getter é reativo e funciona com `<For>`
- `<For each={accessor}>` — componente para listas reativas (não `.as()` retornando arrays JSX)
- `GLib.timeout_add(priority, ms, () => false)` — timer one-shot; retornar `false` cancela
- `notifd.connect("notified", (_, id) => ...)` — sinal para novas notificações; buscar via `notifd.notifications.find(n => n.id === id)`
- Importar de `"ags"` re-exporta tudo de `"gnim"`
- SCSS deve ser compilado para CSS antes — `sass style.scss style.css`
- `ags run arquivo.tsx --gtk 4` — flag obrigatória para GTK4
- `pkill -9 -f "ags"` — matar instância anterior antes de relancar
- Symlinks em dotfiles: usar `readlink -f` para resolver antes de editar

---

## Repositório

- **URL:** https://github.com/jonatasbarra/jonpanel
- **Branch principal:** `main`
- **Branch de desenvolvimento:** `feat/initial`
- **Visibilidade:** público

### Tags planejadas
| Tag | Marco |
|---|---|
| `v0.1-bar` | Top bar funcional com todos os módulos |
| `v0.2-control-center` | Control Center + notificações AGS nativas (Bloco D completo) |
| `v0.3-osd` | OSD de volume e brilho |
| `v1.0-launch` | MVP completo, README com screenshots |

---

## Estado atual

**Bloco atual:** Bloco D concluído — Control Center e notificações funcionais
**Última tag:** `v0.2-control-center`
**Próxima etapa:** Bloco E — OSD de volume e brilho
