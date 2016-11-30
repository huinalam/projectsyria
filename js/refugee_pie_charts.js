var intro_pie_width = 300;
var intro_pie_height = 260;
var intro_pie_margin = {left: 100, top: 50};

var intro_pie1_svg = d3.select('#pie1')
						.append("svg")
						.attr("width",intro_pie_width)
						.attr("height",intro_pie_height);

var intro_pie2_svg = d3.select('#pie2')
						.append("svg")
						.attr("width",intro_pie_width)
						.attr("height",intro_pie_height);

var continent_portion = [{cont:"mid", text:"MIDDLE EAST", refugee_value:3701082},
						 {cont:"eu", text:"EUROPE", refugee_value:92540}];

var sum1 = 3701082 + 92540;

/*
var mid_portion = [{div:"turkey",refugee_value:1557899},
				   {div:"lebanon",refugee_value:1147494},
				   {div:"Jordan",refugee_value:623112},
				   {div:"Iraq",refugee_value:234196},
				   {div:"Gulf State",refugee_value:82}];
*/
var mid_portion = [{div:"mid",text:"OTHER", refugee_value:3649276},
				   {div:"gulf",text:"PERSIAN GULF", refugee_value:234278}];

var sum2 = 3649276 + 234278;

drawing_introPie();

function drawing_introPie(){

	var pie_width = 200;
	var pie_height = 200;
	var outerRadius = pie_width/2;
	var innerRadius = 50;


	var portion_arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

	var intro_pie = d3.layout
            .pie()            
            .sort(null)
            .value(function(d) {return d.refugee_value;});

    var arc_g1 = intro_pie1_svg
                .append("g")
                .attr("transform", "translate(" + (outerRadius + intro_pie_margin.left) +","+ (outerRadius + intro_pie_margin.top) +")");


    var arc_g2 = intro_pie2_svg
                .append("g")
                .attr("transform", "translate(" + (outerRadius + intro_pie_margin.left) +","+ (outerRadius + intro_pie_margin.top) +")");

    var title_text1 = intro_pie1_svg.append("g")
                        .attr("transform","translate(15,30)")
                        .append("text")
                        .attr("class","chart_title");

    title_text1.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("Portions of Refugees");

    title_text1.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("Between Continents");

    title_text1.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("2014");


    var title_text2 = intro_pie2_svg.append("g")
                        .attr("transform","translate(15,30)")
                        .append("text")
                        .attr("class","chart_title");

    title_text2.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("Portions of Refugees");

    title_text2.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("in Middle East");

    title_text2.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("2014");


    arc_g1.selectAll("path")
    	  .data(intro_pie(continent_portion))
    	  .enter()
    	  .append("path")
    	  .attr("d",portion_arc)
    	  .attr("class",function(d){
    	  	return d.data.cont;
    	  });


   	arc_g1.selectAll("text")
      		 .data(intro_pie(continent_portion))
             .enter()
             .append("text")
             .attr("d",portion_arc)
             .attr("transform", function(d){
                     return "translate(" + portion_arc.centroid(d) + ")";
             })
             .attr("text-anchor", "middle")
             .attr("class","pie_text")
             .text(function(d){
                    return d3.format("%")(d.data.refugee_value/sum1);
            });

    var pie_legend1 = intro_pie1_svg.append("g")
    								.attr("transform","translate(0,200)");

    pie_legend1.selectAll("rect")
    		   .data(continent_portion)
    		   .enter()
    		   .append("rect")
    		   .attr("class",function(d){
    		   	return d.cont;
    		   })
    		   .attr("x",0)
    		   .attr("y",function(d,i){
    		   	return i*30;
    		   })
    		   .attr("width",20)
    		   .attr("height",20);

    pie_legend1.selectAll("text")
    		   .data(continent_portion)
    		   .enter()
    		   .append("text")
    		   .attr("class","legend_text")
    		   .attr("x",25)
    		   .attr("y",function(d,i){
    		   	return i*30 + 15;
    		   })
    		   .text(function(d){
    		   	return d.text;
    		   })


    var pie_legend2 = intro_pie2_svg.append("g")
    								.attr("transform","translate(15,200)");

    pie_legend2.selectAll("rect")
    		   .data(mid_portion)
    		   .enter()
    		   .append("rect")
    		   .attr("class",function(d){
    		   	return d.div;
    		   })
    		   .attr("x",0)
    		   .attr("y",function(d,i){
    		   	return i*30;
    		   })
    		   .attr("width",20)
    		   .attr("height",20);

    pie_legend2.selectAll("text")
    		   .data(mid_portion)
    		   .enter()
    		   .append("text")
    		   .attr("class","legend_text")
    		   .attr("x",25)
    		   .attr("y",function(d,i){
    		   	return i*30 + 15;
    		   })
    		   .text(function(d){
    		   	return d.text;
    		   })

   	arc_g2.selectAll("path")
    	  .data(intro_pie(mid_portion))
    	  .enter()
    	  .append("path")
    	  .attr("d",portion_arc)
    	  .attr("class",function(d){
    	  	return d.data.div;
    	  });

    arc_g2.selectAll("text")
      		 .data(intro_pie(mid_portion))
             .enter()
             .append("text")
             .attr("d",portion_arc)
             .attr("transform", function(d){
                     return "translate(" + portion_arc.centroid(d) + ")";
             })
             .attr("text-anchor", "middle")
             .attr("class","pie_text")
             .text(function(d){
                    return d3.format("%")(d.data.refugee_value/sum2);
            });

}




