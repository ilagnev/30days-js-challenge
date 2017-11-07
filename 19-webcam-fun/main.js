const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip .photos');
const snap = document.querySelector('.snap');
const filters = document.querySelectorAll('input[name=filter]');

/**
 * Start webcam stream
 */

// v1 with promises
// getVideo().then(() => paintToCanvas())

// v2 with event
getVideo();
video.addEventListener('canplay', paintToCanvas);

// request for webcam media stream and put it to video element
function getVideo(cb) {
    return navigator.mediaDevices.getUserMedia({video: true, sound: false})
        .then(stream => {
            // console.log(stream);
            video.src = window.URL.createObjectURL(stream);
            return video.play()
        })
        .catch(err => console.error('no camera allowed?', err));
}

let filterName;
let filterFunc = function(){};
[...filters].forEach(i => i.addEventListener('change', (e) => {
    filterName = i.value
    if (typeof this[filterName] === 'function')
        filterFunc = this[filterName];
}))

// update canvas with image from video
function paintToCanvas() {
    const {videoWidth: width, videoHeight: height} = video;
    canvas.width = width;
    canvas.height = height;

    // todo: use requestAnimationFrame()
    return setInterval(() => {
        // put to canvas data from video element
        ctx.drawImage(video, 0, 0, width, height);

        // get image pixels array from current canvas state
        let pixels = ctx.getImageData(0, 0, width, height);
        
        // apply effect to pixels data
        // console.log(filterName, filterFunc);
        filterFunc(pixels, ctx);

        // update canvas
        ctx.putImageData(pixels, 0, 0);
    }, 50);
}


/**
 * Take photo snap function
 */
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


/**
 * Filters functions
 */

function noEffect() {}

function highEffect(pixels, ctx) {
    ctx.globalAlpha = .2;
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i    ] = pixels.data[i    ] + 100;
        pixels.data[i + 1] = pixels.data[i + 1] - 100;
        pixels.data[i + 2] = pixels.data[i + 2] * .5;
    }
}

//todo: will be more effective if we walk up to down by image
//todo: not left to right, i guess
function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 200 + 0] = pixels.data[i    ];
        // pixels.data[i + 1] = pixels.data[i + 1];
        pixels.data[i + 200 + 2] = pixels.data[i + 2];
    }
}

// get rgb levels values for "greenScreen" filter
const levels = {};
const levelInputs = document.querySelectorAll('.rgb input');
const updateLevels = () => [...levelInputs].forEach(input => levels[input.name] = input.value);
[...levelInputs].forEach(input => input.addEventListener('change', updateLevels));
updateLevels();

// green screen filter
function greenScreen(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        // if red and green and blue color of the pixel
        // in range of levels, then make it transparent
        if (
            // red channel
               ( pixels.data[i] >= levels.rmin
            && pixels.data[i] < levels.rmax)
            // green channel
            || ( pixels.data[i + 1] >= levels.gmin
                && pixels.data[i + 1] < levels.gmax)
            // blue channel
            || ( pixels.data[i + 2] >= levels.bmin
                && pixels.data[i + 2] < levels.bmax)
        ) {
            // set alpha channel
            pixels.data[i + 3] = 0;
        }
    }
}
