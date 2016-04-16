
    				//** SVG,PATH 설정
    var map_width=860; //path가 그려질 svg크기
    //var map_height=680;
    var map_height = window.innerHeight - 260;
    var center = [32.8333, 44.9167];		  //지도의 중앙에 위치한 터키 좌표
	/*var projection = d3.geo.conicConformal().center(center)   //투영법 및 스케인, path translate값 입력
					.clipAngle(180)
					.scale(550)
					.translate([0,h/3 + 100])
					.precision(.1);*/


					//**연도 버튼, 국가리스트 배열 설정
  	var start_year = 2011;
    var buttonYears = [2009, 2010, 2011, 2012, 2013, 2014]; //선택될 연도 
    var countryList = ["Syria","South Korea","Egypt", "Iraq","Iran", "Lebanon","Jordan","Turkey","Italy","France","Greece","United Kingdom", "Sweden", "Germany", "Libya", "Saudi Arabia", "Yemen","United States","Canada","Qatar","Oman"]; //이름이 표시될 국가들
    var countryList2 = ["South Korea","Egypt", "Iraq", "Lebanon","Jordan","Turkey","Italy","France","Greece","United Kingdom", "Sweden", "Germany", "Libya", "Saudi Arabia", "Yemen","United States","Canada","Qatar","Oman"]; //난민 숫자가 표시될 국가들

    				//** 전역변수로 갖고 있어야할 data들 또는 인터랙션에 따라 필터링해야 하는 data값들을 저장하는 변수들
    var data1;
    var data2;
    var	popData1; //map 년도 필터링 data 및 바로 전에 필터링된 data
    var preData1;
    var popData2; //pie 년도 필터링 data 및 바로 전에 필터링된 data
    var preData2;
    var map_legend;
    var map_json;
    var duration =[]; //각 국가의 난민변화수량에 맞게 duration 
    var map_num_domain = [1,1000,50000,1000000,1500000];
    var map_legend_num = [1,1000,10000,50000,100000,1000000,1500000];

    				//** 카토그램 및 파이 그래프에 필요한 색상들
 	//var color_list = ["#ccffee","#ccccaa","#cc8866","#bb2222","#AA2233","#660811"];
 	var color_list = ['#b8e2d3','#9CBEB4','#966977','#8f1135','#770025'];
	var c_syria = "#772222";
	
	
	var color = d3.scale.log()
 							.range(color_list);		//카토그램 칼라스케일
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

	var map_path;			//실제 지도를 그리는 path값
	var map_label;
	var map_number;
	//레전드바에 칼라매핑을 하기 위한 실제수치변환 스케일
 					
    var svg_map = d3.select(".map_div_map")  //맵이 그려질 svg추가
    				.append("svg")
    				.attr("width",map_width)
    				.attr("height",map_height)
    				.attr("class","svg_map");


	svg_map.append("path")
				  .datum(graticule)
				  .attr("class","graticule")
				  .attr("d",path);

    var path_group = svg_map.append("g")		//맵 path를 묶을 그룹 추가
    					.attr("transform","translate(20,0)")
    					.attr("class","world");



    d3.csv("data/refugee_2004_2014_world_ac.csv", function(data){

		data.forEach(function(d){
          d.refugees_value = +d.refugees_value;
          d.AS_value = +d.AS_value;
          });

		data1 = data;
	    color.domain(map_num_domain);
	    

        popData1 = data1.filter(function(d) {return d.year == start_year});

		d3.json("data/world_map.geo.json", function(json){   	//시라이+중동+아프리카+유럽 포함된 지도. 

		map_json = json;

		for(var i=0; i<popData1.length; i++){
			
			var dataCountry = popData1[i].destination;
			var refugeesValue = popData1[i].refugees_value;
	

			for(var j =0; j<map_json.features.length; j++){
				
				var jsonCountry = json.features[j].properties.name;
				
				if(dataCountry == jsonCountry){
					map_json.features[j].properties.refugeesValue = refugeesValue;
					break;
				}
			}
		}

		/*group.append("circle")
    					.attr("cx",485)
    					.attr("cy",385)
    					.attr("r",projection.scale())
    					.attr("fill","#114077");*/



		map_path = path_group.append("g")
						.selectAll("path")
						.data(map_json.features)
						.enter()
		 				.append("path")
						.attr("d",path)
						.attr("class","map_path")
						.style("fill", function(d){
							var value = d.properties.refugeesValue;
							value = +value;
							if(d.properties.name == "Syria"){
								return c_syria;
							}
							if(value==0){
								console.log(d.properties.name);
								return color_list[0];
							}else if(value){
								return color(value)
							}
							else{
								return color_list[0];
							}
						
						});

		map_label = path_group.append("g")
							.selectAll("text")
							.data(map_json.features)
							.enter()
							.append("text")
							.attr("class",function(d){
								if(d.properties.name=="Syria"){
									return "syria_label";
								}
								else{
									return "focus_map_label";
								}
							})
							.attr("transform", function(d){
								if(d.properties.name == "Lebanon"){
									return "translate(" + path.centroid(d) +")" + "translate(-35,5)";
								}
								else if(d.properties.name == "Syria"){
									return "translate(" + path.centroid(d) +")";
								}
								else{
									return "translate(" + path.centroid(d) +")" + "translate(0,-5)";
								}	
							})
							.attr("text-anchor","middle")
							.text(function(d){
								for(var i=0; i<countryList.length; i++){
									if(d.properties.name == countryList[i])	
										return d.properties.name;	
								}
							});
							/*.style("fill",function(d,i){
								if(d.properties.name!="Syria"){
								 var value = d.properties.refugeesValue;
								
								 if(value!=0){
								 	 var rgb =  d3.rgb(color(value));
								 }
								 else{
								 	rgb = d3.rgb(c1);
								 }

			                    rgb.r +=alpha;
			                    rgb.g +=alpha;
			                    rgb.b +=alpha;

			                    return "#DDDDDD";
			                	}else{
			                		return "#eeeeee";
			                	}
								
							});*/


		map_number = path_group.append("g")
							.selectAll("text")
							.data(map_json.features)
							.enter()
							.append("text")
							.attr("class","focus_map_number")
							.attr("transform", function(d){
								if(d.properties.name == "Lebanon"){
									return "translate(" + path.centroid(d) +")" + "translate(-35,17)";
								}
								else{
									return "translate(" + path.centroid(d) +")" + "translate(0,7)";
								}	
							})
							.attr("text-anchor","middle")
							.text(function(d){
								for(var i=0; i<countryList.length; i++){
									if(countryList[i]===d.properties.name){
										return d.properties.refugeesValue;
									}
								}
							});
							
				});


    var legend_group = svg_map.append("g")		//맵 path를 묶을 그룹 추가
    					.attr("transform","translate(0,0)")
    					.attr("class","world");
    
   legend_group.append("rect")
   			   .attr("width",100)
   			   .attr("height",130)
   			   .attr("fill","#222222");

    map_legend = legend_group.append("g")
						  .attr("transform","translate(0,0)")
						  .selectAll('g')
						  .data(map_legend_num)
						  .enter()
						  .append("g");

	map_legend.append("rect").attr("x",15)
							  .attr("y",function(d,i){
							  	return map_legend_num.length*15 - i*15;
							  })
							  .attr("width",15)
							  .attr("height",15)
							  .attr("stroke","#cccccc")
							  .attr("stroke-width",0.5)
							  .attr("fill",function(d){
							  	return color(d);
							  });
							  
	map_legend.append("text")
	  			  .attr("text-anchor","start")
				  .text(function(d){
				  	if(d==1){
				  		d=0;
				  	}
				  	return "-" + d3.format(",")(d);
				  })
				  .attr("x",35)
				  .attr("y",function(d,i){
				
				  	return map_legend_num.length*15 - i*15 +10;
				  })
				  .attr("class","map_legend_text");

	}); 
	/*csv function 종료 */

function resize_refugeeMap(){
	var map_width=860; //path가 그려질 svg크기
    var map_height = innerHeight - 260;

	if(700<window.innerHeight){

		projection = d3.geo.conicConformal()
					   .center(center)
					   .scale(580)
					   .translate([map_width/2,map_height/2])
					   .center(center)
					   .precision(.1);

		path = d3.geo.path().projection(projection);  //path의 프로젝션값 설정 
	    graticule = d3.geo.graticule();

	    svg_map.attr("width",map_width)
			   .attr("height",map_height)
			   .attr("class","svg_map");

	    map_path.transition()
	    		.attr("d",path)
				.attr("class","map_path")
				.style("fill", function(d){
				var value = d.properties.refugeesValue;
					value = +value;
					if(d.properties.name == "Syria"){
					return c_syria;
					}
					if(value==0){
					console.log(d.properties.name);
					return color_list[0];
					}else if(value){
					return color(value)
					}
					else{
					return color_list[0];
					}
				});

		map_label.attr("transform", function(d){
						if(d.properties.name == "Lebanon"){
							return "translate(" + path.centroid(d) +")" + "translate(-35,5)";
						}
						else if(d.properties.name == "Syria"){
							return "translate(" + path.centroid(d) +")";
						}
						else{
							return "translate(" + path.centroid(d) +")" + "translate(0,-5)";
						}	
					})
				.attr("text-anchor","middle")
				.text(function(d){
					for(var i=0; i<countryList.length; i++){
						if(d.properties.name == countryList[i])	
							return d.properties.name;	
					}
				});


		map_number.attr("transform", function(d){
							if(d.properties.name == "Lebanon"){
								return "translate(" + path.centroid(d) +")" + "translate(-35,17)";
							}
							else{
								return "translate(" + path.centroid(d) +")" + "translate(0,7)";
							}	
						});





	}
}
			
  

  

