// console.log('start');

// select elements
const player = document.querySelector('.player');
const video = player.querySelector('video');
const playButton = player.querySelector('.play');
const progress = player.querySelector('.progress');
const progressFilled = player.querySelector('.progress-filled');
const skipButtons = player.querySelectorAll('[data-skip]');
const sliders = player.querySelectorAll('.player-slider');

// define functions
function togglePlay() {
    video.paused ? video.play() : video.pause();
}
function togglePlayButtonText() {
    playButton.textContent = this.paused ? '▶︎' : '||';
}
function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}
function slidersUpdate() {
    video[this.name] = this.value;
}

// attach events
video.addEventListener('click', togglePlay);
video.addEventListener('pause', togglePlayButtonText);
video.addEventListener('play', togglePlayButtonText);

playButton.addEventListener('click', togglePlay);

skipButtons.forEach(button => button.addEventListener('click', skip));
sliders.forEach(button => button.addEventListener('change', slidersUpdate));