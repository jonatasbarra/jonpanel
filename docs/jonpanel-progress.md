# JonPanel — Progresso e Log de Sessões

**Status atual:** Bloco F em andamento — F1 e F2 concluídas; próxima: F3 (README)
**Última atualização:** 2026-05-29

---

## Checklist de desenvolvimento

### Bloco A — Fundação e ambiente

- [x] A1 — Criar repo `jonatasbarra/jonpanel` no GitHub
- [x] A1 — Instalar `aylurs-gtk-shell-git` e `dart-sass`
- [x] A1 — Verificar `ags --version` (3.1.0) e `sass --version` (1.100.0)
- [x] A2 — Instalar Astal libraries (battery, network, bluetooth, mpris, notifd, hyprland, gjs)
- [x] A3 — `ags init` + estrutura do projeto com pnpm
- [x] A4 — Hello World GTK4 + Tokyo Night funcionando
- [x] A5 — Integração com Hyprland via `launch.sh`

### Bloco B — Estrutura e estilo base

- [x] B1 — Estrutura de diretórios completa (`widgets/`, `themes/`, `services/`)
- [x] B2 — `themes/tokyo-night.scss` com todas as variáveis
- [x] B3 — `Bar.tsx` com blur e background semi-transparente
- [x] B4 — Layout full-width com três zonas (left/center/right)

### Bloco C — Módulos da barra

- [x] C1 — Workspaces via `astal-hyprland` (reativo com `<For>`)
- [x] C2 — Active window (reativo com `createBinding`)
- [x] C3 — Clock (polling com `createPoll`)
- [x] C4 — Battery via `astal-battery`
- [x] C5 — Network via `astal-network`
- [x] C6 — Bluetooth via `astal-bluetooth`
- [x] C7 — Volume via `astal-wireplumber`
- [x] C8 — Tray via `astal-tray`
- [x] C9 — Media via `astal-mpris` (reativo com `createComputed`)
- [x] C10 — Powermenu (TODO: diálogo de confirmação)

### Bloco D — Control Center e notificações

- [x] D1 — Estrutura do painel (layer-shell overlay, TOP + RIGHT, service de visibilidade)
- [x] D2 — VolumeSlider via `astal-wireplumber`
- [x] D3 — BrightnessSlider via `brightnessctl`
- [x] D4 — QuickToggles (WiFi, BT, DND, power profile)
- [x] D5 — NotificationList via `astal-notifd` (histórico + estado vazio + DND banner)
- [x] D6 — Notification popups flutuantes (auto-dismiss 4s, máx 3, dismiss manual)
- [x] D7 — Swaync removido; AGS/AstalNotifd como daemon `org.freedesktop.Notifications`

### Bloco E — OSD

- [x] E1 — `services/osd.ts` com debounce via `GLib.source_remove`
- [x] E2 — `OSD.tsx` centralizado na tela via layer shell sem anchor
- [x] E3 — Volume conectado via `GObject.connect("notify::volume")` — síncrono
- [x] E4 — Brightness via `createPoll` com detecção de mudança externa (keybinds)

### Bloco F — Portabilidade e publicação

- [x] F1a — Auditoria de cores hardcoded — zero violações
- [x] F1b — Auditoria de paths absolutos — 2 fixes em launch.sh (path + UID hardcoded)
- [x] F1c — Auditoria de dependências implícitas — mapeadas: brightnessctl, power-profiles-daemon + daemons Astal
- [x] F1d — Auditoria do fluxo de boot — exec-once corrigido nos dotfiles; decisão de path padrão tomada ($HOME/.local/share/jonpanel/)
- [x] F2 — `install.sh` criado (Arch only, AUR helper detection, todas as deps, SCSS compile, rsync para destino)
- [x] F2 — Validar install.sh: passos não-sudo validados diretamente (SCSS, rsync/cp, chmod); sudo steps (pacman/AUR/systemctl) são no-ops pois tudo já instalado/ativo
- [ ] F3 — README profissional com screenshots
- [ ] F4 — CHANGELOG desde v0.1
- [ ] F5 — `CONTRIBUTING.md` básico
- [ ] F6 — Tag `v1.0-launch` e publicação

### Bloco G — Refinamento visual da barra (planejado)

- [ ] G1 — Relógio: ajustar proporção hora vs data (hora dominando demais)
- [ ] G2 — Status icons: aumentar tamanho e peso visual (battery, wifi, bt, volume)
- [ ] G3 — Harmonia geral: revisar font-size e espaçamento entre módulos do lado direito

---

## Log de sessões

### Sessão 0 — 2026-05-27 — Planejamento inicial
- Decisão de criar JonPanel como projeto open-source independente
- Definido: top bar full-width, AGS Notifications nativas, Control Center completo
- Definido: múltiplos temas com Tokyo Night como default

### Sessão 1 — 2026-05-27 — Blocos A, B e C
- **Contexto absorvido:** rice `my-hyprland-rice` na tag `v1.1-visual-polish`
  - Waybar + Swaync rodando atualmente
  - paru, mise (Node 24.16.0), JetBrains Mono Nerd Font, WirePlumber instalados
  - GNU Stow + dotfiles versionados
- **A1:** Repo criado em `github.com/jonatasbarra/jonpanel`, branch `feat/initial`
- **A2:** AGS 3.1.0 + Sass 1.100.0 instalados. Astal libs instaladas. wireplumber e tray falharam inicialmente (distutils Python)
- **A3:** Projeto inicializado com `ags init`, pnpm configurado, tipos gerados
- **A4:** Hello World GTK4 + Tokyo Night funcionando. Descoberto: SCSS deve ser compilado manualmente
- **A5:** `launch.sh` criado, integrado ao `exec-once` do Hyprland
- **B1-B4:** Estrutura de diretórios, tema, Bar com três zonas
- **C1-C10:** Todos os módulos da barra implementados
- Commits: feat: initial setup → feat: complete bar with all 10 modules

### Sessão 2 — 2026-05-28 — Bloco D (Control Center e notificações)
- **D0:** Build do `libastal-wireplumber-git` e `libastal-tray-git` resolvido — mise Python 3.14.5 não tinha setuptools
- **D1:** `ControlCenter.tsx` — window layer-shell TOP+RIGHT, OVERLAY; `services/controlcenter.ts`
- **D2:** `VolumeSlider.tsx` — slider reativo via `AstalWp`, ícone por faixa
- **D3:** `BrightnessSlider.tsx` — lê/escreve via `brightnessctl`, guard `lastWritten` evita loop poll→write→poll
- **D4:** `QuickToggles.tsx` — WiFi, Bluetooth, DND, Power Profile
- **D5:** `NotificationList.tsx` — lista reativa com `<For>`, banner DND
- **D6:** Notification popups flutuantes — auto-dismiss 4s, máx 3, dismiss manual
- **D7:** Swaync completamente removido; AGS é o daemon D-Bus
- Tag: `v0.2-control-center`

### Sessão 3 — 2026-05-29 — Bloco E (OSD) + Bloco F início (auditoria + install.sh)

#### Bloco E
- **E1-E4:** OSD de volume e brilho implementado e funcional
- Tag: `v0.3-osd`

#### Bloco F — Auditoria (F1)
- **F1a:** Zero cores hardcoded fora de `themes/` — todos os `rgba()` usam variáveis de tema como base ✅
- **F1b:** 2 fixes em `launch.sh`:
  - Path absoluto `/home/jon/projects/jonpanel/app.tsx` → `$SCRIPT_DIR/app.tsx`
  - UID hardcoded `/run/user/1000` → `/run/user/$(id -u)`
  - `pkill -f swaync` (resíduo do Bloco D) removido
  - Commits: `fix: replace hardcoded absolute path`, `fix: remove swaync remnant and fix hardcoded UID`
- **F1c:** Dependências implícitas mapeadas:
  - `brightnessctl` — BrightnessSlider.tsx + OSD
  - `power-profiles-daemon` (powerprofilesctl) — QuickToggles.tsx
  - Daemons via Astal: WirePlumber, NetworkManager, BlueZ, UPower
- **F1d:** `exec-once` no `hyprland.conf` dos dotfiles corrigido:
  - `/home/jon/projects/jonpanel/launch.sh` → `$HOME/.local/share/jonpanel/launch.sh`
  - Decisão: install.sh instala em `$HOME/.local/share/jonpanel/` (path padrão, previsível)
  - Commit no repo `my-hyprland-rice`: `fix: use $HOME-relative path for jonpanel exec-once`

#### Bloco F — install.sh (F2)
- `install.sh` criado com 129 linhas:
  - Detecção de distro (Arch only)
  - Detecção de AUR helper (paru → yay → abort)
  - Instalação de deps pacman + AUR
  - Compilação SCSS
  - rsync para `$HOME/.local/share/jonpanel/` com `--delete`
  - `systemctl enable --now power-profiles-daemon`
  - Mensagem final com instrução do `exec-once`
- Fixes aplicados durante criação:
  - `pnpm install` removido — `ags` e `gnim` não são pacotes npm reais
  - `ags`/`gnim` removidos do `package.json` — são symlinks para `/usr/share/ags/` criados pelo AUR
  - `pnpm install --prefer-offline` não resolveu o problema — solução foi remover as deps
- Commits: `chore: add install.sh`, `fix: use --prefer-offline`, `fix: remove pnpm install step`, `chore: remove ags and gnim from package.json`
- **Pendente:** executar `bash install.sh` com TTY real para validar funcionamento completo

#### Bloco F — Validação do install.sh (F2 concluída)
- Todos os passos não-sudo validados em execução direta:
  - SCSS: `sass style.scss style.css` — OK
  - rsync fallback fix: `cp -r` substituído por `find ... -exec cp -r` com exclusões corretas
  - `rsync` adicionado ao PACMAN_DEPS (instalado pelo próprio script em sistemas frescos)
  - Destino `~/.local/share/jonpanel/` limpo e correto: `.git`, `node_modules`, `@girs` excluídos
  - `launch.sh` com permissão de execução e paths relativos corretos
- Passos sudo (pacman, AUR, systemctl) validados indiretamente: todos pacotes já instalados, power-profiles-daemon já enabled/active
- Commit: `fix: add rsync to pacman deps and fix cp fallback exclusions`
- F2 marcada como concluída ✅

#### Descoberta de workflow
- Claude CLI com `--dangerously-skip-permissions` é o workflow ideal para desenvolvimento
- Elimina o ciclo copiar/colar entre claude.ai e terminal
- Usar: `cd ~/projects/jonpanel && claude --dangerously-skip-permissions`
- Lembrar: ao fim de cada sessão CLI, pedir atualização de `jonpanel-overview.md` e `jonpanel-progress.md`

#### Observação visual registrada (Bloco G)
- Barra com problemas de harmonia visual identificados via screenshot:
  - Hora (`17:15`) muito grande em relação à data (`Fri 29 May`)
  - Status icons (battery, wifi, bt, volume) pequenos demais
  - Densidade visual irregular entre lado esquerdo e direito
- Bloco G planejado para refinamento visual após publicação do MVP