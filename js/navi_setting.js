$(document).ready(function () {
         var $window = $(window);
         var chapter_title_top = [];
         var chapter_title_text = ["Introduction",
                                   "Syrian Refugees before Civil War",
                                   "Distribution of Syrian Refugees",
                                   "What force them to leave Syria?",
                                   "Numbers should not be ignored"];

        for(var i=0; i<5; i++){
            chapter_title_top[i] = parseInt($(".chapter_title").eq(i).offset().top) + parseInt($(".chapter_title").eq(i).css("padding-top"));
         }

         $window.on("scroll",function(){
            set_chapter_title();
            set_progress_bar();
         });                          

         //*writting chapter title 
         function set_chapter_title(){
            if((0<$window.scrollTop())&&($window.scrollTop()<chapter_title_top[1])){
                $('#chapter_num').html("Chapter1:");
                $('#current_chapter').html("&quot;" + chapter_title_text[0] + "&quot;");
             }
             else if((chapter_title_top[1]<$window.scrollTop())&&($window.scrollTop()<chapter_title_top[2])){
                $('#chapter_num').html("Chapter2:");
                $('#current_chapter').html("&quot;" + chapter_title_text[1] + "&quot;");
             }
             else if((chapter_title_top[2]<$window.scrollTop())&&($window.scrollTop()<chapter_title_top[3])){
                $('#chapter_num').html("Chapter3:");
                $('#current_chapter').html("&quot;" + chapter_title_text[2] + "&quot;");
             }
             else if((chapter_title_top[3]<$window.scrollTop())&&($window.scrollTop()<chapter_title_top[4])){
                $('#chapter_num').html("Chapter4:");
                $('#current_chapter').html("&quot;" + chapter_title_text[3] + "&quot;");
             }
             else if((chapter_title_top[4]<$window.scrollTop())&&($window.scrollTop()<chapter_title_top[5])){
                $('#chapter_num').html("Chapter5:");
                $('#current_chapter').html("&quot;" + chapter_title_text[4] + "&quot;");
             }
             else if((chapter_title_top[5]<$window.scrollTop())&&($window.scrollTop()<chapter_title_top[6])){
                $('#chapter_num').html("Chapter6:");
                $('#current_chapter').html("&quot;" + chapter_title_text[5] + "&quot;");
             }
         }

         function set_progress_bar(){
            var end_scroll = parseInt($("#end_div").offset().top);
            var bar_percent = (parseInt($window.scrollTop())/end_scroll)*100;

            $('.progress_bar').css("width", bar_percent + "%");
         }

     });