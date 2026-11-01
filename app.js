'use strict';

/* =========================================================
   Unicorn Squishy Kingdom: quiz, points, players, screens
   ========================================================= */

/* ---------- Data ---------- */
const COLORS = [
  { id: 'pink',  name: 'Bubblegum', body: '#ffe1f1', mane: '#ff5fa2', mane2: '#ffb347', bg: '#ffd0e8' },
  { id: 'lilac', name: 'Lavender',  body: '#f3ebff', mane: '#9b6cff', mane2: '#ff8ad8', bg: '#e2d2ff' },
  { id: 'mint',  name: 'Minty',     body: '#e4fff5', mane: '#22b893', mane2: '#7ed0ff', bg: '#c8f5e6' },
  { id: 'sky',   name: 'Sky',       body: '#e5f4ff', mane: '#3fa2ff', mane2: '#b388ff', bg: '#cbe7ff' },
  { id: 'peach', name: 'Peachy',    body: '#fff0e4', mane: '#ff8a3d', mane2: '#ff5fa2', bg: '#ffdcc4' },
  { id: 'snow',  name: 'Snowflake', body: '#ffffff', mane: '#ffc83d', mane2: '#6ec6ff', bg: '#fff2c4' },
];

const SQUISHIES = [
  { id: 'dumpling', e: '🥟', n: 'Dumpling' },
  { id: 'mochi',    e: '🍡', n: 'Mochi' },
  { id: 'kitty',    e: '🐱', n: 'Kitty' },
  { id: 'panda',    e: '🐼', n: 'Panda' },
  { id: 'peach',    e: '🍑', n: 'Peach' },
  { id: 'cloud',    e: '☁️', n: 'Cloud' },
  { id: 'berry',    e: '🍓', n: 'Strawberry' },
  { id: 'froggy',   e: '🐸', n: 'Froggy' },
  { id: 'donut',    e: '🍩', n: 'Donut' },
  { id: 'penguin',  e: '🐧', n: 'Penguin' },
  { id: 'bunny',    e: '🐰', n: 'Bunny' },
  { id: 'cupcake',  e: '🧁', n: 'Cupcake' },
  { id: 'onigiri',  e: '🍙', n: 'Rice Ball' },
  { id: 'bear',     e: '🐻', n: 'Bear' },
  { id: 'avocado',  e: '🥑', n: 'Avocado' },
  { id: 'unicorn',  e: '🦄', n: 'Mini Unicorn' },
];

const LEVELS = [
  [0, 'Baby Foal', '🍼'],
  [150, 'Sparkle Pony', '✨'],
  [400, 'Rainbow Unicorn', '🌈'],
  [800, 'Star Unicorn', '⭐'],
  [1500, 'Crystal Unicorn', '💎'],
  [3000, 'Legendary Unicorn', '👑'],
];

const CATS = {
  Kindness: '💖', Honesty: '✅', Respect: '🤝', Responsibility: '🧹', Teamwork: '🧩',
  Safety: '🛡️', Gratitude: '🙏', Courage: '🦁', 'Earth & Animals': '🌍', Feelings: '🫶',
};
// Questions in these categories also earn a Kindness Heart.
const HEART_CATS = ['Kindness', 'Teamwork', 'Gratitude', 'Feelings'];

// The first option is always the best answer; options are shuffled when shown.
const QUESTIONS = [
  { c: 'Kindness', q: 'A new student is sitting all alone at lunch. What is the kindest thing to do?',
    o: ['Invite them to sit with you', 'Ignore them, they will be fine', 'Whisper about them with friends', 'Wait for a teacher to fix it'],
    e: 'A small invitation can make someone\'s whole day. Everyone remembers who was kind to them on their first day!' },
  { c: 'Kindness', q: 'Your classmate drops all their books in the hallway.',
    o: ['Help them pick everything up', 'Walk past quickly', 'Take a funny photo', 'Laugh with your friends'],
    e: 'Helping hands are magic. It only takes a minute and it shows you care.' },
  { c: 'Kindness', q: 'A friend shows you a drawing they worked hard on, but it\'s a bit messy. What do you say?',
    o: ['Tell them something you really like about it', 'Say it looks bad', 'Say nothing and change the topic', 'Show them yours is better'],
    e: 'You can be honest AND kind. Point out the good parts, it helps people keep trying.' },
  { c: 'Kindness', q: 'You see someone being teased in a group chat. What should you do?',
    o: ['Don\'t join in, support them and tell a trusted adult', 'Add a laughing emoji', 'Forward it to more people', 'Leave the chat and forget it'],
    e: 'Being an "upstander" means standing up for others. Telling a trusted adult is brave, not tattling.' },
  { c: 'Kindness', q: 'Your little brother or sister is sad because they lost a game to you.',
    o: ['Comfort them and offer to play again', 'Brag that you won', 'Tell them to stop crying', 'Never play with them again'],
    e: 'Winning kindly is a superpower. A good winner helps everyone want to play again.' },

  { c: 'Honesty', q: 'You accidentally broke your mum\'s favourite mug.',
    o: ['Tell her the truth and say sorry', 'Hide the pieces', 'Blame the cat', 'Pretend it was already broken'],
    e: 'Telling the truth when it\'s hard builds trust. Mistakes can be fixed, broken trust is harder to fix.' },
  { c: 'Honesty', q: 'The shopkeeper accidentally gives you too much change.',
    o: ['Give back the extra money', 'Keep it quietly', 'Spend it fast', 'Keep it, it was their mistake'],
    e: 'Honest people do the right thing even when nobody would ever know.' },
  { c: 'Honesty', q: 'You forgot to do your homework.',
    o: ['Tell your teacher honestly and make a plan to finish it', 'Say your dog ate it', 'Copy a friend\'s homework', 'Pretend to be sick'],
    e: 'Owning up is the first step to fixing it. Teachers love honesty!' },
  { c: 'Honesty', q: 'You find a wallet on the playground.',
    o: ['Give it to a teacher or adult so it can be returned', 'Keep the money inside', 'Leave it where it is', 'Hide it in your bag'],
    e: 'Imagine how worried the owner is. Returning it is what a true unicorn would do.' },
  { c: 'Honesty', q: 'In a game, you stepped out of bounds but nobody saw.',
    o: ['Admit it and play fair', 'Keep quiet and keep playing', 'Argue if anyone asks', 'Say someone pushed you'],
    e: 'Winning by cheating isn\'t really winning. Fair play makes games fun for everyone.' },

  { c: 'Respect', q: 'Your grandparent is telling a story you have heard before.',
    o: ['Listen patiently and smile', 'Interrupt and say "I know!"', 'Look at your phone', 'Walk away'],
    e: 'Listening is a gift. Grandparents love sharing their stories with you.' },
  { c: 'Respect', q: 'A classmate celebrates different festivals and eats different food than you.',
    o: ['Be curious and ask them about it respectfully', 'Make fun of it', 'Tell them your way is better', 'Avoid them'],
    e: 'Our differences make the world colourful, just like a rainbow!' },
  { c: 'Respect', q: 'You want to borrow your sister\'s headphones.',
    o: ['Ask her first and wait for her answer', 'Just take them', 'Take them and put them back before she notices', 'Hide them so she can\'t use them'],
    e: 'Asking permission shows respect for other people\'s things.' },
  { c: 'Respect', q: 'Your friend says "no" when you want to play your favourite game.',
    o: ['Respect their choice and find something you both enjoy', 'Keep asking until they give in', 'Get angry', 'Tell everyone they are boring'],
    e: '"No" is an answer we should respect. Good friends find things that make both people happy.' },
  { c: 'Respect', q: 'Your teacher is explaining something to the class.',
    o: ['Listen and raise your hand to ask a question', 'Chat with your neighbour', 'Shout out your question', 'Draw on your desk'],
    e: 'Listening and taking turns to speak helps everyone learn.' },

  { c: 'Responsibility', q: 'You promised to feed the family pet, but your favourite show is starting.',
    o: ['Feed the pet first, then watch', 'Watch the show and forget', 'Ask the pet to wait', 'Pretend you already did it'],
    e: 'Keeping promises, especially to animals who depend on us, is real responsibility.' },
  { c: 'Responsibility', q: 'After playing, your toys are all over the floor.',
    o: ['Tidy them up yourself', 'Leave them for someone else', 'Push them under the bed', 'Wait until someone shouts'],
    e: 'Cleaning up after yourself is a grown-up skill. Your family will be so proud!' },
  { c: 'Responsibility', q: 'A library book you borrowed got a little torn.',
    o: ['Tell the librarian and offer to help fix it', 'Return it and say nothing', 'Throw it away', 'Never go back to the library'],
    e: 'Taking responsibility for accidents shows maturity and respect.' },
  { c: 'Responsibility', q: 'You have a big test next week.',
    o: ['Study a little bit every day', 'Study everything the night before', 'Don\'t study at all', 'Hope for good luck'],
    e: 'Small steps every day add up to big results. That\'s the secret of champions.' },
  { c: 'Responsibility', q: 'You made a mess at your friend\'s house.',
    o: ['Help clean it up', 'Run home quickly', 'Blame your friend', 'Pretend you didn\'t see it'],
    e: 'A good guest leaves a place as nice as they found it.' },

  { c: 'Teamwork', q: 'In a group project, one team member is very quiet.',
    o: ['Ask for their ideas too', 'Do their part without asking', 'Tell them they are useless', 'Ignore them'],
    e: 'Quiet people often have amazing ideas. Great teams include everyone.' },
  { c: 'Teamwork', q: 'You have four cookies and your friend has none.',
    o: ['Offer to share some', 'Eat them all in front of them', 'Hide them', 'Sell them one'],
    e: 'Sharing doubles the happiness!' },
  { c: 'Teamwork', q: 'Your team just lost a match.',
    o: ['Say "good game" to the other team', 'Blame a teammate', 'Refuse to shake hands', 'Say the game was unfair'],
    e: 'Being a good sport when you lose is even more impressive than winning.' },
  { c: 'Teamwork', q: 'Two friends both want the swing at the same time.',
    o: ['Take turns and count to share time', 'The strongest one gets it', 'Nobody gets it ever', 'Whoever screams loudest gets it'],
    e: 'Taking turns is fair, and it means everyone gets to have fun.' },
  { c: 'Teamwork', q: 'Your teammate makes a mistake and your team misses a point.',
    o: ['Say "It\'s okay, we\'ll get the next one!"', 'Yell at them', 'Roll your eyes', 'Ask the coach to remove them'],
    e: 'Encouragement helps people bounce back. Everyone makes mistakes.' },

  { c: 'Safety', q: 'Someone you met online asks for your home address.',
    o: ['Don\'t share it and tell a trusted adult', 'Share it, they seem nice', 'Share only your street name', 'Send a photo of your house'],
    e: 'Personal information stays private online. Always tell a trusted adult if someone asks.' },
  { c: 'Safety', q: 'Someone in an online game asks you to keep your chats a secret from your parents.',
    o: ['Tell a parent or trusted adult right away', 'Keep the secret', 'Keep chatting but be careful', 'Delete the chats'],
    e: 'Safe people never ask kids to keep secrets from their parents. Telling is the right thing.' },
  { c: 'Safety', q: 'You need to cross a busy road.',
    o: ['Use a crossing and look both ways', 'Run across quickly', 'Cross while looking at your phone', 'Follow the crowd without looking'],
    e: 'Stop, look and listen. Safety first, always!' },
  { c: 'Safety', q: 'You find some pills on the floor that look like sweets.',
    o: ['Don\'t touch them and tell an adult', 'Taste one to check', 'Give them to your sibling', 'Put them in your pocket'],
    e: 'Medicine can be dangerous. Never eat anything you find. Tell an adult straight away.' },
  { c: 'Safety', q: 'A friend asks for your game account password.',
    o: ['Keep it private, only parents can know it', 'Share it with your best friend', 'Post it so you don\'t forget', 'Make it "1234"'],
    e: 'Passwords are like toothbrushes: don\'t share them! Only your parents should know.' },

  { c: 'Gratitude', q: 'Grandma gives you a present you don\'t really like.',
    o: ['Thank her warmly for thinking of you', 'Tell her you don\'t like it', 'Ask for money instead', 'Leave it unopened'],
    e: 'Gratitude is about the love behind a gift, not just the gift itself.' },
  { c: 'Gratitude', q: 'Your bus driver gets you to school safely every day.',
    o: ['Say "thank you" when you get off', 'Say nothing, it\'s their job', 'Complain about the bumps', 'Ignore them'],
    e: 'A simple thank you can brighten someone\'s whole day.' },
  { c: 'Gratitude', q: 'Which habit helps grow a happy heart?',
    o: ['Thinking of 3 things you are thankful for each day', 'Complaining about everything', 'Comparing yourself to others', 'Wanting more and more toys'],
    e: 'Grateful people are happier. Try it tonight before bed!' },
  { c: 'Gratitude', q: 'Your parent cooked a dinner you don\'t love.',
    o: ['Thank them and politely try a little', 'Push the plate away and say "yuck"', 'Feed it to the dog', 'Only eat snacks instead'],
    e: 'Someone spent time and love making that meal. Thanking them matters.' },

  { c: 'Courage', q: 'You\'re nervous about trying out for the school play.',
    o: ['Give it a try, being brave means trying even when scared', 'Never try anything new', 'Make fun of people who try out', 'Wait until you are not scared at all'],
    e: 'Courage isn\'t having no fear. It\'s feeling the fear and trying anyway!' },
  { c: 'Courage', q: 'You got a low score on a test.',
    o: ['Learn from your mistakes and keep practising', 'Give up on that subject', 'Hide the test forever', 'Decide you are not smart'],
    e: 'Mistakes are how brains grow. Every expert was once a beginner.' },
  { c: 'Courage', q: 'Your friends dare you to do something dangerous.',
    o: ['Say "No thanks" confidently', 'Do it so they think you\'re cool', 'Do it but secretly', 'Dare someone else to do it'],
    e: 'Saying no to something unsafe takes real courage. True friends will respect it.' },
  { c: 'Courage', q: 'You said something that hurt your friend\'s feelings.',
    o: ['Say sorry sincerely and try to make it right', 'Pretend it never happened', 'Say "it was just a joke"', 'Wait for them to say sorry'],
    e: 'A real apology takes courage, and it can heal a friendship.' },
  { c: 'Courage', q: 'Learning a new skill feels really hard.',
    o: ['Say "I can\'t do it YET" and keep trying', 'Quit right away', 'Say "I\'m just bad at it"', 'Get someone to do it for you'],
    e: 'The word YET is magic. With practice, hard things become easy.' },

  { c: 'Earth & Animals', q: 'You finish a juice box at the park and there\'s no bin nearby.',
    o: ['Carry it until you find a bin', 'Drop it on the grass', 'Hide it in a bush', 'Throw it in the pond'],
    e: 'Keeping nature clean protects animals and plants. Our planet thanks you!' },
  { c: 'Earth & Animals', q: 'You see a kitten that looks hurt.',
    o: ['Tell an adult who can help it safely', 'Pick it up and squeeze it', 'Chase it', 'Ignore it'],
    e: 'Hurt animals can be scared. An adult can help them get care safely.' },
  { c: 'Earth & Animals', q: 'You are brushing your teeth.',
    o: ['Turn off the tap while brushing', 'Let the water run the whole time', 'Use a bucket of water', 'Brush in the shower for an hour'],
    e: 'Turning off the tap can save lots of water every day. Every drop counts!' },
  { c: 'Earth & Animals', q: 'You are leaving your room to go and play outside.',
    o: ['Switch off the lights and fan', 'Leave everything on', 'Turn on more lights', 'Leave the TV on for the toys'],
    e: 'Saving electricity helps protect our beautiful Earth.' },

  { c: 'Feelings', q: 'You feel really, really angry.',
    o: ['Take deep breaths, calm down, then talk about it', 'Hit something', 'Yell at the nearest person', 'Break a toy'],
    e: 'All feelings are okay, but how we act matters. Breathe in for 4, out for 4.' },
  { c: 'Feelings', q: 'A friend tells you they have been feeling sad for a long time.',
    o: ['Listen kindly and encourage them to talk to a trusted adult', 'Tell them to just cheer up', 'Laugh it off', 'Tell everyone at school'],
    e: 'Listening is one of the kindest things you can do. Trusted adults can help even more.' },
  { c: 'Feelings', q: 'Someone gives you a compliment.',
    o: ['Smile and say "Thank you!"', 'Say "No, I\'m not"', 'Ignore them', 'Brag even more'],
    e: 'Accepting kind words graciously makes both of you feel good.' },
  { c: 'Feelings', q: 'Your friend got a prize and you didn\'t.',
    o: ['Congratulate them, even if you feel a bit sad', 'Say the prize is silly', 'Stop being their friend', 'Pretend you didn\'t hear'],
    e: 'Being happy for others is a sign of a big, beautiful heart.' },
];

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }
const colorOf = id => COLORS.find(c => c.id === id) || COLORS[0];

/* ---------- Storage ---------- */
const STORE_KEY = 'usk-v1';
const Store = {
  data: { players: [], sound: true, turn: null },
  load() { try { const raw = localStorage.getItem(STORE_KEY); if (raw) Object.assign(this.data, JSON.parse(raw)); } catch (e) { /* private mode */ } },
  save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(this.data)); } catch (e) { /* private mode */ } },
};

/* ---------- Sound ---------- */
const Sound = {
  ac: null,
  init() {
    if (!this.ac) { try { this.ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; } }
    if (this.ac.state === 'suspended') this.ac.resume();
  },
  tone(f, d = 0.12, type = 'sine', v = 0.12, f2 = 0, delay = 0) {
    if (!Store.data.sound || !this.ac) return;
    const t = this.ac.currentTime + delay, o = this.ac.createOscillator(), g = this.ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + d);
    o.connect(g).connect(this.ac.destination); o.start(t); o.stop(t + d + 0.03);
  },
  tap() { this.tone(660, 0.06, 'triangle', 0.07); },
  correct() { [523, 659, 784].forEach((f, i) => this.tone(f, 0.16, 'triangle', 0.12, 0, i * 0.08)); },
  wrong() { this.tone(320, 0.28, 'sine', 0.12, 180); },
  win() { [523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.12, 0, i * 0.1)); },
  jump(m = 1) { this.tone(360 * m, 0.16, 'square', 0.045, 760 * m); },
  collect() { this.tone(1250, 0.08, 'triangle', 0.07, 1900); },
  gem() { [1047, 1568, 2093].forEach((f, i) => this.tone(f, 0.12, 'triangle', 0.09, 0, i * 0.06)); },
  stomp() { this.tone(220, 0.16, 'square', 0.07, 560); },
  hurt() { this.tone(260, 0.32, 'sawtooth', 0.06, 90); },
};

/* ---------- Unicorn avatar ---------- */
function uniSVG(colorId, size = 64) {
  const c = colorOf(colorId);
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">
    <circle cx="50" cy="50" r="48" fill="${c.bg}"/>
    <circle cx="33" cy="37" r="11" fill="${c.mane}"/>
    <circle cx="25" cy="51" r="11" fill="${c.mane2}"/>
    <circle cx="24" cy="65" r="10" fill="${c.mane}"/>
    <circle cx="30" cy="78" r="8.5" fill="${c.mane2}"/>
    <path d="M40 42 L43 21 L54 37 Z" fill="${c.body}" stroke="#c9a8e8" stroke-width="2" stroke-linejoin="round"/>
    <ellipse cx="56" cy="60" rx="25" ry="23" fill="${c.body}" stroke="#d6bff0" stroke-width="2"/>
    <ellipse cx="69" cy="72" rx="17" ry="12.5" fill="${c.body}" stroke="#d6bff0" stroke-width="2"/>
    <path d="M52 39 L63 6 L67 38 Z" fill="#ffd45e" stroke="#e5a900" stroke-width="2" stroke-linejoin="round"/>
    <path d="M55 30 L65 27 M57 21 L64 19" stroke="#e5a900" stroke-width="2" stroke-linecap="round"/>
    <circle cx="44" cy="44" r="7" fill="${c.mane}"/>
    <circle cx="60" cy="56" r="4.6" fill="#3b2a4a"/>
    <circle cx="61.8" cy="54.2" r="1.6" fill="#fff"/>
    <circle cx="73" cy="62" r="5" fill="#ff9ec7" opacity=".65"/>
    <circle cx="79" cy="71" r="1.7" fill="#3b2a4a"/>
    <path d="M65 79 Q71 84 77 79" stroke="#3b2a4a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  </svg>`;
}

/* ---------- Points & levels ---------- */
function newPlayer(name, color) {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, color,
    stars: 0, hearts: 0, gems: 0, crowns: 0, sparkles: 0, squishies: {}, seen: [],
    quizzes: 0, passes: 0, bestQuiz: 0, bestRun: 0, runs: 0,
  };
}
const total = p => p.stars + p.hearts * 5 + p.gems * 15 + p.crowns * 50 + p.sparkles;
function levelOf(p) {
  const t = total(p); let i = 0;
  while (i < LEVELS.length - 1 && t >= LEVELS[i + 1][0]) i++;
  const [base, name, icon] = LEVELS[i];
  const next = LEVELS[i + 1] ? LEVELS[i + 1][0] : null;
  return { i, name, icon, base, next, t, pct: next ? Math.round((t - base) / (next - base) * 100) : 100 };
}
const players = () => Store.data.players;
const findPlayer = id => players().find(p => p.id === id);

/* ---------- UI basics ---------- */
let current = null; // player id taking a turn

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo(0, 0);
}
function go(id) {
  if (id === 's-home') renderHome();
  if (id === 's-board') renderBoard();
  if (id === 's-help') renderHelp();
  show(id);
}
let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}
function confetti(n = 50) {
  const bits = ['✨', '⭐', '💖', '🌈', '🦄', '💜', '🎉'];
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.textContent = bits[i % bits.length];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (16 + Math.random() * 18) + 'px';
    el.style.animationDuration = (2 + Math.random() * 2) + 's';
    el.style.animationDelay = Math.random() * 0.6 + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4800);
  }
}

/* ---------- Home ---------- */
function renderHome() {
  $('#heroUni').innerHTML = uniSVG(players()[0]?.color || 'lilac', 118);
  $('#btnSound').textContent = Store.data.sound ? '🔊' : '🔇';
  const list = $('#playerList');
  if (!players().length) {
    list.innerHTML = `<div class="empty"><div class="big">🦄</div>Add your first unicorn to begin the adventure!</div>
      <button class="btn block pulse" id="btnAddEmpty">＋ Create my unicorn</button>`;
    $('#btnAddEmpty').onclick = () => openModal();
  } else {
    const multi = players().length > 1;
    list.innerHTML = players().map(p => {
      const c = colorOf(p.color), l = levelOf(p);
      const isTurn = multi && Store.data.turn === p.id;
      return `<div class="pcard ${isTurn ? 'turn' : ''}" style="--c:${c.mane}">
        ${isTurn ? '<span class="turn-badge">✨ Your turn!</span>' : ''}
        <button class="pava" data-profile="${p.id}" aria-label="Open ${esc(p.name)}'s profile">${uniSVG(p.color, 58)}</button>
        <div class="pinfo" data-profile="${p.id}">
          <div class="pname">${esc(p.name)}</div>
          <div class="plevel">${l.icon} ${l.name} · <b>${l.t}</b> pts</div>
          <div class="pmini">⭐${p.stars} 💖${p.hearts} 🌈${p.gems} 👑${p.crowns} ✨${p.sparkles}</div>
        </div>
        <button class="btn small" data-play="${p.id}">Play ▶</button>
      </div>`;
    }).join('');
  }
  $('#btnAdd').classList.toggle('hidden', players().length >= 6 || !players().length);
}

/* ---------- Add / edit modal ---------- */
let editingId = null, pickedColor = 'pink';
function openModal(id = null) {
  editingId = id;
  const p = id ? findPlayer(id) : null;
  $('#modalTitle').textContent = p ? 'Edit unicorn' : 'New unicorn';
  $('#inName').value = p ? p.name : '';
  const used = players().filter(x => x.id !== id).map(x => x.color);
  pickedColor = p ? p.color : (COLORS.find(c => !used.includes(c.id)) || COLORS[0]).id;
  renderColors();
  $('#btnDelete').classList.toggle('hidden', !p);
  $('#modal').classList.remove('hidden');
  setTimeout(() => $('#inName').focus(), 50);
}
function renderColors() {
  $('#colorGrid').innerHTML = COLORS.map(c => `<button class="color-opt ${c.id === pickedColor ? 'sel' : ''}" data-color="${c.id}">${uniSVG(c.id, 54)}${c.name}</button>`).join('');
}
function closeModal() { $('#modal').classList.add('hidden'); }
function saveModal() {
  const name = $('#inName').value.trim();
  if (!name) { toast('Give your unicorn a name! 🦄'); $('#inName').focus(); return; }
  if (editingId) {
    const p = findPlayer(editingId); p.name = name; p.color = pickedColor;
  } else {
    const p = newPlayer(name, pickedColor);
    players().push(p);
    if (!Store.data.turn) Store.data.turn = p.id;
    toast(`Welcome to the Kingdom, ${name}! ✨`);
  }
  Store.save(); closeModal();
  if ($('#s-profile').classList.contains('active') && editingId) renderProfile(editingId); else renderHome();
}
function deletePlayer() {
  const p = findPlayer(editingId);
  if (!p || !confirm(`Remove ${p.name} and all their points?`)) return;
  Store.data.players = players().filter(x => x.id !== editingId);
  if (Store.data.turn === editingId) Store.data.turn = players()[0]?.id || null;
  Store.save(); closeModal(); go('s-home');
}

/* ---------- Ready ---------- */
function startTurn(id) {
  current = id;
  const p = findPlayer(id), l = levelOf(p);
  $('#readyAva').innerHTML = uniSVG(p.color, 120);
  $('#readyName').textContent = p.name;
  $('#readyLevel').textContent = `${l.icon} ${l.name} · ${l.t} points`;
  show('s-ready');
}

/* ---------- Quiz ---------- */
const QUIZ_LEN = 10, PASS = 7;
let quiz = null;

function startQuiz() {
  const p = findPlayer(current);
  let pool = QUESTIONS.map((_, i) => i).filter(i => !p.seen.includes(i));
  if (pool.length < QUIZ_LEN) { p.seen = []; pool = QUESTIONS.map((_, i) => i); }
  const picks = shuffle(pool).slice(0, QUIZ_LEN);
  quiz = {
    qs: picks.map(i => ({ ...QUESTIONS[i], i, opts: shuffle(QUESTIONS[i].o.map((t, k) => ({ t, ok: k === 0 }))) })),
    idx: 0, correct: 0, streak: 0, bestStreak: 0, hearts: 0, gems: 0, missed: [],
  };
  $('#quizAva').innerHTML = uniSVG(p.color, 36);
  $('#quizName').textContent = p.name;
  showQuestion();
  show('s-quiz');
}

function showQuestion() {
  const q = quiz.qs[quiz.idx];
  $('#quizCount').textContent = `Question ${quiz.idx + 1} of ${QUIZ_LEN}`;
  $('#quizBar').style.width = (quiz.idx / QUIZ_LEN * 100) + '%';
  $('#quizStreak').textContent = `🔥 ${quiz.streak}`;
  $('#qCat').textContent = `${CATS[q.c]} ${q.c}`;
  $('#qText').textContent = q.q;
  $('#qOpts').innerHTML = q.opts.map((o, k) => `<button class="opt" data-opt="${k}"><span class="let">${'ABCD'[k]}</span><span>${esc(o.t)}</span></button>`).join('');
  $('#qExplain').classList.add('hidden');
  $('#btnNext').classList.add('hidden');
}

function answer(k) {
  const q = quiz.qs[quiz.idx];
  if (q.done) return;
  q.done = true;
  const p = findPlayer(current);
  if (!p.seen.includes(q.i)) p.seen.push(q.i);
  const btns = [...document.querySelectorAll('#qOpts .opt')];
  btns.forEach((b, j) => { b.disabled = true; if (q.opts[j].ok) b.classList.add('ok'); });
  const ok = q.opts[k].ok;
  const ex = $('#qExplain');
  if (ok) {
    quiz.correct++; quiz.streak++; quiz.bestStreak = Math.max(quiz.bestStreak, quiz.streak);
    let bonus = '';
    if (HEART_CATS.includes(q.c)) { quiz.hearts++; bonus += ' +1 💖'; }
    if (quiz.streak % 3 === 0) { quiz.gems++; bonus += ' +1 🌈'; toast(`🔥 ${quiz.streak} in a row! Rainbow Gem bonus! 🌈`); $('#quizStreak').classList.add('hot'); setTimeout(() => $('#quizStreak').classList.remove('hot'), 1300); }
    Sound.correct();
    ex.className = 'explain good';
    ex.innerHTML = `<b>🎉 Yes! +10 ⭐${bonus}</b>${esc(q.e)}`;
  } else {
    quiz.streak = 0; quiz.missed.push(q);
    btns[k].classList.add('bad');
    Sound.wrong();
    ex.className = 'explain oops';
    ex.innerHTML = `<b>💭 Good try! The best answer is: ${esc(q.o[0])}</b>${esc(q.e)}`;
  }
  $('#quizStreak').textContent = `🔥 ${quiz.streak}`;
  $('#btnNext').textContent = quiz.idx === QUIZ_LEN - 1 ? 'See my results 🏁' : 'Next ➜';
  $('#btnNext').classList.remove('hidden');
  Store.save();
  setTimeout(() => $('#btnNext').scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
}

function nextQuestion() {
  if (quiz.idx < QUIZ_LEN - 1) { quiz.idx++; showQuestion(); window.scrollTo(0, 0); }
  else finishQuiz();
}

function pickSquishy(p) {
  const unowned = SQUISHIES.filter(s => !p.squishies[s.id]);
  const pool = unowned.length && Math.random() < 0.8 ? unowned : SQUISHIES;
  const s = pool[Math.random() * pool.length | 0];
  const isNew = !p.squishies[s.id];
  p.squishies[s.id] = (p.squishies[s.id] || 0) + 1;
  return { ...s, isNew };
}

function finishQuiz() {
  $('#quizBar').style.width = '100%';
  const p = findPlayer(current);
  const n = quiz.correct, pass = n >= PASS;
  p.quizzes++; p.bestQuiz = Math.max(p.bestQuiz, n);
  const card = $('#resultCard');
  const pct = n * 10;
  if (pass) {
    const stars = n * 10, crown = n === QUIZ_LEN ? 1 : 0;
    const before = levelOf(p).i;
    p.stars += stars; p.hearts += quiz.hearts; p.gems += quiz.gems; p.crowns += crown; p.passes++;
    const sq = [pickSquishy(p)];
    if (crown) sq.push(pickSquishy(p));
    const lv = levelOf(p);
    const earned = stars + quiz.hearts * 5 + quiz.gems * 15 + crown * 50;
    Store.save();
    card.innerHTML = `
      <div class="ring" style="--p:${pct}"><div><b>${n}/10</b><small>correct</small></div></div>
      <h2 class="res-title">${crown ? '👑 PERFECT! You are amazing!' : '🎉 Quest complete!'}</h2>
      <p class="muted">You earned <b>${earned}</b> points, ${esc(p.name)}!</p>
      <div class="rewards">
        <div class="reward"><div class="ico">⭐</div><div class="val">+${stars}</div><div class="nm">Stars</div></div>
        <div class="reward" style="animation-delay:.1s"><div class="ico">💖</div><div class="val">+${quiz.hearts}</div><div class="nm">Kindness Hearts</div></div>
        <div class="reward" style="animation-delay:.2s"><div class="ico">🌈</div><div class="val">+${quiz.gems}</div><div class="nm">Rainbow Gems</div></div>
        <div class="reward" style="animation-delay:.3s"><div class="ico">👑</div><div class="val">+${crown}</div><div class="nm">Golden Crown</div></div>
      </div>
      ${sq.map(s => `<div class="squish-win"><div class="emo">${s.e}</div><div><b>${s.isNew ? 'New squishy!' : 'Another'} ${esc(s.n)} Squishy</b></div><div class="muted">${s.isNew ? 'Added to your collection 🧸' : `You now have ${p.squishies[s.id]}!`}</div></div>`).join('')}
      ${lv.i > before ? `<div class="squish-win"><div class="emo">${lv.icon}</div><b>Level up! You are now a ${lv.name}!</b></div>` : ''}
      <button class="btn green block pulse" id="btnPlayRun">🎮 Play Rainbow Run!</button>
      <button class="btn ghost block" id="btnSkipRun">Skip for now</button>`;
    Sound.win(); confetti(crown ? 90 : 55);
    $('#btnPlayRun').onclick = startRun;
    $('#btnSkipRun').onclick = endTurn;
  } else {
    Store.save();
    card.innerHTML = `
      <div class="ring" style="--p:${pct};--rc:#ffb347"><div><b>${n}/10</b><small>correct</small></div></div>
      <h2 class="res-title">💫 So close!</h2>
      <p class="muted">You need <b>${PASS} or more</b> to win points and unlock Rainbow Run. You can do it!</p>
      <p>💖 Remember the golden rule: even if you don't win, you are still a <b>Unicorn Star</b>!</p>
      <div class="review"><h3>Let's remember these:</h3>${quiz.missed.map(q => `<div>${CATS[q.c]} <b>${esc(q.o[0])}</b></div>`).join('')}</div>
      <button class="btn block" id="btnRetry">🔁 Try a new quest</button>
      <button class="btn ghost block" id="btnHomeFail">🏠 Back to the Kingdom</button>`;
    $('#btnRetry').onclick = startQuiz;
    $('#btnHomeFail').onclick = endTurn;
  }
  show('s-result');
}

/* ---------- Rainbow Run ---------- */
function startRun() {
  const p = findPlayer(current);
  show('s-game');
  $('#pauseMenu').classList.add('hidden');
  RainbowRun.start($('#gameCanvas'), { color: colorOf(p.color), sound: Sound, onEnd: runOver });
}

function runOver(res) {
  const p = findPlayer(current);
  const best = res.score > p.bestRun;
  p.sparkles += res.score; p.runs++; p.bestRun = Math.max(p.bestRun, res.score);
  Store.save();
  const next = nextPlayer();
  $('#overCard').innerHTML = `
    <div class="big-ava">${uniSVG(p.color, 120)}</div>
    <h2 class="res-title">${res.survived ? '🏰 You made it to the castle!' : '🌈 What a run!'}</h2>
    ${best ? '<p><b>🏅 New best run!</b></p>' : ''}
    <div class="rewards">
      <div class="reward"><div class="ico">✨</div><div class="val">+${res.score}</div><div class="nm">Sparkles</div></div>
      <div class="reward" style="animation-delay:.1s"><div class="ico">💎</div><div class="val">${res.gems}</div><div class="nm">Crystals found</div></div>
      <div class="reward" style="animation-delay:.2s"><div class="ico">☁️</div><div class="val">${res.stomps}</div><div class="nm">Grumpy clouds cheered up</div></div>
      <div class="reward" style="animation-delay:.3s"><div class="ico">🏅</div><div class="val">${p.bestRun}</div><div class="nm">Best run</div></div>
    </div>
    <p class="muted">Total: <b>${total(p)}</b> points · ${levelOf(p).icon} ${levelOf(p).name}</p>
    ${next && next.id !== p.id
      ? `<button class="btn block pulse" id="btnNextPlayer">Pass to ${esc(next.name)} ➜</button>`
      : `<button class="btn block" id="btnAgain">🔁 Another quest</button>`}
    <button class="btn ghost block" id="btnOverHome">🏠 Back to the Kingdom</button>`;
  if (best) confetti(40);
  Store.data.turn = next ? next.id : p.id; Store.save();
  const np = $('#btnNextPlayer'); if (np) np.onclick = () => startTurn(next.id);
  const ag = $('#btnAgain'); if (ag) ag.onclick = startQuiz;
  $('#btnOverHome').onclick = () => go('s-home');
  show('s-over');
}

function nextPlayer() {
  const list = players(); if (!list.length) return null;
  const i = list.findIndex(p => p.id === current);
  return list[(i + 1) % list.length];
}
function endTurn() {
  const next = nextPlayer();
  if (next) Store.data.turn = next.id;
  Store.save(); go('s-home');
}

/* ---------- Leaderboard ---------- */
function renderBoard() {
  const list = players().slice().sort((a, b) => total(b) - total(a));
  const medals = ['🥇', '🥈', '🥉'];
  $('#boardList').innerHTML = list.length ? list.map((p, i) => {
    const l = levelOf(p);
    return `<div class="brow" data-profile="${p.id}">
      <div class="brank">${medals[i] || i + 1}</div>
      ${uniSVG(p.color, 52)}
      <div class="pinfo"><div class="pname">${esc(p.name)}</div>
        <div class="plevel">${l.icon} ${l.name}</div>
        <div class="pmini">⭐${p.stars} 💖${p.hearts} 🌈${p.gems} 👑${p.crowns} ✨${p.sparkles} 🧸${Object.keys(p.squishies).length}</div></div>
      <div class="btotal">${l.t}<small>points</small></div>
    </div>`;
  }).join('') : '<div class="card empty"><div class="big">🏆</div>No unicorns yet. Add one on the home screen!</div>';
}

/* ---------- Profile ---------- */
function renderProfile(id) {
  const p = findPlayer(id); if (!p) return go('s-home');
  const l = levelOf(p);
  const owned = Object.keys(p.squishies).length;
  $('#profileBody').innerHTML = `
    <div class="card center">
      <div class="big-ava">${uniSVG(p.color, 120)}</div>
      <h2 class="ready-title">${esc(p.name)}</h2>
      <p class="muted" style="margin:4px 0">${l.icon} ${l.name} · <b>${l.t}</b> points</p>
      <div class="lvl-bar"><div style="width:${l.pct}%"></div></div>
      <p class="muted" style="margin:0;font-size:13px">${l.next ? `${l.next - l.t} points to ${LEVELS[l.i + 1][2]} ${LEVELS[l.i + 1][1]}` : 'Highest level reached! 👑'}</p>
      <button class="btn block" data-play="${p.id}">Play ▶</button>
    </div>
    <div class="card">
      <h3>My points</h3>
      <div class="stat-grid">
        <div class="stat"><div class="ico">⭐</div><div class="val">${p.stars}</div><div class="nm">Stars</div></div>
        <div class="stat"><div class="ico">💖</div><div class="val">${p.hearts}</div><div class="nm">Hearts</div></div>
        <div class="stat"><div class="ico">🌈</div><div class="val">${p.gems}</div><div class="nm">Gems</div></div>
        <div class="stat"><div class="ico">👑</div><div class="val">${p.crowns}</div><div class="nm">Crowns</div></div>
        <div class="stat"><div class="ico">✨</div><div class="val">${p.sparkles}</div><div class="nm">Sparkles</div></div>
        <div class="stat"><div class="ico">🏅</div><div class="val">${p.bestRun}</div><div class="nm">Best run</div></div>
      </div>
      <p class="muted" style="margin:10px 0 0;font-size:14px">Quests passed: <b>${p.passes}</b> of ${p.quizzes} · Best quiz: <b>${p.bestQuiz}/10</b></p>
    </div>
    <div class="card">
      <h3>🧸 Squishy collection (${owned}/${SQUISHIES.length})</h3>
      <div class="squish-grid">
        ${SQUISHIES.map(s => {
          const n = p.squishies[s.id] || 0;
          return `<div class="sq ${n ? '' : 'locked'}">${n > 1 ? `<span class="cnt">x${n}</span>` : ''}<div class="emo">${s.e}</div><div class="nm">${n ? esc(s.n) : '???'}</div></div>`;
        }).join('')}
      </div>
    </div>
    <button class="btn ghost block" id="btnEditPlayer">✏️ Change name or colour</button>`;
  $('#btnEditPlayer').onclick = () => openModal(p.id);
  show('s-profile');
}

/* ---------- Help ---------- */
function renderHelp() {
  $('#levelLegend').innerHTML = LEVELS.map(([pts, name, icon]) => `<div><span>${icon}</span><b>${name}</b> ${pts}+ points</div>`).join('');
}

/* ---------- Events ---------- */
document.addEventListener('pointerdown', () => Sound.init(), { once: false, passive: true });
document.addEventListener('click', e => {
  const t = e.target;
  const goEl = t.closest('[data-go]'); if (goEl) { Sound.tap(); go(goEl.dataset.go); return; }
  const play = t.closest('[data-play]'); if (play) { Sound.tap(); startTurn(play.dataset.play); return; }
  const prof = t.closest('[data-profile]'); if (prof) { Sound.tap(); renderProfile(prof.dataset.profile); return; }
  const opt = t.closest('[data-opt]'); if (opt) { answer(+opt.dataset.opt); return; }
  const col = t.closest('[data-color]'); if (col) { Sound.tap(); pickedColor = col.dataset.color; renderColors(); }
});
$('#btnAdd').onclick = () => openModal();
$('#btnCancel').onclick = closeModal;
$('#btnSave').onclick = saveModal;
$('#btnDelete').onclick = deletePlayer;
$('#inName').addEventListener('keydown', e => { if (e.key === 'Enter') saveModal(); });
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
$('#btnStartQuiz').onclick = startQuiz;
$('#btnNext').onclick = nextQuestion;
$('#btnQuitQuiz').onclick = () => { if (confirm('Leave this quest? Your answers so far won\'t earn points.')) go('s-home'); };
$('#btnSound').onclick = () => { Store.data.sound = !Store.data.sound; Store.save(); $('#btnSound').textContent = Store.data.sound ? '🔊' : '🔇'; };
$('#btnPause').onclick = () => { RainbowRun.pause(); $('#pauseMenu').classList.remove('hidden'); };
$('#btnResume').onclick = () => { $('#pauseMenu').classList.add('hidden'); RainbowRun.resume(); };
$('#btnEndRun').onclick = () => { $('#pauseMenu').classList.add('hidden'); RainbowRun.quit(); };

/* ---------- PWA install ---------- */
let installEvt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; $('#btnInstall').classList.remove('hidden'); });
$('#btnInstall').onclick = async () => {
  if (!installEvt) return;
  installEvt.prompt(); await installEvt.userChoice; installEvt = null; $('#btnInstall').classList.add('hidden');
};
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

/* ---------- Boot ---------- */
Store.load();
renderHome();
