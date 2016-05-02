function size_cut_off() {
    //console.log("size changed");
    //console.log("screen :" + screen.width + " // " + screen.height);
    if (screen.width < 1200 || screen.height < 700) {
        $(".sorry").css({
            "visibility": "visible"
        });
    } else {
        $(".sorry").css({
            "visibility": "hidden"
        });
    }
}

$(window).resize(function () {
    size_cut_off();
});
size_cut_off()