/*var svg_width = 860;
var svg_height = 560;

var scatter_width = 600;
var scatter_height = 500;*/
var svg_width = 860;
var svg_height = window.innerHeight - 450;

var scatter_width = 600;
var scatter_height = svg_height - 50;
//var scatter_margin = 50;
//var scatter_top = 30;
var scatter_margin = {left:100, right:50, bottom:100, top:30}

var circle_graph_width = 280;
var circle_graph_height = 280;
var circle_graph_margin = 30;

var country_list = ["ARE","EGY","IRQ","JOR","KWT","LBN","LBY","MAR","OMN","QAT","SAU","TUN","TUR","YEM"];


//** scatter **//
var scatter_svg = d3.select('#scatter_chart').append("svg")
								.attr("width",svg_width)
								.attr("height",svg_height);

var scatter_g = scatter_svg.append("g")
						.attr("transform","translate(" +  0 + "," + 80 + ")");

var scatter_chart_g = scatter_g.append("g");

var	scatter_title = scatter_g.append("text")
				 .attr("class","chart_title")
				 .attr("x",scatter_margin.left - 10)
				 .attr("y",-50)
				 .text("Number of Refugees & Economic Indicator");


var capita_graph_g = scatter_svg.append("g")
								.attr("transform","translate("+ (scatter_width + 50) +"," + scatter_margin.top  + ")");



var	circle_graph_title = capita_graph_g.append("text")
						 .attr("class","chart_title")
						 .attr("x",0)
						 .attr("y",0)
						 .text("GDP Per Capita");


//** gdp_capita graph//

	 

// scatter plot graph 척도
var xScale_scatter;
var yScale_scatter;
var gdp_yAxis;

var cScale_value_GR; // GDP/refugee color
var rScale_value_GR; // GDP/refugee radious

var cScale_value_GPR; // GDP capita/refugee color
var rScale_value_GPR; // GDP capita/refugee radious


// line graph 척도
var yScale_capita;

var gdp_dataCon;
var popData;
var year = 2011;

var c1 = "#55BFAA";
var c2 = "#CC3333";

var country_code = [];

d3.csv("data/refugee_gdp_2011_2014_middle_east_short.csv",function(data){

	gdp_dataCon = data;

	gdp_dataCon.forEach(function(item,i){
		item.year = +item.year;
		item.GDP = +item.GDP;
		item.GDP_capita = +item.GDP_capita;
		item.refugee = +item.refugee;
		item.value1 = +item.value1;
		item.value2 = +item.value2;
		country_code[i] = item.Country_Code;
	});

	popData = gdp_dataCon.filter(function(d) {return d.year == year});

	var maxGDP = d3.max(gdp_dataCon,function(d){ return d.GDP;});
	var maxGDP_capita = d3.max(gdp_dataCon,function(d){ return d.GDP_capita;});
	var maxRefugee = d3.max(gdp_dataCon,function(d){ return d.refugee;});
	var maxValue1 = d3.max(gdp_dataCon,function(d){ return d.value1;});
	var maxValue2 = d3.max(gdp_dataCon,function(d){ return d.value2;});
	

	xScale_scatter = d3.scale.linear()
					  .domain([0,maxGDP])
					  .range([scatter_margin.left,scatter_width-scatter_margin.right]);

	var xAxis = d3.svg.axis()
					  .scale(xScale_scatter)
					  .orient("bottom")
					  .innerTickSize((scatter_margin.bottom + scatter_margin.top) - scatter_height)
					  .outerTickSize(0)
        			  .ticks(6)
        			  .tickFormat(d3.format("s"));

	yScale_scatter = d3.scale.linear()
					  .domain([0,maxRefugee])
					  .range([scatter_height-scatter_margin.bottom,scatter_margin.top]);

	gdp_yAxis = d3.svg.axis()
					  .scale(yScale_scatter)
					  .orient("left")
					  .innerTickSize((scatter_margin.left + scatter_margin.right)-scatter_width)
					  .outerTickSize(0)
        			  .ticks(6)
        			  .tickFormat(d3.format("s"));

	cScale_value_GR = d3.scale.linear()
					  .domain([0,maxValue1])
					  .range([c1,c2]);

	rScale_value_GR = d3.scale.sqrt()
					  .domain([0,maxValue1])
					  .range([2,40]);

	cScale_value_GPR = d3.scale.linear()
					  .domain([0,maxValue2])
					  .range([c1,c2]);

	rScale_value_GPR = d3.scale.sqrt()
					  .domain([0,maxValue2])
					  .range([2,40]);

	yScale_capita = d3.scale.linear()
					  .domain([0,maxGDP_capita])
					  .range([scatter_height-scatter_margin.bottom,scatter_margin.top]);

	//** scatter **//

	scatter_circle_g = scatter_chart_g.selectAll("g")
									.data(popData)
									.enter()
									.append("g"); 

	scatter_circle_g.append("circle")
					.attr("cx",function(d){
					 	return xScale_scatter(d.GDP)
					 })
					.attr("cy",function(d){
					 	return yScale_scatter(d.refugee)
					 })
					.attr("r",function(d){
					 	return rScale_value_GR(d.value1);
					 })
					.attr("stroke","#eeeeee")
				    .attr("stroke-width",0.5)
					.attr("fill",function(d){
					 	return cScale_value_GR(d.value1);
					 });

	scatter_circle_g.append("text")
					.attr("x",function(d){
					 	return xScale_scatter(d.GDP)
					 })
					.attr("y",function(d){
					 	return yScale_scatter(d.refugee)
					 })
					.attr("class","country_code")
					.text(function(d){
						return d.Country_Code;
					})
					.attr("text-anchor","middle");

	var xAxis_g = scatter_g.append("g")
							 .attr("transform","translate(" + 0 + ","+ (scatter_height - scatter_margin.bottom) +")")
							 .attr("class","gdp_axis")
							 .call(xAxis);

	var yAxis_g = scatter_g.append("g")
							 .attr("transform","translate(" + scatter_margin.left + ","+ 0 +")")
							 .attr("class","gdp_axis")
							 .attr("id","gdp_yAxis")
							 .call(gdp_yAxis);

	var yAxis_text = scatter_g.append("g")
							  .attr("transform","translate("+ (scatter_margin.left - 50) + "," + (scatter_height - (scatter_margin.top+scatter_margin.bottom))/2 + ")rotate(-90)")
							  .append("text")
							  .attr("class","axis_text")
							  .attr("text-anchor","middle")
							  .text("Number of Refugees");

	var xAxis_text = scatter_g.append("g")
							  .attr("transform","translate("+ (scatter_width/2) + "," + (scatter_height - scatter_margin.bottom + 30) + ")")
							  .append("text")
							  .attr("class","axis_text")
							  .attr("text-anchor","middle");

		xAxis_text.append("tspan")
				  .attr("dy","1.1em")
                  .attr("x",0)
				  .text("GDP of middle east countries");

		xAxis_text.append("tspan")
				  .attr("dy","1.1em")
                  .attr("x",0)
				   .text("(constant 2011 international $)");


							  
							 
							  


	//** line_graph **//
	var gdpCapita_g = capita_graph_g.append("g")
									   .attr("transform","translate(10,80)")
									   .attr("class","gdp_capita_g")

	var gdpCapita_country = gdpCapita_g.selectAll("g")
								.data(popData)
								.enter()
								.append("g");

	gdpCapita_country.append("circle")
					 .attr("id",function(d){
					 	return d.Country_Code;
					 })
					 .attr("cx",0)
					 .attr("cy",function(d){
					 	return yScale_capita(d.GDP_capita);
					 })
					 .attr("r",2)
					 .attr("stroke","#eeeeee")
					 .attr("fill",function(d){
					 	return cScale_value_GPR(d.value2);
					 });

	gdpCapita_country.append("text")
					.attr("class","country_code")
					.attr("x",function(d,i){
						if((d.Country_Index%6)==1){
							return 50;
						}else if((d.Country_Index%6)==2){
							return -50;
						}else if((d.Country_Index%6)==3){
							return 30;
						}else if((d.Country_Index%6)==4){
							return -30;
						}
						else if((d.Country_Index%6)==5){
							return 10;
						}
						else if((d.Country_Index%6)==0){
							return -10;
						}
					})
					.attr("y",function(d){
					 	return yScale_capita(d.GDP_capita) + 2;
					 })
					.text(function(d,i){
						return d.Country_Code;
					})
					.attr("text-anchor",function(d,i){
						if((d.Country_Index%6)==1){
							return "start";
						}else if((d.Country_Index%6)==2){
							return "end";
						}else if((d.Country_Index%6)==3){
							return "start";
						}else if((d.Country_Index%6)==4){
							return "end";
						}
						else if((d.Country_Index%6)==5){
							return "start";
						}
						else if((d.Country_Index%6)==0){
							return "end";
						}
					});

	gdpCapita_country.append("line")
					.attr("class","country_code")
					.attr("x1",function(d,i){
						if((d.Country_Index%6)==1){
							return 50;
						}else if((d.Country_Index%6)==2){
							return -50;
						}else if((d.Country_Index%6)==3){
							return 30;
						}else if((d.Country_Index%6)==4){
							return -30;
						}
						else if((d.Country_Index%6)==5){
							return 10;
						}
						else if((d.Country_Index%6)==0){
							return -10;
						}
					})
					.attr("x2",0)
					.attr("y1",function(d){
					 	return yScale_capita(d.GDP_capita);
					 })
					.attr("y2",function(d){
					 	return yScale_capita(d.GDP_capita);
					 })
					.attr("stroke-width",0.5)
					.attr("stroke","#eeeeee");


	/*gdpCapita_text.append("text")
				  .attr("class","gdp_text")
				  .attr("x",0)
				  .attr("y",function(d,i){
				  	return i*17;
				  })
				  .text(function(d){
				  	return (d.Country_Code)+":";
				  });

	gdpCapita_text.append("text")
				  .attr("class","gdp_text")
				  .attr("x",100)
				  .attr("y",function(d,i){
				  	return i*17;
				  })
				  .text(function(d){
				  	return (d3.format(",.0f")(d.GDP_capita) + "$");
				  })
				  .attr("text-anchor","end");*/






});
function scatter_scaleSetting(){
	svg_width = 860;
	svg_height = window.innerHeight - 450;

	scatter_width = 600;
	scatter_height = svg_height - 50;


}

function draw_scatter_Axis(){

}
function scatter_resize(){

	if(700<window.innerHeight){

		var svg_width = 860;
		var svg_height = window.innerHeight - 450;

		var scatter_width = 600;
		var scatter_height = svg_height - 50;

		//**SVG resize **//
		scatter_svg.transition()
				   .attr("width",svg_width)
				   .attr("height",svg_height);

		//*Scale resize **//
		yScale_scatter
					 .range([scatter_height-scatter_margin.bottom,scatter_margin.top]);

		d3.select('#gdp_yAxis').transition().call(gdp_yAxis);

		//*Scatter plot redraw*//
		scatter_chart_g.selectAll("circle")
					.transition()
					.attr("cx",function(d){
					 	return xScale_scatter(d.GDP)
					 })
					.attr("cy",function(d){
					 	return yScale_scatter(d.refugee)
					 })
					.attr("r",function(d){
					 	return rScale_value_GR(d.value1);
					 })
					.attr("stroke","#eeeeee")
				    .attr("stroke-width",0.5)
					.attr("fill",function(d){
					 	return cScale_value_GR(d.value1);
					 });

		scatter_circle_g.transition()
						.attr("x",function(d){
						 	return xScale_scatter(d.GDP)
						 })
						.attr("y",function(d){
						 	return yScale_scatter(d.refugee)
						 })
						.attr("class","country_code")
						.text(function(d){
							return d.Country_Code;
						})
						.attr("text-anchor","middle");




	}
}

function scatterTransition(year){

	popData = gdp_dataCon.filter(function(d) {return d.year == year});
	console.log(popData);

	//scatter_g.selectAll("g").data(popData).transition();

	scatter_chart_g.selectAll("circle")
					.data(popData)
					.transition()
					.duration(2000)
					.ease("quad")
					.attr("cx",function(d){
					 	return xScale_scatter(d.GDP)
					 })
					.attr("cy",function(d){
					 	return yScale_scatter(d.refugee)
					 })
					.attr("r",function(d){
					 	return rScale_value_GR(d.value1);
					 })
					.attr("fill",function(d){
					 	return cScale_value_GR(d.value1);
					 });


	scatter_chart_g.selectAll("text")
					.data(popData)
					.transition()
					.duration(2000)
					.ease("quad")
					.attr("x",function(d){
					 	return xScale_scatter(d.GDP)
					 })
					.attr("y",function(d){
					 	return yScale_scatter(d.refugee)
					 })
					.attr("class","country_code")
					.text(function(d){
						return d.Country_Code;
					})
					.attr("text-anchor","middle");

	d3.select(".gdp_capita_g").selectAll("circle")
					 .data(popData)
					 .transition()
					 .duration(2000)
					 .ease("quad")
					 .attr("cx",0)
					 .attr("cy",function(d){
					 	return yScale_capita(d.GDP_capita);
					 })
					 .attr("r",2)
					 .attr("stroke","#eeeeee")
					 .attr("fill",function(d){
					 	return cScale_value_GPR(d.value2);
					 });


	d3.select(".gdp_capita_g").selectAll("text")
					.data(popData)
					.transition()
					.duration(2000)
					.ease("quad")
					.attr("y",function(d){
					 	return yScale_capita(d.GDP_capita) + 2;
					 })
					.text(function(d,i){
						return d.Country_Code;
					});

	d3.select(".gdp_capita_g").selectAll("line")
					.data(popData)
					.transition()
					.duration(2000)
					.ease("quad")
					.attr("y1",function(d){
					 	return yScale_capita(d.GDP_capita);
					 })
					.attr("y2",function(d){
					 	return yScale_capita(d.GDP_capita);
					 });

}