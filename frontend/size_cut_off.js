function moveToTarget() {
    var isMobile = {
        Android: function() {
             return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
             return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
             return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
             return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
             return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() ||
                    isMobile.BlackBerry() ||
                    isMobile.iOS() ||
                    isMobile.Opera() ||
                    isMobile.Windows());
        }
    };

    if (isMobile.any()) {
        //console.log("mobile");
        //location.replace("/m/");
        //$(".sorry").css({
        //    "visibility": "visible"
        //});
        location.replace("/sorry.html");
    } else {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') != -1) {
            if (ua.indexOf('chrome') > -1) {
                location.replace("/pc/");
            } else {
                location.replace("/pc_safari/");
            }
        } else {
             location.replace("/pc/");
        }

    }
}

/*
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
*/

//$(window).resize(function () {
//    size_cut_off();
//});
//size_cut_off()