var cloud_width = parseInt(d3.select("#wordcloud").style('width'));
var cloud_height = 0.4 * cloud_width;
var layout_width = cloud_width *0.85;
var layout_height = cloud_height *0.8;

/*var intro_word_svg = d3.select('.introduction_wordCloud')
					   .append("svg")
					   .attr("width",width)
					   .attr("height",height);*/

var headline_frequencys = [{"text":"Iran", id:"ir", "total":1543, "nyt":1208, "gd":335},
            						   {"text":"Hezbollah", id:"hez", "total":375,"nyt":319, "gd":56},
            						   {"text":"United States",id:"us","total":1978, "nyt":1978, "gd":2},
            						   {"text":"Assad Regime",id:"ass", "total": 4644, "nyt":4009, "gd":635},
                           {"text":"Islamic State",id:"is", "total":7245, "nyt":6496, "gd":749},
            						   {"text":"Free Syrian Army",id:"fsa", "total": 1120, "nyt": 1001, "gd":119},
            						   {"text":"International Coalition",id:"ic", "total":45, "nyt": 45, "gd":0},
            						   {"text":"YPG", id:"ypg", "total":1067, "nyt":972, "gd":95},
            						   {"text":"United Nations",id:"un", "total":2429, "nyt":1952, "gd":477}];

  font_size = [15,50,60,75];

for(i=0; i<font_size.length;i++){
  font_size[i] = font_size[i] * (layout_width/800);
}

var color_cloud = d3.scale.linear()
            .domain(font_size)
            .range(["#88AA99","#88BBB0","#99DDD0","#AAFFFF"]);

var font_scale = d3.scale.linear()
			.domain([0,2500,5000,7500])
			.range(font_size);

d3.layout.cloud().size([layout_width,layout_height])
				 .words(headline_frequencys)
				 .rotate(0)
				 .fontSize(function(d){ return font_scale(d.total);})
				 .padding(3)
				 .on("end",draw)
				 .start();

function redraw_wordcloud(){
  d3.select('.wordcloud').remove();

  cloud_width = parseInt(d3.select("#wordcloud").style('width'));
  cloud_height = 0.4 * cloud_width;
  layout_width = cloud_width *0.8;
  layout_height = cloud_height *0.8;

  font_size = [15,50,60,75];

  for(i=0; i<font_size.length;i++){
    font_size[i] = font_size[i] * (layout_width/800);
  }

  color_cloud.domain(font_size);
  font_scale.range(font_size);

  d3.layout.cloud().size([layout_width,layout_height])
         .words(headline_frequencys)
         .rotate(0)
         .fontSize(function(d){ return font_scale(d.total);})
         .padding(3)
         .on("end",draw)
         .start();
}

function draw(words) {

        d3.select('#wordcloud')
			   .append("svg")
			   .attr("width",cloud_width)
			   .attr("height",cloud_height)
               .attr("class", "wordcloud")
               .append("g")
                // without the transform, words words would get cutoff to the left and top, they would
                // appear outside of the SVG area
                .attr("transform", "translate("+ (layout_width/2) + ","+ (layout_height/2 + 0.05*cloud_height) + ")")
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
                .style("font-size", function(d) {console.log(d.size); return d.size + "px"; })
                .style("fill", function(d, i) { 
                	return color_cloud(d.size); })
                .attr("transform", function(d) {
                  console.log(d);
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });


          d3.selectAll(".wordcloud_text").on("mouseover",function(d){
          	var id = d.id;
          
          	d3.selectAll(".wordcloud_text:not(#" + id + ")")
          	  .style("fill",function(d){
			   		return color_cloud(d.size);
			   })
          	  .attr("opacity",0.5);

          	d3.select(this)
          				   .style("fill","#cc3300")
          				   .attr("opacity",1);

          	var node = d3.select(".wordcloud").node();

          	var coords = d3.mouse(node);

          
          	var tooltip = d3.select(".wordcloud").append("g")
          						   .attr("class","cloud_tooltip")
          						   .attr("transform","translate(" + (coords[0] + 55) + "," + (coords[1] - 55) + ")");

  	tooltip.append("rect")
  		   .attr("x",0)
  		   .attr("y",0)
  		   .attr("width",200)
  		   .attr("height",70)
  		   .attr("fill","#111111")
  		   .style("opacity",0.8);

    	tooltip.append("text")
    		   .attr("class","tooltip")
  			   .attr("x",20)
  			   .attr("y",20)
  			   .text("New York Times :  " + d.nyt);

			tooltip.append("text")
				   .attr("class","tooltip")
				   .attr("x",20)
				   .attr("y",40)
				   .text("Guardians :  " + d.gd);

			tooltip.append("text")
				   .attr("class","tooltip")
				   .attr("x",20)
				   .attr("y",60)
				   .text("Total :  " + (d.gd + d.nyt));

          });


          d3.selectAll(".wordcloud_text").on("mousemove",function(d){

          	var node = d3.select(".wordcloud").node();

          	var coords = d3.mouse(node);

          
          	 d3.select(".cloud_tooltip")
          						   .attr("transform","translate(" + (coords[0]) + "," + (coords[1]) + ")");

          });


          d3.selectAll(".wordcloud_text").on("mouseout",function(d){
          	var id = d.id;

          	d3.selectAll(".wordcloud_text")
          				   .style("fill",function(d){
          				   		return color_cloud(d.size);
          				   });

          	d3.selectAll(".wordcloud_text:not(#" + id + ")")
          	  .attr("opacity",1);

          	d3.select(".cloud_tooltip")
          	  .remove();

          });

     }


