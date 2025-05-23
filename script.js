document.getElementById("menuToggle").onclick = function () {
  const menu = document.getElementById("hiddenMenu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
};

const songs = [
  { name: "Sajni", src: "songs/Sajni.mp3", cover: "covers/Sajni.png" },
  { name: "Faded", src: "songs/Faded.mp3", cover: "covers/Faded.png" },
  {
    name: "Tere Bina",
    src: "songs/Tere Bina.mp3",
    cover: "covers/Tere Bina.png",
  },
  { name: "Kissik", src: "songs/Kissik.mp3", cover: "covers/Kissik.png" },
  {
    name: "Tere Bina - Haseena Parkar",
    src: "songs/Tere Bina - Haseena Parkar.mp3",
    cover: "covers/Tere Bina - Haseena Parkar.png",
  },
  {
    name: "On My Way",
    src: "songs/On My Way.mp3",
    cover: "covers/On My Way.png",
  },
  {
    name: "Tera Hone Laga Hoon",
    src: "songs/Tera Hone Laga Hoon.mp3",
    cover: "covers/Tera Hone Laga Hoon.png",
  },
  {
    name: "Sooraj Hi Chhaon Banke",
    src: "songs/Sooraj Hi Chhaon banke.mp3",
    cover: "covers/Sooraj Hi Chhaon banke.png",
  },
  {
    name: "Bin Tere - I Hate Luv Story",
    src: "songs/Bin Tere - I Hate Luv Story.mp3",
    cover: "covers/Bin Tere - I Hate Luv Story.png",
  },
  {
    name: "Team India Hain Hum",
    src: "songs/Team India Hain Hum.mp3",
    cover: "covers/Team India Hain Hum.png",
  },
  {
    name: "Tu Hai Champion",
    src: "songs/Tu Hai Champion.mp3",
    cover: "covers/Tu Hai Champion.png",
  },
  {
    name: "Tere Bina - Shorgul",
    src: "songs/Tere Bina - Shorgul.mp3",
    cover: "covers/Tere Bina - Shorgul.png",
  },
  { name: "Bulleya", src: "songs/Bulleya.mp3", cover: "covers/Bulleya.png" },
  {
    name: "Tere Bina - Mausam Ikrar ke Do Pal Pyar Ke",
    src: "songs/Tere Bina - Mausam Ikrar ke Do Pal Pyar Ke.mp3",
    cover: "covers/Tere Bina - Mausam Ikrar ke Do Pal Pyar Ke.png",
  },
  { name: "Ajab Si", src: "songs/Ajab Si.mp3", cover: "covers/Ajab Si.png" },
  { name: "Bin Tere", src: "songs/Bin Tere.mp3", cover: "covers/Bin Tere.png" },
  {
    name: "Dil Haaraa",
    src: "songs/Dil Haaraa.mp3",
    cover: "covers/Dil Haaraa.png",
  },
  {
    name: "Jugraafiya",
    src: "songs/Jugraafiya.mp3",
    cover: "covers/Jugraafiya.png",
  },
  {
    name: "O Rangrez",
    src: "songs/O Rangrez.mp3",
    cover: "covers/O Rangrez.png",
  },
  {
    name: "Bin Tere Bin",
    src: "songs/Bin Tere Bin.mp3",
    cover: "covers/Bin Tere Bin.png",
  },
];

let currentSong = 0,
  repeatMode = "none";
const audio = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const volumeControl = document.getElementById("volume");
const seekBar = document.getElementById("seekBar");
const playerCover = document.getElementById("playerCover");
const songTitle = document.getElementById("songTitle");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeText = document.getElementById("totalTime");
const repeatBtn = document.getElementById("repeatBtn");
const songCards = document.getElementById("songCards");

songs.forEach((song, i) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img src="${song.cover}" alt="${song.name}">
    <p>${song.name}</p>
    <div class="progress"><span id="bar-${i}"></span></div>
    <button class="queue-btn" onclick="event.stopPropagation(); addToQueue(${i})">➕ Queue</button>`;
  card.onclick = () => playSong(i);
  songCards.appendChild(card);
});


function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
}

function loadSong(index) {
  audio.src = songs[index].src;
  audio.load();
  playerCover.src = songs[index].cover;
  songTitle.textContent = songs[index].name;
}

function playSong(index) {
  currentSong = index;
  loadSong(index);
  audio.play();
  playPauseBtn.textContent = "❚❚";
}

playPauseBtn.onclick = () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "❚❚";
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶";
  }
};

function nextSong() {
  if (repeatMode === "one") return playSong(currentSong);
  if (isShuffle) {
    let next;
    do {
      next = Math.floor(Math.random() * songs.length);
    } while (next === currentSong);
    currentSong = next;
  } else {
    currentSong = (currentSong + 1) % songs.length;
  }
  playSong(currentSong);
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  playSong(currentSong);
}

volumeControl.oninput = () => (audio.volume = volumeControl.value);

audio.ontimeupdate = () => {
  if (audio.duration && !isNaN(audio.duration)) {
    const progress = (audio.currentTime / audio.duration) * 100;
    seekBar.value = Math.floor(progress);
    seekBar.max = 100;
    seekBar.style.background = `linear-gradient(to right, #0ff ${progress}%, #333 ${progress}%)`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
};

audio.addEventListener("loadedmetadata", () => {
  seekBar.max = Math.floor(audio.duration);
  totalTimeText.textContent = formatTime(audio.duration);
});

seekBar.oninput = () => {
  audio.currentTime = (seekBar.value / 100) * audio.duration;
};

audio.onended = () => nextSong();

document.getElementById("searchBar").oninput = function () {
  const val = this.value.toLowerCase();
  document.querySelectorAll(".card").forEach((card) => {
    card.style.display = card.textContent.toLowerCase().includes(val)
      ? "block"
      : "none";
  });
};

// 🎵 Visualizer
const visualizer = document.getElementById("visualizer");
const ctx = visualizer.getContext("2d");
visualizer.width = window.innerWidth;
visualizer.height = 150;
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawBars() {
  requestAnimationFrame(drawBars);
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, visualizer.width, visualizer.height);
  const barWidth = (visualizer.width / bufferLength) * 2.5;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    ctx.fillStyle = `rgb(${barHeight + 100}, 0, ${255 - barHeight})`;
    ctx.fillRect(x, visualizer.height - barHeight / 2, barWidth, barHeight / 2);
    x += barWidth + 1;
  }
}
audio.onplay = () => audioCtx.resume().then(drawBars);

// 🎈 Particle Animation
const particles = document.getElementById("particles");
const pctx = particles.getContext("2d");
particles.width = window.innerWidth;
particles.height = window.innerHeight;
let bubbleArr = [];

function createBubbles() {
  for (let i = 0; i < 100; i++) {
    bubbleArr.push({
      x: Math.random() * particles.width,
      y: Math.random() * particles.height,
      radius: Math.random() * 3 + 2,
      dx: (Math.random() - 0.5) * 2,
      dy: Math.random() * 1 + 0.5,
    });
  }
}
function animateBubbles() {
  requestAnimationFrame(animateBubbles);
  pctx.clearRect(0, 0, particles.width, particles.height);
  bubbleArr.forEach((b) => {
    b.y -= b.dy;
    if (b.y < 0) b.y = particles.height;
    pctx.beginPath();
    pctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    pctx.fillStyle = "rgba(0,255,255,0.5)";
    pctx.fill();
  });
}
createBubbles();
animateBubbles();

// ⌨️ Add keyboard controls
document.addEventListener("keydown", function (e) {
  const active = document.activeElement;
  const isTyping = active.tagName === "INPUT" || active.tagName === "TEXTAREA";

  if (!isTyping && e.code === "Space") {
    e.preventDefault();
    playPauseBtn.click();
  }

  // Allow Arrow keys even while typing
  if (e.code === "ArrowRight") {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
  } else if (e.code === "ArrowLeft") {
    audio.currentTime = Math.max(0, audio.currentTime - 5);
  }
});

let isShuffle = false;
let playbackSpeeds = [1, 1.25, 1.5, 2];
let currentSpeedIndex = 0;

function toggleShuffle() {
  isShuffle = !isShuffle;
  const shuffleBtn = document.getElementById("shuffleBtn");
  shuffleBtn.classList.toggle("active-toggle", isShuffle);
}

// 🎵 Add audio controls Playback Speed
function toggleSpeed() {
  currentSpeedIndex = (currentSpeedIndex + 1) % playbackSpeeds.length;
  audio.playbackRate = playbackSpeeds[currentSpeedIndex];
  document.getElementById("speedBtn").textContent =
    playbackSpeeds[currentSpeedIndex] + "x";
}

// Toggle Create Panel
function togglePanel() {
  document.getElementById("createPanel").classList.toggle("hidden");
}

document.querySelectorAll('a').forEach(link => {
  if (link.textContent.includes("Add")) {
    link.addEventListener("click", togglePanel);
  }
});
// Submit Request Handler
function submitSongRequest() {
  const name = document.getElementById("reqName").value.trim();
  const songname = document.getElementById("reqSongName").value.trim();
  const artist = document.getElementById("reqSongArtist").value.trim();
  const note = document.getElementById("reqNote").value.trim();


  if (!name) return alert("🎵 Please enter a song name!");

  const message = `🎶 *New Song Request!*\n*Name:* ${name}\n*Title:* ${songname}\n*Artist:* ${artist || "N/A"}\n📝 *Note:* ${note || "None"}`;

  const botToken = "7928176624:AAFlsRrOGKBHy8rNz0QyJKIjQsewCCeP0hg";
  const chatId = "6769271388";
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown"
    })
  })
  .then(res => {
    if (res.ok) {
      alert("📬 Request sent to the Admin on Telegram!");
      document.getElementById("reqName").value = '';
      document.getElementById("reqSongName").value = '';
      document.getElementById("reqSongArtist").value = '';
      document.getElementById("reqNote").value = '';
    } else {
      alert("⚠️ Failed to send request.");
    }
  })
  .catch(err => {
    console.error(err);
    alert("❌ Error sending request.");
  });
}

// Queue Panel
let queue = [];

function addToQueue(index) {
  queue.push(index);
  updateQueueUI();
}

function clearQueue() {
  queue = [];
  updateQueueUI();
}

function updateQueueUI() {
  const panel = document.getElementById("queuePanel");
  const list = document.getElementById("queueList");

  // Always clear existing items
  list.innerHTML = "";

  if (queue.length === 0) {
    // 🔒 Hide the entire panel if queue is empty
    panel.classList.add("hidden");
    return;
  }

  // 🧾 If queue has items, show panel and render them
  panel.classList.remove("hidden");

  queue.forEach((songIndex, i) => {
    const item = document.createElement("li");
    item.textContent = `${i + 1}. ${songs[songIndex].name}`;
    list.appendChild(item);
  });
}


function playFromQueue() {
  if (queue.length > 0) {
    const nextIndex = queue.shift();
    updateQueueUI();
    playSong(nextIndex);
    return true;
  }
  return false;
}

// 🔁 Override audio.onended
audio.onended = () => {
  if (!playFromQueue()) nextSong();
};


// History

let logTimer;
audio.onplay = () => {
  audioCtx.resume().then(drawBars);
  if (logTimer) clearTimeout(logTimer);

  logTimer = setTimeout(() => {
    logSongPlay({
      id: songs[currentSong].name,
      title: songs[currentSong].name,
      artist: 'Unknown',
      duration: audio.duration || 0,
      playedAt: new Date().toISOString()
    });
  }, 30000); // Only log if 30+ seconds played
};

function logSongPlay(song) {
  const history = JSON.parse(localStorage.getItem('playbackHistory') || '[]');
  history.push({ ...song, playedAt: new Date().toISOString() });
  localStorage.setItem('playbackHistory', JSON.stringify(history));
}

logSongPlay({
  id: songs.name,
  title: song.name,
  artist: 'Unknown',
  duration: audioPlayer.duration || 0
});
