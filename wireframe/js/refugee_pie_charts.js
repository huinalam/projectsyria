var pie_width = parseInt(d3.select("#pie1").style('width'));
if(300<pie_width){
    pie_width = 300;
}
var pie_height = pie_width * 0.6;
var pie_margin = {left: pie_width*0.1, top: pie_height*0.1};

var intro_pie1_svg = d3.select('#pie1')
						.append("svg")
						.attr("width",pie_width)
						.attr("height",pie_height);

var intro_pie2_svg = d3.select('#pie2')
						.append("svg")
						.attr("width",pie_width)
						.attr("height",pie_height);

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

	var pie_r = pie_width *0.5;
	var outerRadius = pie_r/2;
	var innerRadius = outerRadius/2;


	var portion_arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

	var intro_pie = d3.layout
            .pie()            
            .sort(null)
            .value(function(d) {return d.refugee_value;});

    var arc_g1 = intro_pie1_svg
                .append("g")
                .attr("id","pie_g1")
                .attr("transform", "translate(" + (pie_width - (outerRadius + pie_margin.left)) +","+ (pie_height - (outerRadius)) +")");


    var arc_g2 = intro_pie2_svg
                .append("g")
                .attr("transform", "translate(" + (pie_width - (outerRadius + pie_margin.left)) +","+ (pie_height - (outerRadius)) +")");

    var title_text1 = intro_pie1_svg.append("g")
                        .attr("transform","translate(0,20)")
                        .append("text")
                        .attr("class","chart_title");

    title_text1.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("PORTION OF REFUGEES");

    title_text1.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("BETWEEN CONTIENTS");

    title_text1.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("2014");


    var title_text2 = intro_pie2_svg.append("g")
                        .attr("transform","translate(0,20)")
                        .append("text")
                        .attr("class","chart_title");

    title_text2.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("PORTION OF REFUGEES");

    title_text2.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("IN MIDDLE EAST");

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
    								.attr("transform","translate(0," + pie_height*0.7 + ")");

    pie_legend1.selectAll("rect")
    		   .data(continent_portion)
    		   .enter()
    		   .append("rect")
    		   .attr("class",function(d){
    		   	return d.cont;
    		   })
    		   .attr("x",0)
    		   .attr("y",function(d,i){
                return i*3 + "em";
               })
               .attr("width","2em")
               .attr("height","2em");

    pie_legend1.selectAll("text")
    		   .data(continent_portion)
    		   .enter()
    		   .append("text")
    		   .attr("class","legend_text")
    		   .attr("x",25)
    		   .attr("y",function(d,i){
                return (i*3 + 1.1) + "em";
               })
               .text(function(d){
                return d.text;
               });


    var pie_legend2 = intro_pie2_svg.append("g")
    								.attr("transform","translate(0," + pie_height*0.7 + ")");

    pie_legend2.selectAll("rect")
    		   .data(mid_portion)
    		   .enter()
    		   .append("rect")
    		   .attr("class",function(d){
    		   	return d.div;
    		   })
    		   .attr("x",0)
    		   .attr("y",function(d,i){
    		   	return i*3 + "em";
    		   })
    		   .attr("width","2em")
    		   .attr("height","2em");

    pie_legend2.selectAll("text")
    		   .data(mid_portion)
    		   .enter()
    		   .append("text")
    		   .attr("class","legend_text")
    		   .attr("x",25)
    		   .attr("y",function(d,i){
    		   	return (i*3 + 1.1) + "em";
    		   })
    		   .text(function(d){
    		   	return d.text;
    		   });

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

function redraw_pie(){

    pie_width = parseInt(d3.select("#pie1").style('width'));
    if(300<pie_width){
        pie_width = 300;
    }
    pie_height = pie_width * 0.6;
    pie_margin = {left: pie_width*0.1, top: pie_height*0.1};

    intro_pie1_svg.transition()
                            .attr("width",pie_width)
                            .attr("height",pie_height);

    intro_pie2_svg.transition()
                            .attr("width",pie_width)
                            .attr("height",pie_height);


    pie_r = pie_width *0.6;
    outerRadius = pie_r/2;
    innerRadius = outerRadius/2;


    portion_arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

    d3.select("pie_g1")
          .selectAll("path")
          .transition()
          .attr("d",portion_arc);

}




