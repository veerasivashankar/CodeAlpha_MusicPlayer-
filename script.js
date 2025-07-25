const songs = [
  { name: "believer.mp3", title: "Believer", artist: "Imagine Dragons", cover: "covers/believer.jpeg" },
  { name: "shape-of-you.mp3", title: "Shape of You", artist: "Ed Sheeran", cover: "covers/shape-of-you.jpeg" },
  { name: "thunder.mp3", title: "Thunder", artist: "Arctic Monkeys", cover: "covers/thunder.jpeg" },
  { name: "love-me-like-u-do.mp3", title: "Love Me Like You Do", artist: "Ellie Goulding", cover: "covers/love-me-like-u-do.jpeg" },
  { name: "i-wanna-be-yours.mp3", title: "I Wanna Be Yours", artist: "Arctic Monkeys", cover: "covers/i-wanna-be-yours.jpeg" },
  { name: "Love-Is-Gone.mp3", title: "Love Is Gone", artist: "SLANDER", cover: "covers/Love-Is-Gone.jpeg" },
  { name: "halo.mp3", title: "Halo", artist: "Beyonce", cover: "covers/halo.jpeg" }
];

let songIndex = 0;
const audio = document.getElementById("audio");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const coverEl = document.getElementById("cover");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressBar = document.getElementById("progress");
const progressArea = document.getElementById("progress-container");
const volumeSlider = document.getElementById("volume");
const waveAnimation = document.querySelector(".wave-animation");
const songListEl = document.getElementById("songList");
const autoplayToggle = document.getElementById("autoplayToggle");
const togglePlaylistBtn = document.getElementById("togglePlaylist");
const playlistPanel = document.getElementById("playlistPanel");

function loadSong(song) {
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  coverEl.src = song.cover;
  audio.src = "music/" + song.name;
}

function playSong() {
  audio.play();
  playBtn.innerHTML = "⏸";
  waveAnimation.classList.remove("paused");
}

function pauseSong() {
  audio.pause();
  playBtn.innerHTML = "▶";
  waveAnimation.classList.add("paused");
}

function updatePlaylistUI() {
  songListEl.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} — ${song.artist}`;
    li.style.padding = "8px 12px";
    li.style.cursor = "pointer";
    li.style.borderRadius = "6px";
    li.style.marginBottom = "6px";
    li.style.background = index === songIndex ? "#FFB34733" : "transparent";
    li.onclick = () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong();
      updatePlaylistUI();
    };
    songListEl.appendChild(li);
  });
}

playBtn.addEventListener("click", () => audio.paused ? playSong() : pauseSong());

nextBtn.addEventListener("click", () => {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
  updatePlaylistUI();
});

prevBtn.addEventListener("click", () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
  updatePlaylistUI();
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = percent + "%";
});

progressArea.addEventListener("click", (e) => {
  const width = progressArea.clientWidth;
  audio.currentTime = (e.offsetX / width) * audio.duration;
});

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

audio.addEventListener("ended", () => {
  if (document.getElementById("autoplayToggle").checked) {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
    audio.play().then(() => {
      playBtn.innerHTML = "⏸";
      waveAnimation.classList.remove("paused");
    }).catch(err => {
      console.warn("Autoplay blocked", err);
    });
  }
});


togglePlaylistBtn.addEventListener("click", () => {
  playlistPanel.classList.toggle("visible");
});

loadSong(songs[songIndex]);
updatePlaylistUI();
