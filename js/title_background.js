var title_width = parseInt(d3.select(".header_background").style('width'));
var title_height = title_width;
var title_margin = title_width *0.05;
var title_canvas_width = title_width - 2*title_margin;
var title_canvas_height = title_height - 2*title_margin;

var title_svg = d3.select('#background_svg').append("svg")
							.attr("width",title_width)
							.attr("height",title_height)
							.attr("id","title_svg");

var grid_index = [				  18,
				22,23,24,25,26,27,28,
				31,32,33,34,35,36,37,
				41,42,43,44,45,46,47,
				51,52,53,54,55,56,57,
				61,62,63,64,65,
				71,72,73,
				81,82
				];

var grid_index_length = grid_index.length;

var title_g = title_svg.append("g")
					   .attr("transform","translate(" + title_margin + "," + title_margin +")");

var grid_g = title_svg.append("g")
					   .attr("transform","translate(" + title_margin + "," + title_margin +")");

var circle_num = 10;
var circle_coord = [];

var grid_coord = [];
var grid_slice = 10;
var grid_unit = title_canvas_width/grid_slice;
var grid_index = 0;
for(i=0;i<grid_slice;i++){
	for(j=0;j<grid_slice;j++){
		var temp = {};
		temp.x = j*grid_unit + grid_unit/2;
		temp.y = i*grid_unit + grid_unit/2; 
		grid_coord[grid_index] = temp;
		grid_index++;
	}
}
console.log(title_canvas_width);
console.log(title_margin);
console.log(grid_unit);

var line_coord = [];


var range= 10;
var dx = Math.random()*range - range/2;
var dy = Math.random()*range - range/2;
//README 원과 라인의 좌표를 맞추기 위한 random move원 좌표 배열 
var ix = [];
var iy = [];
var total_num=0;

//push_circle(circle_num);
//initial_animation();
function redraw_headerSVG(){

	title_width = parseInt(d3.select(".header_background").style('width'));
	title_height = title_width;
	title_margin = title_width *0.05;
	title_canvas_width = title_width - 2*title_margin;
	title_canvas_height = title_height - 2*title_margin;

	title_svg
			 .attr("width",title_width)
			 .attr("height",title_height);



	title_g
		   .attr("transform","translate(" + title_margin + "," + title_margin +")");

	grid_g
		   .attr("transform","translate(" + title_margin + "," + title_margin +")");


    grid_coord = [];
    console.log(grid_coord);
	grid_unit = title_canvas_width/grid_slice;
	grid_index = 0;

	for(i=0;i<grid_slice;i++){
		for(j=0;j<grid_slice;j++){
			var temp = {};
			temp.x = j*grid_unit + grid_unit/2;
			temp.y = i*grid_unit + grid_unit/2;
			grid_coord[grid_index] = temp;
			grid_index++;
		}
	}


	title_g.selectAll("circle")
		   .data(circle_coord)
		   .enter()
		   .append("circle")
		   .attr("class",function(d,i){
		   	 return "m_circle" + " " + "circle" +i;
		   })
		   .attr("cx",function(d){
		   		return d.x;
		   })
		   .attr("cy",function(d){
		   		return d.y;
		   })
		   .attr("r","0.3em")
		   .style("opacity",0);


	grid_g.selectAll("circle")
		   .transition()
		   .attr("cx",function(d,i){
		   		console.log(grid_coord[i].x);
		   		return grid_coord[i].x;
		   })
		   .attr("cy",function(d,i){
		   		return grid_coord[i].y;
		   })
		   .attr("r",0.5)
		   .attr("fill","#ffcc00");

	grid_g.selectAll("text")
		   .transition()
		   .attr("x",function(d,i){
		   		console.log(grid_coord[i].x);
		   		return grid_coord[i].x;
		   })
		   .attr("y",function(d,i){
		   		return grid_coord[i].y;
		   })
		   .attr("fill","#ffcc00")
		   .text(function(d,i){return i;});



}

function random_move(time){

		var limit = 3000;
		var interval = time%limit;
		//console.log(interval);
		//인터벌 체크
		if(2970<interval){
			//시작점, 끝점 인덱스
			for(i=0; i<circle_num; i++){
				//원 트랜지션
				var dx = Math.random()*range - range/2;
			 	var dy = Math.random()*range - range/2;

			 	ix[i] = parseFloat(d3.select(".circle"+i).attr("cx")) +dx;
			 	iy[i] = parseFloat(d3.select(".circle"+i).attr("cy")) +dx;

			 	d3.select(".circle" +i)
			 		  .transition()
			 		  .duration(4000)
			 		  .ease("elastic")
			 		  .attr("cx",ix[i])
			 		  .attr("cy",iy[i]);
			 }

			 d3.selectAll(".m_line")
			   .transition()
			   .duration(4000)
			   .ease("elastic")
			   .attr("x1",function(d){
			   	 var index = d.s;
			   	 return ix[index];
			   })
			   .attr("y1",function(d){
			   	 var index = d.s;
			   	 return iy[index];
			   })
			   .attr("x2",function(d){
			   	 var index = d.e;
			   	 return ix[index];
			   })
			   .attr("y2",function(d){
			   	 var index = d.e;
			   	 return iy[index];
			   });

		}

}
function scroll_move(){

		
		//시작점, 끝점 인덱스
		for(i=0; i<total_num; i++){
			//원 트랜지션
			var dx = Math.random()*range - range/2;
		 	var dy = Math.random()*range - range/2;

		 	ix[i] = parseFloat(d3.select(".circle"+i).attr("cx")) +dx;
		 	iy[i] = parseFloat(d3.select(".circle"+i).attr("cy")) +dx;

		 	d3.select(".circle" +i)
		 		  .transition()
		 		  .duration(600)
		 		  .ease("elastic")
		 		  .attr("cx",ix[i])
		 		  .attr("cy",iy[i]);
		 }

		 d3.selectAll(".m_line")
		   .transition()
		   .duration(600)
		   .ease("elastic")
		   .attr("x1",function(d){
		   	 var index = d.s;
		   	 return ix[index];
		   })
		   .attr("y1",function(d){
		   	 var index = d.s;
		   	 return iy[index];
		   })
		   .attr("x2",function(d){
		   	 var index = d.e;
		   	 return ix[index];
		   })
		   .attr("y2",function(d){
		   	 var index = d.e;
		   	 return iy[index];
		   });


}

function first_drawing(num){
	total_num+= num;

	for(i=0;i<num;i++){
		var temp = {};
		temp.x = parseInt(Math.random() * title_canvas_width/40)*40
		temp.y = parseInt(Math.random() * title_canvas_height/40)*40;
		temp.index = i;
		circle_coord.push(temp);
	}

	var index =0;
	for(i=0; i<total_num; i++){
	 	for(j=i+1; j<total_num; j++){
	 		var temp = {};
	 		temp.s = i;
	 		temp.e = j;
	 		line_coord[index]= temp;
	 		index+=1;
	 	}
	 }


	title_g.selectAll("circle")
		   .data(circle_coord)
		   .enter()
		   .append("circle")
		   .attr("class",function(d,i){
		   	 return "m_circle" + " " + "circle" +i;
		   })
		   .attr("cx",function(d){
		   		return d.x;
		   })
		   .attr("cy",function(d){
		   		return d.y;
		   })
		   .attr("r","0.3em")
		   .style("opacity",0);

	title_g.selectAll(".m_circle")  
		   .transition()
		   .duration(600)
		   .style("opacity",0.8);


	title_g.selectAll("line")
		   .data(line_coord)
		   .enter()
		   .append("line")
		   .attr("class","m_line")
		   .attr("x1",function(d){
		   		var index = d.s;
		   		return circle_coord[index].x
		   })
		   .attr("y1",function(d){
		   		var index = d.s;
		   		return circle_coord[index].y
		   })
		   .attr("x2",function(d){
		   		var index = d.e;
		   		return circle_coord[index].x
		   })
		   .attr("y2",function(d){
		   		var index = d.e;
		   		return circle_coord[index].y
		   });

	grid_g.selectAll("circle")
		   .data(grid_coord)
		   .enter()
		   .append("circle")
		   .attr("cx",function(d){
		   		return d.x;
		   })
		   .attr("cy",function(d){
		   		return d.y;
		   })
		   .attr("r",0.5)
		   .attr("fill","#ffcc00");

	grid_g.selectAll("text")
		   .data(grid_coord)
		   .enter()
		   .append("text")
		   .attr("x",function(d){
		   		return d.x;
		   })
		   .attr("y",function(d){
		   		return d.y;
		   })
		   .attr("fill","#ffcc00")
		   .text(function(d,i){return i;});




	//animation();

}


function push_circle(num){

	total_num+= num;

	for(i=0;i<num;i++){
		var temp ={};
		temp.x = parseInt(Math.random() * title_canvas_width);
		temp.y = parseInt(Math.random() * title_canvas_height);
		circle_coord.push(temp);
	}

	var index =0;
	for(i=0; i<total_num; i++){
	 	for(j=i+1; j<total_num; j++){
	 		var temp = {};
	 		temp.s = i;
	 		temp.e = j;
	 		line_coord[index]= temp;
	 		index+=1;
	 	}
	 }

	 title_g.selectAll("circle")
		   .data(circle_coord)
		   .enter()
		   .append("circle")
		   .attr("class",function(d,i){
		   	 return "m_circle" + " " + "circle" +i;
		   })
		   .attr("cx",function(d){
		   		return d.x;
		   })
		   .attr("cy",function(d){
		   		return d.y;
		   })
		   .attr("r","0.3em");


	 title_g.selectAll("line")
		   .data(line_coord)
		   .enter()
		   .append("line")
		   .attr("class","m_line")
		   .attr("x1",function(d){
		   		var index = d.s;
		   		return circle_coord[index].x
		   })
		   .attr("y1",function(d){
		   		var index = d.s;
		   		return circle_coord[index].y
		   })
		   .attr("x2",function(d){
		   		var index = d.e;
		   		return circle_coord[index].x
		   })
		   .attr("y2",function(d){
		   		var index = d.e;
		   		return circle_coord[index].y
		   });
}

function animation(){

	d3.timer(random_move);

}
