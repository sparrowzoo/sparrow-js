var imageSwitch = new ImageSwitch("imageSwitch");
var imageSwitch2 = new ImageSwitch("imageSwitch2");
document.ready(function () {
    imageSwitch.config.containerId = "phototab1";
    imageSwitch.config.containerWidth = 0;
    imageSwitch.config.containerHeight = 250;
    imageSwitch.config.summaryHeight = 0;
    imageSwitch.config.playInterval = 8000;
    //imageSwitch.config.img.show=true;
    imageSwitch.init();
    imageSwitch.play();


    imageSwitch2.config.containerId = "phototab2";
    imageSwitch2.config.containerWidth = 350;
    imageSwitch2.config.containerHeight = 280;
    imageSwitch2.config.summaryHeight = 0;
    imageSwitch2.config.playInterval = 3000;
    //控制图片的尺寸 （是否显示）
    imageSwitch2.config.img.show = true;
    imageSwitch2.config.img.width = 20;
    imageSwitch2.config.img.height = 80;
    imageSwitch2.init();
    imageSwitch2.play();
    //滚动
    $("#divMarque").marque(0, 2, 80);

    $("#tab1").tabs();
    $("#tab3").tabs();
    $("#tab4").tabs();

    $.user.initLoginBar();

    $("son.li.interlace_container").each(function (i) {
        $(this).interlace();
    });
});