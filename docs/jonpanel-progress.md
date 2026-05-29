# JonPanel — Progresso e Log de Sessões

**Status atual:** Bloco D concluído — Control Center e notificações funcionais
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

- [ ] E1 — OSD de volume (popup flutuante, auto-oculta 2s)
- [ ] E2 — OSD de brilho
- [ ] E3 — Desativar scripts `osd-volume` e `osd-brightness` do rice

### Bloco F — Portabilidade e publicação

- [ ] F1 — Revisar: nenhuma cor hardcoded, nenhum path absoluto
- [ ] F2 — `install.sh` pensado para outros usuários
- [ ] F3 — README profissional com screenshots
- [ ] F4 — CHANGELOG desde v0.1
- [ ] F5 — `CONTRIBUTING.md` básico
- [ ] F6 — Tag `v1.0-launch` e publicação

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
- **A2:** AGS 3.1.0 + Sass 1.100.0 instalados. Astal libs: battery, network, bluetooth, mpris, notifd, hyprland, gjs instaladas. wireplumber e tray falharam inicialmente (distutils Python)
- **A3:** Projeto inicializado com `ags init`, pnpm configurado, tipos gerados
- **A4:** Hello World GTK4 + Tokyo Night funcionando. Descoberto: SCSS deve ser compilado manualmente
- **A5:** `launch.sh` criado, integrado ao `exec-once` do Hyprland
- **B1-B4:** Estrutura de diretórios, tema, Bar com três zonas
- **C1:** Workspaces reativos com `<For>` (não `.as()` retornando JSX)
- **C2:** ActiveWindow com `createBinding`
- **C3:** Clock com `createPoll`
- **C4-C6:** Battery, Network, Bluetooth
- **C7-C8:** Volume (WirePlumber) e Tray — implementados após resolução de build
- **C9:** Media com `createComputed` para reatividade em propriedades do player
- **C10:** Powermenu (systemctl direto — TODO: diálogo de confirmação)
- Commits: feat: initial setup, feat: bar structure, feat: Workspaces/ActiveWindow/Clock, feat: Battery/Network/Bluetooth, feat: Media, feat: Powermenu, feat: complete bar with all 10 modules

### Sessão 2 — 2026-05-28 — Bloco D (Control Center e notificações)
- **D1:** `widgets/controlcenter/ControlCenter.tsx` — window layer-shell TOP+RIGHT, OVERLAY; `services/controlcenter.ts` com `createState` para visibilidade; `toggleCC()`/`closeCC()` exportados
- **D2:** `VolumeSlider.tsx` — slider reativo via `AstalWp`, ícone muda por faixa (mudo/baixo/médio/alto)
- **D3:** `BrightnessSlider.tsx` — lê e escreve brilho via `brightnessctl`, polling com `createPoll`
- **D4:** `QuickToggles.tsx` — WiFi, Bluetooth, DND, Power Profile; estado ativo via `createBinding`; `getDND()` exportado para consumo pelo NotificationList
- **D5:** `NotificationList.tsx` — lista reativa com `<For>`, banner DND, estado vazio, dismiss por card; `.notif-card` com `hexpand`, body com wrap sem truncamento
- **D6:** `widgets/notifications/Notifications.tsx` — terceira window, TOP+RIGHT, máx 3 popups, `GLib.timeout_add` (4000ms) para auto-dismiss, `notifd.connect("notified")` para captura em tempo real; reutiliza classes `.notif-card` do controlcenter.scss
- **D7:** `pkill -f swaync` já presente no `launch.sh`; `exec-once = swaync` estava comentado no hyprland.conf; `layerrules` e `bind` de swaync-client comentados em `dotfiles/hypr`; após matar swaync em sessão ativa, `gjs` (AGS) assumiu `org.freedesktop.Notifications` no D-Bus imediatamente
- **Fix:** card de notificação corrigido — `widthRequest` 360→380px, `hexpand` no scrolledwindow e no card box, `min-width: 0` no CSS
- Commits: feat: QuickToggles, feat: Control Center complete, feat: notification popups (D6), chore: remove swaync (D7)

---

## Pendências e decisões abertas

| # | Decisão | Status |
|---|---|---|
| 1 | Workspaces: ícones pacman ou ícones por app? | Aberta |
| 2 | Posição do OSD: centro inferior ou centro tela? | Aberta |
| 3 | Animação do Control Center: slide ou fade+scale? | Aberta |
| 4 | Config file para o usuário: YAML, JSON ou só SCSS? | Aberta |
| 5 | Powermenu: diálogo de confirmação | Pendente |
