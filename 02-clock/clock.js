const hands = {
    "seconds": document.querySelector('#seconds-hand'),
    "minutes": document.querySelector('#minutes-hand'),
    "hours": document.querySelector('#hours-hand'),
};

function clockTick() {
    const now = new Date();

    const secondsDegrees = (now.getSeconds() / 60 * 360) + 90;
    hands.seconds.style.transform = `rotate(${secondsDegrees}deg)`;

    const minutesDegrees = (now.getMinutes() / 60 * 360) + 90;
    hands.minutes.style.transform = `rotate(${minutesDegrees}deg)`;

    const hoursDegrees = (now.getHours() / 12 * 360) + 90;
    hands.hours.style.transform = `rotate(${hoursDegrees}deg)`;
}
clockTick();
setInterval(clockTick, 1000);
