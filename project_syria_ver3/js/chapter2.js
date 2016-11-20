// size variable
var margin = {
              top:30,
              left:30,
              bottom:0,
              right:40
              };
              
width = parseInt(d3.select(".viz").style('width'));
height = width * 0.8;

//DATA
var dataCon;
var popData;
var map_json;
var start_year = 2011;
var Years = [2011, 2012, 2013, 2014]; //선택될 연도 

//SVG & Group & Map 


var map_legend;
var duration =[]; //각 국가의 난민변화수량에 맞게 duration 
var map_num_domain = [1,1000,50000,1000000,1500000];
var map_legend_num = [1,1000,10000,50000,100000,1000000,1500000];




//scale & projection
var center = [32.8333, 44.9167];		  //지도의 중앙에 위치한 터키 좌표
var color_list = ['#b8e2d3','#9CBEB4','#966977','#8f1135','#770025'];
var c_syria = "#772222";


var color = d3.scale.log().range(color_list);		//카토그램 칼라스케일
	
	var alpha = 90;
	var scale_legend = d3.scale.linear()
							.domain([0,200])
							.range([0,1500000]);		//레전드바에 칼라매핑을 하기 위한 실제수치변환 스케일


var projection = d3.geo.conicConformal()
				   .center(center)
				   .scale(580)
				   .translate([map_width/2,map_height/2])
				   .center(center)
				   .precision(.1);

var path = d3.geo.path().projection(projection);  //path의 프로젝션값 설정 
var graticule = d3.geo.graticule();

var map_path;	// path값
var map_label;
var map_number;

var svg_chapter2 = d3.select(".viz").append("svg")
                                    .attr("class","intro_svg_intrograph")
                                    .attr("width",width)
                                    .attr("height",height)
                                    .style("background-color","#111215");

    svg_chapter2.append("path")
    	   .datum(graticule)
    	   .attr("class","graticule")
    	   .attr("d",path);

    var path_group = svg_chapter2.append("g")
    							 .attr("transform","translate(0,0)")
    							 .attr("class","world");



    d3.csv("data/refugee_2004_2014_world_ac.csv",function(data){

    	
    });