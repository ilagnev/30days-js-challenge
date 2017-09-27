console.log('inited');

const panels = document.querySelectorAll('.panel');
panels.forEach(panel => {
	panel.addEventListener('click', panelToggled);
	panel.addEventListener('transitionend', transitionEnded);
});

function panelToggled () {
	this.classList.toggle('opened');
}
function transitionEnded(e) {
	console.log(e.propertyName);
}