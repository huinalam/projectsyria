/*GLOBAL VAR*/
/**/
/*Data & SVG*/
var data_correlation;
var svg_correlation;
var svg_cor_margin = {
                      top: 50,
                      left: 30,
                      bottom: 50,
                      right: 30
                      };
/*Scale*/
var date_scale;
var death_scale;
var ref_scale;
/*Axis*/
var date_axis;
var death_axis;
var ref_axis;
var date_axis_g;
var death_axis_g;
var ref_axis_g;
/*PATH*/
var death_area;
var ref_area;
var death_area_g;
var ref_area_g;

var width = parseInt(d3.select('#viz_correlation').style("width"));
var height = width*0.8;


svg_correlation = d3.select('#viz_correlation').append("svg")
                        .attr("width",width)
                        .attr("height",height);


function initiation_correlation(){

  d3.csv("data/death_refugee_per_month.csv",function(data){
    data_correlation = data;
    data_correlation.forEach(function(item){
      item.date = parseDate(item.date);
      item.death = +item.death;
      item.refugee = +item.refugee;
    });



    /*Scale Setting*/
    var vertical_div = height * 0.3;

    date_scale = d3.time.scale()
                        .domain([parseDate("2011-03-01"), parseDate("2016-04-01")])
                        .range([svg_cor_margin.left, width - svg_cor_margin.right]);

    death_scale = d3.scale.linear()
                          .domain([0,6000])
                          .range([vertical_div,svg_cor_margin.top]);

    ref_scale = d3.scale.linear()
                          .domain([0,520000])
                          .range([0,(height - vertical_div) - svg_cor_margin.bottom]);

    

    /*Apeend Area*/
    /*Death*/
    death_area = d3.svg.area()
                   .y0(vertical_div)
                   .x(function(d){return date_scale(d.date);})
                   .y1(function(d){return death_scale(d.death);})
                   .interpolate("monotone");

    death_area_g = svg_correlation.append("g")
                                  .attr("transform","translate(0,"+ 0 +")");

    death_area_g.append('path')
                .datum(data_correlation)
                .attr("d",death_area)
                .attr("class","death_area");

    /*Refugee*/
    ref_area = d3.svg.area()
                   .y0(vertical_div)
                   .x(function(d){return date_scale(d.date);})
                   .y1(function(d){return vertical_div + ref_scale(d.refugee);})
                   .interpolate("monotone");

    ref_area_g = svg_correlation.append("g")
                                .attr("transform","translate(0,"+ 0 +")");

    ref_area_g.append('path')
              .datum(data_correlation)
              .attr("d",ref_area)
              .attr("class","ref_area");


    /*Axis Setting*/
    date_axis = d3.svg.axis()
                      .scale(date_scale)
                      .orient("bottom")
                      .tickSize(5,0)
                      .ticks(12)
                      .tickFormat(function(d,i){ 
                            if(i%3==0){
                                  return d3.time.format("%b %Y")(d);
                              }
                              else{
                                  return " ";
                              }
                        });

    death_axis = d3.svg.axis()
                       .scale(death_scale)
                       .orient("left")
                       .tickSize(-width + svg_cor_margin.left + svg_cor_margin.right,0)
                       .tickValues([0,2000,4000,6000])
                       .tickFormat(d3.format("s"));

    ref_axis = d3.svg.axis()
                       .scale(ref_scale)
                       .orient("left")
                       .tickSize(-width + svg_cor_margin.left + svg_cor_margin.right,0)
                       .tickValues([0,100000,200000,300000,400000,500000])
                       .tickFormat(d3.format("s"));

    /*Append Axis*/
    date_axis_g = svg_correlation.append("g")
                                 .attr("transform","translate(0,"+ vertical_div +")")
                                 .attr("class","date_axis")
                                 .attr("id","date_axis")
                                 .call(date_axis);

    death_aixs_g = svg_correlation.append("g")
                                  .attr("transform","translate(" + svg_cor_margin.left +",0)")
                                  .attr("class","num_axis")
                                  .attr("id","death_axis")
                                  .call(death_axis);

    ref_aixs_g = svg_correlation.append("g")
                                  .attr("transform","translate(" + svg_cor_margin.left +","+ vertical_div +")")
                                  .attr("class","num_axis")
                                  .attr("id","ref_axis")
                                  .call(ref_axis);

  });

}

function redrawing_correlation(){
	var width = parseInt(d3.select('#viz_correlation').style("width"));
	var height = width*0.8;
	console.log(width);
  /*SVG resize*/
	svg_correlation.transition()
				   .attr("width",width)
				   .attr("height",height);

  /*Rescale*/
  var vertical_div = (height*1)/5;
  date_scale.range([svg_cor_margin.left, width - svg_cor_margin.right]);
  death_scale.range([vertical_div,svg_cor_margin.top]);
  ref_scale.range([0,(height - vertical_div) - svg_cor_margin.bottom]);
 

  /*Axis recall*/
  death_axis.tickSize(-width + svg_cor_margin.left + svg_cor_margin.right,0);
  ref_axis.tickSize(-width + svg_cor_margin.left + svg_cor_margin.right,0);

  d3.select('#date_axis').transition()
             .attr("transform","translate(0,"+ vertical_div +")")
             .call(date_axis);
  d3.select('#death_axis').transition()
              .attr("transform","translate(" + svg_cor_margin.left +",0)")
              .call(death_axis);
  d3.select('#ref_axis').transition()
            .attr("transform","translate(" + svg_cor_margin.left +","+ vertical_div +")")
            .call(ref_axis);

   /*Redraw Area*/
   /*Death*/
    death_area
             .y0(vertical_div)
             .x(function(d){return date_scale(d.date);})
             .y1(function(d){return death_scale(d.death);})
             .interpolate("monotone");

    death_area_g.select('path')
                .transition()
                .attr("d",death_area);                

    /*Refugee*/
    ref_area
           .y0(vertical_div)
           .x(function(d){return date_scale(d.date);})
           .y1(function(d){return vertical_div + ref_scale(d.refugee);})
           .interpolate("monotone");

    ref_area_g.select('path')
              .transition()
              .attr("d",ref_area);
}



/*dateParsing function*/
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