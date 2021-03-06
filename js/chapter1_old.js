// main svg,group
var intro_svg_intrograph;
var intro_g_intrograph;

//size, margin value
var intro_width_intrograph = 860;
//var intro_height_intrograph = 700;
var intro_height_intrograph = window.innerHeight - 160;
var intro_intrograph_margin = {
                top:40,
                left:80,
                right:80,
                bottom:40
            };
//var graph_top_margin = 10;

//data container, scale
var intro_dataCon;
var intro_popData;
var x_scale_intrograph;
var y_scale_intrograph;
var x_area_intrograph;
var y_area_introgrpah;

var intro_marking_g;
var marking_events = [{year:"1971", title:"Hafez al-Assad became the President of Syria"},{year: "1982", title:"Hamma massacre: 10,000-40,000 casulties "},{ year: "2000", title:"Hafez's death and al-Assad Regime began"}];

//year list to put in X scale
var preline_graph_year = [parseDate("1968-12-31"),parseDate("1980-12-31"),parseDate("1992-12-31"),parseDate("2000-12-31"),parseDate("2011-12-31")]; 
var chapter_list = [{start: "1967-01-31", end: "1967-12-31"},
                    {start: "1968-12-31", end: "1982-12-31"},
                    {start: "1982-12-31", end: "2000-12-31"},
                    {start: "2000-01-01", end: "2001-12-31"},
                    {start: "2001-12-31", end: "2011-12-31"}];

//svg group declare
intro_svg_intrograph = d3.select(".viz").append("svg")
							  .attr("class","intro_svg_intrograph")
							  .attr("width",intro_width_intrograph)
							  .attr("height",intro_height_intrograph)
							  .style("background-color","#111111");



intro_g_intrograph = intro_svg_intrograph.append("g")
								 .attr("transfrom","translate(0,0)");

intro_marking_g = intro_svg_intrograph.append("g")
                 .attr("transform","translate(0,0)");

var introgaph_title_g = intro_svg_intrograph.append("g")
                                            .attr("transform","translate(50,50)");

    introgaph_title = introgaph_title_g.append("text")
                                       .attr("class","chart_title")
                                       .attr("x",0)
                                       .attr("y",0);

    introgaph_title.append("tspan")
          .attr("dy","1.1em")
          .attr("x",60)
          .text("The Number of Refugees");

    introgaph_title.append("tspan")
          .attr("dy","1.1em")
          .attr("x",60)
          .text("During 4decades of");

    introgaph_title.append("tspan")
          .attr("dy","1.1em")
          .attr("x",60)
          .text("Dictatorship");

var pre_timeAxis_circle;
var intrograph_circle;
var intrograph_line;
var intrograph_area;

var refugee_sum_area;
//open csv
d3.csv("data/refugees_by_years_df.csv",function(data){

//data initiall setting
	data.forEach(function(d){
          d.value = +d.value;
          d.year = d.year + "-12-31";
          d.year = parseDate(d.year);
    });

    intro_dataCon = data;

    var maxValue = d3.max(intro_dataCon,function(d){ return d.value});

    x_scale_intrograph = d3.time.scale()
    						  .domain([preline_graph_year[0],preline_graph_year[4]])
    						  .range([intro_intrograph_margin.left,intro_width_intrograph - intro_intrograph_margin.right]);

    y_scale_intrograph = d3.scale.linear()
    							 .domain([maxValue,0])
    							 .range([intro_intrograph_margin.bottom, intro_height_intrograph - intro_intrograph_margin.top]);

    x_area_intrograph = d3.time.scale()
                          .domain([preline_graph_year[0],preline_graph_year[4]])
                          .range([intro_intrograph_margin.left,intro_width_intrograph - intro_intrograph_margin.right]);

    y_area_introgrpah = d3.scale.linear()
                         .domain([maxValue,0])
                         .range([intro_intrograph_margin.bottom, intro_height_intrograph - intro_intrograph_margin.top]);

    refugee_sum_area = d3.svg.area()
                                  .x(function(d) { return x_area_intrograph(d.year);})
                                  .y0(y_scale_intrograph(0))
                                  .y1(function(d){ return y_area_introgrpah(d.value);})
                                  .interpolate("monotone");

   

    var refugee_sum_area_path = intro_g_intrograph
                                     .append("g")
                                     .attr("class","area_intrograph")
                                     .attr("transform","translate(0,0)")
                                     .append("path")
                                     .datum(intro_dataCon)
                                     .attr("d",refugee_sum_area)
                                     .attr("class","intro_area");

   var pre_refugee_sum_line = d3.svg.line()
                                .x(function(d){return x_scale_intrograph(d.year)})
                                .y(function(d){return y_scale_intrograph(d.value)})
                                .interpolate("monotone");

   pre_refugee_sum_line_path = intro_g_intrograph.append("g")
                                     .attr("transform","translate(0,0)")
                                     .append("path")
                                     .datum(intro_dataCon)
                                     .attr("d",pre_refugee_sum_line)
                                     .attr("class","intro_graph");


    //** AXIS decalre and Setting **//

    var xAxis = d3.svg.axis()
        .scale(x_scale_intrograph)
        .orient("bottom")
        .tickSize(5,0)
        .ticks(12)
        .tickValues(preline_graph_year)
        .tickFormat(function(d){ return toYear(d);});

    var xAxis_g = intro_g_intrograph.append("g")
        .attr("class", "intrograph_axis")
        .attr("id", "intrograph_date_axis")
        .attr("transform", "translate(0,"+(intro_height_intrograph - (intro_intrograph_margin.bottom - 10))+")")
        .call(xAxis);


    var yAxis = d3.svg.axis()
        .scale(y_scale_intrograph)
        .orient("right")
        .tickSize(5,0)
        .ticks(5)
        .tickFormat(d3.format("s"));

    var yAxis_g = intro_g_intrograph.append("g")
        .attr("class", "intrograph_axis")
        .attr("id", "intrograph_date_axis")
        .attr("transform","translate(" + (intro_width_intrograph - (intro_intrograph_margin.right - 10)) + ",0)")
        .call(yAxis);


    //** marking point setting **//
    markingEvent(marking_events);
                              
    //**moving elelment setting **//
    /*pre_timeAxis_circle = intro_g_intrograph.append("circle")
                                         .attr("cx",x_scale_intrograph(preline_graph_year[0]))
                                         .attr("cy",y_scale_intrograph(0))
                                         .attr("r",2)
                                         .attr("fill","#BB2233");

    intrograph_circle = intro_g_intrograph.append("circle")
                                          .attr("cx",x_scale_intrograph(preline_graph_year[0]))
                                          .attr("cy",y_scale_intrograph(intro_dataCon[0].value))
                                          .attr("r",2)
                                          .attr("fill","#BB2233");

    intrograph_line = intro_g_intrograph.append("line")
                                        .attr("x1",x_scale_intrograph(preline_graph_year[0]))
                                        .attr("x2",x_scale_intrograph(preline_graph_year[0]))
                                        .attr("y1",y_scale_intrograph(0))
                                        .attr("y2",y_scale_intrograph(intro_dataCon[0].value))
                                        .attr("stroke","#BB2233")
                                        .attr("stroke-width",1);*/

    intro_popYear(chapter_list[0]);


});

function markingEvent(marking_events){
    var marking_events = intro_marking_g.selectAll("g")
                                        .data(marking_events)
                                        .enter();

    marking_events.append("circle")
                  .attr("class","marking_events")
                  .attr("r",3)
                  .attr("cx",function(d){
                      var toYear = d.year + "-12-31"
                      return x_scale_intrograph(parseDate(toYear));
                  })    
                  .attr("cy",function(d){
                      var index = d.year - 1968;
                      return y_scale_intrograph(intro_dataCon[index].value);
                  }); 


    marking_events.append("circle")
                  .attr("class","marking_events")
                  .attr("r",3)
                  .attr("cx",function(d){
                      var toYear = d.year + "-12-31"
                      return x_scale_intrograph(parseDate(toYear));
                  })    
                  .attr("cy",function(d){
                      var index = d.year - 1968;
                      return y_scale_intrograph(intro_dataCon[index].value) - 200;
                  }); 

    marking_events.append("line")
                .attr("class","marking_events_line")
                .attr("x1",function(d){
                    var toYear = d.year + "-12-31"
                    return x_scale_intrograph(parseDate(toYear));
                })
                .attr("x2",function(d){
                    var toYear = d.year + "-12-31"
                    return x_scale_intrograph(parseDate(toYear));
                })
                .attr("y1",function(d){
                      var index = d.year - 1968;
                      return y_scale_intrograph(intro_dataCon[index].value) - 200;
                 })
                .attr("y2",function(d){
                      var index = d.year - 1968;
                      return y_scale_intrograph(intro_dataCon[index].value);
                 }); 

    marking_events.append("text")
                  .attr("class","chart_caption")
                  .attr("x",function(d){
                    var toYear = d.year + "-12-31"
                    return x_scale_intrograph(parseDate(toYear)) - 10;
                  })
                  .attr("y",function(d){
                      var index = d.year - 1968;
                      return y_scale_intrograph(intro_dataCon[index].value) - 420;
                  })
                  .attr("dy","15px")
                  .text(function(d){
                    return d.title;
                  });

    d3.selectAll(".chart_caption")
      .call(wrap,150);

}

function intrographTransition(year){
    var toYear = year + "-12-31"
    var index = year - 1968;

    pre_timeAxis_circle.transition().duration(300)
                                .attr("cx",x_scale_intrograph(parseDate(toYear)))
                                .attr("cy",y_scale_intrograph(0));

    intrograph_circle.transition().duration(300)
                                 .attr("cx",x_scale_intrograph(parseDate(toYear)))
                                 .attr("cy",y_scale_intrograph(intro_dataCon[index].value));

    intrograph_line.transition().duration(300)
                               .attr("x1",x_scale_intrograph(parseDate(toYear)))
                               .attr("x2",x_scale_intrograph(parseDate(toYear)))
                               .attr("y2",y_scale_intrograph(intro_dataCon[index].value));

}

function intro_popYear(chapter_list){
    var popData = intro_dataCon.filter(function(d){ return (parseDate(chapter_list.start) <= d.year)&&(d.year <= parseDate(chapter_list.end));})
    intro_popData = popData;

    d3.select(".area_intrograph").selectAll("path")
                            .datum(intro_popData)
                            .attr("d",refugee_sum_area)
                            .transition()
                            .duration(0);
                            
}

function intro_resize(){
    intro_height_intrograph = window.innerHeight - 200;

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