/* README 
Script Structure

Main code
------------------------
1.Global Variable Declare
  - Size variable
  - Temporal Data
  - Legend
  - Axis
  - SVG & Group & Position setting
  - Scale


2.Drwaing burbble chart with actual data,CSV function start--Start
  - Data initial setting
  - Call Axis
  - Append Circles (burbble chart)


3.Chapter Masking

Function definitions
------------------------
3. Redraw Function

4. ReScale Function

5. Axis Function

6. parsDate Function

7. Custom Axis Function

*/


var value = [];



                // NOTE 
//1.Global Variable Declare - Start
// NOTE size variable
width = parseInt(d3.select(".viz").style('width'));

//width = (d3.select("body").width())*0.63;
height = width;

var margin = {
              top: 20,
              left: width*0.07,
              bottom:10,
              right: width*0.01
              };


// NOTE
//Temporal data
var dataCon1 = {};       // Container for the data 각 item(사건)들의 시간,트랙,순서를 저장하는 객체
var dataCon2 = {};
var timeline_current_chapter=0;
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
var chapter_date = [{start: parseDate("2011-01-01"), end: parseDate("2016-04-01")},
                    {start: parseDate("2011-03-01"), end: parseDate("2011-06-01")},
                    {start: parseDate("2011-05-01"), end: parseDate("2012-07-01")},
                    {start: parseDate("2012-07-01"), end: parseDate("2013-04-01")},
                    {start: parseDate("2013-04-01"), end: parseDate("2014-01-01")},
                    {start: parseDate("2014-01-01"), end: parseDate("2014-12-01")},
                    {start: parseDate("2014-12-01"), end: parseDate("2015-12-01")},
                    {start: parseDate("2016-01-01"), end: parseDate("2016-04-01")},
                    {start: parseDate("2011-01-01"), end: parseDate("2016-04-01")}];

//Legend
var legend_list1 = ["barrel_bomb","battle","shelling","chemical","air_strike","direct_attack"];
var legend_text = ["Barrel Bomb","Battle","Shelling","Chemical","Air Strike","Massacre"];
var legend_list3 = ["Death"];

var year = 2011;
var month = 1;
var day = 1;

var dateList =[]; //montly box hover에 쓰일 date 배열
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


// NOTE
//axis함수에서 사용된 axis변
var timeline_yAxis; 
var timeline_yAxis_g;
var timeline_xAxis; 
var timeline_xAxis_g;
var death_xAxis;
var death_xAxis_g;


// NOTE 
//SVG & Group & Position setting
var svg_chapter3 = d3.select(".viz").append("svg")
                                    .attr("class","intro_svg_intrograph")
                                    .attr("width",width)
                                    .attr("height",height)
                                    .style("background-color","#111215;");

var g_svg_chapter3 = svg_chapter3.append("g")
                                 .attr("transform","translate(" + margin.left + "," + margin.top + ")");

var innerWidth = width - (margin.left + margin.right);
var innerHeight = height - (margin.top + margin.bottom);

var checkPoint =[
                  0.04 * innerWidth, //X-Axis,Y-Axis 시작 교차점
                  0.05 * innerWidth, //Ordinal Scale 시작점 (공격패턴)
                  0.70 * innerWidth, //Ordinal Scale 종료
                  0.75 * innerWidth, //Linear Scale 시작점(사망)
                  0.98 * innerWidth  //Llinear Scale, canvas 끝
                 ];



// NOTE 
//Scale Setting
var xScale_events = d3.scale.ordinal().rangeBands([checkPoint[1],checkPoint[2]])
                                          .domain(legend_list1);
var timeline_yScale = d3.time.scale()
                             .domain([parseDate("2011-01-01"), parseDate("2016-04-01")])
                             .range([0, innerHeight]);

var yScale_unit = innerHeight/64;

var xScale_d;
var rScale;

//ETC
//** 이벤트 써클 오버서티 **//
var c_opacity1 = 0.45;
var c_opacity2 = 0.05;
var c_opacityR = 0.7;
var current_opacity;
var current_opacity2;

//1.Global Variable Declare--END






//NOTE
//2.Drwaing burbble chart with actual data,CSV function start--Start
d3.csv("data/event_num_long.csv",function(event_data){

  //NOTE
  //Data initial setting
  event_data.forEach(function (item){               
                        item.date = parseDate(item.date);
                        item.value = +item.value;
                    });

  dataCon1 = event_data;
  var max = d3.max(event_data,function(d){return d.value});
  

  var maxRange = innerWidth/12;

  rScale = d3.scale.sqrt()
                   .domain([0,max])
                   .range([0,maxRange]);


  //NOTE Call Axis
  timeline_yAxis();
  timeline_xAxis();

  g_svg_chapter3.append("rect")
              .attr("class","chart_border")
              .attr("x",checkPoint[0])
              .attr("y",0)
              .attr("width",checkPoint[4]-checkPoint[0])
              .attr("height",innerHeight);

  g_svg_chapter3.append("line")
              .attr("class","border_line")
              .attr("x1",checkPoint[3])
              .attr("x2",checkPoint[3])
              .attr("y1",0)
              .attr("y2",innerHeight);

  var guideLine = g_svg_chapter3.append("line")
                              .attr("class","timeline_divLine guideLine")
                              .attr("x1",checkPoint[3])
                              .attr("x2",checkPoint[3])
                              .attr("y1",timeline_yScale(parseDate("2011-01-01")))
                              .attr("y2",timeline_yScale(parseDate("2016-04-01")));

  //NOTE Chapter masking
 /* var chapter_mask1 = g_svg_chapter3.append("rect")
                                    .attr("class","chapter_mask")
                                    .attr("id","chapter_mask1")
                                    .attr("width",(checkPoint[2]-checkPoint[1]))
                                    .attr("height",0)
                                    .attr("x",checkPoint[1])
                                    .attr("y",timeline_yScale(parseDate("2011-01-01")));*/

  var chapter_selector = g_svg_chapter3.append("g")
                                    .attr("transform","translate(0,0)")
                                    .append("rect")
                                    .attr("class","chapter_selector")
                                    .attr("width",(checkPoint[4]-checkPoint[0]))
                                    .attr("height",timeline_yScale(parseDate("2016-04-01"))-timeline_yScale(parseDate("2011-01-01")))
                                    .attr("x",checkPoint[0])
                                    .attr("y",timeline_yScale(parseDate("2011-01-01")));

 /* var chapter_mask2 = g_svg_chapter3.append("rect")
                                    .attr("class","chapter_mask")
                                    .attr("id","chapter_mask1")
                                    .attr("width",(checkPoint[2]-checkPoint[1]))
                                    .attr("height",0)
                                    .attr("x",checkPoint[1])
                                    .attr("y",timeline_yScale(parseDate("2016-04-01")));*/

  //NOTE Append Circles (burbble chart)
  var g_burble_chart = g_svg_chapter3.append("g")
                            .attr("transform","translate(" + 0 + ",0)");

  g_burble_chart.selectAll("g")
         .data(dataCon1)
         .enter()
         .append("g")
         .attr("class",function(d,i){
            return "group_event_" + (i%60);
         })
         .append("circle")
         .attr("value",function(d){return d.value;})
         .attr("class",function(d,i){
             return "circle_event" + " " + chapter_check(d) + "_circle" + " " + "month_" +(i%60);
         })
         .attr("id",function(d){
            return d.event_type;
         })
         .attr("r",function(d){
            return rScale(d.value);
         })
         .attr("cx",function(d){
            return xScale_events(d.event_type) + xScale_events.rangeBand()/2;
         })
         .attr("cy",function(d){
            return timeline_yScale(d.date);
         })
         .attr("stroke-width","0.25px")
         .attr("stroke","#111111")


         d3.csv("data/death_per_month.csv",function(death_data){
  
            //NOTE
            //
            death_data.forEach(function(item){
                        item.date = parseDate(item.date);
                        item.num = +item.num;
            });

            dataCon2 = death_data;

            //Scale setting
            var max = d3.max(death_data,function(d){return d.value});
            

            xScale_d = d3.scale.linear()
                                  .range([checkPoint[3],checkPoint[4]])
                                  .domain([0,7000]); 

            //NOTE Call Axis
            death_xAxis();

            var g_line_chart = g_svg_chapter3.append("g")
                                             .attr("transform","translate(0,0)");



            g_line_chart.selectAll("line")
                        .data(dataCon2)
                        .enter()
                        .append("line")
                        .attr("class", function(d,i){
                                return "death_line" + " " + chapter_check(d) + "_line" + " " + "line_month_" +i;
                        })
                        .attr("id","death")
                        .attr("x1",xScale_d(0))
                        .attr("x2",function(d){
                            return xScale_d(d.num);
                        })
                        .attr("y1",function(d){
                            return timeline_yScale(d.date);
                        })
                        .attr("y2",function(d){
                            return timeline_yScale(d.date);
                        });

            g_line_chart.selectAll("circle")
                        .data(dataCon2)
                        .enter()
                        .append("circle")
                        .attr("class", function(d,i){
                                return "death_circle" + " " + chapter_check(d) + "_line" + " " + "circle_month_" +i;
                        })
                        .attr("id","death")
                        .attr("cx",function(d){
                          return xScale_d(d.num);
                        })
                        .attr("cy",function(d){
                          return timeline_yScale(d.date);
                        })
                        .attr("r","0.1em");



            //NOTE Adding Monthly box
            /*chart monthly box for hover*/
            g_svg_chapter3.append("g").selectAll("rect").data(dateList)
                                   .enter()
                                   .append("rect")
                                   .attr("class",function(d,i){
                                        return "monthly_box" + " " + "month_" +i; 
                                   })
                                   .attr("x",checkPoint[0])
                                   .attr("y",function(d,i){
                                     return timeline_yScale(dateList[i]) - yScale_unit/2;
                                   })
                                   .attr("width",checkPoint[4]-checkPoint[0])
                                   .attr("height",innerHeight/64)
                                   .attr("opacity",0);

            /*Adding Event Listener to Monthly box*/
          /*   for(i=0; i<64; i++){
                (function(){
                  var index=i;
                  d3.selectAll(".month_" + index).on("mouseover",function(){
                      console.log("month: " + index);

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

                        d3.selectAll(".tickMonth_" + (index)).style("fill","#aaaaaa");
                        d3.selectAll(".lineMonth_" + (index)).style("stroke","#aaaaaa");
                        d3.selectAll(".event_line").style("stroke","#666666");
                        d3.selectAll(".guideLine").style("stroke","#aaaaaa");  

                        var guideLine_x =xScale_d(death_data[index-3].num);
                            
                        d3.selectAll(".guideLine").attr("x1",guideLine_x)
                                                  .attr("x2",guideLine_x);

 
                        
                        d3.selectAll(".group_event_" + (index-3)).append("text")
                                                                 .attr("class","tooltip")
                                                                 //.attr("id",function(d){
                                                                 //   return d.event_type;
                                                                 //})
                                                                 .attr("x",function(d){
                                                                    return xScale_events(d.event_type) + xScale_events.rangeBand()/2;
                                                                 })
                                                                 .attr("y",function(d){
                                                                  console.log(d.date);
                                                                    return timeline_yScale(d.date) + yScale_unit/2;

                                                                 })
                                                                 .text(function(d){
                                                                    return d.value;
                                                                 });
                                      


                      });//Rollover End


                  d3.selectAll(".month_" + index).on("mouseout",function(){

                        

                       d3.selectAll(".month_" + (index-3)).style("stroke-width",1)
                                                               .style("stroke","#222222")
                                                               .style("opacity",current_opacity);
                       d3.selectAll(".monthly_box").style("opacity",0);  

                       d3.selectAll(".line_month_" + (index-3)).style("opacity", current_opacity2);
                       d3.selectAll(".circle_month_" + (index-3)).style("opacity", current_opacity2);

                       d3.selectAll(".tickMonth_" + (index)).style("fill","#aaaaaa");
                       d3.selectAll(".lineMonth_" + (index)).style("stroke","#444444");
                       d3.selectAll(".event_line").style("stroke","#444444");

                       d3.selectAll(".guideLine").style("stroke","#444444");
                       d3.selectAll(".guideLine").attr("x1",checkPoint[3])
                                                 .attr("x2",checkPoint[3]);

                       d3.selectAll(".group_event_" + (index-3)).selectAll("text").remove();

                   });//Rollout end

                  
                  })();//function End
                }*/


          }); //CSV function end

});
//2.Drwaing burbble chart with actual data,CSV function start--End


//

//NOTE
//3.Redraw function
function reDraw(){
  
  width = parseInt(d3.select(".viz").style('width'));
  //width = (d3.select("body").width())*0.63;
  height = width;
  margin = {
            top: 20,
            left: width*0.05,
            bottom:10,
            right: width*0.01
            };

  innerWidth = width - (margin.left + margin.right);
  innerHeight = height - (margin.top + margin.bottom);  

  checkPoint =[
                  0.04 * innerWidth, //X-Axis,Y-Axis 시작 교차점
                  0.05 * innerWidth, //Ordinal Scale 시작점 (공격패턴)
                  0.70 * innerWidth, //Ordinal Scale 종료
                  0.75 * innerWidth, //Linear Scale 시작점(사망)
                  0.98 * innerWidth  //Llinear Scale, canvas 끝
              ];


  svg_chapter3.transition().duration(0)
               .attr("width",width)
               .attr("height",height);

  reScale();

  d3.select(".chart_border")
              .transition().duration(0)
              .attr("x",checkPoint[0])
              .attr("y",0)
              .attr("width",checkPoint[4]-checkPoint[0])
              .attr("height",innerHeight);

 d3.select(".border_line")
              .transition().duration(0)
              .attr("x1",checkPoint[3])
              .attr("x2",checkPoint[3])
              .attr("y1",0)
              .attr("y2",innerHeight);

  //Axis rescale
  timeline_yAxis
    .tickSize(checkPoint[4] - checkPoint[0],0);

  d3.select(".yAxis_timeline").transition().duration(0)
                              .attr("transform", "translate(" + checkPoint[0] +",0)")
                              .call(timeline_yAxis);

  d3.select(".yAxis_timeline").selectAll("text")
                              .transition().duration(0)
                              .attr("class",function(d,i){
                                    return "tickMonth_" + i;
                               })
                              .attr("x","-0.5em")
                              .style("text-anchor","end")
                              .style("fill","#bbbbbb");


  timeline_xAxis.tickSize(-innerHeight,0)

  d3.select(".xAxis_timeline").transition().duration(0)
                              .attr("transform","translate(0,0)")
                              .call(timeline_xAxis);
                              
  timeline_xAxis_g.selectAll("text")
                  .transition().duration(0)
                  .attr("y","-1em")
                  .text(function(d,i){
                    return legend_text[i];
                  });

  d3.select(".death_xAxis").transition().duration(0)
                           .attr("transform", "translate(0,0)")
                           .call(death_xAxis);


  d3.select(".guideLine").transition().duration(0)
            .attr("x1",checkPoint[3])
            .attr("x2",checkPoint[3])
            .attr("y1",timeline_yScale(parseDate("2011-01-01")))
            .attr("y2",timeline_yScale(parseDate("2016-04-01")));

  //chart rescale
   d3.selectAll(".circle_event")
         .transition().duration(0)
         .attr("r",function(d){
            return rScale(d.value);
         })
         .attr("cx",function(d){
            return xScale_events(d.event_type) + xScale_events.rangeBand()/2;
         })
         .attr("cy",function(d){
            return timeline_yScale(d.date);
         });    


   d3.selectAll(".death_line")
      .transition().duration(0)
      .attr("x1",xScale_d(0))
      .attr("x2",function(d){
          return xScale_d(d.num);
      })
      .attr("y1",function(d){
          return timeline_yScale(d.date);
      })
      .attr("y2",function(d){
          return timeline_yScale(d.date);
      });


    d3.selectAll(".death_circle")
      .transition().duration(0)
      .attr("cx",function(d){
        return xScale_d(d.num);
      })
      .attr("cy",function(d){
        return timeline_yScale(d.date);
      })
      .attr("r","0.1em");

    d3.selectAll(".monthly_box")
       .transition().duration(0)
       .attr("x",checkPoint[0])
       .attr("y",function(d,i){
         return timeline_yScale(dateList[i]) - yScale_unit/2;
       })
       .attr("width",checkPoint[4]-checkPoint[0])
       .attr("height",innerHeight/64)
       .attr("opacity",0);

  //Chapter selector rescale
  chapter_move(timeline_current_chapter);


}




//NOTE
//reScale Function
function reScale(){

  xScale_events.rangeBands([checkPoint[1],checkPoint[2]]);
  timeline_yScale.range([0, innerHeight]);
  yScale_unit = innerHeight/64;
  xScale_d.range([checkPoint[3],checkPoint[4]]);

  var maxRange = innerWidth/12;
  rScale.range([0,maxRange]);

}

function timeline_xAxis(){

  timeline_xAxis = d3.svg.axis()
                         .scale(xScale_events)
                         .orient("top")
                         .tickSize(-innerHeight,0);

  timeline_xAxis_g = g_svg_chapter3.append("g")
                                   .attr("class","timeline_axis xAxis_timeline")
                                   .attr("id","date_axis")
                                   .attr("transform","translate(0,0)")
                                   .call(timeline_xAxis);
                                   


  timeline_xAxis_g.selectAll("text")
                  .attr("id",function(d){
                    return d;
                  })
                  .attr("y","-1em")
                  .text(function(d,i){
                    return legend_text[i];
                  });

  timeline_xAxis_g.selectAll("line")
                  .attr("class","event_line");
                                 
}


//Note
//Axis Function
function timeline_yAxis(){

    var datelist =[1];

    for(var i=0; i<5; i++){
        for(var j=1; j<7; j++){
            datelist.push("201" + i + "-" + j*2 + "-01");
        }
    }

    timeline_yAxis = d3.svg.axis()
                           .scale(timeline_yScale)
                           .orient("right")
                           .tickSize(checkPoint[4] -checkPoint[0] ,0)
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

     timeline_yAxis_g = g_svg_chapter3.append("g")
                                     .attr("class", "timeline_axis yAxis_timeline")
                                     .attr("id", "date_axis")
                                     .attr("transform", "translate(" + checkPoint[0] +",0)")
                                     .call(timeline_yAxis)
                                     .call(customAxis);

      d3.select(".yAxis_timeline").selectAll("text")
                              .attr("class",function(d,i){
                                    return "tickMonth_" + i;
                               })
                              .attr("x","-0.5em")
                              .style("text-anchor","end")
                              .style("fill","#bbbbbb");

      d3.select(".yAxis_timeline").selectAll("line")
                              .attr("class",function(d,i){
                                    return "lineMonth_" + i;
                               });

}

function death_xAxis(){
  death_xAxis = d3.svg.axis()
                          .scale(xScale_d)
                          .orient("top")
                          .ticks(4)
                          .tickValues([0,3000,6000])
                          .tickFormat(d3.format("s"))
                          .tickSize(6,0);

  death_xAxis_g = g_svg_chapter3.append("g")
                                    .attr("class","timeline_axis death_xAxis")
                                    .attr("transform", "translate(0,0)")
                                    .call(death_xAxis);

}



//NOTE
//dateParsing function
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

//Custom Axis
function customAxis(g) {
  g.selectAll("text")
      .attr("x", -50)
      .attr("dy", 3);
}

function chapter_move(index){
   var i = index ;
   timeline_current_chapter = i;


    //Cahpter select
    d3.select(".chapter_selector").transition().duration(0)
                    .delay(150)
                    .duration(300)
                    .ease("bounce")
                    .attr("width",checkPoint[4]-checkPoint[0])
                    .attr("height",function(){
                        return timeline_yScale(chapter_date[i].end)-timeline_yScale(chapter_date[i].start);
                    })
                    .attr("x",checkPoint[0])
                    .attr("y",timeline_yScale(chapter_date[i].start));


    //Opacity highlgiht
    if((0<i)&&(i<8)){ //*서브 챕터(1~7)일때 각 챕터만 보여주기
        console.log("chapter: " + i)
        d3.selectAll(".chapt" + i + "_circle").transition()
                              .delay(150)
                              .duration(300)  
                              .ease("bounce")
                              .style("opacity",c_opacity1);

        d3.selectAll(".circle_event:not(.chapt"+ i + "_circle)")
                              .transition()
                              .delay(150)
                              .duration(300)  
                              .ease("bounce")
                              .style("opacity",c_opacity2);

        d3.selectAll(".death_circle:not(.chapt"+ i + "_circle)")
                              .transition()
                              .delay(150)
                              .duration(300)  
                              .ease("bounce")
                              .style("opacity",c_opacity2 + 0.2);

        d3.selectAll(".chapt" + i + "_line").transition()
                              .delay(150)
                              .duration(300)  
                              .ease("bounce")
                              .style("opacity",c_opacity1 + 0.2);

        d3.selectAll(".death_line:not(.chapt" + i + "_line)")
                              .transition()
                              .delay(150)
                              .duration(300)  
                              .ease("bounce")
                              .style("opacity",c_opacity2 + 0.2);

    }
    else{ //*처음과 끝에는 다 보여주기

        d3.selectAll(".circle_event")
                              .transition()
                              .delay(150)
                              .duration(300)  
                              .ease("bounce")
                              .style("opacity",c_opacity1);

        d3.selectAll(".death_line")
                              .transition()
                              .delay(150)
                              .duration(300)  
                              .ease("bounce")
                              .style("opacity",c_opacity1 + 0.2);

        d3.selectAll(".death_circle")
                              .transition()
                              .delay(150)
                              .duration(300)  
                              .ease("bounce")
                              .style("opacity",c_opacity1 + 0.2);
                              
    } 

}

function chapter_check(d){
   if((chapter_date[1].start<=d.date)&&(d.date<=chapter_date[1].end)){
        return "chapt1";
   }else if((chapter_date[2].start<=d.date)&&(d.date<=chapter_date[2].end)){
        return "chapt2";
   }else if((chapter_date[3].start<=d.date)&&(d.date<=chapter_date[3].end)){
        return "chapt3";
   }else if((chapter_date[4].start<=d.date)&&(d.date<=chapter_date[4].end)){
        return "chapt4";
   }else if((chapter_date[5].start<=d.date)&&(d.date<=chapter_date[5].end)){
        return "chapt5";
   }else if((chapter_date[6].start<=d.date)&&(d.date<=chapter_date[6].end)){
        return "chapt6";
   }else if((chapter_date[7].start<=d.date)&&(d.date<=chapter_date[7].end)){
        return "chapt7";
   }else if((chapter_date[8].start<=d.date)&&(d.date<=chapter_date[8].end)){
        return "chapt8";
   }
}