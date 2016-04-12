// main svg,group
var intro_svg_intrograph;
var intro_g_intrograph;

//size, margin value
var intro_width_intrograph = 860;
var intro_height_intrograph = 700;
var intro_intrograph_margin = {
                top:20,
                left:80,
                right:80,
                bottom:40
            };
//var graph_top_margin = 10;

//data container, scale
var intro_dataCon;
var x_scale_intrograph;
var y_scale_intrograph;

//year list to put in X scale
var line_graph_year = ["1968-12-31","1980-12-31","1992-12-31","2011-12-31"]; 

//svg group declare
intro_svg_intrograph = d3.select(".intro_div_intrograph").append("svg")
							  .attr("class","intro_svg_intrograph")
							  .attr("width",intro_width_intrograph)
							  .attr("height",intro_height_intrograph)
							  .style("background-color","#111111");

intro_g_intrograph = intro_svg_intrograph.append("g")
								 .attr("transfrom","translate(0,0)");


var timeAxis_circle;
var intrograph_circle;
var intrograph_line;

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
    						  .domain([parseDate(line_graph_year[0]),parseDate(line_graph_year[3])])
    						  .range([intro_intrograph_margin.left,intro_width_intrograph - intro_intrograph_margin.right]);

    y_scale_intrograph = d3.scale.linear()
    							 .domain([maxValue,0])
    							 .range([intro_intrograph_margin.top, intro_height_intrograph - intro_intrograph_margin.bottom]);

   var refugee_sum_line = d3.svg.line(intro_dataCon)
                                .x(function(d){return x_scale_intrograph(d.year)})
                                .y(function(d){return y_scale_intrograph(d.value)})
                                .interpolate("cardinal");

    refugee_sum_path = intro_g_intrograph.append("g")
                                     .attr("transform","translate(0,0)")
                                     .append("path")
                                     .datum(intro_dataCon)
                                     .attr("d",refugee_sum_line)
                                     .attr("class","intro_graph");

    //** AXIS decalre and Setting **//

    var xAxis = d3.svg.axis()
        .scale(x_scale_intrograph)
        .orient("bottom")
        .tickSize(5,0)
        .ticks(12)
        .tickValues([parseDate(line_graph_year[0]),parseDate(line_graph_year[1]),parseDate(line_graph_year[2]),parseDate(line_graph_year[3])])
        .tickFormat(function(d){ return toYear(d);});2

    var xAxis_g = intro_g_intrograph.append("g")
        .attr("class", "intrograph_axis")
        .attr("id", "intrograph_date_axis")
        .attr("transform", "translate(0,"+(intro_height_intrograph - (intro_intrograph_margin.bottom-20))+")")
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


    //**moving elelment setting **//
    timeAxis_circle = intro_g_intrograph.append("circle")
                                         .attr("cx",x_scale_intrograph(parseDate(line_graph_year[0])))
                                         .attr("cy",y_scale_intrograph(0))
                                         .attr("r",2)
                                         .attr("fill","#BB2233");

    intrograph_circle = intro_g_intrograph.append("circle")
                                          .attr("cx",x_scale_intrograph(parseDate(line_graph_year[0])))
                                          .attr("cy",y_scale_intrograph(intro_dataCon[0].value))
                                          .attr("r",2)
                                          .attr("fill","#BB2233");

    intrograph_line = intro_g_intrograph.append("line")
                                        .attr("x1",x_scale_intrograph(parseDate(line_graph_year[0])))
                                        .attr("x2",x_scale_intrograph(parseDate(line_graph_year[0])))
                                        .attr("y1",y_scale_intrograph(0))
                                        .attr("y2",y_scale_intrograph(intro_dataCon[0].value))
                                        .attr("stroke","#BB2233")
                                        .attr("stroke-width",1);

});

function intrographTransition(year){
    var toYear = year + "-12-31"
    var index = year - 1968;
    timeAxis_circle.transition().duration(300)
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