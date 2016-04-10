var dataCon;
var popData_year;
var popData_group;
var popData_group_event =[];

var width = 700;
var height = 500;
var margin = 50; 
var main_svg = d3.select(".corelation_div_chart").append("svg")
							   .attr("width",width)
							   .attr("height",height);
var xScale;
var yScale;
var cScale;

var chapter_date = [{start: "2011-03-01", end: "2011-06-01"},
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
				 {start:"2016-01-01", end: "2016-12-01"}];

var whole = {start:"2011-03-01", end:"2016-04-01"}

var color_Range = ["#f0f0f0","#eab4b4","#dd0000"];
var maxValue;

var main_g = main_svg.append("g")
					 .attr("transform","translate(0,0)");
var xAxis;
var yAxis;

var group_list = ["IS","IC","RS","YPG","HZB","ASS"];
var event_list = ["chemical","air_strike","agreement","barrel_bomb","massacre","intervention","shelling","battle"];

for(var i=0; i<11; i++){
	for(var j=0; j<8; j++){
		var index = i*8 + j;
		popData_group_event[index] = {};
		popData_group_event[index].group = group_list[i];
		popData_group_event[index].event = event_list[j];
		popData_group_event[index].value = 0;
	}
}
d3.csv("data/long_df_update.csv",function(data){

	dataCon = data;

	dataCon.forEach(function(item){
		item.date = parseDate(item.date);
		item.value = +item.value;
	});

	//maxValue = d3.max(dataCon,function(d){ return d.value; });
	maxValue = 2050;
	xScale = d3.scale.ordinal()
				    .domain(group_list)
				    .rangePoints([margin,width - 3*margin]);

	yScale = d3.scale.ordinal()
				    .domain(event_list)
				    .rangePoints([height-3*margin,margin]);

	xAxis = d3.svg.axis()
				 .scale(xScale)
				 .orient("bottom")
				 .tickSize(5,1);

	yAxis = d3.svg.axis()
				 .scale(yScale)
				 .orient("right")
				 .tickSize(5,1);

	var xAxis_g = main_svg.append("g")
						.attr("transform","translate(" + margin/2 + "," + (height-3*margin/2) + ")")
						.call(xAxis)
						.attr("class","axis");

	var yAxis_g = main_svg.append("g")
						.attr("transform","translate(" + (width - 3*margin/2) + "," + margin/2 + ")")
						.call(yAxis)
						.attr("class","axis");

	cScale = d3.scale.linear()
					 .range(color_Range)
					 .domain([0,200,maxValue]);

	chart_g = main_g.selectAll("g")
				    .data(popData_group_event)
				    .enter()
				    .append("g");
	
	chart_g.append("rect")
		  .attr("x",function(d){
		  	return xScale(d.group);
		  })
		  .attr("y",function(d){
		  	return yScale(d.event);
		  })
		  .attr("width",50)
		  .attr("height",50)
		  .attr("fill",function(d){
		  	return cScale(d.value);
		  })
		  .attr("stroke","#ffffff")
		  .attr("stroke-width",1);

	chart_g.append("text")
		  .attr("x",function(d){
		  	return xScale(d.group) + 35;
		  })
		  .attr("y",function(d){
		  	return yScale(d.event) + 25;
		  })
		  .text(function(d){
		  	return d.value;
		  })
		  .attr("text-anchor","end")
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
	console.log(start_date + " / " + end_date);

	popData_year = dataCon.filter(function(d){ return (start_date <= d.date)&&(d.date <= end_date);})
	summarizeGroup();
}
function popGroup(group){
	popData_group = popData_year.filter(function(d){ return d.group == group});
}
function summarizeGroup(){
	//*초기화*//
	for(var i=0; i<11; i++){
		for(var j=0; j<8; j++){
			var index = i*8 + j;
			popData_group_event[index] = {};
			popData_group_event[index].group = group_list[i];
			popData_group_event[index].event = event_list[j];
			popData_group_event[index].value = 0;
		}
	}

	var num = popData_year.length;
	var term = num/88;

	for(var t=0; t<term; t++){
		for(var i=0; i<11; i++){
			for(var j=0; j<8; j++){
				var index1 = t*88 + i*8 + j; //popData_year 인덱스
				var index2 = i*8 + j; //popData_group_event 인덱스
				popData_group_event[index2].value+= popData_year[index1].value;
			}
		}
	}

	main_g.selectAll("rect")
		  .data(popData_group_event)
		  .transition()
		  .duration(300)
		  .attr("fill",function(d){
		  	return cScale(d.value);
		  });


	main_g.selectAll("text")
		  .data(popData_group_event)
		  .transition()
		  .duration(300)
		  .text(function(d){
		  	return d.value;
		  });




}