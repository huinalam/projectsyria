
//인트로
var frameStatus = { "unfixed": 0, "fixed": 1 };

function preloader() {
    // 높이 설정
    // div로 gap을 주는 대신에, padding 값을 주었음
    $(".pre_war_article").css({
        "padding-top": (window.innerHeight / 3) * 2,
        "padding-bottom": (window.innerHeight / 3) * 1
    });
    // 처음 content의 padding-top은 0으로
    $(".pre_war_article").eq(0).css({
        "padding-top": window.innerHeight / 4
    });
    $(".pre_war_article").eq(3).css({
        "padding-bottom": 0
    });
}

//** Chapter 1: "Syrian Refugee before Civil War" **//
//**************************************************//

$(document).ready(function () {
    var $window = $(window);

    preloader();

    var $pre_war_chapter_article_div = $('#pre_war_chapter_article_div');
    $pre_war_chapter_article_div.css({
        "padding-bottom": window.innerHeight / 3 * 2
    });

    var chart_width = $(".chapter_chart_div_s86").width();
    var chapter_divs = $(".pre_war_article");
    var chapter_offset_top = [];

    function set_chapter_offset() {
        for (var i = 0; i < chapter_divs.length; i++) {
            chapter_offset_top[i] = parseInt(chapter_divs.eq(i).offset().top);
        }
    }

    set_chapter_offset();

    var $pre_war_refugee_map = $('#pre_war_refugee_map');

    function pre_war_fix_chart() {
        var section_left = parseInt($pre_war_refugee_map.offset().left);
        var section_top = parseInt($pre_war_refugee_map.css("margin-top"));

        $('#pre_war_fixed_chart').css({
            position: "fixed",
            top: section_top,
            left: section_left
        });

        var chart = document.getElementById("pre_war_fixed_chart");
        chart.style.left = section_left + "px";

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

    function pre_war_unfix_chart_bottom(chapter_bottom) {
        $('#pre_war_fixed_chart').css({
            "position": "absolute",
            "top": chapter_bottom
        });
        $('#pre_war_chapter_article_div').css({
            "padding-left": chart_width
        });
    }

    var $pre_war_section_bottom = $("#pre_war_section_bottom");
    var pre_war_fixed_chart = $("#pre_war_fixed_chart");

    var pre_war_scroll_event_status = frameStatus.unfixed;
    var pre_war_scroll_event_chapter_idx = 0;
    function pre_war_scroll_event(scroll_top) {
        var chapter_bottom = parseInt($pre_war_section_bottom.offset().top) - parseInt(pre_war_fixed_chart.height());
        var section_top = parseInt($pre_war_refugee_map.css("margin-top"));
        var pre_war_refugee_map_top = parseInt($pre_war_refugee_map.offset().top) - section_top;

        // ==> start Scroll
        if (pre_war_refugee_map_top < scroll_top && chapter_bottom > scroll_top && pre_war_scroll_event_status === frameStatus.unfixed) {
            pre_war_fix_chart();
            pre_war_scroll_event_status = frameStatus.fixed;
        } else if (pre_war_scroll_event_status === frameStatus.fixed) {
            if (chapter_bottom < scroll_top) {
                pre_war_unfix_chart_bottom(chapter_bottom);
                pre_war_scroll_event_status = frameStatus.unfixed;
            } else if (pre_war_refugee_map_top > scroll_top) {
                pre_war_unfix_chart();
                pre_war_scroll_event_status = frameStatus.unfixed;
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
        var chapter_bottom = parseInt($pre_war_section_bottom.offset().top) - parseInt(pre_war_fixed_chart.height());
        var pre_war_refugee_map_top = parseInt($pre_war_refugee_map.offset().top);

        // ==> start Scroll
        if (pre_war_refugee_map_top < scroll_top && chapter_bottom > scroll_top) {
            pre_war_fix_chart();
        } else {
            if (chapter_bottom < scroll_top) {
                pre_war_unfix_chart_bottom(chapter_bottom);
            } else {
                pre_war_unfix_chart();
            }
        }
    });
});



//** Chapter 2: "Syrian Refugee Distribution" **//
//**********************************************//

$(document).ready(function () {
    //return;
    var $window = $(window);

    var $refugee_map = $('#refugee_map');
  //  var $map_div_map = $('.map_div_map');
    var $fixed_graph = $('#fixed_graph');
    var $fixed_chart = $('#fixed_chart');
    var $map_div_article = $('.map_article_col');
    var chapter_divs = $(".map_article");
    var chapter_offset_top = [];

    /** REFUGEE MAP SECTION SET POSITION **/
    function section1_setposition() {
        var section_offset = parseInt($refugee_map.offset().top);
        var section_left = parseInt($refugee_map.css("margin-left"));
        var section_top = parseInt($refugee_map.css("margin-top"));
        var map_width = parseInt($fixed_chart.css("width"));
        var map_years_height = parseInt($fixed_chart.css("height"));

        $(".map_div_linegraph").css({
            "left": section_left + map_width, 
            "top": section_offset + section_top + 190 
        });
        $(".map_article_col").css({
            "left": section_left + map_width,
            "top": section_offset + section_top + map_years_height + 190
        });
        // div로 gap을 주는 대신에, padding 값을 주었음
        $(".map_article").css({
            "padding-top": 4*(window.innerHeight) / 5,
            "padding-bottom": window.innerHeight / 5,
            "padding-left": map_width
        });
        $(".map_article").eq(3).css({
            "padding-bottom": 4*(window.innerHeight) / 5 //마지막 단락은 다음 챕터 간격을 위해 더넓
        });
    }
    section1_setposition();


    /******************************/
    /******* timeline 이밴트 *******/
    /******************************/
    // 높이 설정
    
    // 처음 content의 padding-top은 0으로
    /*$(".map_article").eq(0).css({
        "padding-top": window.innerHeight / 4
    });*/




    function fix_chart() {
        var section_left = parseInt($refugee_map.offset().left);
        var section_top = parseInt($refugee_map.css("margin-top"));
        var chart_width = $fixed_chart.width();

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

        //*고정한다음에 offset을 정해야함
        for (var i = 0; i < chapter_divs.length; i++) {
            chapter_offset_top[i] = parseInt(chapter_divs.eq(i).offset().top);
        }
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

    function unfix_chart_bottom(chapter_bottom) {
        $fixed_graph.css({
            "position": "absolute",
            "top": chapter_bottom
        });
        $fixed_chart.css({
            "position": "absolute",
            "top": chapter_bottom
        });
    }

    var refugee_map_status = frameStatus.unfixed;
    var refugee_map_idx = 0;
    var rms_section_bottom = $("#rms_section_bottom");
    function refugee_map_scroll_event(scroll_top) {
        var refugee_map_bottom = parseInt(rms_section_bottom.offset().top) - parseInt($fixed_chart.height());
        var refugee_map_top = parseInt($refugee_map.offset().top);

        // ==> start Scroll
        if (refugee_map_top < scroll_top && refugee_map_bottom > scroll_top && refugee_map_status === frameStatus.unfixed) {
            fix_chart();
            refugee_map_status = frameStatus.fix;
        } else if (refugee_map_status === frameStatus.fix){
            if (refugee_map_bottom < scroll_top) {
                unfix_chart_bottom(refugee_map_bottom);
                refugee_map_status = frameStatus.unfixed;
            } else if (refugee_map_top > scroll_top) {
                unfix_chart();
                refugee_map_status = frameStatus.unfixed;
            }
        }
        // <== end Scroll
        // ==> start chapter

    if(refugee_map_status === frameStatus.fix){
          if(scroll_top<chapter_offset_top[1]){
               refugee_map_idx=0;
          }
          else if(scroll_top<chapter_offset_top[2]){
                refugee_map_idx=1;
          }
          else if(scroll_top<chapter_offset_top[3]){
                refugee_map_idx=2;
          }
          else{
                refugee_map_idx=3;
          }
            mapTransition((2011 + refugee_map_idx));
            pieTransition(2011 + refugee_map_idx);
            total_numTransition(2011 + refugee_map_idx);
            lineTransition(2011 + refugee_map_idx);
        }

        // <== end chapter
    }

    /******************************/
    /******* Window 이밴트  ********/
    /******************************/
    $window.resize(function () {
        section1_setposition();

        var scroll_top = $window.scrollTop();
        var chapter_bottom = parseInt(rms_section_bottom.offset().top) - parseInt($fixed_chart.height());
        var chapter_top = parseInt($refugee_map.offset().top);
        // ==> start Scroll
        if (chapter_top < scroll_top && chapter_bottom > scroll_top) {
            fix_chart();
        } else {
            if (chapter_bottom < scroll_top) {
                unfix_chart_bottom(chapter_bottom);
            } else {
                unfix_chart();
            }
        }

        resize_refugeeMap();
    });

    //** ON_SCROLL EVENT **//
    $window.on('scroll', function () {
        var scroll_top = $window.scrollTop();
        refugee_map_scroll_event(scroll_top);
    });
});

//** Chapter 4: "GDP Compare" **//
//******************************//
$(document).ready(function(){
    var $window = $(window);
    var $gdp_compare = $('#gdp_compare'); // 전체 div
    var $scatter_chart = $('#scatter_chart_div'); // chart가 들어간 div
    var $gdp_div_article = $('.gdp_article_col'); //article 들어간 전체 col
    var chapter_divs = $(".gdp_article"); //연도별 chapter article
    var chapter_offset_top = [];

    function section4_setpoisition(){
        var section_offset = parseInt($gdp_compare.offset().top);
        var section_left = parseInt($gdp_compare.css("margin-left"));
        var section_top = parseInt($gdp_compare.css("margin-top"));
        var scatter_width = parseInt($scatter_chart.css("width"));
        var scatter_height = parseInt($scatter_chart.css("height"));

        $(".gdp_article").css({
            "padding-top": 4*(window.innerHeight) / 5,
            "padding-bottom": window.innerHeight / 5,
            "padding-left": scatter_width,
            
        });
        $(".gdp_article").eq(3).css({
            "padding-bottom": 4*(window.innerHeight) / 5 //마지막 단락은 다음 챕터 간격을 위해 더넓
        });

        $("#gdp_last_article").css({
            "margin-top": (window.innerHeight) / 2
        })

    }
    section4_setpoisition();

    function fix_scatter(){

        var section_left = parseInt($gdp_compare.offset().left);
        var section_top = parseInt($gdp_compare.css("margin-top"));
        var scatter_width = parseInt($scatter_chart.css("width"));

        $scatter_chart.css({
            position: "fixed",
            top: section_top,
            left: section_left
        });

        //*고정한다음에 offset을 정해야함
        for (var i = 0; i < chapter_divs.length; i++) {
            chapter_offset_top[i] = parseInt(chapter_divs.eq(i).offset().top);
        }
    }

    function unfix_scatter(){

        $scatter_chart.css({
            position: "absolute",
            top: $gdp_compare.offset().top

        });

    }
    function unfix_scatter_bottom(chapter_bottom){

        $scatter_chart.css({
            position: "absolute",
            top: chapter_bottom

        });

    }
    var gdp_compare_status = frameStatus.unfixed;
    var gdp_compare_idx = 0;
    var gdp_section_bottom = $("#gdp_section_bottom");
    function gdp_compare_scroll_event(scroll_top) {
        var gdp_compare_bottom = parseInt(gdp_section_bottom.offset().top) - parseInt($scatter_chart.height());
        var gdp_compare_top = parseInt($gdp_compare.offset().top);

        // ==> start Scroll
        if (gdp_compare_top < scroll_top && gdp_compare_bottom > scroll_top && gdp_compare_status === frameStatus.unfixed) {
            fix_scatter();
            gdp_compare_status = frameStatus.fix;
        } else if (gdp_compare_status === frameStatus.fix){
            if (gdp_compare_bottom < scroll_top) {
                unfix_scatter_bottom(gdp_compare_bottom);
                gdp_compare_status = frameStatus.unfixed;
            } else if (gdp_compare_top > scroll_top) {
                unfix_scatter();
                gdp_compare_status = frameStatus.unfixed;
            }
        }
        // <== end Scroll
        // ==> start chapter

    if(gdp_compare_status === frameStatus.fix){
          if(scroll_top <chapter_offset_top[1]){
               gdp_compare_idx=0;
          }
          else if(scroll_top<chapter_offset_top[2]){
                gdp_compare_idx=1;
          }
          else if(scroll_top<chapter_offset_top[3]){
                gdp_compare_idx=2;
          }
          else{
                gdp_compare_idx=3;
          }
            scatterTransition(2011 + gdp_compare_idx);
        }

        // <== end chapter
    }

    $window.resize(function(){
        section4_setpoisition();

        var scroll_top = $window.scrollTop();
        var chapter_bottom = parseInt(gdp_section_bottom.offset().top) - parseInt($scatter_chart.height());
        var chapter_top = parseInt($gdp_compare.offset().top);
        // ==> start Scroll
        if (chapter_top < scroll_top && chapter_bottom > scroll_top) {
            fix_scatter();
        } else {
            if (chapter_bottom < scroll_top) {
                unfix_scatter_bottom(chapter_bottom);
            } else {
                unfix_scatter();
            }
        }

    });

    $window.on('scroll', function () {
        var scroll_top = $window.scrollTop();
        gdp_compare_scroll_event(scroll_top);
    });

});



//** Chapter 4: "Timeline" **//
//***************************//

$(document).ready(function () {
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
            "padding-top": window.innerHeight / 4
        });
    }
    chapter_title_size_setting();

    var c4 = $("#c4");
    var $timeline_div = $("#timeline_div");
    var $timeline = $("#timeline");
    var $timeline_article = $("#timeline_article");

    $window.resize(function () {
        var scroll_top = $window.scrollTop();
        var chapter_bottom = parseInt(c4.offset().top) - parseInt($timeline_div.height());
        var chapter_top = parseInt($timeline.offset().top);

        timeline_resize();
        // ==> start Scroll
        if (chapter_top < scroll_top && chapter_bottom > scroll_top) {
            section3_fix();
        } else {
            if (chapter_bottom < scroll_top) {
                var sectionLeft = parseInt($timeline.css("margin-left"));
                $timeline_div.css({
                    position: "absolute",
                    top: chapter_bottom,
                    left: sectionLeft
                });
            } else {
                section3_unFix_top();
            }
        }

    });

    /** TIMELINE SECTION SETPOSITION **/
    function section3_fix() {
        var section_left = parseInt($timeline.offset().left);
        var section_top = parseInt($timeline.css("margin-top"));
        var timeline_width = parseInt($timeline_div.css("width"));

        $timeline_div.css({
            position: "fixed",
            top: section_top,
            left: section_left
        });
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


    var chapter_divs = $(".timeline_div_article_content");
    var chapter_offset_top = [];
    var valid_value = 0;
    function set_chapter_offset_top() {
        for (var i = 0; i < chapter_divs.length; i++) {
            chapter_offset_top[i] = parseInt(chapter_divs.eq(i).offset().top);
            // 연산을 줄이기 위해 중간에 취소
            if ((i === 0) && (valid_value === chapter_offset_top[i])) {
                break;
            }
        }
        valid_value = chapter_offset_top[0];
    }
    set_chapter_offset_top();

    //** ON_SCROLL EVENT **//
    var timeline_status = frameStatus.unfixed;
    var timeline_idx = 0;
    $window.on('scroll', function () {
        var scroll_top = $window.scrollTop();
        set_chapter_offset_top();

        var chapter_bottom = parseInt(c4.offset().top) - parseInt($timeline_div.height());
        var chapter_top = parseInt($timeline.offset().top) - parseInt($timeline.css("margin-top"));

        // ==> start Scroll
        if (chapter_top < scroll_top && chapter_bottom > scroll_top && timeline_status === frameStatus.unfixed) {
            section3_fix();
            timeline_status = frameStatus.fix;
        } else if (timeline_status === frameStatus.fix) {
            if (chapter_bottom < scroll_top) {
                $timeline_div.css({
                    position: "absolute",
                    top: chapter_bottom + parseInt($timeline.css("margin-top")),
                    left: parseInt($timeline.offset().left)
                });
                timeline_status = frameStatus.unfixed;
            } else if (chapter_top > scroll_top) {
                section3_unFix_top();
                timeline_status = frameStatus.unfixed;
            }
        }
        // <== end Scroll
        // ==> start chapter
        for (var idx = chapter_offset_top.length - 1; idx >= 1; idx--) {
            if (chapter_offset_top[idx] < scroll_top) {
                if (timeline_idx === idx + 2)
                    return;
                // *****************
                // 여기다가 챕터에 따른 이벤트를 넣으세요
                // *****************
                chapter_move(idx + 2);
                timeline_idx = idx + 2;
                break;
            }
        }
        if (chapter_offset_top[1] > scroll_top) {
            if (timeline_idx === 2)
                return;
            chapter_move(2);
            timeline_idx = 2;
            return;
        }
        // <== end chapter
    });
});
