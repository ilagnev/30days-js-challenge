const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

//
function getVideo(cb) {
    return navigator.mediaDevices.getUserMedia({video: true, sound: false})
        .then(stream => {
            // console.log(stream);
            video.src = window.URL.createObjectURL(stream);
            return video.play()
        })
        .catch(err => console.error('no camera allowed?', err));
}

// update canvas with image from video
function paintToCanvas() {
    const {videoWidth: width, videoHeight: height} = video;
    canvas.width = width;
    canvas.height = height;

    // todo: use requestAnimationFrame()
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
    }, 50);
}

function takePhoto() {
    // play sound
    snap.currentTime = 0;
    snap.play();
    // get canvas data and create image
    const imgData = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'cam-image';
    link.innerHTML = `<img src="${imgData}">`;
    strip.insertBefore(link, strip.firstChild);
}

// v1 with promises
// getVideo().then(() => paintToCanvas())

// v2 with event
getVideo();
video.addEventListener('canplay', paintToCanvas);
