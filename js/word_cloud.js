var width = parseInt(d3.select("#wordcloud").style('width'));
var height = 0.4 * width;

/*var intro_word_svg = d3.select('.introduction_wordCloud')
					   .append("svg")
					   .attr("width",width)
					   .attr("height",height);*/

var headline_frequencys = [{"text":"Islamic State",id:"is", "size":7245, "nyt":6496, "gd":749},
		                   {"text":"Iran", id:"ir", "size":1543, "nyt":1208, "gd":335},
						   {"text":"Hezbollah", id:"hez", "size":375,"nyt":319, "gd":56},
						   {"text":"United States",id:"us","size":1978, "nyt":1978, "gd":2},
						   {"text":"Assad Regime",id:"ass", "size": 4644, "nyt":4009, "gd":635},
						   {"text":"Free Syrian Army",id:"fsa", "size": 1120, "nyt": 1001, "gd":119},
						   {"text":"International Coalition",id:"ic", "size":45, "nyt": 45, "gd":0},
						   {"text":"YPG", id:"ypg", "size":1067, "nyt":972, "gd":95},
						   {"text":"United Nations",id:"un", "size":2429, "nyt":1952, "gd":477}];

var color_cloud = d3.scale.linear()
            .domain([15,90])
            .range(["#b8e2d3", "#229977"]);

var font_scale = d3.scale.linear()
			.domain([0,7500])
			.range([15,90])

d3.layout.cloud().size([width,height])
				 .words(headline_frequencys)
				 .rotate(0)
				 .fontSize(function(d){ return font_scale(d.size);})
				 .padding(1)
				 .on("end",draw)
				 .start();

function draw(words) {

        d3.select('#wordcloud')
			   .append("svg")
			   .attr("width",width)
			   .attr("height",height)
               .attr("class", "wordcloud")
               .append("g")
                // without the transform, words words would get cutoff to the left and top, they would
                // appear outside of the SVG area
                .attr("transform", "translate(100,100)")
                .selectAll("g")
                .data(words)
                .enter().append("g")
                .attr("id",function(d){
                	return d.id + "_g";
                })
                .append("text")
                .attr("class","wordcloud_text")
                .attr("id",function(d){
                	return d.id;
                })
                .style("font-size", function(d) { return d.size + "px"; })
                .style("fill", function(d, i) { 
                	console.log(color_cloud(d.size) + " :" + d.size);
                	return color_cloud(d.size); })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });


          d3.selectAll(".wordcloud_text").on("mouseover",function(d){
          	var id = d.id;
          
          	d3.selectAll(".wordcloud_text:not(#" + id + ")")
          	  .transition()
          	  .duration(300)
          	  .style("fill",function(d){
			   		return color_cloud(d.size);
			   })
          	  .attr("opacity",0.5);

          	d3.select(this).transition()
          				   .duration(300)
          				   .style("fill","#cc3300")
          				   .attr("opacity",1);

          	var node = d3.select(".wordcloud").node();

          	var coords = d3.mouse(node);

          
          	var tooltip = d3.select(".wordcloud").append("g")
          						   .attr("class","cloud_tooltip")
          						   .attr("transform","translate(" + (coords[0] + 55) + "," + (coords[1] - 55) + ")");

          	tooltip.append("rect")
          		   .attr("x",-20)
          		   .attr("y",-30)
          		   .attr("width",200)
          		   .attr("height",80)
          		   .attr("fill","#111111")
          		   .style("opacity",0.8);

          	tooltip.append("text")
          		   .attr("class","tooltip")
				   .attr("x",0)
				   .attr("y",0)
				   .text("New York Times :  " + d.nyt);

			tooltip.append("text")
				   .attr("class","tooltip")
				   .attr("x",0)
				   .attr("y",20)
				   .text("Guardians :  " + d.gd);

			tooltip.append("text")
				   .attr("class","tooltip")
				   .attr("x",0)
				   .attr("y",40)
				   .text("Total :  " + (d.gd + d.nyt));

          });


          d3.selectAll(".wordcloud_text").on("mousemove",function(d){

          	var node = d3.select(".wordcloud").node();

          	var coords = d3.mouse(node);

          
          	 d3.select(".cloud_tooltip")
          						   .attr("transform","translate(" + (coords[0] + 55) + "," + (coords[1] - 70) + ")");

          });


          d3.selectAll(".wordcloud_text").on("mouseout",function(d){
          	var id = d.id;

          	d3.selectAll(".wordcloud_text").transition()
          				   .duration(300)
          				   .style("fill",function(d){
          				   		return color_cloud(d.size);
          				   });

          	d3.selectAll(".wordcloud_text:not(#" + id + ")")
          	  .transition()
          	  .duration(300)
          	  .attr("opacity",1);

          	d3.select(".cloud_tooltip")
          	  .remove();


          });

     }


