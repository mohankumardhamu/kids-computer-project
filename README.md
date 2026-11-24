# 💻 Computer Explorers

A quiz game that teaches kids the parts of a computer. Kids see a photo, then **type** the name or **say it** into the microphone.

## Run it

```bash
npm install
npm run dev
```

Open the link it prints (http://localhost:5173) in **Chrome or Edge**. Voice input only works in those browsers, and the first time you use it Chrome will ask for microphone permission.

## How it works

- **Players:** each child has their own profile and avatar.
- **5 levels:** Very Basic → Basic → Intermediate → Professional → Advanced. The next level unlocks at **80%** first-try accuracy.
- **Learn mode:** flashcards that read each part's name and a fun fact out loud.
- **Quiz mode:** 2 tries per question. Wrong answers come back once at the end of the round. Small spelling mistakes are accepted.
- **Points:** 10 for first try, 5 for second try or with a hint, +5 bonus for every 3 in a row.
- **Parent dashboard:** behind a 4-digit PIN. Shows points, accuracy per level, the parts each child misses most, and recent quizzes.

Scores are saved in the browser (localStorage) on this laptop. Clearing browser data erases them.

## Adding photos

Put photos in `public/photos/`, named after the part's id. `.jpg`, `.png` and `.webp` all work. Until a photo is added, an emoji is shown instead. Square-ish photos with a plain background work best.

To add or change questions, edit `src/data/levels.ts`.

## Photo filenames

**Very Basic**

- `monitor.jpg`: Monitor
- `keyboard.jpg`: Keyboard
- `mouse.jpg`: Mouse
- `speakers.jpg`: Speakers
- `headphones.jpg`: Headphones
- `printer.jpg`: Printer
- `laptop.jpg`: Laptop
- `tower.jpg`: CPU Cabinet

**Basic**

- `webcam.jpg`: Webcam
- `microphone.jpg`: Microphone
- `usb-drive.jpg`: Pen Drive
- `charger.jpg`: Charger
- `power-button.jpg`: Power Button
- `tablet.jpg`: Tablet
- `router.jpg`: Router
- `touchpad.jpg`: Touchpad
- `scanner.jpg`: Scanner

**Intermediate**

- `cpu.jpg`: CPU
- `ram.jpg`: RAM
- `hard-disk.jpg`: Hard Disk
- `ssd.jpg`: SSD
- `motherboard.jpg`: Motherboard
- `fan.jpg`: Cooling Fan
- `graphics-card.jpg`: Graphics Card
- `usb-port.jpg`: USB Port
- `hdmi-cable.jpg`: HDMI Cable
- `ethernet-cable.jpg`: Ethernet Cable

**Professional**

- `psu.jpg`: Power Supply
- `heat-sink.jpg`: Heat Sink
- `network-card.jpg`: Network Card
- `wifi-card.jpg`: Wi-Fi Card
- `cmos-battery.jpg`: CMOS Battery
- `optical-drive.jpg`: DVD Drive
- `usb-c.jpg`: USB-C Port
- `server.jpg`: Server
- `thermal-paste.jpg`: Thermal Paste

**Advanced**

- `binary.jpg`: Binary
- `bit.jpg`: Bit
- `byte.jpg`: Byte
- `operating-system.jpg`: Operating System
- `bios.jpg`: BIOS
- `transistor.jpg`: Transistor
- `ram-volatile.jpg`: RAM
- `gigabyte.jpg`: Gigabyte
- `cloud.jpg`: Cloud
- `antivirus.jpg`: Antivirus
