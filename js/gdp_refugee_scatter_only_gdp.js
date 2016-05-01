/*var svg_width = 860;
var svg_height = 560;

var scatter_width = 600;
var scatter_height = 500;*/
var svg_width = 860;
var svg_height;
if(1000<window.innerHeight){
	svg_height = window.innerHeight - 400;
}else{
	svg_height = 600;
}


var scatter_width = 650;
var scatter_height = svg_height - 80;
//var scatter_margin = 50;
//var scatter_top = 30;
var scatter_margin = {left:100, right:50, bottom:100, top:30}

var circle_graph_width = 280;
var circle_graph_height = scatter_height;
var circle_gMargin = {top:80,bottom: 0}

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
				 .attr("y",-20)
				 .text("Refugees & GDP of Resisdent Country");


//** circle graph//

var capita_graph_g = scatter_svg.append("g")
								.attr("transform","translate("+ (scatter_width + 20) +"," + 0  + ")");

var capita_graph_exp = capita_graph_g.append("text")
			  						 .attr("class","axis_text")
			  						 .attr("transform","translate(0," + (scatter_height - scatter_margin.bottom + 110) + ")");

	capita_graph_exp.append("tspan")
					.attr("dy","1.1em")
					.attr("x",0)
					.text("Comparison between");

	capita_graph_exp.append("tspan")
					.attr("dy","1.1em")
					.attr("x",0)
					.text("Number of Reguees &");

	capita_graph_exp.append("tspan")
					.attr("dy","1.1em")
					.attr("x",0)
					.text("Relative Economic Statue");

var circle_graph_chart_g = capita_graph_g.append("g")
										 .attr("transform","translate(0,0)");







var yScale_gdp;
var yScale_capita
var yScale_gdp_pop;
var yScale_refugee;
var cScale_value1;
var cScale_value2;
var rScale_value2;	 // scatter plot graph 척도
var rScale_GDP_capita; // circle graph 척도
var cScale_GDP_capita;

var xScale_scatter;
var yScale_scatter;
var gdp_yAxis;

var gdp_dataCon;
var capita_dataCon;
var popData_gdp;
var popData_capita;
var circle_yScale;
var year = 2011;

var c1 = "#55BFAA";
var c2 = "#CC3333";

var country_code = ["QAT","YEM","EGY","JOR","TUR"];

d3.csv("data/refugee_gdp_2011_2014_middle_east_short.csv",function(data){

	gdp_dataCon = data;

	gdp_dataCon.forEach(function(item){
		item.year = +item.year;
		item.GDP = +item.GDP;
		item.GDP_capita = +item.GDP_capita;
		item.refugee = +item.refugee;
		item.value1 = +item.value1;
		item.value2 = +item.value2;
	});

	popData_gdp = data.filter(function(d) {return d.year == year});

	var maxGDP = d3.max(gdp_dataCon,function(d){ return d.GDP;});
	var maxGDP_pop = d3.max(gdp_dataCon,function(d){ return d.GDP_capita;});
	var maxRefugee = d3.max(gdp_dataCon,function(d){ return d.refugee;});
	var maxValue1 = d3.max(gdp_dataCon,function(d){ return d.value2;});
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
        			  .tickFormat(d3.format("s"));;

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

	cScale_value1 = d3.scale.linear()
					  .domain([0,maxValue1])
					  .range([c1,c2]);

	cScale_value2 = d3.scale.linear()
					  .domain([0,maxValue2])
					  .range([c1,c2]);

	cScale_GDP_capita = d3.scale.linear()
					  .domain([0,maxGDP_pop])
					  .range([c1,c2]);

	rScale_value2 = d3.scale.sqrt()
					  .domain([0,maxValue2])
					  .range([2,40]);


	rScale_GDP_capita = d3.scale.sqrt()
					  .domain([0,maxGDP_pop])
					  .range([2,40]);

	lScale_GDP_capita = d3.scale.linear()
					  .domain([0,maxGDP_pop])
					  .range([circle_graph_width/2+300,circle_graph_width/2 + 600]);


	//** scatter **//

	scatter_circle_g = scatter_chart_g.selectAll("g")
									.data(popData_gdp)
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
					 	return rScale_value2(d.value2);
					 })
					.attr("stroke","#eeeeee")
				    .attr("stroke-width",0.5)
					.attr("fill",function(d){
					 	return cScale_value2(d.value2);
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
							  
							 
							  


	//** value2 legend **//	






});

d3.csv("data/refugee_gdp_2011_2014_middle_east_circle_graph.csv",function(data){

	capita_dataCon = data;

	capita_dataCon.forEach(function(item,i){
		item.year = +item.year;
		item.GDP = +item.GDP;
		item.GDP_capita = +item.GDP_capita;
		item.refugee = +item.refugee;
		item.value1 = +item.value1;
		item.value2 = +item.value2;
		country_code[i] = item.Country_Code;
	});

	var maxCapita = d3.max(capita_dataCon,function(d){ return d.GDP_capita;});
	var minCapita = d3.min(capita_dataCon,function(d){ return d.GDP_capita;});
	var maxRefugee = d3.max(capita_dataCon,function(d){ return d.refugee;});
	var maxValue2 = d3.max(capita_dataCon,function(d){ return d.value2;});

	popData_capita = capita_dataCon.filter(function(d) {return d.year == year});

	
	yScale_capita = d3.scale.linear()
					  .domain([minCapita,maxCapita])
					  .range([svg_height-scatter_margin.bottom,scatter_margin.top]);

	rScale_value2 = d3.scale.sqrt()
					  .domain([0,maxValue2])
					  .range([2,40]);

	cScale_value2 = d3.scale.linear()
					  .domain([0,maxValue2])
					  .range([c1,c2]);

	var circle_graph_country = circle_graph_chart_g.selectAll("g")
												   .data(popData_capita)
												   .enter()
												   .append("g")
												   .attr("class","circle_graph_country");


	circle_yScale = d3.scale.ordinal()
					  .domain(country_code)
					  .rangeBands([circle_gMargin.top,circle_graph_height - circle_gMargin.bottom]);

		circle_graph_country.append("circle")
							.attr("cx",0)
							.attr("cy",function(d){
								return circle_yScale(d.Country_Code);
							})
							.attr("r",function(d){
								return rScale_value2(d.value2);
							})
							.attr("fill",function(d){
								return cScale_value2(d.value2);
							})
							.attr("stroke","#eeeeee")
				    		.attr("stroke-width",0.5);

		var circle_factor = circle_graph_chart_g.append("g")
							.attr("transform","translate(0," + (circle_gMargin.top - 20) + ")");

		circle_factor.append("text")
							.attr("x",100)
							.attr("y",0)
							.attr("class","country_factor")
							.text("Refugees")
							.attr("text-anchor","end");

		circle_factor.append("text")
							.attr("x",190)
							.attr("y",0)
							.attr("class","country_factor")
							.text("GDP per Capita")
							.attr("text-anchor","end");

		circle_graph_country.append("text")
							.attr("x",0)
							.attr("y",function(d){
								return circle_yScale(d.Country_Code);
							})
							.attr("class","country_code")
							.text(function(d){
								return d.Country_Code;
							})
							.attr("text-anchor","middle");

		circle_graph_country.append("text")
							.attr("class","circle_capita country_code")
							.attr("x",190)
							.attr("y",function(d){
								return circle_yScale(d.Country_Code);
							})
							.text(function(d){
								return d3.format(",.0f")(d.GDP_capita) + "$";
							})
							.attr("text-anchor","end");

		circle_graph_country.append("text")
							.attr("class","circle_refugee country_code")
							.attr("x",100)
							.attr("y",function(d){
								return circle_yScale(d.Country_Code);
							})
							.text(function(d){
								return d.refugee;
							})
							.attr("text-anchor","end");



});

function scatter_scaleSetting(){
	var svg_width = 860;
	var svg_height = window.innerHeight - 450;

	var scatter_width = 600;
	var scatter_height = svg_height - 50;
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
					 	return rScale_value2(d.value2);
					 })
					.attr("stroke","#eeeeee")
				    .attr("stroke-width",0.5)
					.attr("fill",function(d){
					 	return cScale_value2(d.value2);
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

	popData_gdp = gdp_dataCon.filter(function(d) {return d.year == year});
	popData_capita = capita_dataCon.filter(function(d) {return d.year == year});

	//scatter_g.selectAll("g").data(popData_gdp).transition();

	scatter_chart_g.selectAll("circle")
					.data(popData_gdp)
					.transition()
					.duration(1000)
					.ease("quad")
					.attr("cx",function(d){
					 	return xScale_scatter(d.GDP)
					 })
					.attr("cy",function(d){
					 	return yScale_scatter(d.refugee)
					 })
					.attr("r",function(d){
					 	return rScale_value2(d.value2);
					 })
					.attr("fill",function(d){
					 	return cScale_value2(d.value2);
					 });


	scatter_chart_g.selectAll("text")
					.data(popData_gdp)
					.transition()
					.duration(1000)
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

	circle_graph_chart_g.selectAll("circle")
						.data(popData_capita)
						.transition()
						.duration(1000)
						.ease("quad")
						.attr("cx",0)
							.attr("cy",function(d){
								return circle_yScale(d.Country_Code);
							})
							.attr("r",function(d){
								return rScale_value2(d.value2);
							})
							.attr("fill",function(d){
								return cScale_value2(d.value2);
							});


	d3.selectAll(".circle_capita")
							.data(popData_capita)
							.transition()
							.duration(2000)
							.ease("quad")
							.tween("text",function(d){
			                 var currentNum = this.textContent;
			                 currentNum = currentNum.replace(/,/g,"");
			                 currentNum = currentNum.replace("$","");
			                 currentNum = +currentNum;
			                 var j = d3.interpolateRound(currentNum, d.GDP_capita);

				                return function(t){
				                    d3.select(this).text(formatCom(j(t)) + "$");
				                }
            				});

	d3.selectAll(".circle_refugee")
							.data(popData_capita)
							.transition()
							.duration(2000)
							.ease("quad")
							.tween("text",function(d){
			                 var currentNum = this.textContent;
			                 currentNum = currentNum.replace(/,/g,"");
			                 currentNum = +currentNum;
			                 var j = d3.interpolateRound(currentNum, d.refugee);

				                return function(t){
				                    d3.select(this).text(formatCom(j(t)));
				                }
            				});


}