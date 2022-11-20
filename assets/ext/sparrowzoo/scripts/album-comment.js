var imageSwitch = new ImageSwitch("imageSwitch");
document.ready(function() {
	imageSwitch.config.containerId = "phototab1";
	imageSwitch.config.containerWidth = 750;
	imageSwitch.config.containerHeight =450;
	imageSwitch.config.img.show = true;
	imageSwitch.config.img.width=80;
	imageSwitch.config.img.height=80;
	imageSwitch.config.count.dvalue=8;
	imageSwitch.init();
	imageSwitch.play();
});