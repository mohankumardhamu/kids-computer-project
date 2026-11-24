// All quiz content lives here. To add a new part, add an item to a level.
// Photos are loaded from /public/photos/<id>.jpg (or .png / .webp).
// If no photo exists yet, the emoji is shown instead.

export interface Item {
  id: string;
  name: string; // the "correct" answer shown to the child
  accept?: string[]; // other answers that also count as correct
  fact: string; // one kid-friendly sentence, read aloud in Learn mode
  emoji: string; // fallback picture when there is no photo
  prompt?: string; // custom question (default: "What is this called?")
}

export interface Level {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  items: Item[];
}

export const UNLOCK_ACCURACY = 80; // % needed on a level to unlock the next one

export const LEVELS: Level[] = [
  {
    id: 'very-basic',
    title: 'Very Basic',
    subtitle: 'Things you can see on a computer desk',
    color: '#4caf50',
    items: [
      { id: 'monitor', name: 'Monitor', accept: ['screen', 'display', 'computer screen'], emoji: '🖥️',
        fact: 'The monitor is the screen that shows you pictures, words and videos.' },
      { id: 'keyboard', name: 'Keyboard', accept: ['key board'], emoji: '⌨️',
        fact: 'The keyboard has lots of buttons called keys. You press them to type letters and numbers.' },
      { id: 'mouse', name: 'Mouse', accept: ['computer mouse'], emoji: '🖱️',
        fact: 'You move the mouse to move the arrow on the screen, and click it to choose things.' },
      { id: 'speakers', name: 'Speakers', accept: ['speaker'], emoji: '🔊',
        fact: 'Speakers let the computer play music and sounds out loud.' },
      { id: 'headphones', name: 'Headphones', accept: ['headphone', 'headset', 'earphones', 'head phones'], emoji: '🎧',
        fact: 'Headphones let you listen to the computer without disturbing anyone else.' },
      { id: 'printer', name: 'Printer', emoji: '🖨️',
        fact: 'A printer puts words and pictures from the computer onto paper.' },
      { id: 'laptop', name: 'Laptop', accept: ['laptop computer', 'notebook'], emoji: '💻',
        fact: 'A laptop is a computer you can fold up and carry anywhere.' },
      { id: 'tower', name: 'CPU Cabinet', accept: ['cabinet', 'tower', 'computer tower', 'computer case', 'case', 'cpu', 'cpu box', 'desktop'], emoji: '🗄️',
        fact: 'The cabinet is the big box that holds all the important parts that make the computer work.' },
    ],
  },
  {
    id: 'basic',
    title: 'Basic',
    subtitle: 'More gadgets that connect to computers',
    color: '#2196f3',
    items: [
      { id: 'webcam', name: 'Webcam', accept: ['web cam', 'camera', 'web camera'], emoji: '📷',
        fact: 'A webcam is a small camera that lets people see you on video calls.' },
      { id: 'microphone', name: 'Microphone', accept: ['mic', 'mike'], emoji: '🎤',
        fact: 'A microphone listens to your voice so the computer can hear you.' },
      { id: 'usb-drive', name: 'Pen Drive', accept: ['pendrive', 'usb drive', 'flash drive', 'usb stick', 'thumb drive', 'usb'], emoji: '💾',
        fact: 'A pen drive is a tiny stick that carries your files from one computer to another.' },
      { id: 'charger', name: 'Charger', accept: ['adapter', 'power adapter', 'laptop charger'], emoji: '🔌',
        fact: 'The charger fills up the laptop battery with electricity.' },
      { id: 'power-button', name: 'Power Button', accept: ['power', 'on off button', 'power switch', 'on button'], emoji: '⏻',
        fact: 'You press the power button to switch the computer on.' },
      { id: 'tablet', name: 'Tablet', accept: ['ipad', 'tab'], emoji: '📱',
        fact: 'A tablet is a flat computer that you control by touching the screen.' },
      { id: 'router', name: 'Router', accept: ['wifi router', 'wi-fi router', 'modem', 'wifi'], emoji: '📡',
        fact: 'The router sends the internet to all the computers and phones in your home using Wi-Fi.' },
      { id: 'touchpad', name: 'Touchpad', accept: ['trackpad', 'touch pad', 'track pad'], emoji: '👆',
        fact: 'The touchpad on a laptop works like a mouse. You slide your finger on it.' },
      { id: 'scanner', name: 'Scanner', emoji: '📠',
        fact: 'A scanner takes a picture of a paper page and puts it inside the computer.' },
    ],
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    subtitle: 'Parts that live inside the computer',
    color: '#ff9800',
    items: [
      { id: 'cpu', name: 'CPU', accept: ['processor', 'central processing unit', 'cpu chip', 'microprocessor'], emoji: '🧠',
        fact: 'The CPU is the brain of the computer. It does all the thinking and calculating.' },
      { id: 'ram', name: 'RAM', accept: ['memory', 'random access memory', 'ram stick', 'ram card'], emoji: '🧩',
        fact: 'RAM is the computer\'s short-term memory, like your brain while you do homework.' },
      { id: 'hard-disk', name: 'Hard Disk', accept: ['hard drive', 'hdd', 'harddisk', 'hard disc'], emoji: '💿',
        fact: 'The hard disk stores all your files, games and photos, even when the computer is off.' },
      { id: 'ssd', name: 'SSD', accept: ['solid state drive', 'solid state disk'], emoji: '💽',
        fact: 'An SSD stores files like a hard disk but is much faster because it has no moving parts.' },
      { id: 'motherboard', name: 'Motherboard', accept: ['mother board', 'mainboard', 'main board'], emoji: '🟩',
        fact: 'The motherboard is the big board that connects all the parts together, like a city\'s roads.' },
      { id: 'fan', name: 'Cooling Fan', accept: ['fan', 'cpu fan', 'cooler'], emoji: '🌀',
        fact: 'The fan blows air to keep the computer cool so it does not overheat.' },
      { id: 'graphics-card', name: 'Graphics Card', accept: ['gpu', 'video card', 'graphic card', 'graphics'], emoji: '🎮',
        fact: 'The graphics card draws all the pictures and games you see on the screen.' },
      { id: 'usb-port', name: 'USB Port', accept: ['usb', 'usb slot', 'usb socket'], emoji: '🔌',
        fact: 'A USB port is a hole where you plug in a mouse, keyboard or pen drive.' },
      { id: 'hdmi-cable', name: 'HDMI Cable', accept: ['hdmi'], emoji: '📺',
        fact: 'An HDMI cable carries pictures and sound from the computer to a TV or monitor.' },
      { id: 'ethernet-cable', name: 'Ethernet Cable', accept: ['ethernet', 'lan cable', 'network cable', 'internet cable', 'lan'], emoji: '🔗',
        fact: 'An ethernet cable connects a computer to the internet with a wire.' },
    ],
  },
  {
    id: 'professional',
    title: 'Professional',
    subtitle: 'Parts that computer technicians know',
    color: '#9c27b0',
    items: [
      { id: 'psu', name: 'Power Supply', accept: ['psu', 'smps', 'power supply unit'], emoji: '⚡',
        fact: 'The power supply takes electricity from the wall and gives the right amount to every part.' },
      { id: 'heat-sink', name: 'Heat Sink', accept: ['heatsink'], emoji: '❄️',
        fact: 'A heat sink is a block of metal fins that pulls heat away from the CPU.' },
      { id: 'network-card', name: 'Network Card', accept: ['nic', 'lan card', 'network interface card', 'ethernet card'], emoji: '🌐',
        fact: 'A network card lets the computer talk to other computers and the internet.' },
      { id: 'wifi-card', name: 'Wi-Fi Card', accept: ['wifi card', 'wireless card', 'wifi adapter', 'wireless adapter'], emoji: '📶',
        fact: 'A Wi-Fi card lets the computer connect to the internet without any wires.' },
      { id: 'cmos-battery', name: 'CMOS Battery', accept: ['cmos', 'bios battery', 'coin battery', 'battery'], emoji: '🔋',
        fact: 'The CMOS battery is a tiny coin battery that helps the computer remember the date and time.' },
      { id: 'optical-drive', name: 'DVD Drive', accept: ['cd drive', 'optical drive', 'dvd', 'cd rom', 'cd-rom', 'dvd writer', 'disc drive'], emoji: '📀',
        fact: 'A DVD drive reads and writes shiny round discs.' },
      { id: 'usb-c', name: 'USB-C Port', accept: ['usb c', 'usbc', 'type c', 'usb type c', 'type c port'], emoji: '🔋',
        fact: 'USB-C is a small oval port that can charge, send files and connect screens, all in one.' },
      { id: 'server', name: 'Server', accept: ['server rack', 'servers', 'data center'], emoji: '🏢',
        fact: 'Servers are powerful computers that run websites, games and apps for millions of people.' },
      { id: 'thermal-paste', name: 'Thermal Paste', accept: ['thermal compound', 'heat paste'], emoji: '🧴',
        fact: 'Thermal paste is a grey goo put between the CPU and the heat sink to move heat away faster.' },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced',
    subtitle: 'How computers really work',
    color: '#e91e63',
    items: [
      { id: 'binary', name: 'Binary', accept: ['binary code', 'binary numbers', 'binary number system'], emoji: '0️⃣',
        prompt: 'Computers count using only 0 and 1. What is this called?',
        fact: 'Binary is the language of computers. Everything is made of just 0s and 1s.' },
      { id: 'bit', name: 'Bit', accept: ['a bit', 'one bit'], emoji: '🔢',
        prompt: 'A single 0 or a single 1 is called a…',
        fact: 'A bit is the smallest piece of information, just one 0 or one 1.' },
      { id: 'byte', name: 'Byte', accept: ['bite', 'a byte', 'one byte'], emoji: '🧮',
        prompt: '8 bits joined together make one…',
        fact: 'A byte is 8 bits together. One letter you type takes about one byte.' },
      { id: 'operating-system', name: 'Operating System', accept: ['os', 'windows', 'linux', 'macos'], emoji: '🪟',
        prompt: 'The main software that runs the whole computer, like Windows or Linux, is called the…',
        fact: 'The operating system is the boss software that controls the computer and runs all the apps.' },
      { id: 'bios', name: 'BIOS', accept: ['uefi', 'bios chip', 'by os', 'bye os'], emoji: '🌅',
        prompt: 'The first program that wakes up when you switch the computer on is called the…',
        fact: 'The BIOS wakes up first, checks all the parts, and then starts the operating system.' },
      { id: 'transistor', name: 'Transistor', accept: ['transistors'], emoji: '🔬',
        prompt: 'A CPU has billions of tiny on/off switches inside it. What are they called?',
        fact: 'Transistors are tiny switches. A CPU has billions of them, turning on and off super fast.' },
      { id: 'ram-volatile', name: 'RAM', accept: ['memory', 'random access memory'], emoji: '💭',
        prompt: 'Which memory forgets everything when the power goes off?',
        fact: 'RAM is fast but forgetful. When you switch off, everything in RAM disappears.' },
      { id: 'gigabyte', name: 'Gigabyte', accept: ['gb', 'giga byte', 'gigabytes'], emoji: '📦',
        prompt: '1024 megabytes make one…',
        fact: 'A gigabyte is a big amount of storage, enough for about 250 songs.' },
      { id: 'cloud', name: 'Cloud', accept: ['the cloud', 'cloud storage', 'cloud computing'], emoji: '☁️',
        prompt: 'Saving your files on a computer far away using the internet is called saving to the…',
        fact: 'The cloud is really just other people\'s computers that keep your files safe over the internet.' },
      { id: 'antivirus', name: 'Antivirus', accept: ['anti virus', 'anti-virus', 'antivirus software'], emoji: '🛡️',
        prompt: 'Software that protects the computer from viruses is called…',
        fact: 'Antivirus software is like a security guard that catches bad programs.' },
    ],
  },
];

export function getLevel(id: string): Level {
  const level = LEVELS.find((l) => l.id === id);
  if (!level) throw new Error(`Unknown level ${id}`);
  return level;
}
