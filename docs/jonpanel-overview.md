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

## Estado atual do branch

- A barra já está com bordas arredondadas, efeito flutuante e clock com interação dupla: clique esquerdo abre o calendário e clique direito abre o Control Center.
- O Control Center foi centralizado, ficou menos transparente e passou a usar uma faixa de status compacta com chips de Wi-Fi, BT, bateria e DND.
- Os quick toggles estão em linha única, sem legenda, e os sliders de volume/brilho estão mais grossos e com maior separação vertical.
- O `MediaCard` foi prototipado e adiado porque ainda estava instável; ele não faz parte do layout ativo agora.

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

### 1. Top Bar (full-width) ✅
- Altura: ~34px, sempre visível
- Fundo: semi-transparente com blur via layerrule Hyprland
- Layout: [workspaces | active window] ←→ [tray | media | bt | net | battery | volume | clock | powermenu]
- Estilo: full-width, sem margin lateral

### 2. Control Center ✅
- Acionado por: clique direito no clock da barra
- Overlay layer-shell centralizado no topo; visibilidade controlada por `services/controlcenter.ts`
- Fecha ao clicar fora (focus lost)
- Seções: faixa de status compacta → QuickToggles em linha única → VolumeSlider → BrightnessSlider → NotificationList
- A faixa de status mostra Wi-Fi, BT, bateria e DND sem relógio grande
- `MediaCard` permanece adiado até a próxima rodada de estabilização
- Swaync completamente removido

### 3. Notificações (daemon nativo AGS) ✅
- Via `astal-notifd` — AGS registra `org.freedesktop.Notifications` no D-Bus
- Popups flutuantes (TOP+RIGHT, máx 3, auto-dismiss 4s) em `widgets/notifications/`
- Histórico dentro do Control Center via `NotificationList` (cresce até 10 cards, scroll após)
- Swaync completamente removido

### 4. OSD ✅
- Window sem anchor = centralizada pelo wlr-layer-shell
- Volume: ícone + levelbar + percentual; acionado via WirePlumber connect
- Brilho: mesmo padrão; acionado via poll + detecção de mudança externa
- Auto-oculta em 2 segundos com debounce

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
$bg:        #1a1b26;
$bg-alt:    #16161e;
$surface:   #1f2335;

// Foreground
$fg:        #c0caf5;
$fg-muted:  #565f89;

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
- ✅ **pnpm** — package manager do projeto (sem dependências npm reais — ags/gnim vêm do AUR)
- ✅ **Blur via layerrule Hyprland** — não CSS blur
- ✅ **Reatividade via `createBinding` e `createComputed`** — API correta do gnim/AGS v3
- ✅ **Listas reativas via `<For>`** — não `.as()` retornando JSX diretamente
- ✅ **SCSS compilado manualmente** com `sass style.scss style.css`
- ✅ **Services como singletons** — `createState` para visibilidade de janelas e estado do OSD
- ✅ **OSD centralizado** — window sem anchor posicionada pelo wlr-layer-shell
- ✅ **OSD via connect imperativo** — `GObject.connect` para volume (síncrono); `createComputed` é lazy e não dispara sem subscriber
- ✅ **install.sh instala em `$HOME/.local/share/jonpanel/`** — path padrão para instalações de usuário; exec-once aponta para esse destino
- ✅ **`ags` e `gnim` removidos do package.json** — são symlinks para `/usr/share/ags/` criados pelo AUR, não pacotes npm reais

### Decisões pendentes

- 🔲 Workspaces: ícones pacman ou ícones por app?
- 🔲 Animação do Control Center: slide down ou fade + scale?
- 🔲 Config file: YAML? JSON? Só SCSS?
- 🔲 Powermenu: diálogo de confirmação antes de executar ações
- 🔲 MediaCard: reintroduzir só depois que a integração MPRIS estiver estável

---

## Lições técnicas importantes (AGS v3 / gnim)

- `createBinding(obj, "prop")` — reatividade em propriedade GObject
- `createComputed(() => { ... })` — computed lazy; só reavalia quando há subscriber consumindo o valor
- `createState(initial)` — `[getter, setter]` para estado local; getter é reativo
- `<For each={accessor}>` — listas reativas (não `.as()` retornando arrays JSX)
- `GLib.timeout_add(priority, ms, () => false)` — timer one-shot; retornar `false` cancela
- `GLib.source_remove(id)` — cancela timeout pelo id; essencial para debounce
- `GObject.connect("notify::prop", handler)` — imperativo e síncrono; garante disparo mesmo sem subscriber JSX
- `notifd.connect("notified", (_, id) => ...)` — sinal para novas notificações
- Window sem anchor = centralizada pelo wlr-layer-shell
- SCSS deve ser compilado para CSS antes — `sass style.scss style.css`
- `ags run arquivo.tsx --gtk 4` — flag com espaço (não `--gtk4`)
- `pkill -9 -f "ags"` — matar instância anterior antes de relancar
- `ags` e `gnim` no package.json com `"*"` causam `ERR_PNPM_MALFORMED_METADATA` — removê-los; os symlinks são criados pelo AUR automaticamente
- `pnpm install` sem dependências npm reais é desnecessário — remover do install.sh

---

## Dependências externas do projeto

### Ferramentas CLI (chamadas diretas no código)
| Ferramenta | Pacote Arch | Usado em | Crítico |
|---|---|---|---|
| `brightnessctl` | `brightnessctl` | BrightnessSlider.tsx, OSD | Sim — slider de brilho quebra sem ele |
| `powerprofilesctl` | `power-profiles-daemon` | QuickToggles.tsx | Sim — toggle de power profile quebra sem ele |

### Daemons obrigatórios (via Astal bindings)
| Daemon | Usado em |
|---|---|
| WirePlumber | Volume.tsx, VolumeSlider.tsx |
| NetworkManager | Network.tsx |
| BlueZ | Bluetooth.tsx |
| UPower | Battery.tsx |

---

## Workflow de desenvolvimento recomendado

Para sessões de desenvolvimento com execução direta de comandos (sem copiar/colar entre janelas):

```bash
cd ~/projects/jonpanel
claude --dangerously-skip-permissions
```

Isso permite que o Claude CLI execute comandos, edite arquivos e rode `sudo` diretamente no terminal com TTY completo. Usar apenas em sessões de desenvolvimento.

---

## Repositório

- **URL:** https://github.com/jonatasbarra/jonpanel
- **Branch principal:** `main`
- **Branch de desenvolvimento:** `feat/initial`
- **Visibilidade:** público

### Tags
| Tag | Marco |
|---|---|
| `v0.1-bar` | Top bar funcional com todos os módulos ✅ |
| `v0.2-control-center` | Control Center + notificações AGS nativas ✅ |
| `v0.3-osd` | OSD de volume e brilho ✅ |
| `v1.0-launch` | MVP completo, README com screenshots |

---

## Estado atual

**Bloco atual:** Bloco G em andamento — refinamento visual da barra e do Control Center
**Última tag:** `v1.0-launch`
**Próxima etapa:** fechar o refinamento visual e preparar a publicação final
