// size variable

              
width = parseInt(d3.select(".viz").style('width'));
console.log(width);
//width = (d3.select("body").width())*0.63;
height = width;

var margin = {
              top: 20,
              left: width*0.07,
              bottom:10,
              right: width*0.01
              };

var timeline = {},   // The timeline data를 포함,label,axis시각적 요소까지 포함하는 timeline객첵 
    dataCon = {};       // Container for the data 각 item(사건)들의 시간,트랙,순서를 저장하는 객체

var timeline_current_chapter=0;

//axis함수에서 사용된 axis변
var timeline_yAxis; 
var timeline_yAxis_g;
var timeline_xAxis; 
var timeline_xAxis_g;
var death_xAxis;
var death_xAxis_g;

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

//Legend
var legend_list1 = ["barrel_bomb","battle","shelling","chemical","air_strike","direct_attack"];
var legend_text = ["Barrel Bomb","Battle","Shelling","Chemical","Air Strike","Massacre"];
var legend_list3 = ["Death"];

//SVG & Group & Position setting
var svg_chapter3 = d3.select(".viz").append("svg")
                                    .attr("class","intro_svg_intrograph")
                                    .attr("width",width)
                                    .attr("height",height)
                                    .style("background-color","#111111");

var g_svg_chapter3 = svg_chapter3.append("g")
                                 .attr("transform","translate(" + margin.left + "," + margin.top + ")");

var innerWidth = width - (margin.left + margin.right);
var innerHeight = height - (margin.top + margin.bottom);

var checkPoint =[
                  0.05 * innerWidth, //X-Axis,Y-Axis 시작 교차점
                  0.05 * innerWidth, //Ordinal Scale 시작점 (공격패턴)
                  0.70 * innerWidth, //Ordinal Scale 종료
                  0.75 * innerWidth, //Linear Scale 시작점(사망)
                  1.00 * innerWidth  //Llinear Scale, canvas 끝
                 ];

//Scale Setting
var xScale_events = d3.scale.ordinal().rangeBands([checkPoint[1],checkPoint[2]])
                                          .domain(legend_list1);
var timeline_yScale = d3.time.scale()
                             .domain([parseDate("2011-01-01"), parseDate("2016-04-01")])
                             .range([0, innerHeight]);

 var xScale_d = d3.scale.linear()
                        .range([checkPoint[3],checkPoint[4]])
                        .domain([0,7000]); 

//Call Axis
timeline_yAxis();
timeline_xAxis();
death_xAxis();

function reDraw(){
  
  width = parseInt(d3.select(".viz").style('width'));
  //width = (d3.select("body").width())*0.63;
  height = width * 0.8;
  margin = {
            top: 20,
            left: width*0.05,
            bottom:10,
            right: width*0.01
            };

  innerWidth = width - (margin.left + margin.right);
  innerHeight = height - (margin.top + margin.bottom);  

  checkPoint =[
                  0.05 * innerWidth, //X-Axis,Y-Axis 시작 교차점
                  0.05 * innerWidth, //Ordinal Scale 시작점 (공격패턴)
                  0.70 * innerWidth, //Ordinal Scale 종료
                  0.75 * innerWidth, //Linear Scale 시작점(사망)
                  1.00 * innerWidth  //Llinear Scale, canvas 끝
              ];


  svg_chapter3.transition()
               .attr("width",width)
               .attr("height",height);

  reScale();

  timeline_yAxis
    .tickSize(innerWidth - checkPoint[0] ,0);

  d3.select(".yAxis_timeline").transition()
                              .attr("transform", "translate(" + checkPoint[0] +",0)")
                              .call(timeline_yAxis);

  d3.select(".yAxis_timeline").selectAll("text")
                              .transition()
                              .attr("class",function(d,i){
                                    return "tickMonth_" + i;
                               })
                              .attr("x",-10)
                              .style("text-anchor","end")
                              .style("fill","#bbbbbb");
/*
  d3.select(".yAxis_timeline").selectAll("line")
                              .transition()
                              .attr("class",function(d,i){
                                    return "lineMonth_" + i;
                               });
*/
  timeline_xAxis.tickSize(-innerHeight,0)

  d3.select(".xAxis_timeline").transition()
                              .attr("transform","translate(0,0)")
                              .call(timeline_xAxis);

  d3.select(".death_xAxis").transition()
                           .attr("transform", "translate(0,0)")
                           .call(death_xAxis);


}

function reScale(){

  xScale_events.rangeBands([checkPoint[1],checkPoint[2]]);
  timeline_yScale.range([0, innerHeight]);
  xScale_d.range([checkPoint[3],checkPoint[4]]);

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
                                 
}

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
    .tickSize(innerWidth - checkPoint[0] ,0)
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
                              .attr("x",-10)
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

function customAxis(g) {
  g.selectAll("text")
      .attr("x", -50)
      .attr("dy", 3);
}