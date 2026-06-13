/* === MOTION PREFERENCE (WCAG 2.3.3) === */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* === MATRIX RAIN (hero-scoped) === */
(function () {
  const canvas  = document.getElementById('matrix-canvas');
  const wrapper = document.getElementById('hero-wrapper');
  if (!canvas || !wrapper) return;
  /* Skip the rain for reduced-motion users and on small/low-power screens
     (saves battery + CPU on phones — a real mobile-first concern). */
  if (prefersReducedMotion || window.innerWidth < 640) { canvas.style.display = 'none'; return; }
  const ctx     = canvas.getContext('2d');
  const chars   = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*<>{}[]|/\\+=~アイウエオカキクケコサシスセソ'.split('');
  const fontSize = 14;
  const trailLen = 18;
  let cols, drops, trails, lastRow;

  function init() {
    canvas.width  = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
    cols    = Math.floor(canvas.width / (fontSize + 2));
    drops   = Array.from({ length: cols }, () => Math.random() * -(canvas.height / fontSize));
    trails  = Array.from({ length: cols }, () => []);
    lastRow = Array.from({ length: cols }, () => -999);
  }

  function draw() {
    ctx.fillStyle = 'rgba(17,24,39,0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;

    for (let i = 0; i < cols; i++) {
      const row = Math.floor(drops[i]);

      if (row !== lastRow[i]) {
        trails[i].unshift(chars[Math.floor(Math.random() * chars.length)]);
        if (trails[i].length > trailLen) trails[i].pop();
        lastRow[i] = row;
      }

      for (let j = 0; j < trails[i].length; j++) {
        const x = i * (fontSize + 2);
        const y = (drops[i] - j) * fontSize;
        if (y < -fontSize || y > canvas.height) continue;

        if (j === 0) {
          ctx.fillStyle = '#ffffff';
        } else if (j < 3) {
          ctx.fillStyle = '#80ffe8';
        } else {
          const alpha = (1 - j / trailLen) * 0.9;
          ctx.fillStyle = `rgba(0,255,204,${alpha.toFixed(2)})`;
        }
        ctx.fillText(trails[i][j], x, y);
      }

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
        trails[i] = [];
        lastRow[i] = -999;
      }
      drops[i] += 0.1;
    }
  }

  init();
  window.addEventListener('resize', init);
  setInterval(draw, 80);
})();

/* === NAVBAR SCROLL === */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* === HAMBURGER === */
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* === TYPEWRITER === */
const phrases = [
  'Cybersecurity Student',
  'CTF Player',
  'Aspiring Pentester',
  'Bug Bounty Learner',
  'SOC & Blue Team Enthusiast',
];
let phraseIndex = 0, charIndex = 0, deleting = false;
const tw = document.getElementById('typewriter');
function type() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    tw.textContent = '> ' + current.slice(0, ++charIndex) + '_';
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1600);
      return;
    }
  } else {
    tw.textContent = '> ' + current.slice(0, --charIndex) + '_';
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 55 : 90);
}
if (tw) {
  if (prefersReducedMotion) {
    tw.textContent = '> ' + phrases.join(' · ');   /* static, no animation */
  } else {
    type();
  }
}

/* === TERMINAL ANIMATION === */
const termLines = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: 'kabinkhadka' },
  { type: 'cmd', text: 'cat focus_areas.txt' },
  { type: 'hi',  text: '[+] SIEM & Log Analysis (Splunk/ELK fundamentals)' },
  { type: 'hi',  text: '[+] Network Traffic Analysis (Wireshark & Nmap)' },
  { type: 'hi',  text: '[+] Web Application Defense (OWASP Top 10 mitigation)' },
  { type: 'hi',  text: '[+] Incident Response & Digital Forensics Triage' },
  { type: 'cmd', text: 'cat education.txt' },
  { type: 'hi',  text: '[+] BCS Cybersecurity & Networking (Ongoing)' },
  { type: 'cmd', text: 'cat certifications.txt' },
  { type: 'hi',  text: '[+] EC-Council Cybersecurity Fundamentals' },
  { type: 'hi',  text: '[+] EC-Council Android Bug Bounty' },
  { type: 'hi',  text: '[+] AWS Cloud Foundations | THM AoC 2025' },
  { type: 'cmd', text: 'nmap -sV security-testing-lab.local' },
  { type: 'out', text: '22/tcp open ssh OpenSSH (Secure Shell Access)' },
  { type: 'out', text: '80/tcp open http Apache httpd (Web Target)' },
  { type: 'cmd', text: 'cat platforms.txt' },
  { type: 'hi',  text: '[+] Active Labs: TryHackMe | HackTheBox | PortSwigger' }
];

const termBody = document.getElementById('terminalBody');
let lineIdx = 0;
function appendTermLine(line) {
  const div = document.createElement('div');
  div.className = line.type;
  if (line.type === 'cmd') div.textContent = '$ ' + line.text;
  else div.textContent = line.text;
  termBody.appendChild(div);
  termBody.scrollTop = termBody.scrollHeight;
}
function runTerminal() {
  if (lineIdx < termLines.length) {
    appendTermLine(termLines[lineIdx++]);
    setTimeout(runTerminal, lineIdx % 3 === 0 ? 400 : 220);
  } else {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    termBody.appendChild(cursor);
  }
}
if (termBody) {
  if (prefersReducedMotion) {
    termLines.forEach(appendTermLine);   /* render all at once, no typing delay */
  } else {
    setTimeout(runTerminal, 800);
  }
}

/* === INTERSECTION OBSERVER — skills & cards === */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.classList.contains('skill-card')) {
      const delay = el.dataset.delay || 0;
      setTimeout(() => {
        el.classList.add('visible');
        const fill = el.querySelector('.skill-fill');
        if (fill) fill.style.width = fill.dataset.width + '%';
      }, Number(delay));
      io.unobserve(el);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.skill-card').forEach(c => io.observe(c));

/* === ACTIVE NAV LINK ON SCROLL (semantic aria-current) === */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
const scrollSpy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.removeAttribute('aria-current'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.setAttribute('aria-current', 'page');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => scrollSpy.observe(s));

/* === CONTACT FORM === */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btnText = submitBtn.querySelector('.btn-text');
  btnText.textContent = 'Sending...';
  submitBtn.disabled = true;
  setTimeout(() => {
    btnText.textContent = 'Send Message';
    submitBtn.disabled = false;
    formSuccess.classList.add('show');
    form.reset();
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1400);
});

/* === SMOOTH SCROLL for older browsers === */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* === MINI-GAMES === */
const GAMES = {
  pentest: {
    title: 'Pentest Challenge', icon: '🛡️',
    qs: [
      { scene: 'Target URL: https://shop.com/product?id=5\n\nThe page shows product details fetched from a database.', q: 'Which vulnerability would you test this parameter for first?', opts: ['SQL Injection — id=5 is likely passed directly to a DB query', 'XSS — inject a script tag into the URL bar', 'CSRF — the URL could be weaponised in a phishing link', 'Nothing — URL parameters are always sanitised by frameworks'], ans: 0, why: 'The id parameter is almost certainly used in a query like SELECT * FROM products WHERE id=5. Adding a single quote (id=5\') can break it and reveal injection points. Always test numeric GET params first.' },
      { scene: 'Recon reveals an admin login page at:\n/admin/login.php\n\nNo credentials in scope yet.', q: 'What is your very first move?', opts: ['Try default credentials: admin/admin, admin/password, admin/1234', 'Immediately run SQLmap against the login form', 'Launch a password spray attack on all users', 'Skip it — admin pages are legally off-limits in pentests'], ans: 0, why: 'Default credentials are the #1 overlooked finding. Over 60% of internet-exposed devices still use them. It\'s low-noise and legally within scope. Always try defaults before heavier techniques.' },
      { scene: 'A web app has a profile picture upload feature.\nThe server checks that the uploaded filename ends in .jpg, .png, or .gif.', q: 'Which filename is most likely to bypass this filter?', opts: ['shell.php.jpg — double extension tricks many naive extension checks', 'photo.png — passes the filter, completely benign', 'avatar.gif — passes the filter, animated image', 'icon.webp — modern format, passes safely'], ans: 0, why: 'Some web servers (notably older Apache configs) execute files by the first extension. shell.php.jpg can pass a filter that checks for ".jpg" while the server still runs it as PHP. The result: Remote Code Execution.' },
      { scene: 'nmap -sV target.com results:\n21/tcp  open  FTP  vsftpd 2.3.4\nBanner: "220 (vsFTPd 2.3.4) — Anonymous login OK"', q: 'What is your next move?', opts: ['Connect anonymously and search for config files, backups, and credentials', 'Ignore it — FTP is outdated and nothing sensitive is ever stored there', 'Report the open port and move on without testing it', 'Run a brute force on the root account immediately'], ans: 0, why: 'Anonymous FTP access often exposes forgotten backups, config files with credentials, and internal documents. Additionally, vsftpd 2.3.4 has a famous backdoor (CVE-2011-2523) — always verify it.' }
    ]
  },
  webex: {
    title: 'Web Bug Hunter', icon: '🕷️',
    qs: [
      { scene: 'A site has a search feature. After searching for "kabin" the page shows:\n\n<h2>Results for: kabin</h2>\n\nYour input appears directly inside the HTML.', q: 'What vulnerability should you test for?', opts: ['XSS — try <script>alert(1)</script> to see if it executes', 'SQL Injection — the search term might query a database', 'SSRF — the server might fetch your input as a URL', 'Nothing — reflected content is always escaped by browsers'], ans: 0, why: 'When user input is embedded in HTML without sanitisation, a <script> tag can run in the victim\'s browser. XSS can steal session cookies, redirect users, or log keystrokes. Test by searching for <b>test</b> first — if it bolds, it\'s injectable.' },
      { scene: 'After logging in, your profile URL is:\nhttps://site.com/user/1042/settings\n\nYou notice your user ID is in the URL.', q: 'What do you test by changing 1042 to 1043?', opts: ['IDOR — you might access another user\'s settings without authorisation', 'Buffer Overflow — changing a number can overflow memory', 'SQL Injection — the number is passed to the database unsanitised', 'Nothing — numeric IDs are always validated server-side'], ans: 0, why: 'IDOR (Insecure Direct Object Reference) occurs when the server doesn\'t verify you own the requested resource. Simply incrementing an ID can expose private data, account settings, invoices, or medical records of other users.' },
      { scene: 'Site uses this redirect pattern:\nhttps://site.com/go?next=https://google.com\n\nAfter login, users are sent to the "next" URL.', q: 'What attack does the next= parameter enable?', opts: ['Open Redirect — attacker replaces the URL with a phishing site', 'CSRF — the redirect can trigger actions on other sites', 'XSS — JavaScript can be injected into the URL value', 'Directory Traversal — path characters in the URL expose files'], ans: 0, why: 'Open Redirect: attacker sends the victim a legitimate-looking link like site.com/go?next=evil.com/fake-login. The victim trusts the original domain and gets redirected to a phishing page. Used extensively in phishing and OAuth abuse.' },
      { scene: 'You check the database and find your password stored as:\n5f4dcc3b5aa765d61d8327deb882cf99\n\n(That\'s a 32-character hex string.)', q: 'What is the critical security problem?', opts: ['It\'s an MD5 hash — billions are precomputed in rainbow tables, trivially reversed', 'The hash is too short — modern hashes must be 64+ characters', 'Passwords should never be stored — only transmitted', 'Nothing — any hash algorithm makes passwords secure'], ans: 0, why: '5f4dcc3b5aa765d61d8327deb882cf99 is the MD5 of "password". Sites like CrackStation reverse it in under a second. MD5 was designed for speed and file integrity, not password storage. Use bcrypt (cost>=12), scrypt, or Argon2.' }
    ]
  },
  scripting: {
    title: 'Code Debugger', icon: '🐛',
    qs: [
      { scene: 'passwords = ["hunter2", "letmein", "abc123"]\n\nfor i in range(10):\n    print(passwords[i])', q: 'What bug does this code have?', opts: ['IndexError: the list has 3 items (index 0-2) but range(10) reaches index 9', 'SyntaxError: Python 3 requires print() parentheses (already has them)', 'NameError: "passwords" is a reserved keyword in Python', 'No bug — Python automatically stops at the end of a list'], ans: 0, why: 'passwords[3] raises IndexError: list index out of range. Fix: use range(len(passwords)) or iterate directly with "for p in passwords". This is one of the most common beginner Python bugs.' },
      { scene: 'A login automation script:\n\nimport requests\npwd = input("Password: ")\nrequests.post("http://login.corp.com",\n              data={"password": pwd})', q: 'What is the security flaw?', opts: ['HTTP not HTTPS — the password is sent as readable plaintext over the network', 'Storing the password in a variable named "pwd" is unsafe', 'requests.post() cannot send form data — use requests.get()', 'Nothing — HTTP is fine for internal corporate tools'], ans: 0, why: 'HTTP sends all data unencrypted. Anyone on the same network (hotel WiFi, corporate LAN, ISP) can read the password with Wireshark. Always use HTTPS. For extra safety, consider prompting with getpass.getpass() instead of input().' },
      { scene: 'User input is used to build a shell command:\n\nuser_input = input("Enter target domain: ")\ncmd = "ping " + user_input\nos.system(cmd)', q: 'What critical attack does this code enable?', opts: ['Command Injection — user types "8.8.8.8; cat /etc/passwd" to run arbitrary commands', 'Buffer Overflow — a very long domain string can crash the program', 'XSS — the ping output could be displayed in a web browser unsafely', 'Race Condition — two users pinging simultaneously could conflict'], ans: 0, why: 'Concatenating user input into shell strings is catastrophically dangerous. A semicolon chains commands: ping 8.8.8.8; rm -rf / runs both. Fix: use subprocess.run(["ping", user_input]) — argument lists never get interpreted by the shell.' }
    ]
  },
  osint: {
    title: 'Digital Investigator', icon: '🔎',
    qs: [
      { scene: 'Target: company.com\nGoal: passive recon only — no active scanning allowed yet.', q: 'What does a WHOIS lookup on company.com reveal?', opts: ['Domain owner, registrar, registration & expiry dates, nameservers, and contact emails', 'All open TCP/UDP ports and service versions running on the server', 'Admin account usernames and hashed passwords from the directory', 'Full HTML source code of the website and all linked resources'], ans: 0, why: 'WHOIS is a public registration database. It reveals the legal registrant name, organization, contact email, registrar, creation date, expiry date, and nameservers — all without sending a single packet to the target.' },
      { scene: 'A suspect posted a photo to Instagram.\nThe image shows: a distinctive curved bridge, mountains in the background, and a partially-visible street sign with non-Latin script.', q: 'Which OSINT technique best identifies the location?', opts: ['Geolocation analysis — match bridge design, mountain silhouette, and script type to map databases', 'EXIF data extraction — GPS coordinates are always embedded in Instagram photos', 'Run Nmap on the Instagram post URL to trace the upload server', 'Reverse image search will always return the exact street address'], ans: 0, why: 'Instagram strips EXIF GPS data before uploading. Geolocation analysis (GEOINT) uses visual clues: mountain ridge profiles match topographic maps, bridge architecture narrows down country, script type identifies region. This is how Bellingcat geolocates conflict footage.' },
      { scene: 'You find a hacker\'s profile on GitHub:\nUsername: d4rk_h4x0r\nBio: "CTF player | Nepal"\nActivity: mostly CTF challenge repos', q: 'Best next passive OSINT step?', opts: ['Search "d4rk_h4x0r" across Twitter, HackerOne, Reddit, and CTF scoreboards — people reuse handles', 'Hack the GitHub account to read private repositories for more info', 'Send a collaboration request to start building a social engineering relationship', 'There is nothing more you can learn passively from a GitHub username'], ans: 0, why: 'Unique usernames are often reused. A Google search for "d4rk_h4x0r" site:reddit.com, site:hackerone.com, or CTF scoreboards often reveals the same person with real names, photos, or email addresses attached.' },
      { scene: 'Engagement scope: phishing simulation against employees of target.com.\nYou need real email addresses to send test phishing emails.', q: 'Which tool is purpose-built for harvesting emails from public sources?', opts: ['theHarvester — queries Google, Bing, LinkedIn, PGP servers, and more for emails tied to a domain', 'Metasploit — has a module that extracts emails from running mail servers', 'Hashcat — can reconstruct email addresses by cracking company naming-convention hashes', 'Nmap — scanning port 25 (SMTP) lists all registered email addresses'], ans: 0, why: 'theHarvester aggregates email addresses, subdomains, employee names, and IP ranges from search engines, LinkedIn, PGP keyservers, and breach databases — entirely passively. It\'s one of the first tools in any red team OSINT phase.' }
    ]
  },
  reveng: {
    title: 'Code Breaker', icon: '⚙️',
    qs: [
      { scene: 'You intercept a message between two hackers:\n\n"URYYB JBEYQ, V\'Z VA"', q: 'This is ROT13 encoded. What does it say?', opts: ['HELLO WORLD, I\'M IN — ROT13 shifts each letter 13 positions forward', 'CYBER HACKS, STAY — a different rotation value was used', 'KABIN KHADKA, SEC — partial decode only works for names', 'It cannot be decoded without knowing the rotation key'], ans: 0, why: 'ROT13 shifts each letter 13 positions: U->H, R->E, Y->L, Y->L, B->O = HELLO. It\'s its own inverse (apply twice = original). ROT13 is used in CTFs constantly. One-liner in Python: import codecs; codecs.decode("URYYB", "rot_13")' },
      { scene: 'You find a binary file. The "strings" command outputs:\n01001000 01100001 01100011 01101011', q: 'Converting these four ASCII bytes gives:', opts: ['Hack — 72=H, 97=a, 99=c, 107=k', 'Hi — only the first two bytes decode to letters', 'ABCD — the values map to the first four uppercase letters', 'The bytes represent four raw numbers, not text characters'], ans: 0, why: '01001000=72=H, 01100001=97=a, 01100011=99=c, 01101011=107=k. Binary->decimal->ASCII is fundamental. Python: chr(int("01001000",2)) = H. CyberChef handles this in one step.' },
      { scene: 'You decompile a suspicious binary in Ghidra.\nInside a license-check function you find:\n\nif (strcmp(user_input, "GhId4_m4st3r_2024") == 0)\n    unlock_premium();', q: 'What vulnerability has this reverse engineering revealed?', opts: ['Hardcoded credential — the password "GhId4_m4st3r_2024" is visible to anyone who decompiles or runs "strings" on the binary', 'Buffer overflow — strcmp() does not check input length and overflows the stack', 'SQL injection — the string comparison could be bypassed via database manipulation', 'Nothing — compiled binaries encrypt their string constants, so this is safe'], ans: 0, why: 'Compilation does NOT hide strings. The command "strings binary" or any disassembler/decompiler instantly reveals all hardcoded values. This is one of the most common findings in reverse engineering CTF challenges and commercial software audits.' }
    ]
  },
  netsec: {
    title: 'Network Defender', icon: '🌐',
    qs: [
      { scene: 'Firewall log (last 3 minutes):\nSRC: 185.220.101.47\nDST: your-server.com:22 (SSH)\nATTEMPTS: 2,347 failed logins\nUSERNAMES TRIED: root, admin, ubuntu, pi, vagrant, oracle...', q: 'What type of attack is this?', opts: ['Brute force / credential stuffing — automated tool cycling usernames and passwords', 'DDoS — the volume of login attempts is overloading the CPU', 'Phishing — the attacker is serving a fake SSH login page', 'Man-in-the-Middle — the attacker is intercepting SSH traffic'], ans: 0, why: '2,347 attempts in 3 minutes = 780/min — humans can\'t type that fast. Tools like Hydra and Medusa automate this. 185.220.x.x is a known Tor exit node range used to hide origin. Defend with fail2ban, SSH keys only, and port knocking.' },
      { scene: 'You receive an email:\nFrom: security@netf1ix-accounts.com\nSubject: URGENT: Account Suspended\n\n"Your Netflix account has been suspended.\nVerify your payment at: netflix-verify.tk/login"', q: 'What type of attack is this?', opts: ['Phishing — fake domain mimicking Netflix to harvest your credentials', 'Legitimate Netflix security alert — the .tk domain is their international portal', 'Malware delivery — opening the email installs a keylogger automatically', 'Spam — just unwanted marketing with no real threat'], ans: 0, why: 'Red flags: (1) Domain is netf1ix (digit 1 not letter l) and .tk is a free domain. (2) Netflix uses netflix.com only. (3) "URGENT" pressure tactic. (4) Asking for payment re-verification. Never click links in emails — go directly to the real site.' },
      { scene: 'Network monitor at 3:17 AM shows:\nDevice: 192.168.1.87 (HR Laptop)\nDestination: 91.108.4.0 (unknown)\nPacket size: 148 bytes — every 5 minutes\nThis pattern repeats nightly.', q: 'What does this traffic pattern suggest?', opts: ['C2 beacon — malware checking in with attacker server on a timer for instructions', 'Normal Windows Update traffic scheduled for off-hours to reduce disruption', 'A user watching low-bitrate streaming video on a loop overnight', 'The corporate VPN client maintaining its keep-alive connection'], ans: 0, why: 'Regular, fixed-interval, small packets to an unfamiliar IP at unusual hours = classic Command & Control (C2) beacon. The malware "phones home" on a schedule to receive commands. Isolate 192.168.1.87 immediately and check its processes with Autoruns and Process Explorer.' },
      { scene: 'You\'ve just joined the internal network (192.168.1.0/24) during a red team engagement.\nYou need to map all live hosts without triggering the IDS.', q: 'Which Nmap command performs a quiet host-discovery sweep only?', opts: ['nmap -sn 192.168.1.0/24 — ping sweep only, no port scanning, minimal noise', 'nmap -A 192.168.1.0/24 — full aggressive scan with OS detection and scripts', 'nmap -p 1-65535 192.168.1.0/24 — scan every single port on every host', 'ping 192.168.1.0 — pings the network address to discover all hosts'], ans: 0, why: '-sn (formerly -sP) sends only ARP requests on local networks — extremely quiet and fast. It maps all 254 hosts in seconds. "-A" triggers thousands of port probes and service version checks — almost certain to alert a tuned IDS/SIEM.' }
    ]
  },
  forensics: {
    title: 'Who Did It?', icon: '🔍',
    qs: [
      {
        scene: 'CASE FILE: "The Leaked Report"\n\nA company\'s confidential merger document appeared on a competitor\'s website. Three employees had file server access that night. Review the evidence.',
        q: 'Based on the digital evidence below — who leaked the document?',
        type: 'whodunit',
        opts: [
          { name: 'Alex', badge: 'Marketing', clue: 'File server log shows the document was opened from Alex\'s account at 2:14 AM. Alex claims to have been asleep at home and says they never connected remotely that night.' },
          { name: 'Sam', badge: 'Finance', clue: 'Sam\'s access log shows zero connections to the file server all evening. Building keycard records confirm Sam badged out at 6:30 PM and never returned.' },
          { name: 'Jordan', badge: 'IT Dept', clue: 'USB activity log: a 4.2 MB file was written to an external drive at 2:17 AM from Jordan\'s workstation. The leaked report is 4.1 MB. Jordan\'s account was active on the server at that exact time.' }
        ],
        ans: 2,
        why: 'Jordan: USB copy + active server session at 2:17 AM = exfiltration. Digital forensics matched the file write timestamp in Jordan\'s USB metadata to the server access log. Alex\'s remote login may have been a cover attempt, but Jordan\'s USB device held the copied file.'
      },
      {
        scene: 'CASE FILE: "The CEO Email Hack"\n\nFraudulent emails were sent from the CEO\'s account asking staff to wire $85,000. Three IT admins had mail server admin access.',
        q: 'Who most likely sent the fraudulent emails?',
        type: 'whodunit',
        opts: [
          { name: 'Maya', badge: 'SysAdmin', clue: 'Logs show Maya\'s credentials were used — but from an IP address in Beijing. Maya\'s building access card shows she was in the Kathmandu office all day. Her password hadn\'t been changed since a data breach 2 months ago.' },
          { name: 'Chris', badge: 'NetAdmin', clue: 'Chris was on a documented camping trip in a remote national park with no cell coverage for 5 days. Laptop stayed in the office. Building access card: no entry all week. Campsite check-in receipt confirmed.' },
          { name: 'Riley', badge: 'IT Manager', clue: 'Riley connected to the mail server admin console at 11:47 PM. The first fraudulent email was sent at 11:49 PM — 2 minutes later. Riley\'s workstation was the last to access the CEO\'s mailbox configuration that evening.' }
        ],
        ans: 2,
        why: 'Riley: 2-minute gap between admin login and the fraudulent email is the smoking gun. Maya\'s account was almost certainly compromised in that old breach — the Beijing IP shows an attacker using stolen credentials, not Maya herself. Chris has an airtight alibi.'
      },
      {
        scene: 'CASE FILE: "The Hospital Ransomware"\n\nPatient records were encrypted on a Sunday night, disrupting emergency care. Three external contractors had active VPN credentials.',
        q: 'Who deployed the ransomware?',
        type: 'whodunit',
        opts: [
          { name: 'Devon', badge: 'Contractor A', clue: 'VPN logs: Devon authenticated at 3:17 AM Sunday. Over 40 minutes, Devon\'s session made authenticated requests to 47 different servers across 6 network segments — consistent with ransomware lateral movement before triggering mass encryption.' },
          { name: 'Pat', badge: 'Contractor B', clue: 'Pat\'s VPN credentials expired and were revoked 3 weeks before the incident following contract end. The VPN gateway shows zero successful authentications from Pat\'s account since then. Pat had no valid access.' },
          { name: 'Kim', badge: 'Contractor C', clue: 'Kim sent an angry invoice dispute email on Friday. However, Kim\'s VPN log shows only one login: Monday morning at 9:15 AM — three hours after the incident response team had already contained and documented the attack.' }
        ],
        ans: 0,
        why: 'Devon: 3 AM login + lateral movement across 47 servers in 40 minutes = ransomware deployment pattern. Ransomware typically spreads laterally before triggering. Pat had no valid credentials. Kim logged in after containment — possibly to check on the situation, not cause it.'
      }
    ]
  }
};

/* --- Modal state --- */
let _game = null, _qIdx = 0, _score = 0, _lock = false, _lastFocus = null, _order = [];

/* Fisher-Yates: returns a randomized permutation of [0..n-1].
   Used so the correct answer isn't always in the same position. */
function _shuffle(n) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Keep keyboard focus inside the open dialog (WCAG 2.4.3 / 2.1.2) */
function _trapFocus(e) {
  if (e.key !== 'Tab') return;
  const m = document.getElementById('game-modal');
  const focusable = m.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const visible = Array.from(focusable).filter(el => el.offsetParent !== null);
  if (!visible.length) return;
  const first = visible[0], last = visible[visible.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function openGame(id) {
  _game = GAMES[id]; _qIdx = 0; _score = 0; _lock = false;
  _lastFocus = document.activeElement;              /* remember opener */
  const m = document.getElementById('game-modal');
  document.querySelector('.gm-title').textContent = _game.title;
  document.querySelector('.gm-icon').textContent  = _game.icon;
  m.setAttribute('aria-hidden','false');
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', _trapFocus);
  _renderQ();
  /* move focus into the dialog */
  setTimeout(() => document.querySelector('.gm-close').focus(), 0);
}

function _renderQ() {
  const q = _game.qs[_qIdx], total = _game.qs.length;
  document.querySelector('.gm-bar').style.width = (_qIdx/total*100)+'%';
  document.querySelector('.gm-count').textContent = `${_qIdx+1} / ${total}`;
  document.querySelector('.gm-body').style.display  = '';
  document.querySelector('.gm-result').style.display = 'none';
  document.querySelector('.gm-scenario').textContent = q.scene;
  document.querySelector('.gm-question').textContent = q.q;
  const fb = document.querySelector('.gm-feedback');
  fb.className = 'gm-feedback'; fb.textContent = '';
  const box = document.querySelector('.gm-choices');
  box.innerHTML = '';
  _order = _shuffle(q.opts.length);   /* randomized display order for this render */
  if (q.type === 'whodunit') {
    box.className = 'gm-choices gm-suspects';
    _order.forEach((origIdx) => {
      const s = q.opts[origIdx];
      const d = document.createElement('div');
      d.className = 'gm-suspect';
      d.setAttribute('role', 'button');
      d.setAttribute('tabindex', '0');
      d.setAttribute('aria-label', `Suspect ${s.name}, ${s.badge}. ${s.clue}`);
      d.innerHTML = `<span class="suspect-name">${s.name}</span><span class="suspect-badge">${s.badge}</span><span class="suspect-clue">${s.clue}</span>`;
      d.addEventListener('click', () => _answer(origIdx));
      d.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _answer(origIdx); }
      });
      box.appendChild(d);
    });
  } else {
    box.className = 'gm-choices';
    _order.forEach((origIdx, pos) => {
      const o = q.opts[origIdx];
      const b = document.createElement('button');
      b.className = 'gm-choice';
      b.innerHTML = `<span class="choice-letter">${String.fromCharCode(65 + pos)}</span>${o}`;
      b.addEventListener('click', () => _answer(origIdx));
      box.appendChild(b);
    });
  }
  _lock = false;
}

function _answer(idx) {
  if (_lock) return; _lock = true;
  const q = _game.qs[_qIdx];
  const ok = idx === q.ans;
  if (ok) _score++;
  const correctPos = _order.indexOf(q.ans);   /* where the correct answer landed on screen */
  const clickedPos = _order.indexOf(idx);      /* where the user's pick landed on screen */
  document.querySelectorAll('.gm-choice, .gm-suspect').forEach((el, pos) => {
    if (pos === correctPos) el.classList.add('correct');
    else if (pos === clickedPos && !ok) el.classList.add('wrong');
    el.style.pointerEvents = 'none';
  });
  const fb = document.querySelector('.gm-feedback');
  fb.className = 'gm-feedback show ' + (ok ? 'fb-correct' : 'fb-wrong');
  fb.textContent = (ok ? '✓ Correct! ' : '✗ Not quite. ') + q.why;
  setTimeout(() => {
    if (!_game) return;
    _qIdx++;
    if (_qIdx < _game.qs.length) _renderQ();
    else _showResult();
  }, 2800);
}

function _showResult() {
  const t = _game.qs.length;
  document.querySelector('.gm-body').style.display   = 'none';
  document.querySelector('.gm-result').style.display = 'flex';
  document.querySelector('.gm-bar').style.width = '100%';
  document.querySelector('.gm-count').textContent = `${t} / ${t}`;
  const p = _score/t;
  const [trophy, msg] = p===1 ? ['🏆','Perfect score. You think like a pro.']
    : p>=.67 ? ['⚡','Solid work — you\'ve got the fundamentals down.']
    : p>=.34 ? ['📚','Good try! Read the explanations and go again.']
    : ['💡','Every expert started here. Give it another shot!'];
  document.querySelector('.gm-trophy').textContent    = trophy;
  document.querySelector('.gm-score-text').textContent = `${_score} / ${t} correct`;
  document.querySelector('.gm-score-sub').textContent  = msg;
}

function closeGame() {
  const m = document.getElementById('game-modal');
  m.classList.remove('open');
  m.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', _trapFocus);
  _game = null;
  if (_lastFocus && typeof _lastFocus.focus === 'function') _lastFocus.focus();  /* return focus to opener */
}

document.querySelectorAll('.game-btn').forEach(b => b.addEventListener('click', () => openGame(b.dataset.game)));

/* Close on X button */
document.querySelector('.gm-close').addEventListener('click', closeGame);

/* Close when clicking the dark overlay area (modal itself, not the panel) */
document.getElementById('game-modal').addEventListener('click', closeGame);
document.querySelector('.gm-panel').addEventListener('click', e => e.stopPropagation());

/* Play Again */
document.querySelector('.gm-retry').addEventListener('click', () => {
  _qIdx = 0; _score = 0;
  document.querySelector('.gm-result').style.display = 'none';
  document.querySelector('.gm-body').style.display = '';
  _renderQ();
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeGame(); });

/* === CASE STUDY FILTER (interactive technical section) === */
(function () {
  const filters = document.querySelectorAll('.case-filter');
  const cards = document.querySelectorAll('.case-card');
  if (!filters.length || !cards.length) return;
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filters.forEach(b => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      cards.forEach(c => {
        c.classList.toggle('is-hidden', !(f === 'all' || c.dataset.cat === f));
      });
    });
  });
})();
