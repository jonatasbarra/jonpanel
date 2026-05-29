# Hardware do notebook

## Modelo
**ASUS Zenbook 14 UX3405CA** (Intel Lunar Lake, 2025)
- Fabricante: ASUSTeK COMPUTER INC.
- BIOS: AMI UX3405CA.314 (20/11/2025)
- Tipo: ultrabook x64, UEFI

## Especificações

### CPU
- **Intel Core Ultra Series 2 — Lunar Lake**
- Family 6, Model 197, Stepping 2
- Clock base: ~2.9 GHz
- Requer kernel Linux **6.10+** (essencial)

### GPU
- **Intel Arc 140T integrada (Xe2 / Battlemage)**
- 16GB compartilhados com a RAM
- Driver Linux: `mesa` (open-source, excelente no Wayland)

### Memória
- **32 GB LPDDR5X** (soldada)

### Armazenamento
- **SSD NVMe Micron 1 TB** (MTFDKBA1T0QGN-1BN1AABGA)
- Status: saudável

### Tela
- **14" FHD+ 1920x1200 @ 60Hz**
- **Touch screen** (capacitiva)
- Aspect ratio 16:10
- Sem HiDPI (escala 1x — simplifica ricing)

### Rede
- **Wi-Fi 7 Intel BE201 (320 MHz)** — suporte kernel 6.7+
- Bluetooth Intel (mesmo módulo)

### Periféricos integrados
- Touchpad de precisão
- Teclado retroiluminado (típico Zenbook)
- Bateria de notebook (Lunar Lake = excelente eficiência)

## Estado atual
- Windows 11 Home instalado — **será apagado completamente**
- Secure Boot: ativo (desativar antes de instalar)
- Sem necessidade de lidar com BitLocker (wipe total)
- Sem dual boot inicial

## Pontos de atenção pra instalação

### Antes
- [ ] Backup de arquivos pessoais do Windows
- [ ] Backup de chaves SSH/GPG (se houver)
- [ ] Desativar Secure Boot na BIOS (F2 ou Esc no boot ASUS)
- [ ] Baixar ISO Arch mais recente
- [ ] Criar USB bootável (Ventoy ou Rufus em modo DD)

### Durante
- Kernel: `linux` ou `linux-zen` (**NÃO** `linux-lts` — Lunar Lake ainda não tem suporte ideal)
- Firmware: `linux-firmware` (Wi-Fi BE201 depende)
- Microcode: `intel-ucode`
- GPU stack: `mesa`, `vulkan-intel`, `intel-media-driver`, `libva-utils`
- Bootloader: `systemd-boot` (UEFI puro, simples)
- Filesystem: `btrfs` com subvolumes

### Pós-instalação específicos do Lunar Lake
- `power-profiles-daemon` (melhor que TLP para Intel modernos)
- `thermald` (gerenciamento térmico Intel)
- Configurar touch screen via libinput
- Configurar gestures de touchpad (libinput-gestures ou via Hyprland direto)