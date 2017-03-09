/*GLOBAL VAR*/
/**/
/*Data & SVG*/
var data_frequency;
var svg_frequency;
var svg_frequency_margin = { 
                            top:30,
                            left:0,
                            bottom:30,
                            right:100
                          };
/*Scale*/
var group_list = ["ass","hzb","is","russia","ypg","ic"];
var group_name = ["ASSAD REGIME", "HEZBOLLAH", "ISLAMIC STATE", "RUSSIA", "YPG", "INTERNATIONAL COALIATION"];
var event_list = ["barrel_bomb","battle","shelling","chemical","air_strike","massacre"];
var event_name = ["BRREL BOMB","BATTLE","SHELLING","CHEMICAL", "AIR STRIKE", "MASSCARE"];
var group_scale;
var event_scale;

/*Axis*/
var group_axis;
var event_axis;
var group_axis_g;
var event_axis_g;

/*Heatmap*/
var heatmap_g;

                        

function initiation_frequency(){
	d3.csv("data/event_group_type.csv",function(data){
		data_frequency = data;
		data_frequency.forEach(function(item){
			item.value = +item.value;
		});

    /*Size*/
  var width = parseInt(d3.select('#viz_frequency').style("width"))/2;
  var height = width;
  svg_frequency = d3.select('#viz_frequency').append("svg")
                          .attr("width",width)
                          .attr("height",height);

    /*Scale Setting*/
    group_scale = d3.scale.ordinal().rangeBands([svg_frequency_margin.top, height - svg_frequency_margin.bottom])
                                    .domain(group_list);

    event_scale = d3.scale.ordinal().rangeBands([svg_frequency_margin.left, height - svg_frequency_margin.right])
                                    .domain(event_list);
                               
    /*Axis Setting*/
    group_axis = d3.svg.axis()
                       .scale(group_scale)
                       .orient("right")
                       .tickSize(5,0);

    event_axis = d3.svg.axis()
                       .scale(event_scale)
                       .orient("top")
                       .tickSize(5,0);

    group_axis_g = svg_frequency.append("g")
                                .attr("class","heatmap_axis")
                                .attr("id","group_axis")
                                .attr("transform","translate(" + (width - svg_frequency_margin.right) + ",0)")
                                .call(group_axis);

    group_axis_g.selectAll("text")
                .text(function(d,i){
                  return group_name[i];
                })
                .attr("text-anchor","middle");

    event_axis_g = svg_frequency.append("g")
                                .attr("class","heatmap_axis")
                                .attr("id","event_axis")
                                .attr("transform","translate(0," + svg_frequency_margin.top + ")")
                                .call(event_axis);

    event_axis_g.selectAll("text")
                .text(function(d,i){
                  return event_name[i];
                })
                .attr("text-anchor","middle");


    /*Drawing heatmap*/
    heatmap_g = svg_frequency.append("g")
                             .attr("transform","translate(0" +(svg_frequency_margin.left + event_scale.rangeBand()/2)+ "," + ( group_scale.rangeBand()/2) + ")");


    heatmap = heatmap_g
                       .selectAll("g")
                       .data(data_frequency)
                       .enter()
                       .append("g")
                       .attr("transform",function(d){
                          var x = event_scale(d.event);
                          var y = group_scale(d.group);
                          return "translate(" + x + "," + y + ")";
                       });

    heatmap.append("text")
             .attr("class","heatmap_value")
             .text(function(d){
              return d.value;
             })
             .attr("text-anchor","middle");




	});
}




function redrawing_frequency(){
	var width = parseInt(d3.select('#viz_frequency').style("width"))/2;
	var height = width;
	
	svg_frequency.transition()
				   .attr("width",width)
				   .attr("height",height);

  /*Rescale*/
  group_scale.rangeBands([svg_frequency_margin.top, height - svg_frequency_margin.bottom]);
  event_scale.rangeBands([svg_frequency_margin.left, height - svg_frequency_margin.right]);
                                 
  /*Re Axis*/
  d3.select("#group_axis").transition()
                          .attr("transform","translate(" + (width - svg_frequency_margin.right) + ",0)")
                          .call(group_axis);

  d3.select("#event_axis").transition()
                          .attr("transform","translate(0," + svg_frequency_margin.top + ")")
                          .call(event_axis);

  group_axis_g.selectAll("text")
                .text(function(d,i){
                  return group_name[i];
                })
                .attr("text-anchor","middle");

  event_axis_g.selectAll("text")
                .html(function(d,i){
                  return event_name[i];
                })
                .attr("text-anchor","middle");


}

