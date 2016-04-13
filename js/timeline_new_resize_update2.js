//              **웹폰트 설정**
 WebFontConfig = {  
                google: { families: [ 'Roboto+Slab:100:latin', 'Source+Code+Pro:400,300,200:latin' ] }
              };
              (function() {
                var wf = document.createElement('script');
                wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
                  '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
                wf.type = 'text/javascript';
                wf.async = 'true';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(wf, s);
              })();



//              **전역변수 설정**


    var margin = {top: 5, right: 5, bottom: 5, left: 5},   //Column div1,2의 width와 그 안에 들어갈 svg width
        outerWidth = 600;                                  
        outerHeight = 800;
        //height = 650; //svg안에 차트가 그려질 영역의 높이와 yScale의 range
        width = outerWidth - margin.left - margin.right;
        height = outerHeight - margin.top - margin.bottom;
        timeline_height = height - 100;

    var timeline = {},   // The timeline data를 포함,label,axis시각적 요소까지 포함하는 timeline객첵 
        dataCon = {},       // Container for the data 각 item(사건)들의 시간,트랙,순서를 저장하는 객체
        components = [], // All the components of the timeline for redrawing
        bandGap = 10,    // Arbitray gap between to consecutive bands
        band ={}; //band object
        
        bandY = 10,       // Y-Position of the next band
        bandNum = 0;     // Count of bands for ids

    var tracks = [];
    var yScale;
    var xScale_band; //bargrapch xScale_band;
    var xScale_r;
    var xScale_d;
    var rScale_event;
    var rScale_group;

    var yAxis; //axis함수에서 사용된 axis변
    var yAxis_g;

    //chapter selecor를 그리기위한 날짜
    var chapter_date = [{start: parseDate("2011-03-01"), end: parseDate("2011-06-01")},
                        {start: parseDate("2011-05-01"), end: parseDate("2012-07-01")},
                        {start: parseDate("2012-07-01"), end: parseDate("2013-04-01")},
                        {start: parseDate("2013-04-01"), end: parseDate("2014-01-01")},
                        {start: parseDate("2014-01-01"), end: parseDate("2014-12-01")},
                        {start: parseDate("2014-12-01"), end: parseDate("2015-12-01")},
                        {start: parseDate("2016-01-01"), end: parseDate("2016-04-01")}];

    var body = d3.select("body");

    var legend_list1 =["shelling","air_strike","battle","chemical","massacre"];
    var legend_list2 =["IR","IS","RS","US","HZB"];
    var legend_list3 =["Refugee","Death"];
    
    var main_svg = d3.select("#timeline_chart").append("svg") // 월별 난민 발생수를 bar chart
                    .attr("width",outerWidth)
                    .attr("height",height);

    var tooltip3 = body.append("div")
        .attr("class", "tooltip_div");

    var alpha = 40; //mouseovell시 명암변화

    //** 섹션별 position 지정 value ** //

    var px_events = 90;
    var px_death = 440;
    var px_refugees = 290;

    var div_line1;
    var div_line2;

    var chart = main_svg.append("g")                       // 이벤트들의 밴드들이 그룹
            .attr("class", "chart")
            .attr("clip-path", "url(#chart-area)")
            .attr("transform","translate("+ margin.left + ", -30)");


    var chart_y_top = 50;   //chart group내에서 차트 상단 경계선 y좌표

    var chapter_selector = chart.append("g")
                            .attr("transform","translate(90,0)")
                            .append("rect");


    div_line1 = chart.append("line")
                    .attr("class","timeline_divLine")
                    .attr("x1",px_events)
                    .attr("y1",chart_y_top)
                    .attr("x2",px_events)
                    .attr("y2",timeline_height);


    div_line2 = chart.append("line")
                    .attr("class","timeline_divLine")
                    .attr("x1",px_death)
                    .attr("y1",chart_y_top)
                    .attr("x2",px_death)
                    .attr("y2",timeline_height);

    div_line3 = chart.append("line")
                    .attr("class","timeline_divLine")
                    .attr("x1",px_refugees)
                    .attr("y1",chart_y_top)
                    .attr("x2",px_refugees)
                    .attr("y2",timeline_height);

    div_line4 = chart.append("line")
                    .attr("class","timeline_divLine")
                    .attr("x1",width-40)
                    .attr("y1",chart_y_top)
                    .attr("x2",width-40)
                    .attr("y2",timeline_height-10);

    var line_graph_g = chart.append("g")
                        .attr("class","line_graph_g")
                        .attr("transform","translate(0,0)");

    var legend_timeline_g = chart.append("g")
                        .attr("class","legend")
                        .attr("transform", "translate(" + px_events + "," + (timeline_height + 15) +")");

    var legend_type = legend_timeline_g.append("g")
                                     .selectAll("g")
                                     .data(legend_list1)
                                     .enter()
                                     .append("g")
                                     .attr("transform",function(d,i){
                                        return "translate(10," + i*15 + ")";
                                     });

    var legend_who = legend_timeline_g.append("g")
                                    .selectAll("g")
                                    .data(legend_list2)
                                    .enter()
                                    .append("g")
                                    .attr("transform",function(d,i){
                                        return "translate(10," + i*15 + ")";
                                    })
                                    .attr("opacity",0);

    var legend_type_circle = legend_type
                                .append("circle")
                                .attr("cx",0)
                                .attr("cy",0)
                                .attr("r",5)
                                .attr("id", function(d){
                                    return d;
                                });

    var legend_type_text = legend_type
                                    .append("text")
                                    .attr("x",10)
                                    .attr("y",3)
                                    .attr("id","legend")
                                    .text(function(d){
                                        return d;
                                    });

    var legend_who_circle = legend_who
                                .append("circle")
                                .attr("cx",0)
                                .attr("cy",0)
                                .attr("r",5)
                                .attr("id", function(d,i){
                                        return legend_list2[i];
                                });

    var legend_who_text = legend_who
                                    .append("text")
                                    .attr("x",10)
                                    .attr("y",3)
                                    .attr("id","legend")
                                    .text(function(d){
                                        return d;
                                });


    var legend_linegraph_g = chart.append("g")
                                .attr("class","legend")
                                .attr("transform", "translate(" + px_death + "," + (timeline_height + 15) +")");

    var legend_linegraph = legend_linegraph_g.append("g")
                                .selectAll("g")
                                .data(legend_list3)
                                .enter()
                                .append("g")
                                .attr("transform",function(d,i){
                                    return "translate(10," + i*15 + ")";
                                });

    var legend_lineg_circle = legend_linegraph
                                .append("line")
                                .attr("x1",0)
                                .attr("y1",0)
                                .attr("x2",15)
                                .attr("y2",0)
                                .attr("stroke-width","2") 
                                .attr("id", function(d){
                                    if(d=="Refugee"){
                                        return "refugee";
                                    }
                                    else if(d=="Death"){
                                        return "death";
                                    }
                                });

    var legend_lineg_text = legend_linegraph
                                .append("text")
                                .attr("x",20)
                                .attr("y",3)
                                .attr("id","legend")
                                .text(function(d){
                                    return d;    
                                });


    //---------------------------------------------------------------------------
    //
    // data
    //

    timeline.data = function(items){

        var today = new Date(),
            yearMills = 31622400000,
            instantOffset = 100* yearMills;

        dataCon.items = items;

        function showItems(n){
            var count = 0; n=n || 10;
            
            dataCon.items.forEach(function (d){
                count++;
                if(count > n) return;
            })
        }

        function compareAscending(item1, item2){
            // Every item must have two fields; 'start' and 'end'.
            var result = item1.start - item2.start;
            // earlier first
            if(result <0){ return -1;}
            if(result >0){ return 1;}
            //longer furst
            result = item2.end - item1.end;
            if(result <0) {return 1;}
            if(result >0) {return -1;}
            return 0;
        }

        function compareDescending(item1, item2) {
            // Every item must have two fields: 'start' and 'end'.
            var result = item1.start - item2.start;
            // later first
            if (result < 0) { return 1; }
            if (result > 0) { return -1; }
            // shorter first
            result = item2.end - item1.end;
            if (result < 0) { return 1; }
            if (result > 0) { return -1; }
            return 0;
        }

        function calculateTracks(items, sortOrder, timeOrder){
            var i,track;

            sortOrder = sortOrder || "descending";
            timeOrder = timeOrder || "backward";

            function sortBackward(){
                //older items end deeper
                items.forEach(function (item){
                    for(i=0, track=0; i<tracks.length; i++, track++){
                        if(item.end < tracks[i]){ 
                         break; }
                    }
            
                    item.track = track;
                    tracks[track] = item.end
                });
            }

            function sortForward() {
                // younger items end deeper
                
                items.forEach(function (item) {
                    for (i = 0; i < tracks.length; i++) {
                        if (item.start > tracks[i]) {  
                            
                            break; }
                    }


                    item.track = i;//i=track
                    
                    if(item.instant){
                        
                        var month = item.start.getMonth();
                        item.end = new Date(item.start);
                        item.end.setMonth(month+2);
                        //item.start.setMonth(month-1);
                        
                    }
                    tracks[i] = item.end;//각 트랙의 마지막 아이템의 
                });
            }

            if(sortOrder ==="ascending")
                dataCon.items.sort(compareAscending);
            else
                dataCon.items.sort(compareDescending);

            if(timeOrder ==="forward")
                sortForward();
            else
                sortBackward();
        }

        // Convert yearStrings into dates
        dataCon.items.forEach(function (item){
            item.start = parseDate(item.start);
            if (item.end == "") {
                
                //console.log("2 item.end: " + item.end);
                item.end = new Date(item.start.getFullYear() + instantOffset);
                //console.log("3 item.end: " + item.end);
                item.instant = true;
            } else {
                //console.log("4 item.end: " + item.end);
                item.end = parseDate(item.end);
                item.instant = false;
            }
            // The timeline never reaches into the future.
            // This is an arbitrary decision.
            // Comment out, if dates in the future should be allowed.
            if (item.end > today) { item.end = today};
        });

        //calculateTracks(data.items);
        // Show patterns
        //calculateTracks(data.items, "ascending", "backward");
        //calculateTracks(data.items, "descending", "forward");
        // Show real data
        //calculateTracks(dataCon.items, "descending", "backward");
        calculateTracks(dataCon.items, "ascending", "forward");
        dataCon.nTracks = tracks.length;
        dataCon.minDate = d3.min(dataCon.items, function (d) { return d.start; });
        dataCon.minDate = parseDate("2010-12-01");
        dataCon.maxDate = parseDate("2016-04-01");
        
        

    };

    function parseDate(dateString) {
        // 'dateString' must either conform to the ISO date format YYYY-MM-DD
        // or be a full year without month and day.
        // AD years may not contain letters, only digits '0'-'9'!
        // Invalid AD years: '10 AD', '1234 AD', '500 CE', '300 n.Chr.'
        // Valid AD years: '1', '99', '2013'
        // BC years must contain letters or negative numbers!
        // Valid BC years: '1 BC', '-1', '12 BCE', '10 v.Chr.', '-384'
        // A dateString of '0' will be converted to '1 BC'.
        // Because JavaScript can't define AD years between 0..99,
        // these years require a special treatment.

        var format = d3.time.format("%Y-%m-%d"),
            date,
            year;

        date = format.parse(dateString);
        if (date !== null) return date;

        // BC yearStrings are not numbers!
        if (isNaN(dateString)) { // Handle BC year
            // Remove non-digits, convert to negative number
            year = -(dateString.replace(/[^0-9]/g, ""));
        } else { // Handle AD year
            // Convert to positive number
            year = +dateString;
        }
        if (year < 0 || year > 99) { // 'Normal' dates
            date = new Date(year, 6, 1);
        } else if (year == 0) { // Year 0 is '1 BC'
            date = new Date (-1, 6, 1);
        } else { // Create arbitrary year and then set the correct year
            // For full years, I chose to set the date to mid year (1st of July).
            date = new Date(year, 6, 1);
            date.setUTCFullYear(("0000" + year).slice(-4));
        }

        
        // Finally create the date
        return date;
    }

    function toYear_Month(date) {
      
      
        var year = date.getFullYear();
        var month = date.getMonth();

        
            month += 1;
            return year + "." + month;
        
    }
    function toFullDate(date) {
       
        var year = date.getFullYear();
        var month = date.getMonth() +1;
        var day = date.getDate();

        return year + "." + month + "." + day;
    }

//draw band
timeline.setScale = function(){

    band.x = 0;
    band.y = bandY;
    band.w = width;
    band.h = height * (0.82 || 1);
    band.trackOffset = 10;
    band.trackWidth = Math.min((band.h - band.trackOffset) / dataCon.nTracks, 12);
    band.itemWidth = band.trackWidth * 0.6;
    band.instantWidth = 100;

    yScale = d3.time.scale()
            .domain([dataCon.minDate, dataCon.maxDate])
            .range([chart_y_top-10, timeline_height]);

    xScale_band = function(track){
        return band.trackOffset + (track%(dataCon.nTracks)) * band.trackWidth;
    };
};



//----------------------------------------------------------------------
    //
    // xAxis
    //

timeline.yAxis = function(){

        var datelist =[1];

        for(var i=0; i<5; i++){
            for(var j=1; j<7; j++){
                datelist.push("201" + i + "-" + j*2 +"-01");
            }
        }

        yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        .tickSize(width-100,0)
        .ticks(12)
        .tickValues([parseDate("2011-01-01"),parseDate("2011-07-01"),parseDate("2012-01-01"),parseDate("2012-07-01"),parseDate("2013-01-01"),parseDate("2013-07-01"),parseDate("2014-01-01"),parseDate("2014-07-01"),parseDate("2015-01-01"),parseDate("2015-07-01"),parseDate("2016-01-01"),parseDate("2016-04-01")])
        .tickFormat(function(d){ return toYear_Month(d);});

        yAxis_g = chart.append("g")
        .attr("class", "timeline_axis")
        .attr("id", "date_axis")
        .attr("transform", "translate(60,0)")
        .call(yAxis)
        .call(customAxis)
        .select("path");

        d3.select("#date_axis").selectAll(".tick")
              .append("circle")
              .attr("cx",1)
              .attr("cy",0)
              .attr("r",2)
              .attr("fill","#dddddd");

        d3.select("#date_axis").selectAll("text")
              .attr("x",-10)
              .style("text-anchor","end");
}

function customAxis(g) {
  g.selectAll("text")
      .attr("x", -50)
      .attr("dy", 3);
}

    d3.csv("data/timeline6.csv", function(d){

        timeline.data(d);
        timeline.setScale();
        timeline.yAxis();

        chapter_selector.attr("width",440)
                        .attr("height",function(){
                            return yScale(chapter_date[0].end)-yScale(chapter_date[0].start);
                        })
                        .attr("x",0)
                        .attr("y",yScale(chapter_date[0].start))
                        .attr("class","chapter_selector");

        

        d3.csv("data/death_per_month.csv", function(data){  // 난민 누적수

                     data.forEach(function (item){               

                        item.date = parseDate(item.date);
                        item.ac_num = +item.ac_num;
                        item.num = +item.num;
                    });


                   var min = 0;
                   var max = d3.max(data, function(d){ return d.num});
                
                    xScale_d = d3.scale.linear()
                        .range([0,90])
                        .domain([min,6000]);

                   var xAxis = d3.svg.axis()
                            .scale(xScale_d)
                            .orient("top")
                            .ticks(4)
                            .tickValues([0,3000,6000])
                            .tickFormat(d3.format("s"))
                            .tickSize(6, 0);


                    var point_group = line_graph_g.append("g")
                                        .attr("transform","translate("+px_death+",0)")
                                        .selectAll("circle")
                                        .data(data)
                                        .enter();

                        point_group.append("circle")
                                    .attr("id","death")
                                    .attr("r","1")
                                    .attr("cx",function(d){
                                        return xScale_d(d.num);
                                    })
                                    .attr("cy",function(d){
                                        return yScale(d.date);
                                    });
                        
                    var line_group = line_graph_g.append("g")
                                        .attr("transform","translate(" +px_death+",0)")
                                        .selectAll("line")
                                        .data(data)
                                        .enter();

                        line_group.append("line") 
                            .attr("class", "line_d")
                            .attr("x1",0)
                            .attr("y1",function(d){
                                    return yScale(d.date);
                            })
                            .attr("x2",function(d){
                                    return xScale_d(d.num);
                            })
                            .attr("y2",function(d){
                                    return yScale(d.date);
                            });

                    var line = d3.svg.line()
                                .x(function(d){ return xScale_d(d.num);})
                                .y(function(d){ return yScale(d.date);})


                    line_graph_g.append("g")
                            .attr("class","x timeline_axis")
                            .attr("transform", "translate("+px_death+",49)")
                            .call(xAxis)
                            .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("dy",".71em");    
    });


    d3.csv("data/refugee_per_month.csv", function(data){  // 난민 누적수

                     data.forEach(function (item){               

                        item.date = parseDate(item.date);
                        item.ac_num = +item.ac_num;
                        item.num = +item.num;
                    });


                   var min = 0;
                   var max = d3.max(data, function(d){ return d.num});
                
                    xScale_r = d3.scale.linear()
                        .range([150,0])
                        .domain([min,max]);

                   var xAxis = d3.svg.axis()
                            .scale(xScale_r)
                            .orient("top")
                            .ticks(4)
                            .tickValues([0,125000,250000])
                            .tickFormat(d3.format("s"))
                            .tickSize(6, 0);


                    var point_group = line_graph_g.append("g")
                                        .attr("transform","translate("+px_refugees+",0)")
                                        .selectAll("circle")
                                        .data(data)
                                        .enter();

                        point_group.append("circle")
                                    .attr("id","refugee")
                                    .attr("r","1")
                                    .attr("cx",function(d){
                                        return xScale_r(d.num);
                                    })
                                    .attr("cy",function(d){
                                        return yScale(d.date);
                                    });
                        
                    var line_group = line_graph_g.append("g")
                                        .attr("transform","translate(" +px_refugees+",0)")
                                        .selectAll("line")
                                        .data(data)
                                        .enter();

                        line_group.append("line") 
                            .attr("class", "line_r")
                            .attr("x1",150)
                            .attr("y1",function(d){
                                    return yScale(d.date);
                            })
                            .attr("x2",function(d){
                                    return xScale_r(d.num);
                            })
                            .attr("y2",function(d){
                                    return yScale(d.date);
                            });

                    var line = d3.svg.line()
                                .x(function(d){ return xScale_d(d.num);})
                                .y(function(d){ return yScale(d.date);})


                    line_graph_g.append("g")
                            .attr("class","x timeline_axis")
                            .attr("transform", "translate("+px_refugees+",49)")
                            .call(xAxis)
                            .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("dy",".71em");    
    });

    d3.csv("data/event_summary_df2.csv", function(data){ 

        data.forEach(function (item){               
                        item.date = parseDate(item.date);
                        item.interventionM = +item.interventionM;
                        item.air_strike = +item.air_strike;
                        item.civiWar = +item.civiWar;
                        item.remarkable = +item.remarkable;
          
                    });

                   var min = 0;
                   var max = 100;
                
                    rScale_event = d3.scale.linear()
                        .range([0,2,10])
                        .domain([0,1,max]);

        var frequency = chart.append("g")
                            .attr("class","frequency")
                            .attr("transform","translate(90,0)");

        var shelling_g = frequency.append("g")
                            .attr("transform","translate(33,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("class","circle_event")
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.shelling);
                            })
                            .attr("id","shelling");

        var air_strike_g = frequency.append("g")
                            .attr("transform","translate(66,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("class","circle_event")
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.air_strike);
                            })
                            .attr("id","air_strike");

        var battle_g = frequency.append("g")
                            .attr("transform","translate(99,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("class","circle_event")
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.battle);
                            })
                            .attr("id","battle");

        var chemical_g = frequency.append("g")
                            .attr("transform","translate(132,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("class","circle_event")
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.chemical);
                            })
                            .attr("id","chemical");

        var massacre_g = frequency.append("g")
                            .attr("transform","translate(165,0)")
                            .selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("class","circle_event")
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.massacre);
                            })
                            .attr("id","massacre");

    });

});
function chapter_move(index){

    var i = index-1 ;
    console.log("chapter move!");

    chapter_selector.transition()
                    .delay(500)
                    .duration(500)
                    .ease("bounce")
                    .attr("height",function(){
                        return yScale(chapter_date[i].end)-yScale(chapter_date[i].start);
                    })
                    .attr("x",0)
                    .attr("y",yScale(chapter_date[i].start))
                    .attr("class","chapter_selector");

    console.log(chapter_selector.attr("y"));
}

       
