    var timeline_margin = {top: 5, right: 10, bottom: 30, left: 10},   //Column div1,2의 width와 그 안에 들어갈 svg width
        outerWidth = 750;                                  
        outerHeight = window.innerHeight - 180;
        //height = 650; //svg안에 차트가 그려질 영역의 높이와 timeline_yScale의 range
        timeline_width = outerWidth - timeline_margin.left - timeline_margin.right;
        timeline_height = outerHeight - timeline_margin.top - timeline_margin.bottom;
        timeline_top = 65;
        //timeline_height = height - 100;

    var timeline = {},   // The timeline data를 포함,label,axis시각적 요소까지 포함하는 timeline객첵 
        dataCon = {};       // Container for the data 각 item(사건)들의 시간,트랙,순서를 저장하는 객체

    var timeline_yScale;
    var xScale_band; //bargrapch xScale_band;
    var xScale_r;
    var xScale_d;
    var rScale_event;
    var rScale_group;

    var timeline_current_chapter=0;

    var timeline_yAxis; //axis함수에서 사용된 axis변
    var timeline_yAxis_g;
   
    var dateList =[]; //montly box hover에 쓰일 date 배열
    var year = 2011;
    var month = 1;
    var day = 1;


    for(var i=0; i<6; i++){
        for(var j=0; j<12; j++){
            var date = (year+i) + "-" + (month+j) + "-" + day;
            var index = i*12 + j;

            dateList[index] = parseDate(date);
            if((i==5)&&(j==3)){
                break;
            }
        }
    }

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
                        {start: parseDate("2011-01-01"), end: parseDate("2016-04-01")},
                        {start: parseDate("2011-03-01"), end: parseDate("2011-06-01")},
                        {start: parseDate("2011-05-01"), end: parseDate("2012-07-01")},
                        {start: parseDate("2012-07-01"), end: parseDate("2013-04-01")},
                        {start: parseDate("2013-04-01"), end: parseDate("2014-01-01")},
                        {start: parseDate("2014-01-01"), end: parseDate("2014-12-01")},
                        {start: parseDate("2014-12-01"), end: parseDate("2015-12-01")},
                        {start: parseDate("2016-01-01"), end: parseDate("2016-04-01")},
                        {start: parseDate("2011-01-01"), end: parseDate("2016-04-01")}];

    var body = d3.select("body");

    var legend_list1 = ["barrel_bomb","battle","shelling","chemical","air_strike","direct_attack"];
    var legend_text = ["Barrel Bomb","Battle","Shelling","Chemical","Air Strike","Massacre"];
    var legend_list3 = ["Death"];
    
    var main_svg = d3.select("#timeline_chart").append("svg") // 월별 난민 발생수를 bar chart
                    .attr("width",outerWidth)
                    .attr("height",outerHeight);

    var tooltip3 = body.append("div")
                       .attr("class", "tooltip_div");


    //** 섹션별 position 지정 value ** //
    var px_event = 90;
    var px_yAxis;
    var px_death = 550;
    
    //** 이벤트 써클 오버서티 **//
    var c_opacity1 = 0.45;
    var c_opacity2 = 0.05;
    var c_opacityR = 0.7;
    var current_opacity;
    var current_opacity2;

    var total_num =[892,
                    5567,
                    14797,
                    342,
                    3543,
                    8304];

    var total_death = 131220;

                    

    var xScale_events = d3.scale.ordinal().rangeBands([px_event,px_death])
                                          .domain(legend_list1);

    px_yAxis = px_event - xScale_events.rangeBand()/2;

    var div_line_frequency;

    var chart = main_svg.append("g")                       // 이벤트들의 밴드들이 그룹
            .attr("class", "chart")
            .attr("clip-path", "url(#chart-area)")
            .attr("transform","translate("+ timeline_margin.left + "," + timeline_margin.top +")");



    var legend_timeline_g = chart.append("g")
                        .attr("class","legend")
                        .attr("transform", "translate(" + 0 + "," + 0 +")");

    var legend_type = legend_timeline_g.append("g")
                                     .selectAll("g")
                                     .data(legend_list1)
                                     .enter()
                                     .append("g")
                                     .attr("transform",function(d,i){
                                        return "translate(" + xScale_events(d) +",10)";
                                     });


    var legend_type_range = chart.append("g")
                                 .attr("transform","translate(" +(0)+ ",40)")
                                 .append("text")
                                 .attr("class","timeline_legend num_range")
                                 .attr("x",0)
                                 .attr("y",0)
                                 .text("Total")
                                 .style("fill","#ffffff")
                                 .attr("text-anchor","start");


    var legend_type_text = legend_type
                                    .append("text")
                                    .attr("x",0)
                                    .attr("y",0)
                                    .attr("class","timeline_legend timeline_event")
                                    .attr("id",function(d){
                                        return d;
                                    })
                                    .text(function(d,i){
                                        return legend_text[i];
                                    })
                                    .attr("text-anchor","middle");

     var legend_type_circle = legend_type
                                .append("circle")
                                .attr("cx",0)
                                .attr("cy",11)
                                .attr("r",5)
                                .attr("id", function(d){
                                    return d;
                                });

     var legend_type_num = legend_type
                                .append("text")
                                .attr("x",0)
                                .attr("y",30)
                                .attr("class","type_num")
                                .attr("id",function(d){
                                        return d;
                                })
                                .text(function(d,i){
                                    return total_num[i];
                                })
                                .attr("text-anchor","middle");


   // legend_type.selectAll(".timeline_event").call(wrap,52);

    var legend_linegraph_g = chart.append("g")
                                .attr("class","legend")
                                .attr("transform", "translate(" + (px_death) + "," + (0) +")");

    var legend_linegraph = legend_linegraph_g.append("g")
                                .selectAll("g")
                                .data(legend_list3)
                                .enter()
                                .append("g")
                                .attr("transform",function(d,i){
                                    return "translate(" + i*150 + ",10)";
                                });

    var legend_lineg_text = legend_linegraph
                                .append("text")
                                .attr("x",0)
                                .attr("y",0)
                                .attr("class","timeline_legend")
                                .attr("id","death")
                                .style("stroke-width",0)
                                .text(function(d){
                                    return d;    
                                });

    var legend_lineg_circle = legend_linegraph
                                .append("line")
                                .attr("x1",2)
                                .attr("y1",12)
                                .attr("x2",20)
                                .attr("y2",12)
                                .attr("stroke-width","2") 
                                .attr("id", function(d){
                                    if(d=="Refugee"){
                                        return "refugee";
                                    }
                                    else if(d=="Death"){
                                        return "death";
                                    }
                                });

    var legend_lineg_num = legend_linegraph
                                .append("text")
                                .attr('x',0)
                                .attr('y',30)
                                .attr("class","timeline_legend death_num")
                                .attr("id","death")
                                .style("stroke-width",0)
                                .text(total_death);

    


    //---------------------------------------------------------------------------
    //
    // data
    //

    timeline.data = function(items){

        var today = new Date(),
            yearMills = 31622400000,
            instantOffset = 100* yearMills;

        dataCon.items = items;
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
            .range([timeline_top, timeline_height]);

};



//----------------------------------------------------------------------
    //
    // xAxis
    //

timeline.yAxis = function(){

        var datelist =[1];

        for(var i=0; i<5; i++){
            for(var j=1; j<7; j++){
                datelist.push("201" + i + "-" + j*2 + "-01");
            }
        }

        timeline_yAxis = d3.svg.axis()
        .scale(timeline_yScale)
        .orient("right")
        .tickSize(timeline_width - px_event,0)
        .ticks(64)
        //.tickValues(dateTick_list)
        .tickFormat(function(d,i){ 
            if(i%3==0){
                    return d3.time.format("%b %Y")(d);
                }
                else{
                    return " ";
                }
            
        });

        timeline_yAxis_g = chart.append("g")
        .attr("class", "timeline_axis")
        .attr("id", "date_axis")
        .attr("transform", "translate(" + (px_event-xScale_events.rangeBand()/2) +",0)")
        .call(timeline_yAxis)
        .call(customAxis);

       /* d3.select("#date_axis").selectAll(".tick")
              .append("circle")
              .attr("class",function(d,i){
                    return "tickMonth_" + i;
               })
              .attr("cx",0)
              .attr("cy",0)
              .attr("r",2)
              .attr("fill","#999999");*/

        d3.select("#date_axis").selectAll("text")
              .attr("class",function(d,i){
                    return "tickMonth_" + i;
               })
              .attr("x",-10)
              .style("text-anchor","end")
              .style("fill","#bbbbbb");

        d3.select("#date_axis").selectAll("line")
              .attr("class",function(d,i){
                    return "lineMonth_" + i;
               });
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
                    .attr("x1",px_event - xScale_events.rangeBand()/2)
                    .attr("y1",timeline_yScale(parseDate("2011-01-01")))
                    .attr("x2",px_event - xScale_events.rangeBand()/2)
                    .attr("y2",timeline_height);

        var div_line_death = chart.append("line")
                    .attr("class","timeline_divLine")
                    .attr("x1",px_death)
                    .attr("y1",timeline_yScale(parseDate("2011-01-01")))
                    .attr("x2",px_death)
                    .attr("y2",timeline_height);


        var div_line_end = chart.append("line")
                        .attr("class","timeline_divLine")
                        .attr("x1",timeline_width - 38)
                        .attr("y1",timeline_yScale(parseDate("2011-01-01")))
                        .attr("x2",timeline_width - 38)
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
                            .attr("class",function(d,i){
                                return "circle_event" + " " + chapter_check(d) + "_circle" + " " + "month_" +i;
                            })
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return timeline_yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.shelling);
                            })
                            .attr("id","shelling");

        var direct_attack_g = frequency.append("g")
                            .attr("class","direct_attack_g")
                            .attr("transform","translate(" + xScale_events("direct_attack") + ",0)")
                            .selectAll("circle")
                            .data(event_data)
                            .enter()
                            .append("circle")
                            .attr("class",function(d,i){
                                return "circle_event" + " " + chapter_check(d) + "_circle" + " " + "month_" +i;
                             })
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return timeline_yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.direct_attack);
                            })
                            .attr("id","direct_attack");

        var air_strike_g = frequency.append("g")
                            .attr("class","air_strike_g")
                            .attr("transform","translate(" + xScale_events("air_strike") + ",0)")
                            .selectAll("circle")
                            .data(event_data)
                            .enter()
                            .append("circle")
                            .attr("class",function(d,i){
                                return "circle_event" + " " + chapter_check(d) + "_circle" + " " + "month_" +i;
                            })
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
                            .attr("class",function(d,i){
                                return "circle_event" + " " + chapter_check(d) + "_circle" + " " + "month_" +i;
                            })
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
                            .attr("class",function(d,i){
                                return "circle_event" + " " + chapter_check(d) + "_circle" + " " + "month_" +i;
                            })
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return timeline_yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.chemical);
                            })
                            .attr("id","chemical");

        var barrel_bomb_g = frequency.append("g")
                            .attr("class","barrel_bomb_g")
                            .attr("transform","translate(" + xScale_events("barrel_bomb") + ",0)")
                            .selectAll("circle")
                            .data(event_data)
                            .enter()
                            .append("circle")
                            .attr("class",function(d,i){
                                return "circle_event" + " " + chapter_check(d) + "_circle" + " " + "month_" +i;
                            })
                            .attr("cx",0)
                            .attr("cy",function(d,i){
                                return timeline_yScale(d.date);
                            })
                            .attr("r",function(d){
                                return rScale_event(d.barrel_bomb);
                            })
                            .attr("id","barrel_bomb");

        div_line_frequency = chart.append("g")
                        .selectAll("line")
                        .data(legend_list1)
                        .enter()
                        .append("line")
                        .attr("class","timeline_divLine event_divLine")
                        .attr("x1",function(d){
                            return xScale_events(d);
                        })
                        .attr("y1",timeline_yScale(parseDate("2011-01-01")))
                        .attr("x2",function(d){
                            return xScale_events(d);
                        })
                        .attr("y2",timeline_height);


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
                        .range([0,143])
                        .domain([min,7000]);

                   var xAxis = d3.svg.axis()
                            .scale(xScale_d)
                            .orient("top")
                            .ticks(4)
                            .tickValues([0,3000,6000])
                            .tickFormat(d3.format("s"))
                            .tickSize(6, 0);

                    var line_graph_g = chart.append("g")
                                            .attr("transform","translate(0,0)");

                    var point_group = line_graph_g.append("g")
                                        .attr("class","point_group_d")
                                        .attr("transform","translate("+px_death+",0)")
                                        .selectAll("circle")
                                        .data(death_data)
                                        .enter();

                        point_group.append("circle")
                                    .attr("class", function(d,i){
                                            return "line_graph_g" + " " + chapter_check(d) + "_line" + " " + "circle_month_" +i;
                                    })
                                    .attr("id","death")
                                    .attr("r","1.5")
                                    .attr("cx",function(d){
                                        return xScale_d(d.num);
                                    })
                                    .attr("cy",function(d){
                                        return timeline_yScale(d.date);
                                    })
                                    .style("opacity",c_opacity1)

                        
                    var line_group = line_graph_g.append("g")
                                        .attr("class","line_group_d")
                                        .attr("transform","translate(" +px_death+",0)")
                                        .selectAll("line")
                                        .data(death_data)
                                        .enter();


                        line_group.append("line") 
                                    .attr("class", function(d,i){
                                            return "line_graph_g" + " " + chapter_check(d) + "_line" + " " + "line_month_" +i;
                                    })
                                    .attr("id", "line_d")
                                    .attr("x1",xScale_d(0))
                                    .attr("y1",function(d){
                                            return timeline_yScale(d.date);
                                    })
                                    .attr("x2",function(d){
                                            return xScale_d(d.num);
                                    })
                                    .attr("y2",function(d){
                                            return timeline_yScale(d.date);
                                    })
                                    .style("opacity",c_opacity1);


                    var line = d3.svg.line()
                                .x(function(d){ return xScale_d(d.num);})
                                .y(function(d){ return timeline_yScale(d.date);})


                    line_graph_g.append("g")
                            .attr("class","x timeline_axis")
                            .attr("transform", "translate("+px_death+"," + timeline_top +")")
                            .call(xAxis)
                            .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("dy",".71em");

                    var guideLine = line_graph_g.append("line")
                                                .attr("class","timeline_divLine guideLine")
                                                .attr("x1",px_death)
                                                .attr("x2",px_death)
                                                .attr("y1",timeline_yScale(parseDate("2011-01-01")))
                                                .attr("y2",timeline_yScale(parseDate("2016-04-01")));




                /* Chapter mask*/
                    var chapter_mask1 = chart.append("g")
                            .attr("transform","translate(0,0)")
                            .append("rect")
                            .attr("class","chapter_mask")
                            .attr("id","chapter_mask1")
                            .attr("width",605)
                            .attr("height",function(){
                                return timeline_yScale(chapter_date[1].start) - timeline_yScale(chapter_date[0].start)
                            })
                            .attr("x",px_yAxis)
                            .attr("y",timeline_yScale(parseDate("2011-01-01")));     


                    var chapter_selector = chart.append("g")
                            .attr("transform","translate(0,0)")
                            .append("rect")
                            .attr("class","chapter_selector")
                            .attr("width",timeline_width - px_event)
                            .attr("height",function(){
                                return timeline_yScale(chapter_date[1].end)-timeline_yScale(chapter_date[1].start);
                            })
                            .attr("x",px_yAxis)
                            .attr("y",timeline_yScale(chapter_date[1].start));


                    var chapter_mask2 = chart.append("g")
                            .attr("transform","translate(0,0)")
                            .append("rect")
                            .attr("class","chapter_mask")
                            .attr("id","chapter_mask2")
                            .attr("width",605)
                            .attr("height",function(){
                                return timeline_yScale(chapter_date[9].end) - timeline_yScale(chapter_date[1].end)
                            })
                            .attr("x",px_yAxis)
                            .attr("y",timeline_yScale(chapter_date[1].end));   


                /*chart monthly box for hover*/
                chart.append("g").selectAll("rect").data(dateList)
                                       .enter()
                                       .append("rect")
                                       .attr("class",function(d,i){
                                            return "monthly_box" + " " + "month_" +i; 
                                       })
                                       .attr("x",px_event)
                                       .attr("y",function(d,i){
                                         return timeline_yScale(dateList[i] - (timeline_height/128));
                                       })
                                       .attr("width",600)
                                       .attr("height",timeline_height/64)
                                       .attr("opacity",0);

                for(i=0; i<64; i++){
                    (function(){
                        var index = i;

                        d3.selectAll(".month_" + index).on("mouseover",function(){
                         //각 월에 해당하는요소 롤어보할 경우
                            d3.selectAll(".month_" + (index-3) +":not(.monthly_box)").style("opacity",function(d){
                                                                                        current_opacity = d3.select(this).style("opacity");
                                                                                        return c_opacityR;
                                                                                      })
                                                                                     .style("stroke-width",1)
                                                                                     .style("stroke","#ffffff");

                            d3.selectAll(".line_month_" + (index-3)).style("opacity",function(d){
                                                                                    current_opacity2 = d3.select(this).style("opacity");
                                                                                    return c_opacityR + 0.2;
                                                                            });
                            d3.selectAll(".circle_month_" + (index-3)).style("opacity",c_opacityR + 0.2);

                            d3.selectAll(".month_" + (index-3) +":not(.monthly_box)").moveToFront();

                            d3.selectAll(".tickMonth_" + (index)).style("fill","#ffffff");
                            d3.selectAll(".lineMonth_" + (index)).style("stroke","#ffffff");
                            d3.selectAll(".event_divLine").style("stroke","#ffffff");

                            var guideLine_x =px_death + xScale_d(death_data[index-3].num);
                            console.log(guideLine_x);
                            d3.selectAll(".guideLine").attr("x1",guideLine_x)
                                                      .attr("x2",guideLine_x);


                            d3.selectAll(".type_num").text(function(d){
                               var id = d3.select(this).attr("id");
                               
                               if(id =="shelling"){
                                    return dataCon[index-3].shelling;
                                }
                                else if(id =="barrel_bomb"){
                                    return dataCon[index-3].barrel_bomb;
                                }
                                else if(id =="battle"){
                                    return dataCon[index-3].battle;
                                }
                                else if(id =="air_strike"){
                                    return dataCon[index-3].air_strike;
                                }
                                else if(id =="chemical"){
                                    return dataCon[index-3].chemical;
                                }
                                else if(id =="direct_attack"){
                                    return dataCon[index-3].direct_attack;
                                }
                            });

                            d3.select(".num_range").text(d3.time.format("%b %Y")(dateList[index]));
                            d3.select(".death_num").text(death_data[index].num);

                        });

                        d3.selectAll(".month_" + index).on("mouseout",function(){
                        
                           /* if((timeline_current_chapter!=1)&&(timeline_current_chapter!=9)){ //특정 챕터가 아닐경우 롤아웃시 opacity를 낮추면 안된다.
                                d3.selectAll(".month_" + (index-3) +":not(.chapt" + (timeline_current_chapter-1) + "_circle)")
                                                                                    .style("opacity",current_opacity);
                            }*/
                            

                            d3.selectAll(".month_" + (index-3)).style("stroke-width",1)
                                                               .style("stroke","#222222")
                                                               .style("opacity",current_opacity);  
                            d3.selectAll(".monthly_box").style("opacity",0);

                            d3.selectAll(".line_month_" + (index-3)).style("opacity", current_opacity2);
                            d3.selectAll(".circle_month_" + (index-3)).style("opacity", current_opacity2);

                            d3.selectAll(".tickMonth_" + (index)).style("fill","#999999");
                            d3.selectAll(".lineMonth_" + (index)).style("stroke","#666666");
                            d3.selectAll(".event_divLine").style("stroke","#888888");

                            d3.selectAll(".guideLine").attr("x1",px_death)
                                                      .attr("x2",px_death);

                            total_num =[892,
                                        5567,
                                        14797,
                                        342,
                                        3543,
                                        8304];

                            d3.selectAll(".type_num").text(function(d,i){
                                                        return total_num[i];
                                                    });
                            d3.select(".num_range").text("Total");
                            d3.select(".death_num").text(total_death);
                        });

                    })();
                }
                //d3.selectAll("")




    });



    
});

function timeline_resize(){

     if(700<window.innerHeight){


        outerWidth = 750;                                  
        outerHeight = window.innerHeight - 180;

        main_svg.transition()
                .attr("width",outerWidth)
                .attr("height",outerHeight);

        timeline_width = outerWidth - timeline_margin.left - timeline_margin.right;
        timeline_height = outerHeight - timeline_margin.top - timeline_margin.bottom;


        //rescale axis//
        timeline_yScale.range([timeline_top, timeline_height]);

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

        //* mask rescale *//
        var i = timeline_current_chapter;
         d3.select("#chapter_mask1").transition()
                    .attr("height",function(){
                        return timeline_yScale(chapter_date[i].start)-timeline_yScale(chapter_date[0].start);
                    })
                    .attr("x",px_event)
                    .attr("y",timeline_yScale(chapter_date[0].start));

        d3.select(".chapter_selector").transition()
                    .attr("height",function(){
                        return timeline_yScale(chapter_date[i].end)-timeline_yScale(chapter_date[i].start);
                    })
                    .attr("x",px_event)
                    .attr("y",timeline_yScale(chapter_date[i].start));
                    
        d3.select("#chapter_mask2").transition()
                    .ease("bounce")
                    .attr("height",function(){
                        return timeline_yScale(chapter_date[9].end) - timeline_yScale(chapter_date[i].end)
                    })
                    .attr("x",px_event)
                    .attr("y",timeline_yScale(chapter_date[i].end));


        //* legend rescale *//
        legend_timeline_g.transition()
                         .attr("transform", "translate(" + 0 + "," + (timeline_height + 15) +")");

        legend_linegraph_g.transition()
                          .attr("transform", "translate(" + (px_death + 20) + "," + (timeline_height + 15) +")");

        //* grid line rescale *//
        d3.selectAll(".timeline_divLine")
                    .transition()
                    .attr("y1",timeline_yScale(parseDate("2011-01-01")))
                    .attr("y2",timeline_yScale(parseDate("2016-04-01")));

     }
    

}
function chapter_move(index){

    var i = index-1 ;
    timeline_current_chapter = i;

    d3.select("#chapter_mask1").transition()
                    .delay(300)
                    .duration(300)
                    .ease("bounce")
                    .attr("height",function(){
                        return timeline_yScale(chapter_date[i].start)-timeline_yScale(chapter_date[0].start);
                    })
                    .attr("x",px_yAxis)
                    .attr("y",timeline_yScale(chapter_date[0].start));

    d3.select(".chapter_selector").transition()
                    .delay(300)
                    .duration(300)
                    .ease("bounce")
                    .attr("height",function(){
                        return timeline_yScale(chapter_date[i].end)-timeline_yScale(chapter_date[i].start);
                    })
                    .attr("x",px_yAxis)
                    .attr("y",timeline_yScale(chapter_date[i].start));
                    
    d3.select("#chapter_mask2").transition()
                    .delay(300)
                    .duration(300)
                    .ease("bounce")
                    .attr("height",function(){
                        return timeline_yScale(chapter_date[9].end) - timeline_yScale(chapter_date[i].end)
                    })
                    .attr("x",px_yAxis)
                    .attr("y",timeline_yScale(chapter_date[i].end));

    if((1<i)&&(i<9)){ //*서브 챕터(1~7)일때 각 챕터만 보여주기
        
        d3.selectAll(".chapt" + (i-1) + "_circle").transition()
                              .delay(600)
                              .duration(300)  
                              .ease("bounce")
                              .style("opacity",c_opacity1);

        d3.selectAll(".circle_event:not(.chapt"+ (i-1) + "_circle)")
                              .transition()
                              .delay(600)
                              .duration(300)  
                              .ease("bounce")
                              .style("opacity",c_opacity2);

        d3.selectAll(".chapt" + (i-1) + "_line").transition()
                              .delay(600)
                              .duration(300)  
                              .ease("bounce")
                              .style("opacity",c_opacity1 + 0.2);

         d3.selectAll(".line_graph_g:not(.chapt" + (i-1) + "_line)")
                              .transition()
                              .delay(600)
                              .duration(300)  
                              .ease("bounce")
                              .style("opacity",c_opacity2 + 0.2);

    }
    else{ //*처음과 끝에는 다 보여주기

        d3.selectAll(".circle_event")
                              .transition()
                              .delay(600)
                              .duration(300)  
                              .ease("bounce")
                              .style("opacity",c_opacity1);

        d3.selectAll(".line_graph_g")
                              .transition()
                              .delay(600)
                              .duration(300)  
                              .ease("bounce")
                              .style("opacity",c_opacity1 + 0.2);
                              
    } 
}

function chapter_check(d){
   if((chapter_date[2].start<=d.date)&&(d.date<=chapter_date[2].end)){
        return "chapt1";
   }else if((chapter_date[3].start<=d.date)&&(d.date<=chapter_date[3].end)){
        return "chapt2";
   }else if((chapter_date[4].start<=d.date)&&(d.date<=chapter_date[4].end)){
        return "chapt3";
   }else if((chapter_date[5].start<=d.date)&&(d.date<=chapter_date[5].end)){
        return "chapt4";
   }else if((chapter_date[6].start<=d.date)&&(d.date<=chapter_date[6].end)){
        return "chapt5";
   }else if((chapter_date[7].start<=d.date)&&(d.date<=chapter_date[7].end)){
        return "chapt6";
   }else if((chapter_date[8].start<=d.date)&&(d.date<=chapter_date[8].end)){
        return "chapt7";
   }
}

       
