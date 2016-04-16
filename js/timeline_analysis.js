    var timeline_margin = {top: 20, right: 10, bottom: 40, left: 10},   //Column div1,2의 width와 그 안에 들어갈 svg width
        outerWidth = 750;                                  
        outerHeight = window.innerHeight - 160;
        //height = 650; //svg안에 차트가 그려질 영역의 높이와 timeline_yScale의 range
        timeline_width = outerWidth - timeline_margin.left - timeline_margin.right;
        timeline_height = outerHeight - timeline_margin.top - timeline_margin.bottom;
        //timeline_height = height - 100;

    var timeline = {},   // The timeline data를 포함,label,axis시각적 요소까지 포함하는 timeline객첵 
        dataCon = {},       // Container for the data 각 item(사건)들의 시간,트랙,순서를 저장하는 객체
        components = [], // All the components of the timeline for redrawing
        bandGap = 10,    // Arbitray gap between to consecutive bands
        band ={}; //band object
        
        bandY = 10,       // Y-Position of the next band
        bandNum = 0;     // Count of bands for ids

    var tracks = [];
    var timeline_yScale;
    var xScale_band; //bargrapch xScale_band;
    var xScale_r;
    var xScale_d;
    var rScale_event;
    var rScale_group;

    var timeline_yAxis; //axis함수에서 사용된 axis변
    var timeline_yAxis_g;
    var dateTick_list = [parseDate("2011-01-01"),parseDate("2011-04-01"),
                         parseDate("2011-07-01"),parseDate("2011-10-01"),
                         parseDate("2012-01-01"),parseDate("2012-04-01"),
                         parseDate("2012-07-01"),parseDate("2012-10-01"),
                         parseDate("2013-01-01"),parseDate("2013-04-01"),
                         parseDate("2013-07-01"),parseDate("2013-10-01"),
                         parseDate("2014-01-01"),parseDate("2014-04-01"),
                         parseDate("2014-07-01"),parseDate("2014-10-01"),
                         parseDate("2015-01-01"),parseDate("2015-04-01"),
                         parseDate("2015-07-01"),parseDate("2015-10-01"),
                         parseDate("2016-01-01"),parseDate("2016-04-01")];

    //chapter selecor를 그리기위한 날짜
    var chapter_date = [{start: parseDate("2011-01-01"), end: parseDate("2011-03-01")},
                        {start: parseDate("2011-03-01"), end: parseDate("2011-06-01")},
                        {start: parseDate("2011-05-01"), end: parseDate("2012-07-01")},
                        {start: parseDate("2012-07-01"), end: parseDate("2013-04-01")},
                        {start: parseDate("2013-04-01"), end: parseDate("2014-01-01")},
                        {start: parseDate("2014-01-01"), end: parseDate("2014-12-01")},
                        {start: parseDate("2014-12-01"), end: parseDate("2015-12-01")},
                        {start: parseDate("2016-01-01"), end: parseDate("2016-04-01")}];

    var body = d3.select("body");

    var legend_list1 =["shelling","air_strike","battle","chemical","direct_attack","barrel_bomb"];
    var legend_list3 =["Refugee","Death"];
    
    var main_svg = d3.select("#timeline_chart").append("svg") // 월별 난민 발생수를 bar chart
                    .attr("width",outerWidth)
                    .attr("height",outerHeight);

    var tooltip3 = body.append("div")
        .attr("class", "tooltip_div");

    var alpha = 40; //mouseovell시 명암변화

    //** 섹션별 position 지정 value ** //
    var px_start = 90;
    var px_events = 120;
    var px_refugees = 450;
    var px_death = 600;
    

    var xScale_events = d3.scale.ordinal().rangeBands([px_events,px_refugees])
                                          .domain(legend_list1);

    var div_line_frequency;


    var chart = main_svg.append("g")                       // 이벤트들의 밴드들이 그룹
            .attr("class", "chart")
            .attr("clip-path", "url(#chart-area)")
            .attr("transform","translate("+ timeline_margin.left + "," + timeline_margin.top +")");


    var chart_y_top = 50;   //chart group내에서 차트 상단 경계선 y좌표


    var line_graph_g = chart.append("g")
                        .attr("class","line_graph_g")
                        .attr("transform","translate(0,0)");

    var legend_timeline_g = chart.append("g")
                        .attr("class","legend")
                        .attr("transform", "translate(" + 0 + "," + (timeline_height + 15) +")");

    var legend_type = legend_timeline_g.append("g")
                                     .selectAll("g")
                                     .data(legend_list1)
                                     .enter()
                                     .append("g")
                                     .attr("transform",function(d,i){
                                        return "translate(" + xScale_events(d) +",10)";
                                     });

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
                                    .attr("x",0)
                                    .attr("y",15)
                                    .attr("class","timeline_legend")
                                    .attr("id",function(d){
                                        return d;
                                    })
                                    .text(function(d){
                                        return d;
                                    })
                                    .attr("text-anchor","middle");

    var legend_linegraph_g = chart.append("g")
                                .attr("class","legend")
                                .attr("transform", "translate(" + (px_refugees + 20) + "," + (timeline_height + 5) +")");

    var legend_linegraph = legend_linegraph_g.append("g")
                                .selectAll("g")
                                .data(legend_list3)
                                .enter()
                                .append("g")
                                .attr("transform",function(d,i){
                                    return "translate(" + i*150 + ",10)";
                                });

    var legend_lineg_circle = legend_linegraph
                                .append("line")
                                .attr("x1",0)
                                .attr("y1",0)
                                .attr("x2",20)
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
                                .attr("x",25)
                                .attr("y",3)
                                .attr("class","timeline_legend")
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
                
                item.end = new Date(item.start.getFullYear() + instantOffset);
                item.instant = true;
            } else {
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
            if(month<10){
                month = "0" + month;
            }
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


    timeline_yScale = d3.time.scale()
            .domain([parseDate("2011-01-01"), parseDate("2016-04-01")])
            .range([0, timeline_height]);

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

        timeline_yAxis = d3.svg.axis()
        .scale(timeline_yScale)
        .orient("right")
        .tickSize(timeline_width-100,0)
        .ticks(12)
        .tickValues(dateTick_list)
        .tickFormat(function(d){ return d3.time.format("%b %Y")(d);});

        timeline_yAxis_g = chart.append("g")
        .attr("class", "timeline_axis")
        .attr("id", "date_axis")
        .attr("transform", "translate(60,0)")
        .call(timeline_yAxis)
        .call(customAxis);

        d3.select("#date_axis").selectAll(".tick")
              .append("circle")
              .attr("cx",1)
              .attr("cy",0)
              .attr("r",2)
              .attr("fill","#bbbbbb");

        d3.select("#date_axis").selectAll("text")
              .attr("x",-10)
              .style("text-anchor","end");
}

function customAxis(g) {
  g.selectAll("text")
      .attr("x", -50)
      .attr("dy", 3);
}

d3.csv("data/event_summary_df_whole.csv", function(event_data){

        event_data.forEach(function (item){               
                        item.date = parseDate(item.date);
                        item.interventionM = +item.interventionM;
                        item.air_strike = +item.air_strike;
                        item.civiWar = +item.civiWar;
                        item.remarkable = +item.remarkable;
          
                    });

        dataCon = event_data;

        timeline.setScale();
       

        var div_line_frequency = chart.append("line")
                    .attr("class","timeline_divLine")
                    .attr("x1",px_start)
                    .attr("y1",timeline_yScale(parseDate("2011-01-01")))
                    .attr("x2",px_start)
                    .attr("y2",timeline_height);

        var div_line_death = chart.append("line")
                    .attr("class","timeline_divLine")
                    .attr("x1",px_death)
                    .attr("y1",timeline_yScale(parseDate("2011-01-01")))
                    .attr("x2",px_death)
                    .attr("y2",timeline_height);

        var div_line_refugee = chart.append("line")
                        .attr("class","timeline_divLine")
                        .attr("x1",px_refugees)
                        .attr("y1",timeline_yScale(parseDate("2011-01-01")))
                        .attr("x2",px_refugees)
                        .attr("y2",timeline_height);

        var div_line_end = chart.append("line")
                        .attr("class","timeline_divLine")
                        .attr("x1",timeline_width - 35)
                        .attr("y1",timeline_yScale(parseDate("2011-01-01")))
                        .attr("x2",timeline_width - 35)
                        .attr("y2",timeline_height);

        div_line_frequency = chart.append("g")
                        .selectAll("line")
                        .data(legend_list1)
                        .enter()
                        .append("line")
                        .attr("class","timeline_divLine")
                        .attr("x1",function(d){
                            return xScale_events(d);
                        })
                        .attr("y1",timeline_yScale(parseDate("2011-01-01")))
                        .attr("x2",function(d){
                            return xScale_events(d);
                        })
                        .attr("y2",timeline_height);

       var min = 0;
       var max = 100;
    
        rScale_event = d3.scale.linear()
            .range([0,2,10])
            .domain([0,1,max]);

        var frequency = chart.append("g")
                            .attr("class","frequency")
                            .attr("transform","translate(0,0)");

        var shelling_g = frequency.append("g")
                            .attr("class","shelling_g")
                            .attr("transform","translate(" + xScale_events("shelling") + ",0)")
                            .selectAll("circle")
                            .data(event_data)
                            .enter()
                            .append("circle")
                            .attr("class","circle_event")
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return timeline_yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.shelling);
                            })
                            .attr("id","shelling");

        var air_strike_g = frequency.append("g")
                            .attr("class","air_strike_g")
                            .attr("transform","translate(" + xScale_events("air_strike") + ",0)")
                            .selectAll("circle")
                            .data(event_data)
                            .enter()
                            .append("circle")
                            .attr("class","circle_event")
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return timeline_yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.air_strike);
                            })
                            .attr("id","air_strike");

        var battle_g = frequency.append("g")
                            .attr("class","battle_g")
                            .attr("transform","translate(" + xScale_events("battle") + ",0)")
                            .selectAll("circle")
                            .data(event_data)
                            .enter()
                            .append("circle")
                            .attr("class","circle_event")
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return timeline_yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.battle);
                            })
                            .attr("id","battle");

        var chemical_g = frequency.append("g")
                            .attr("class","chemical_g")
                            .attr("transform","translate(" + xScale_events("chemical") + ",0)")
                            .selectAll("circle")
                            .data(event_data)
                            .enter()
                            .append("circle")
                            .attr("class","circle_event")
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return timeline_yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.chemical);
                            })
                            .attr("id","chemical");

        var direct_attack_g = frequency.append("g")
                            .attr("class","direct_attack_g")
                            .attr("transform","translate(" + xScale_events("direct_attack") + ",0)")
                            .selectAll("circle")
                            .data(event_data)
                            .enter()
                            .append("circle")
                            .attr("class","circle_event")
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return timeline_yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.direct_attack);
                            })
                            .attr("id","direct_attack");

        var barrel_bomb_g = frequency.append("g")
                            .attr("class","barrel_bomb_g")
                            .attr("transform","translate(" + xScale_events("barrel_bomb") + ",0)")
                            .selectAll("circle")
                            .data(event_data)
                            .enter()
                            .append("circle")
                            .attr("class","circle_event")
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return timeline_yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.barrel_bomb);
                            })
                            .attr("id","barrel_bomb");


         timeline.yAxis();


        

        d3.csv("data/death_per_month.csv", function(death_data){  // 난민 누적수

                    death_data.forEach(function (item){               

                        item.date = parseDate(item.date);
                        item.ac_num = +item.ac_num;
                        item.num = +item.num;
                    });


                   var min = 0;
                   var max = d3.max(death_data, function(d){ return d.num});
                
                    xScale_d = d3.scale.linear()
                        .range([0,95])
                        .domain([min,6000]);

                   var xAxis = d3.svg.axis()
                            .scale(xScale_d)
                            .orient("top")
                            .ticks(4)
                            .tickValues([0,3000,6000])
                            .tickFormat(d3.format("s"))
                            .tickSize(6, 0);


                    var point_group = line_graph_g.append("g")
                                        .attr("class","point_group_d")
                                        .attr("transform","translate("+px_death+",0)")
                                        .selectAll("circle")
                                        .data(death_data)
                                        .enter();

                        point_group.append("circle")
                                    .attr("id","death")
                                    .attr("r","1")
                                    .attr("cx",function(d){
                                        return xScale_d(d.num);
                                    })
                                    .attr("cy",function(d){
                                        return timeline_yScale(d.date);
                                    });
                        
                    var line_group = line_graph_g.append("g")
                                        .attr("class","line_group_d")
                                        .attr("transform","translate(" +px_death+",0)")
                                        .selectAll("line")
                                        .data(death_data)
                                        .enter();

                        line_group.append("line") 
                            .attr("class", "line_d")
                            .attr("x1",xScale_d(0))
                            .attr("y1",function(d){
                                    return timeline_yScale(d.date);
                            })
                            .attr("x2",function(d){
                                    return xScale_d(d.num);
                            })
                            .attr("y2",function(d){
                                    return timeline_yScale(d.date);
                            });

                    var line = d3.svg.line()
                                .x(function(d){ return xScale_d(d.num);})
                                .y(function(d){ return timeline_yScale(d.date);})


                    line_graph_g.append("g")
                            .attr("class","x timeline_axis")
                            .attr("transform", "translate("+px_death+",0)")
                            .call(xAxis)
                            .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("dy",".71em");    
    });


    d3.csv("data/refugee_per_month.csv", function(refugee_data){  // 난민 누적수

                     refugee_data.forEach(function (item){               

                        item.date = parseDate(item.date);
                        item.ac_num = +item.ac_num;
                        item.num = +item.num;
                    });


                   var min = 0;
                   var max = d3.max(refugee_data, function(d){ return d.num});
                
                    xScale_r = d3.scale.linear()
                        .range([150,5])
                        .domain([min,max]);

                   var xAxis = d3.svg.axis()
                            .scale(xScale_r)
                            .orient("top")
                            .ticks(4)
                            .tickValues([0,125000,250000])
                            .tickFormat(d3.format("s"))
                            .tickSize(6, 0);


                    var point_group = line_graph_g.append("g")
                                        .attr("class","point_group_r")
                                        .attr("transform","translate("+px_refugees+",0)")
                                        .selectAll("circle")
                                        .data(refugee_data)
                                        .enter();

                        point_group.append("circle")
                                    .attr("id","refugee")
                                    .attr("r","1")
                                    .attr("cx",function(d){
                                        return xScale_r(d.num);
                                    })
                                    .attr("cy",function(d){
                                        return timeline_yScale(d.date);
                                    });
                        
                    var line_group = line_graph_g.append("g")
                                        .attr("class","line_group_r")
                                        .attr("transform","translate(" +px_refugees+",0)")
                                        .selectAll("line")
                                        .data(refugee_data)
                                        .enter();

                        line_group.append("line") 
                            .attr("class", "line_r")
                            .attr("x1",xScale_r(0))
                            .attr("y1",function(d){
                                    return timeline_yScale(d.date);
                            })
                            .attr("x2",function(d){
                                    return xScale_r(d.num);
                            })
                            .attr("y2",function(d){
                                    return timeline_yScale(d.date);
                            });

                    var line = d3.svg.line()
                                .x(function(d){ return xScale_d(d.num);})
                                .y(function(d){ return timeline_yScale(d.date);})


                    line_graph_g.append("g")
                            .attr("class","x timeline_axis")
                            .attr("transform", "translate("+px_refugees+",0)")
                            .call(xAxis)
                            .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("dy",".71em");  


                    var chapter_mask1 = chart.append("g")
                            .attr("transform","translate(0,0)")
                            .append("rect")
                            .attr("class","chapter_mask")
                            .attr("id","chapter_mask1")
                            .attr("width",605)
                            .attr("height",function(){
                                return timeline_yScale(chapter_date[1].start) - timeline_yScale(chapter_date[0].start)
                            })
                            .attr("x",px_start)
                            .attr("y",timeline_yScale(parseDate("2011-01-01")));            

                    var chapter_selector = chart.append("g")
                            .attr("transform","translate(0,0)")
                            .append("rect")
                            .attr("class","chapter_selector")
                            .attr("width",605)
                            .attr("height",function(){
                                return timeline_yScale(chapter_date[1].end)-timeline_yScale(chapter_date[1].start);
                            })
                            .attr("x",px_start)
                            .attr("y",timeline_yScale(chapter_date[1].start));


                    var chapter_mask2 = chart.append("g")
                            .attr("transform","translate(0,0)")
                            .append("rect")
                            .attr("class","chapter_mask")
                            .attr("id","chapter_mask2")
                            .attr("width",605)
                            .attr("height",function(){
                                return timeline_yScale(chapter_date[7].end) - timeline_yScale(chapter_date[1].end)
                            })
                            .attr("x",px_start)
                            .attr("y",timeline_yScale(chapter_date[1].end));  
                                
    });

    
});

function timeline_resize(){

     if(700<window.innerHeight){


        outerWidth = 750;                                  
        outerHeight = window.innerHeight - 160;

        main_svg.transition()
                .attr("width",outerWidth)
                .attr("height",outerHeight);

        timeline_width = outerWidth - timeline_margin.left - timeline_margin.right;
        timeline_height = outerHeight - timeline_margin.top - timeline_margin.bottom;


        //rescale axis//
        timeline_yScale.range([0, timeline_height]);

        timeline_yAxis.scale(timeline_yScale);


        timeline_yAxis_g.transition().call(timeline_yAxis).call(customAxis);



        //redraw eventCricle
        d3.select(".shelling_g").selectAll("circle").transition()
                  .attr("cy",function(d,i){
                      return timeline_yScale(d.date);
                  });

        d3.select(".air_strike_g").selectAll("circle").transition()
                  .attr("cy",function(d,i){
                      return timeline_yScale(d.date);
                  });

        d3.select(".battle_g").selectAll("circle").transition()
                  .attr("cy",function(d,i){
                      return timeline_yScale(d.date);
                  });

        d3.select(".chemical_g").selectAll("circle").transition()
                  .attr("cy",function(d,i){
                      return timeline_yScale(d.date);
                  });

        d3.select(".direct_attack_g").selectAll("circle").transition()
                  .attr("cy",function(d,i){
                      return timeline_yScale(d.date);
                  });

        d3.select(".barrel_bomb_g").selectAll("circle").transition()
                  .attr("cy",function(d,i){
                      return timeline_yScale(d.date);
                  });

        //* redraw linegraph *//
        d3.select(".point_group_d").selectAll("circle").transition()
                  .attr("cy",function(d){
                     return timeline_yScale(d.date);
                  });

        d3.select(".line_group_d").selectAll("line").transition()
                    .attr("x1",xScale_d(0))
                    .attr("y1",function(d){
                            return timeline_yScale(d.date);
                    })
                    .attr("x2",function(d){
                            return xScale_d(d.num);
                    })
                    .attr("y2",function(d){
                            return timeline_yScale(d.date);
                    });

        d3.select(".point_group_r").selectAll("circle").transition()
                  .attr("cy",function(d){
                     return timeline_yScale(d.date);
                  });

        d3.select(".line_group_r").selectAll("line").transition()
                    .attr("x1",xScale_r(0))
                    .attr("y1",function(d){
                            return timeline_yScale(d.date);
                    })
                    .attr("x2",function(d){
                            return xScale_r(d.num);
                    })
                    .attr("y2",function(d){
                            return timeline_yScale(d.date);
                    });

        //* legend rescale *//
        legend_timeline_g.transition()
                         .attr("transform", "translate(" + 0 + "," + (timeline_height + 15) +")");

        legend_linegraph_g.transition()
                          .attr("transform", "translate(" + (px_refugees + 20) + "," + (timeline_height + 15) +")");
     }
    

}
function chapter_move(index){


    var i = index ;
    var i = index-1 ;

    d3.select("#chapter_mask1").transition()
                    .delay(300)
                    .duration(300)
                    .ease("bounce")
                    .attr("height",function(){
                        return timeline_yScale(chapter_date[i].start)-timeline_yScale(chapter_date[0].start);
                    })
                    .attr("x",px_start)
                    .attr("y",timeline_yScale(chapter_date[0].start));

    d3.select(".chapter_selector").transition()
                    .delay(300)
                    .duration(300)
                    .ease("bounce")
                    .attr("height",function(){
                        return timeline_yScale(chapter_date[i].end)-timeline_yScale(chapter_date[i].start);
                    })
                    .attr("x",px_start)
                    .attr("y",timeline_yScale(chapter_date[i].start));
                    
    d3.select("#chapter_mask2").transition()
                    .delay(300)
                    .duration(300)
                    .ease("bounce")
                    .attr("height",function(){
                        return timeline_yScale(chapter_date[7].end) - timeline_yScale(chapter_date[i].end)
                    })
                    .attr("x",px_start)
                    .attr("y",timeline_yScale(chapter_date[i].end));  
  
}

       
