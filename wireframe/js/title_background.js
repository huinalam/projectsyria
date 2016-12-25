var title_width = parseInt(d3.select(".header_background").style('width'));
var title_height = title_width;
var title_margin = title_width *0.05;
var title_canvas_width = title_width - 2*title_margin;
var title_canvas_height = title_height - 2*title_margin;

var title_svg = d3.select('#background_svg').append("svg")
							.attr("width",title_width)
							.attr("height",title_height)
							.attr("id","title_svg");


function redraw_headerSVG(){

	title_width = parseInt(d3.select(".header_background").style('width'));
	title_height = title_width;
	title_margin = title_width *0.05;
	title_canvas_width = title_width - 2*title_margin;
	title_canvas_height = title_height - 2*title_margin;

	title_svg
			 .attr("width",title_width)
			 .attr("height",title_height);

}

