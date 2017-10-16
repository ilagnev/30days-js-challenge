// console.log('start');

// select elements
const player = document.querySelector('.player');
const video = player.querySelector('video');
const playButton = player.querySelector('.play');
const progress = player.querySelector('.progress');
const progressFilled = player.querySelector('.progress-filled');
const skipButtons = player.querySelectorAll('[data-skip]');
const sliders = player.querySelectorAll('.player-slider');

// control functions
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
function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressFilled.style.flexBasis = `${percent}%`;
}
function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

// attach events
// play pause events
playButton.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('pause', togglePlayButtonText);
video.addEventListener('play', togglePlayButtonText);

// update video state
skipButtons.forEach(button => button.addEventListener('click', skip));
sliders.forEach(button => button.addEventListener('change', slidersUpdate));

// progress update
video.addEventListener('timeupdate', handleProgress);

// rewind by grab progress bar
progress.addEventListener('click', scrub);
let mousedown = false;
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
progress.addEventListener('mousemove', (e) => mousedown && setTimeout(() => scrub(e)), 100);