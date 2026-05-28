# AGS Research — Referências e decisões técnicas

## Stack técnica definida

- AGS v3 (aylurs-gtk-shell-git AUR) — CLI tool + framework
- TypeScript + JSX (sintaxe inspirada em React/Solid)
- GTK4 + gtk4-layer-shell
- SCSS com dart-sass
- Astal libraries (Battery, Network, Bluetooth, Mpris, Hyprland, Tray, etc.)
- GJS (GNOME JavaScript) como runtime

## Como AGS funciona

- Entry point: app.start({ main() {} }) em arquivo .tsx
- Widgets são funções TypeScript que retornam GTK widgets via JSX
- Estado reativo: createState, createBinding (GObject), createComputed
- Estilização: CSS/SCSS carregado via app.start({ css }) ou app.apply_css()
- Integração externa: createPoll (polling CLI) ou createSubprocess (stream stdout)
- Componentes dinâmicos: <With> pra nullable, <For> pra listas reativas
- Root de todo componente é sempre uma <window>
- Instalar pro Arch: paru -S aylurs-gtk-shell-git

## Comandos AGS essenciais

- ags run ./arquivo.tsx — roda sem bundlar
- ags init -d /caminho — inicializa projeto com template TypeScript
- ags types -u -d /caminho — gera tipos TS pra autocompletar
- ags inspect — abre GTK inspector (debug de hierarquia/CSS)
- ags bundle — bundla projeto em executável único

## Referências visuais absorvidas

### colorshell (retrozinndev) — PRINCIPAL REFERÊNCIA

- URL: https://github.com/retrozinndev/colorshell
- Stack: GTK4 + AGS v3 + TypeScript + SCSS
- Features: Top bar, Control Center (sliders vol/brilho/BT/wifi), OSD,
  notificações, app runner com plugins, suporte multi-monitor
- Cores dinâmicas via pywal16 (opcional pra nós — vamos usar Tokyo Night fixo)
- Estrutura: src/ com módulos por componente, scripts/, resources/
- Usa pnpm pra gerenciar pacotes
- Ativamente mantido (última release março 2026)

### OkPanel (JohnOberhauser)

- URL: https://github.com/JohnOberhauser/OkPanel
- Stack: AGS + TypeScript + SCSS
- Destaque: configurável via config file, estrutura limpa ags/ + bin/
- Boa referência pra padrões de organização de projeto

### HyprPanel (Jas-SinghFSU) — ARQUIVADO

- URL: https://github.com/Jas-SinghFSU/HyprPanel
- ⚠️ Arquivado em abril 2026 — não instalar
- Autor migrou pro Wayle (Rust)
- Código fonte ainda útil como referência visual de componentes/SCSS
- Usava GTK3 (mais antigo que colorshell/OkPanel)

## Estrutura de projeto AGS recomendada

Baseada no colorshell e OkPanel:

ags/
├── app.ts # entry point, app.start()
├── style.scss # SCSS principal com variáveis Tokyo Night
├── tsconfig.json
├── package.json # pnpm
├── widgets/
│ ├── bar/
│ │ ├── Bar.tsx
│ │ ├── modules/
│ │ │ ├── Workspaces.tsx
│ │ │ ├── Clock.tsx
│ │ │ ├── Battery.tsx
│ │ │ ├── Network.tsx
│ │ │ ├── Volume.tsx
│ │ │ ├── Bluetooth.tsx
│ │ │ └── Media.tsx
│ │ └── bar.scss
│ ├── controlcenter/
│ │ ├── ControlCenter.tsx
│ │ └── controlcenter.scss
│ ├── osd/
│ │ ├── OSD.tsx
│ │ └── osd.scss
│ └── notifications/
│ ├── Notifications.tsx
│ └── notifications.scss
└── services/ # wrappers sobre Astal libraries se necessário

## Astal libraries relevantes pro nosso setup

- astal-hyprland — workspaces, active window, focus
- astal-battery — nível, estado de carga
- astal-network — wifi SSID, força de sinal
- astal-bluetooth — dispositivos, conectado/desconectado
- astal-wireplumber — volume, mute (já temos WirePlumber instalado ✅)
- astal-mpris — media player controls (playerctl)
- astal-tray — system tray

## Decisões de design pra nossa bar AGS Tokyo Night

- Manter vibe pill/floating igual ao Waybar atual (v1.1-visual-polish)
- Workspaces: ícones pacman igual ao Waybar (󰮯 active, 󰊠 default)
- Cores base: bg #1a1b26, border #7aa2f7, accent #bb9af7
- Fonte: JetBrains Mono Nerd Font (já instalada ✅)
- Blur via layerrule do Hyprland (igual ao Waybar)
- Waybar continua rodando até merge ser decidido

## Dependências a instalar na F11

Do pacman/AUR:

- aylurs-gtk-shell-git (AUR) — o AGS em si
- dart-sass (extra) — compilador SCSS
- libgtop (extra) — CPU/RAM metrics
- gtksourceview3 (extra) — syntax highlighting opcional

Do npm (via pnpm dentro do projeto):

- @girs/ags — tipos TypeScript
- (demais via ags init)
