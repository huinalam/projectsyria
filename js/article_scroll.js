//인트로
var frameFixed = { "unfixed": 0, "fixed": 1 };

function preloader() {
    // 높이 설정
    // div로 gap을 주는 대신에, padding 값을 주었음
    $(".pre_war_article").css({
        "padding-top": (window.innerHeight / 3) * 2,
        "padding-bottom": (window.innerHeight / 3) * 1
    });
    // 처음 content의 padding-top은 0으로
    $(".pre_war_article").eq(0).css({
        "padding-top": 0
    });
}


$(document).ready(function () {
    var $window = $(window);

    preloader();

    var $pre_war_chapter_article_div = $('#pre_war_chapter_article_div');
    $pre_war_chapter_article_div.css({
        "padding-bottom": window.innerHeight / 3 * 2
    });

    var chart_width = $(".chapter_chart_div_s86").width();
    var chatper_divs = $(".pre_war_article");
    var chapter_offset_top = [];

    function set_chapter_offset() {
        for (var i = 0; i < chatper_divs.length; i++) {
            chapter_offset_top[i] = parseInt(chatper_divs.eq(i).offset().top);
        }
    }

    set_chapter_offset();

    var $pre_war_refugee_map = $('#pre_war_refugee_map');

    function pre_war_fix_chart() {
        var section_left = parseInt($pre_war_refugee_map.css("margin-left"));
        var section_top = parseInt($pre_war_refugee_map.css("margin-top"));

        $('#pre_war_fixed_chart').css({
            position: "fixed",
            top: section_top,
            left: section_left
        });

        $('#pre_war_chapter_article_div').css({
            "padding-left": chart_width
        });
    }

    function pre_war_unfix_chart() {
        $('#pre_war_fixed_chart').css({
            "position": "static"
        });
        $('#pre_war_chapter_article_div').css({
            "padding-left": 0
        });
    }

    function pre_war_unfix_chart_bottom(timeline_bottom) {
        $('#pre_war_fixed_chart').css({
            "position": "absolute",
            "top": timeline_bottom
        });
        $('#pre_war_chapter_article_div').css({
            "padding-left": chart_width
        });
    }

    var $pre_war_section_bottom = $("#pre_war_section_bottom");
    var pre_war_fixed_chart = $("#pre_war_fixed_chart");

    var pre_war_scroll_event_status = frameFixed.unfixed;
    var pre_war_scroll_event_chapter_idx = 0;
    function pre_war_scroll_event(scroll_top) {
        var timeline_bottom = parseInt($pre_war_section_bottom.offset().top) - parseInt(pre_war_fixed_chart.height());
        var section_top = parseInt($pre_war_refugee_map.css("margin-top"));
        var pre_war_refugee_map_top = parseInt($pre_war_refugee_map.offset().top) - section_top;

        // ==> start Scroll
        if (pre_war_refugee_map_top < scroll_top && timeline_bottom > scroll_top && pre_war_scroll_event_status === frameFixed.unfixed) {
            pre_war_fix_chart();
            pre_war_scroll_event_status = frameFixed.fixed;
        } else if (pre_war_scroll_event_status === frameFixed.fixed) {
            if (timeline_bottom < scroll_top) {
                pre_war_unfix_chart_bottom(timeline_bottom);
                pre_war_scroll_event_status = frameFixed.unfixed;
            } else if (pre_war_refugee_map_top > scroll_top) {
                pre_war_unfix_chart();
                pre_war_scroll_event_status = frameFixed.unfixed;
            }
        }
        // <== end Scroll
        // ==> start chapter
        for (var idx = chapter_offset_top.length - 1; idx >= 1; idx--) {
            if (chapter_offset_top[idx] < scroll_top) {
                if (pre_war_scroll_event_chapter_idx === idx)
                    return;
                // *****************
                // 2번째 챕터 이벤트
                // *****************
                intro_popYear(chapter_list[idx]);
                pre_war_scroll_event_chapter_idx = idx;
                break;
            }
        }
        if (chapter_offset_top[1] > scroll_top) {
            if (pre_war_scroll_event_chapter_idx === 0)
                return;
            // *****************
            // 첫번째 챕터 이벤트
            // *****************
            intro_popYear(chapter_list[0]);
            pre_war_scroll_event_chapter_idx = 0;
            return;
        }
        // <== end chapter
    }


    //** ON_SCROLL EVENT **// prewar scroll event control
    $window.on('scroll', function () {
        var scroll_top = $window.scrollTop();

        pre_war_scroll_event(scroll_top);
    });

    $window.resize(function () {
        set_chapter_offset();

        var scroll_top = $window.scrollTop();
        var timeline_bottom = parseInt($pre_war_section_bottom.offset().top) - parseInt(pre_war_fixed_chart.height());
        var pre_war_refugee_map_top = parseInt($pre_war_refugee_map.offset().top);

        // ==> start Scroll
        if (pre_war_refugee_map_top < scroll_top && timeline_bottom > scroll_top) {
            pre_war_fix_chart();
        } else {
            if (timeline_bottom < scroll_top) {
                pre_war_unfix_chart_bottom(timeline_bottom);
            } else {
                pre_war_unfix_chart();
            }
        }
    });

});

$(document).ready(function () {
    //return;
    var $window = $(window);

    /******************************/
    /********* GDP 이밴트  *********/
    /******************************/
    /** EVENT HANDLER **/
    $(".gdp_div_textCol").on("click", function () {
        var classfy = $(this).attr('class').split(/\s+/);
        switch (classfy[1]) {
            case "gdp_year_button2011":
                scatterTransition(2011);
                $(".gdp_div_textCol").eq(0).css("opacity", 1);
                $(".gdp_div_textCol").not(':eq(0)').css("opacity", 0.5);
                break;
            case "gdp_year_button2012":
                scatterTransition(2012);
                $(".gdp_div_textCol").eq(1).css("opacity", 1);
                $(".gdp_div_textCol").not(':eq(1)').css("opacity", 0.5);
                break;
            case "gdp_year_button2013":
                scatterTransition(2013);
                $(".gdp_div_textCol").eq(2).css("opacity", 1);
                $(".gdp_div_textCol").not(':eq(2)').css("opacity", 0.5);
                break;
            case "gdp_year_button2014":
                scatterTransition(2014);
                $(".gdp_div_textCol").eq(3).css("opacity", 1);
                $(".gdp_div_textCol").not(':eq(3)').css("opacity", 0.5);
                break;
        }
    });

    var $refugee_map = $('#refugee_map');
    var $map_div_map = $('.map_div_map');
    var $fixed_graph = $('#fixed_graph');
    var $fixed_chart = $('#fixed_chart');
    var $map_div_article = $('#map_div_article');
    var chatper_divs = $(".chapter_article");

    /** REFUGEE MAP SECTION SET POSITION **/
    function section1_setposition() {
        var section_offset = parseInt($refugee_map.offset().top);
        var section_left = parseInt($refugee_map.css("margin-left"));
        var section_top = parseInt($refugee_map.css("margin-top"));
        var map_width = parseInt($map_div_map.css("width"));
        var map_years_height = parseInt($map_div_map.css("height"));

        $(".map_div_linegraph").css({
            "left": section_left + map_width,
            "top": section_offset + section_top + map_years_height
        });
        $(".map_div_article").css({
            "left": section_left + map_width,
            "top": section_offset + section_top + map_years_height
        });
    }
    section1_setposition();


    /******************************/
    /******* timeline 이밴트 *******/
    /******************************/
    // 높이 설정
    // div로 gap을 주는 대신에, padding 값을 주었음
    $(".chapter_article").css({
        "padding-top": window.innerHeight / 2,
        "padding-bottom": window.innerHeight / 2
    });
    // 처음 content의 padding-top은 0으로
    $(".chapter_article").eq(0).css({
        "padding-top": 0
    });

    //fixed_chart
    //fixed_graph
    var chart_width = $fixed_chart.width();
    var chapter_offset_top = [];
    for (var i = 0; i < chatper_divs.length; i++) {
        chapter_offset_top[i] = parseInt(chatper_divs.eq(i).offset().top);
    }
    // 초기 고정
    $('#map_div_article').css({
        "padding-left": chart_width
    });


    function fix_chart() {
        var section_left = parseInt($refugee_map.css("margin-left"));
        var section_top = parseInt($refugee_map.css("margin-top"));

        $fixed_graph.css({
            position: "fixed",
            top: section_top
            //"padding-left": chart_width + 30 // 마진 값 30
        });

        $fixed_chart.css({
            position: "fixed",
            top: section_top,
            left: section_left + 8
        });

        $map_div_article.css({
            "padding-left": chart_width
        });
    }

    function unfix_chart() {
        $fixed_graph.css({
            "position": "absolute",
            "top": $refugee_map.offset().top
        });
        $fixed_chart.css({
            "position": "absolute",
            "top": $refugee_map.offset().top
        });
    }

    function unfix_chart_bottom(timeline_bottom) {
        $fixed_graph.css({
            "position": "absolute",
            "top": timeline_bottom
        });
        $fixed_chart.css({
            "position": "absolute",
            "top": timeline_bottom
        });
    }

    var rms_section_bottom = $("#rms_section_bottom");

    function scroll_event() {
        var scroll_top = $window.scrollTop();
        var timeline_bottom = parseInt(rms_section_bottom.offset().top) - parseInt($fixed_chart.height());
        var timeline_top = parseInt($refugee_map.offset().top);
        // ==> start Scroll
        if (timeline_top < scroll_top && timeline_bottom > scroll_top) {
            //console.log("fix_chart");
            fix_chart();
        } else {
            if (timeline_bottom < scroll_top) {
                //console.log("unFix bottom");
                unfix_chart_bottom(timeline_bottom);
            } else {
                //console.log("unfix_chart");
                unfix_chart();
            }
        }
        // <== end Scroll
        // ==> start chapter
        for (var idx = chapter_offset_top.length - 1; idx >= 1; idx--) {
            if (chapter_offset_top[idx] < scroll_top) {
                mapTransition((2011 + idx));
                pieTransition(2011 + idx);
                total_numTransition(2011 + idx);
                lineTransition(2011 + idx);
                // *****************
                // 2번째 챕터 이벤트
                // *****************
                //console.log("event : " + idx);
                //intro_popYear(chapter_list[idx]);
                break;
            }
        }
        if (chapter_offset_top[1] > scroll_top) {
            mapTransition((2011 + idx));
            pieTransition(2011 + idx);
            total_numTransition(2011 + idx);
            lineTransition(2011 + idx);
            // *****************
            // 첫번째 챕터 이벤트
            // *****************
            //console.log("first event");
            //intro_popYear(chapter_list[0]);
            return;
        }
        // <== end chapter
    }


    /******************************/
    /******* Window 이밴트  ********/
    /******************************/
    $window.resize(function () {
        section1_setposition();

        var scroll_top = $window.scrollTop();
        var timeline_bottom = parseInt(rms_section_bottom.offset().top) - parseInt($fixed_chart.height());
        var timeline_top = parseInt($refugee_map.offset().top);
        // ==> start Scroll
        if (timeline_top < scroll_top && timeline_bottom > scroll_top) {
            //console.log("fix_chart");
            fix_chart();
        } else {
            if (timeline_bottom < scroll_top) {
                //console.log("unFix bottom");
                unfix_chart_bottom(timeline_bottom);
            } else {
                //console.log("unfix_chart");
                unfix_chart();
            }
        }

        resize_refugeeMap();
    });

    //** ON_SCROLL EVENT **//
    $window.on('scroll', function () {
        scroll_event();
    });
});

$(document).ready(function () {
    retrun;
    var $window = $(window);

    /** CHAPTER TITLE SETTING **/
    function chapter_title_size_setting() {
        // div로 gap을 주는 대신에, padding 값을 주었음
        //$(".timeline_div_articleGap").css("height", window.innerHeight);
        $(".timeline_div_article_content").css({
            "padding-top": (window.innerHeight / 3) * 2,
            "padding-bottom": (window.innerHeight / 3) * 1
        });
        // 처음 content의 padding-top은 0으로
        $(".timeline_div_article_content").eq(0).css({
            "padding-top": 0
        });
    }
    chapter_title_size_setting();

    var c4 = $("#c4");
    var $timeline_div = $("#timeline_div");
    var $timeline = $("#timeline");
    var $timeline_article = $("#timeline_article");

    $window.resize(function () {
        var scroll_top = $window.scrollTop();
        var timeline_bottom = parseInt(c4.offset().top) - parseInt($timeline_div.height());
        var timeline_top = parseInt($timeline.offset().top);

        timeline_resize();
        //console.log("timeline_bottom : " + timeline_bottom + " // scroll_top : " + scroll_top);

        // ==> start Scroll
        if (timeline_top < scroll_top && timeline_bottom > scroll_top) {
            //console.log("fix top");
            section3_fix();
        } else {
            if (timeline_bottom < scroll_top) {
                var sectionLeft = parseInt($timeline.css("margin-left"));
                //console.log("unFix bottom");
                $timeline_div.css({
                    position: "absolute",
                    top: timeline_bottom,
                    left: sectionLeft
                });
            } else {
                //console.log("unFix top");
                section3_unFix_top();
            }
        }

    });

    /** TIMELINE SECTION SETPOSITION **/
    function section3_fix() {
        var section_left = parseInt($timeline.css("margin-left"));
        var section_top = parseInt($timeline.css("margin-top"));
        var timeline_width = parseInt($timeline_div.css("width"));

        $timeline_div.css({
            position: "fixed",
            top: section_top,
            left: section_left
        });
        console.log(timeline_width);

        $timeline_article.css({
            "padding-left": timeline_width, // padding값을 timeline width값으로 수정했음.(사이즈 변경시 고려)
            width: "auto"
        });
    }

    function section3_unFix_top() {
        $timeline_div.css("position", "static");
        $timeline_article.css({
            "padding-left": 0,
            width: 420
        });
    }


    var chatper_divs = $(".timeline_div_article_content");
    var chapter_offset_top = [];
    var valid_value = 0;

    function set_chapter_offset_top() {
        for (var i = 0; i < chatper_divs.length; i++) {
            chapter_offset_top[i] = parseInt(chatper_divs.eq(i).offset().top);
            // 연산을 줄이기 위해 중간에 취소
            if ((i === 0) && (valid_value === chapter_offset_top[i])) {
                break;
            }
            console.log("chapter_offset_top[" + i + "] : " + chapter_offset_top[i]);
        }
        valid_value = chapter_offset_top[0];
        //console.log("valid_value : " + valid_value);
    }

    set_chapter_offset_top();

    //** ON_SCROLL EVENT **//
    $window.on('scroll', function () {
        var scroll_top = $window.scrollTop();

        var timeline_bottom = parseInt(c4.offset().top) - parseInt($timeline_div.height());
        var timeline_top = parseInt($timeline.offset().top);

        set_chapter_offset_top();
        //console.log("timeline_bottom : " + timeline_bottom + " // scroll_top : " + scroll_top);

        // ==> start Scroll
        if (timeline_top < scroll_top &&
            timeline_bottom > scroll_top) {
            //console.log("fix top");
            section3_fix();
        } else {
            if (timeline_bottom < scroll_top) {
                var sectionLeft = parseInt($('#timeline').css("margin-left"));
                //console.log("unFix bottom");
                $timeline_div.css({
                    position: "absolute",
                    top: timeline_bottom,
                    left: sectionLeft
                });
            } else {
                //console.log("unFix top");
                section3_unFix_top();
            }
        }
        // <== end Scroll
        // ==> start chapter
        for (var idx = chapter_offset_top.length - 1; idx >= 1; idx--) {
            if (chapter_offset_top[idx] < scroll_top) {
                //console.log("chapter idx : " + idx);
                // *****************
                // 여기다가 챕터에 따른 이벤트를 넣으세요
                // *****************
                chapter_move(idx + 2);
                break;
            }
        }
        if (chapter_offset_top[1] > scroll_top) {
            //console.log("chapter_offset_top[1] > scroll_top");
            chapter_move(2);
            return;
        }
        // <== end chapter
    });
});
