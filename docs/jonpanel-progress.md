# JonPanel — Progresso e Log de Sessões

**Status atual:** Bloco C concluído — barra funcional com 8 módulos
**Última atualização:** 2026-05-27

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
- [x] C9 — Media via `astal-mpris` (reativo com `createComputed`)
- [x] C10 — Powermenu (TODO: diálogo de confirmação)
- [ ] C7 — Volume via `astal-wireplumber` ⚠️ build quebrado
- [ ] C8 — Tray via `astal-tray` ⚠️ build quebrado

### Bloco D — Control Center e notificações

- [ ] D1 — Estrutura do painel (slide down do top bar)
- [ ] D2 — VolumeSlider via `astal-wireplumber`
- [ ] D3 — BrightnessSlider via `brightnessctl`
- [ ] D4 — QuickToggles (WiFi, BT, DND, power profile)
- [ ] D5 — NotificationList via `astal-notifd`
- [ ] D6 — Notification popups flutuantes
- [ ] D7 — Desativar Swaync, AGS como daemon de notificações

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
- **A2:** AGS 3.1.0 + Sass 1.100.0 instalados. Astal libs: battery, network, bluetooth, mpris, notifd, hyprland, gjs instaladas. wireplumber e tray falharam (distutils Python)
- **A3:** Projeto inicializado com `ags init`, pnpm configurado, tipos gerados
- **A4:** Hello World GTK4 + Tokyo Night funcionando. Descoberto: SCSS deve ser compilado manualmente
- **A5:** `launch.sh` criado, integrado ao `exec-once` do Hyprland
- **B1-B4:** Estrutura de diretórios, tema, Bar com três zonas
- **C1:** Workspaces reativos com `<For>` (não `.as()` retornando JSX)
- **C2:** ActiveWindow com `createBinding`
- **C3:** Clock com `createPoll`
- **C4-C6:** Battery, Network, Bluetooth
- **C9:** Media com `createComputed` para reatividade em propriedades do player
- **C10:** Powermenu (systemctl direto — TODO: diálogo de confirmação)
- Commits: feat: initial setup, feat: bar structure, feat: Workspaces/ActiveWindow/Clock, feat: Battery/Network/Bluetooth, feat: Media, feat: Powermenu

---

## Pendências e decisões abertas

| # | Decisão | Status |
|---|---|---|
| 1 | Workspaces: ícones pacman ou ícones por app? | Aberta |
| 2 | Posição do OSD: centro inferior ou centro tela? | Aberta |
| 3 | Animação do Control Center: slide ou fade+scale? | Aberta |
| 4 | Config file para o usuário: YAML, JSON ou só SCSS? | Aberta |
| 5 | Powermenu: diálogo de confirmação | Pendente |
| 6 | libastal-wireplumber-git: build quebrado (distutils) | Bloqueante para Volume |
| 7 | libastal-tray-git: build quebrado (distutils) | Bloqueante para Tray |