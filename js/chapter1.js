// size variable
var margin = {
              top:30,
              left:30,
              bottom:0,
              right:40
              };
              
width = parseInt(d3.select(".viz").style('width'));
//width = (d3.select("body").width())*0.63;
height = width * 0.7;

//DATA
var dataCon;

//SVG & Group
var svg_chapter1 = d3.select(".viz").append("svg")
                                    .attr("class","intro_svg_intrograph")
                                    .attr("width",width)
                                    .attr("height",height)
                                    .style("background-color","rgba(0,0,0,0)");

var g_svg_chapter1 = svg_chapter1.append("g")
                                 .attr("transform","translate(0,0)");

var g_marking = svg_chapter1.append("g")
                            .attr("transform","translate(0,0)");

//Scale
var x_line;
var y_line;

//Data
var year = [parseDate("1968-12-31"),parseDate("1980-12-31"),parseDate("1992-12-31"),parseDate("2000-12-31"),parseDate("2011-12-31")]; 
var marking_events = [{year:"1971", title:"Hafez al-Assad was elected as a president"},{year: "1982", title:"Hamma massacre: 10,000-40,000 casulties "},{ year: "2000", title:"Hafez's death and al-Assad Regime began"}];
var chapter_list = [{start: "1967-01-31", end: "1967-12-31"},
                    {start: "1968-12-31", end: "1982-12-31"},
                    {start: "1982-12-31", end: "2000-12-31"},
                    {start: "2000-01-01", end: "2001-12-31"},
                    {start: "2001-12-31", end: "2011-12-31"}];
var current_chapter = chapter_list[0];

//Axis
var xAxis;
var yAxis;

//line object
var graph_line;
var graph_area;

d3.csv("data/refugees_by_years_df.csv",function(data){
  console.log("JS file CSV function loaded");
    //data initiall setting
    data.forEach(function(d){
            d.value = +d.value;
            d.year = d.year + "-12-31";
            d.year = parseDate(d.year);
      });

    dataCon = data;
    var maxValue = d3.max(dataCon,function(d){ return d.value}); 
    

    //scale setting
    x_line = d3.time.scale()
                    .domain([year[0],year[4]])
                    .range([margin.left,width-margin.right]);

    y_line = d3.scale.linear()
                     .domain([0,maxValue])
                     .range([height-margin.top,margin.bottom]);

    //Axis setting
    xAxis = d3.svg.axis()
        .scale(x_line)
        .orient("bottom")
        .tickSize(5,0)
        .ticks(12)
        .tickValues(year)
        .tickFormat(function(d){ return toYear(d);});

    var xAxis_g = g_svg_chapter1.append("g")
        .attr("class", "intrograph_axis xAxis")
        .attr("id", "intrograph_date_axis")
        .attr("transform", "translate(0," + (height-margin.top) + ")")
        .call(xAxis);

    yAxis = d3.svg.axis()
        .scale(y_line)
        .orient("right")
        .tickSize(5,0)
        .ticks(5)
        .tickFormat(d3.format("s"));

    var yAxis_g = g_svg_chapter1.append("g")
        .attr("class", "intrograph_axis yAxis")
        .attr("id", "intrograph_date_axis")
        .attr("transform","translate(" + (width - margin.right + 10) + ",0)")
        .call(yAxis);


    //Drawing graph
        //Drawing line
    graph_line = d3.svg.line()
                        .x(function(d){return x_line(d.year)})
                        .y(function(d){return y_line(d.value)})
                        .interpolate("monotone");

    var line_path = g_svg_chapter1.append("g")
                         .attr("transform","translate(0,0)")
                         .append("path")
                         .datum(dataCon)
                         .attr("d",graph_line)
                         .attr("class","intro_graph");

        //Drawing Area
    graph_area = d3.svg.area()
                          .x(function(d) { return x_line(d.year);})
                          .y0(y_line(0))
                          .y1(function(d){ return y_line(d.value);})
                          .interpolate("monotone");

    var area_path = g_svg_chapter1
                         .append("g")
                         .attr("class","area_intrograph")
                         .attr("transform","translate(0,0)")
                         .append("path")
                         .datum(dataCon)
                         .attr("d",graph_area)
                         .attr("class","intro_area");

    area_popYear(chapter_list[0]);

        //Adding annotation
    markingEvent(marking_events);

   
  });//csv function end;

function reDraw(){

    //*assign size from css (media query) 
    width = parseInt(d3.select(".viz").style('width'));
    height = width * 0.7;

    svg_chapter1.transition()
            .attr("width",width)
            .attr("height",height);

    //scale resize
    x_line.range([margin.left,width-margin.right]);
    y_line.range([height-margin.top,margin.bottom]);

    //rescale line
    d3.select(".intro_graph").transition()
                             .attr("d",graph_line);

    //d3.select(".intro_area").remove();

    graph_area = d3.svg.area()
                          .x(function(d) { return x_line(d.year);})
                          .y0(y_line(0))
                          .y1(function(d){ return y_line(d.value);})
                          .interpolate("monotone");

   d3.select(".intro_area")
                         .transition()
                         .attr("d",graph_area)
                         .attr("class","intro_area");

    area_popYear(current_chapter);

    //rescale Axis
    d3.select(".xAxis").transition()
                       .attr("transform", "translate(0," + (height-margin.top) + ")")
                       .call(xAxis);

    d3.select(".yAxis").transition()
                       .attr("transform","translate(" + (width - margin.right + 10) + ",0)")
                       .call(yAxis);


    //resecale annotation
    d3.selectAll(".c1").transition()
                    .attr("cx",function(d){
                          var toYear = d.year + "-12-31"
                          return x_line(parseDate(toYear));
                      })    
                      .attr("cy",function(d){
                          var index = d.year - 1968;
                          return y_line(dataCon[index].value);
                      });

    d3.selectAll(".c2").transition()
                    .attr("cx",function(d){
                          var toYear = d.year + "-12-31"
                          return x_line(parseDate(toYear));
                      })    
                      .attr("cy",function(d){
                          var index = d.year - 1968;
                          //return y_line(dataCon[index].value) - 100;
                          var svg_height = d3.select('.intro_svg_intrograph').attr("height");
                          return svg_height/2;
                      }); 

    d3.selectAll(".l1").transition()
                        .attr("x1",function(d){
                            var toYear = d.year + "-12-31"
                            return x_line(parseDate(toYear));
                        })
                        .attr("x2",function(d){
                            var toYear = d.year + "-12-31"
                            return x_line(parseDate(toYear));
                        })
                        .attr("y1",function(d){
                              var index = d.year - 1968;
                              //return y_line(dataCon[index].value) - 100;
                              var svg_height = d3.select('.intro_svg_intrograph').attr("height");
                              return svg_height/2;
                         })
                        .attr("y2",function(d){
                              var index = d.year - 1968;
                              return y_line(dataCon[index].value);
                         });

    d3.selectAll("tspan").transition()
                          .attr("x",function(d){
                                var toYear = d.year + "-12-31"
                                return x_line(parseDate(toYear)) - 5;
                              })
                          .attr("y",function(d){
                              var index = d.year - 1968;
                              //return y_line(dataCon[index].value) - 275;
                               var svg_height = d3.select('.intro_svg_intrograph').attr("height");
                               return svg_height/2 - 45;
                          });

    //d3.selectAll(".chart_caption").call(wrap,110);                   

}//redraw function end;

function markingEvent(marking_events){
    var marking_events = g_marking.selectAll("g")
                                        .data(marking_events)
                                        .enter();

    marking_events.append("circle")
                  .attr("class","marking_events c1 caption_g")
                  .attr("id",function(d,i){
                    return "caption_g" + i;
                  })
                  .attr("r",2)
                  .attr("cx",function(d){
                      var toYear = d.year + "-12-31"
                      return x_line(parseDate(toYear));
                  })    
                  .attr("cy",function(d){
                      var index = d.year - 1968;
                      return y_line(dataCon[index].value);
                  }); 


    marking_events.append("circle")
                  .attr("class","marking_events c2 caption_g")
                  .attr("id",function(d,i){
                    return "caption_g" + i;
                  })
                  .attr("r",2)
                  .attr("cx",function(d){
                      var toYear = d.year + "-12-31"
                      return x_line(parseDate(toYear));
                  })    
                  .attr("cy",function(d){
                      var index = d.year - 1968;
                      //return y_line(dataCon[index].value) - 100;
                      var svg_height = d3.select('.intro_svg_intrograph').attr("height");
                      return svg_height/2;
                  }); 

    marking_events.append("line")
                .attr("class","marking_events_line l1 caption_g")
                .attr("id",function(d,i){
                  return "caption_g" + i;
                })
                .attr("x1",function(d){
                    var toYear = d.year + "-12-31";
                    return x_line(parseDate(toYear));
                })
                .attr("x2",function(d){
                    var toYear = d.year + "-12-31";
                    return x_line(parseDate(toYear));
                })
                .attr("y1",function(d){
                      var index = d.year - 1968;
                      //return y_line(dataCon[index].value) - 100;
                      var svg_height = d3.select('.intro_svg_intrograph').attr("height");
                      return svg_height/2;
                 })
                .attr("y2",function(d){
                      var index = d.year - 1968;
                      return y_line(dataCon[index].value);
                 }); 

    marking_events.append("text")
                  .attr("class","chart_caption caption_g")
                  .attr("id",function(d,i){
                    return "caption_g" + i;
                  })
                  .attr("x",function(d){
                    var toYear = d.year + "-12-31";
                    return x_line(parseDate(toYear)) - 5;
                  })
                  .attr("y",function(d){
                      var index = d.year - 1968;
                      //return y_line(dataCon[index].value) - 275;
                      var svg_height = d3.select('.intro_svg_intrograph').attr("height");
                      return svg_height/2 - 45;
                  })
                  .text(function(d){
                    return d.title;
                  })
                  .attr("dy","0.8em")

    d3.selectAll(".chart_caption:not(#caption1)").call(wrap,90); 
    d3.selectAll("#caption1").call(wrap,110); 
}

function area_popYear(chapter_list){
    var popData = dataCon.filter(function(d){ return (parseDate(chapter_list.start) <= d.year)&&(d.year <= parseDate(chapter_list.end));})

    d3.select(".area_intrograph").selectAll("path")
                            .datum(popData)
                            .attr("d",graph_area)
                            .transition()
                            .duration(0);
                            
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

function toYear(date) {
      
        var year = date.getFullYear();

            return year;       
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", d3.select(this).attr("x")).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", d3.select(this).attr("x")).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}