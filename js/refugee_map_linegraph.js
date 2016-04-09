// main svg,group
var map_svg_linegraph;
var map_g_linegraph;

//size, margin value
var map_width_linegraph = 350;
var map_height_linegraph = 680;
var margin = {
                top:20,
                left:20,
                right:40,
                bottom:40
            };
//var graph_top_margin = 10;

//data container, scale
var data_Con;
var x_scale_linegraph;
var y_scale_linegraph;

//year list to put in X scale
var line_graph_year = ["2011-12-31","2012-12-31","2013-12-31","2014-12-31"]; 

//svg group declare
map_svg_linegraph = d3.select(".map_div_linegraph").append("svg")
							  .attr("class","map_svg_linegraph")
							  .attr("width",map_width_linegraph)
							  .attr("height",map_height_linegraph)
							  .style("background-color","#222222");

map_g_linegraph = map_svg_linegraph.append("g")
								 .attr("transfrom","translate(0,0)");


var timeAxis_circle;
var linegraph_circle;
var linegraph_line;

//open csv
d3.csv("data/refugees_total_year_2011_2014.csv",function(data){

//data initiall setting
	data.forEach(function(d){
          d.value = +d.value;
          d.date = parseDate(d.date);
    });

    data_Con = data;

    var maxValue = d3.max(data_Con,function(d){ return d.value});

    x_scale_linegraph = d3.time.scale()
    						  .domain([parseDate(line_graph_year[0]),parseDate(line_graph_year[3])])
    						  .range([margin.left,map_width_linegraph - margin.right]);

    y_scale_linegraph = d3.scale.linear()
    							 .domain([maxValue,0])
    							 .range([margin.top, map_height_linegraph - margin.bottom]);

   var refugee_sum_line = d3.svg.line(data_Con)
                                .x(function(d){return x_scale_linegraph(d.date)})
                                .y(function(d){return y_scale_linegraph(d.value)})
                                .interpolate("cardinal");

    refugee_sum_path = map_g_linegraph.append("g")
                                     .attr("transform","translate(0,0)")
                                     .append("path")
                                     .datum(data_Con)
                                     .attr("d",refugee_sum_line)
                                     .attr("class","line_graph");


    /*
    map_g_linegraph.selectAll("circle")
                  .data(year)
                  .enter()
                  .append("circle")
                  .attr("cx",function(d){
                        return x_scale_linegraph(parseDate(d));
                  })
                  .attr("cy",function(d){
                        return y_scale_linegraph(0);
                  })
                  .attr("r",4)
                  .attr("fill","#eeeeee");

    map_g_linegraph.append("line")
                  .attr("x1",x_scale_linegraph(parseDate(year[0])))
                  .attr("y1",y_scale_linegraph(0))
                  .attr("x2",x_scale_linegraph(parseDate(year[3])))
                  .attr("y2",y_scale_linegraph(0))
                  .attr("stroke","#eeeeee")
                  .attr("stroke-width",1);
    */

    //** AXIS decalre and Setting **//

    var xAxis = d3.svg.axis()
        .scale(x_scale_linegraph)
        .orient("bottom")
        .tickSize(5,0)
        .ticks(12)
        .tickValues([parseDate(line_graph_year[0]),parseDate(line_graph_year[1]),parseDate(line_graph_year[2]),parseDate(line_graph_year[3])])
        .tickFormat(function(d){ return toYear(d);});2

    var xAxis_g = map_g_linegraph.append("g")
        .attr("class", "linegraph_axis")
        .attr("id", "date_axis")
        .attr("transform", "translate(0,"+(map_height_linegraph - (margin.bottom-20))+")")
        .call(xAxis);


    var yAxis = d3.svg.axis()
        .scale(y_scale_linegraph)
        .orient("right")
        .tickSize(5,0)
        .ticks(5)
        .tickFormat(d3.format("s"));

    var yAxis_g = map_g_linegraph.append("g")
        .attr("class", "linegraph_axis")
        .attr("id", "date_axis")
        .attr("transform","translate(" + (map_width_linegraph - (margin.right - 10)) + ",0)")
        .call(yAxis);


    //**moving elelment setting **//
    timeAxis_circle = map_g_linegraph.append("circle")
                                         .attr("cx",x_scale_linegraph(parseDate(line_graph_year[0])))
                                         .attr("cy",y_scale_linegraph(0))
                                         .attr("r",2)
                                         .attr("fill","#BB2233");

    linegraph_circle = map_g_linegraph.append("circle")
                                          .attr("cx",x_scale_linegraph(parseDate(line_graph_year[0])))
                                          .attr("cy",y_scale_linegraph(data_Con[0].value))
                                          .attr("r",2)
                                          .attr("fill","#BB2233");

    linegraph_line = map_g_linegraph.append("line")
                                        .attr("x1",x_scale_linegraph(parseDate(line_graph_year[0])))
                                        .attr("x2",x_scale_linegraph(parseDate(line_graph_year[0])))
                                        .attr("y1",y_scale_linegraph(0))
                                        .attr("y2",y_scale_linegraph(data_Con[0].value))
                                        .attr("stroke","#BB2233")
                                        .attr("stroke-width",1);

});

function lineTransition(index){

    timeAxis_circle.transition().duration(300)
                                .attr("cx",x_scale_linegraph(parseDate(line_graph_year[index])))
                                .attr("cy",y_scale_linegraph(0));

    linegraph_circle.transition().duration(300)
                                 .attr("cx",x_scale_linegraph(parseDate(line_graph_year[index])))
                                 .attr("cy",y_scale_linegraph(data_Con[index].value));

    linegraph_line.transition().duration(300)
                               .attr("x1",x_scale_linegraph(parseDate(line_graph_year[index])))
                               .attr("x2",x_scale_linegraph(parseDate(line_graph_year[index])))
                               .attr("y2",y_scale_linegraph(data_Con[index].value));

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