/* ========= SONG DATA ========= */
console.log("SCRIPT LOADED");

const songs = [
    { title: "Thunder", artist: "Imagine Dragons", src: "audio/audio1.mp3", cover: "covers/cover1.jpeg", duration: "3:24" },
    { title: "Daisies", artist: "Justin Bieber", src: "audio/audio2.mp3", cover: "covers/cover2.png", duration: "2:56" },
    { title: "Jeena Jeena", artist: "Atif Aslam", src: "audio/audio3.mp3", cover: "covers/cover3.jpeg", duration: "3:49" },
    { title: "Gehra Hua", artist: "Arijit Singh", src: "audio/audio4.mp3", cover: "covers/cover4.jpeg", duration: "4:02" },
    { title: "Track Five", artist: "Artist 5", src: "audio/audio5.mp3", cover: "covers/cover5.jpg", duration: "3:10" },
    { title: "Track Six", artist: "Artist 6", src: "audio/audio6.mp3", cover: "covers/cover6.jpg", duration: "3:45" },
    { title: "Track Seven", artist: "Artist 7", src: "audio/audio7.mp3", cover: "covers/cover7.jpg", duration: "4:01" },
    { title: "Track Eight", artist: "Artist 8", src: "audio/audio8.mp3", cover: "covers/cover8.jpg", duration: "3:30" }
];

/* ========= STATE ========= */
let currentIndex = Number(localStorage.getItem("lastSong")) || 0;
let isShuffle = false;
let isRepeat = false;

/* ========= ELEMENTS ========= */
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volume = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");
const playBtn = document.getElementById("playBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

/* ========= LOAD SONG ========= */
function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    cover.src = song.cover;
    title.textContent = song.title;
    artist.textContent = song.artist;
    durationEl.textContent = song.duration;

    document.body.style.setProperty("--bg-image", `url(${song.cover})`);
    localStorage.setItem("lastSong", index);

    renderPlaylist();
}

/* ========= PLAY / PAUSE ========= */
function playPause() {
    if (audio.paused) {
        audio.play();
        playBtn.classList.add("playing");
        setEQState(true);
    } else {
        audio.pause();
        playBtn.classList.remove("playing");
        setEQState(false);
    }
}

/* ========= NEXT ========= */
function nextSong() {
    if (isShuffle) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === currentIndex);
        currentIndex = randomIndex;
    } else {
        currentIndex = (currentIndex + 1) % songs.length;
    }

    loadSong(currentIndex);
    audio.currentTime = 0;
    audio.play();
    playBtn.classList.add("playing");
    setEQState(true);
}
/* ========= PREVIOUS ========= */
function prevSong() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
    audio.play();
    playBtn.classList.add("playing");
    setEQState(true);
}
/* ========= AUDIO END ========= */
audio.addEventListener("ended", () => {
    if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextSong();
    }
});
/* ========= PROGRESS ========= */
audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration)) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});
progress.addEventListener("input", () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});
/* ========= VOLUME ========= */
volume.addEventListener("input", () => {
    audio.volume = volume.value;
});
/* ========= FORMAT TIME ========= */
function formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
}
/* ========= PLAYLIST + EQ ========= */
function renderPlaylist() {
    playlistEl.innerHTML = "";
    songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${song.cover}" class="playlist-cover">
            <div class="playlist-info">
                <strong>${song.title}</strong>
                <span>${song.artist}</span>
            </div>
            <span class="track-time">${song.duration}</span>
            <div class="mini-eq">
                <span></span><span></span><span></span>
            </div>
        `;
        if (index === currentIndex) li.classList.add("active");

        li.onclick = () => {
            currentIndex = index;
            loadSong(index);
            audio.play();
            playBtn.classList.add("playing");
            setEQState(true);
        };
        playlistEl.appendChild(li);
    });
}
/* ========= EQ CONTROL ========= */
function setEQState(isPlaying) {
    document.querySelectorAll(".playlist li").forEach((li, i) => {
        li.classList.toggle("playing", i === currentIndex && isPlaying);
    });
}
/* ========= SHUFFLE / REPEAT (ONLY ONCE!) ========= */
shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active", isShuffle);
});
repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle("active", isRepeat);
});
/* ========= INIT ========= */
loadSong(currentIndex);
audio.volume = 0.6;
volume.value = 0.6;