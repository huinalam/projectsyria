var correlation_dataCon;
var popData_year;
var popData_group;
var popData_group_event =[];

var correlation_width = 600;
var correlation_height = 600;
var correlation_margin = 60; 
var rect_size = (correlation_width - 2*correlation_margin)/6
var correlation_main_svg = d3.select("#correlation_div_chart").append("svg")
							   .attr("width",correlation_width)
							   .attr("height",correlation_height);


var groupBox;
							   
var top_offset = 50;

var text_g = correlation_main_svg.append("g")
					 .attr("transform","translate(0,0)")
					 .append("text")
					 .attr("class","chart_title");

	text_g.append("tspan")
          .attr("dy","1.1em")
          .attr("x",30)
		  .text("Co-occurance between");

	text_g.append("tspan")
          .attr("dy","1.1em")
          .attr("x",30)
		  .text("Attactk Event and Power Group");

var infoText_g = correlation_main_svg.append("g")
					 .attr("transform","translate(170,90)")
					 .append("text")
					 .attr("class","correlation_exp")
					 .text("Please click name of groups on the Y Axis to show summary");

var correlation_xScale;
var correlation_yScale;
var correlation_cScale;

/*var chapter_date = [{start: "2011-03-01", end: "2011-06-01"},
                    {start: "2011-05-01", end: "2012-07-01"},
                    {start: "2012-07-01", end: "2013-04-01"},
                    {start: "2013-04-01", end: "2014-02-01"},
                    {start: "2014-02-01", end: "2014-12-01"},
                    {start: "2014-12-01", end: "2015-10-01"},
                    {start: "2015-10-01", end: "2016-04-01"}];

var year_date = [{start:"2011-01-01", end: "2011-12-01"},
				 {start:"2012-01-01", end: "2012-12-01"},
				 {start:"2013-01-01", end: "2013-12-01"},
				 {start:"2014-01-01", end: "2014-12-01"},
				 {start:"2015-01-01", end: "2015-12-01"},
				 {start:"2016-01-01", end: "2016-12-01"}];*/

var whole = {start:"2011-03-01", end:"2016-04-01"}

var color_Range = ['#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026'];
var maxValue;

var svg_g = correlation_main_svg.append("g")
					.attr("transform","translate(0," + top_offset + ")");

var correlation_main_g = svg_g.append("g")
					 .attr("transform","translate(0,0)");
var xAxis;
var yAxis;

var event_list = ["CHEMICAL","AIR STRIKE","BARREL BOMB","DIRECT ATTACK","SHELLING","BATTLE"];
var group_list = ["IS","IC","RS","YPG","HZB","ASS"];

for(var i=0; i<6; i++){
	for(var j=0; j<6; j++){
		var index = i*6 + j;
		popData_group_event[index] = {};
		popData_group_event[index].group = group_list[i];
		popData_group_event[index].event = event_list[j];
		popData_group_event[index].value = 0;
	}
}
d3.csv("data/long_df.csv",function(data){

	correlation_dataCon = data;

	correlation_dataCon.forEach(function(item){
		item.date = parseDate(item.date);
		item.value = +item.value;
	});

	//maxValue = d3.max(correlation_dataCon,function(d){ return d.value; });
	correlation_xScale = d3.scale.ordinal()
				    .domain(event_list)
				    .rangePoints([correlation_margin,correlation_width - 3*correlation_margin]);

	correlation_yScale = d3.scale.ordinal()
				    .domain(group_list)
				    .rangePoints([correlation_height-3*correlation_margin,correlation_margin]);

	xAxis = d3.svg.axis()
				 .scale(correlation_xScale)
				 .orient("bottom")
				 .tickSize(5,1);

	yAxis = d3.svg.axis()
				 .scale(correlation_yScale)
				 .orient("right")
				 .tickSize(5,1);



	var xAxis_g = svg_g.append("g")
						.attr("transform","translate(" + correlation_margin/2 + "," + (correlation_height-3*correlation_margin/2) + ")")
						.call(xAxis)
						.attr("class","correlation_axis");

	var yAxis_g = svg_g.append("g")
						.attr("transform","translate(" + (correlation_width - 3*correlation_margin/2) + "," + correlation_margin/2 + ")")
						.call(yAxis)
						.attr("class","correlation_axis correlation_y");

	xAxis_g.selectAll("text")
		   .attr("class","correlation_button_event")
		   .attr("id",function(d){
		   	return d;
		   });

		   console.log(
		   xAxis_g.selectAll(".correlation_button_event").attr("dy")
		   );

	xAxis_g.selectAll(".correlation_button_event")
			.call(wrap,60);


	yAxis_g.selectAll("text")
		   .attr("class","correlation_button_group")
		   .attr("id",function(d){
		   	return d;
		   });

	correlation_cScale = d3.scale.linear()
					 .range(color_Range)
					 .domain([0,50,500,1000,2600]);

	chart_g = correlation_main_g.selectAll("g")
				    .data(popData_group_event)
				    .enter()
				    .append("g");
	
	chart_g.append("rect")
		  .attr("x",function(d){
		  	return correlation_xScale(d.event);
		  })
		  .attr("y",function(d){
		  	return correlation_yScale(d.group);
		  })
		  .attr("width",rect_size)
		  .attr("height",rect_size)
		  .attr("fill",function(d){
		  	return correlation_cScale(d.value);
		  })
		  .attr("stroke","#ffffff")
		  .attr("stroke-width",1);

	chart_g.append("text")
		  .attr("class","correlation_chart_num")
		  .attr("x",function(d){
		  	return correlation_xScale(d.event) + 35;
		  })
		  .attr("y",function(d){
		  	return correlation_yScale(d.group) + 40;
		  })
		  .text(function(d){
		  	return d.value;
		  })
		  .attr("text-anchor","middle");

  	  groupBox = chart_g.append("g");

	d3.selectAll(".correlation_article_div").style("opacity",0);
			d3.select("#ASS_article").style("opacity",1);

	d3.selectAll(".correlation_button_group").on("click",function(){
			var id = d3.select(this).attr("id");

			d3.selectAll(".correlation_article_div").style("opacity",0);
			d3.select("#" + id + "_article").style("opacity",1);
		});

	popYear(whole);
});


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

function popYear(chapter){
	var start_date = parseDate(chapter.start);
	var end_date = parseDate(chapter.end);
	

	popData_year = correlation_dataCon.filter(function(d){ return (start_date <= d.date)&&(d.date <= end_date);})
	summarizeGroup();
}
function popGroup(group){
	popData_group = popData_year.filter(function(d){ return d.group == group});
}
function summarizeGroup(){
	//*초기화*//
	for(var i=0; i<6; i++){
		for(var j=0; j<6; j++){
			var index = i*6 + j;
			popData_group_event[index] = {};
			popData_group_event[index].group = event_list[i];
			popData_group_event[index].event = group_list[j];
			popData_group_event[index].value = 0;
		}
	}

	var num = popData_year.length;
	var term = num/36;

	for(var t=0; t<term; t++){
		for(var i=0; i<6; i++){
			for(var j=0; j<6; j++){
				var index1 = t*36 + i*6 + j; //popData_year 인덱스
				var index2 = i*6 + j; //popData_group_event 인덱스
				popData_group_event[index2].value+= popData_year[index1].value;
			}
		}
	}

	correlation_main_g.selectAll("rect")
		  .data(popData_group_event)
		  .transition()
		  .duration(300)
		  .attr("fill",function(d){
		  	return correlation_cScale(d.value);
		  });


	correlation_main_g.selectAll("text")
		  .data(popData_group_event)
		  .transition()
		  .duration(300)
		  .text(function(d){
		  	return d.value;
		  });




}