document.getElementById("menuToggle").onclick = function () {
  const menu = document.getElementById("hiddenMenu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
};

const songs = [
  { name: "Sajni", src: "songs/Sajni.mp3", cover: "covers/Sajni.png" },
  { name: "Faded", src: "songs/Faded.mp3", cover: "covers/Faded.png" },
  { name: "Tere Bina", src: "songs/Tere Bina.mp3", cover: "covers/Tere Bina.png" },
  { name: "Kissik", src: "songs/Kissik.mp3", cover: "covers/Kissik.png" },
  { name: "Tere Bina - Haseena Parkar", src: "songs/Tere Bina - Haseena Parkar.mp3", cover: "covers/Tere Bina - Haseena Parkar.png" },
  { name: "On My Way", src: "songs/On My Way.mp3", cover: "covers/On My Way.png" },
  { name: "Tera Hone Laga Hoon", src: "songs/Tera Hone Laga Hoon.mp3", cover: "covers/Tera Hone Laga Hoon.png" },
  { name: "Sooraj Hi Chhaon Banke", src: "songs/Sooraj Hi Chhaon banke.mp3", cover: "covers/Sooraj Hi Chhaon banke.png" },
  { name: "Bin Tere - I Hate Luv Story", src: "songs/Bin Tere - I Hate Luv Story.mp3", cover: "covers/Bin Tere - I Hate Luv Story.png" },
  { name: "Team India Hain Hum", src: "songs/Team India Hain Hum.mp3", cover: "covers/Team India Hain Hum.png" },
  { name: "Tu Hai Champion", src: "songs/Tu Hai Champion.mp3", cover: "covers/Tu Hai Champion.png" },
  { name: "Tere Bina - Shorgul", src: "songs/Tere Bina - Shorgul.mp3", cover: "covers/Tere Bina - Shorgul.png" },
  { name: "Bulleya", src: "songs/Bulleya.mp3", cover: "covers/Bulleya.png" },
  { name: "Tere Bina - Mausam Ikrar ke Do Pal Pyar Ke", src: "songs/Tere Bina - Mausam Ikrar ke Do Pal Pyar Ke.mp3", cover: "covers/Tere Bina - Mausam Ikrar ke Do Pal Pyar Ke.png" },
  { name: "Ajab Si", src: "songs/Ajab Si.mp3", cover: "covers/Ajab Si.png" },
  { name: "Bin Tere", src: "songs/Bin Tere.mp3", cover: "covers/Bin Tere.png" },
  { name: "Dil Haaraa", src: "songs/Dil Haaraa.mp3", cover: "covers/Dil Haaraa.png" },
  { name: "Jugraafiya", src: "songs/Jugraafiya.mp3", cover: "covers/Jugraafiya.png" },
  { name: "O Rangrez", src: "songs/O Rangrez.mp3", cover: "covers/O Rangrez.png" },
  { name: "Bin Tere Bin", src: "songs/Bin Tere Bin.mp3", cover: "covers/Bin Tere Bin.png" }
];

let currentSong = 0, repeatMode = "none";
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
    <div class="progress"><span id="bar-${i}"></span></div>`;
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
  playPauseBtn.textContent = "⏸";
}

playPauseBtn.onclick = () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸";
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶";
  }
};

function nextSong() {
  if (repeatMode === "one") return playSong(currentSong);
  currentSong = (currentSong + 1) % songs.length;
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
    seekBar.value = progress;
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

repeatBtn.onclick = function () {
  if (repeatMode === "none") {
    repeatMode = "all";
    repeatBtn.textContent = "🔂";
  } else if (repeatMode === "all") {
    repeatMode = "one";
    repeatBtn.textContent = "🔁";
  } else {
    repeatMode = "none";
    repeatBtn.textContent = "🔁";
  }
};

audio.onended = () => nextSong();

document.getElementById("searchBar").oninput = function () {
  const val = this.value.toLowerCase();
  document.querySelectorAll(".card").forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(val) ? "block" : "none";
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
  bubbleArr.forEach(b => {
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
