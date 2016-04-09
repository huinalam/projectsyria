//웹폰트 추가: Roboto + Slab
	 WebFontConfig = {	
                    google: { families: [ 'Roboto+Slab:100:latin', 'Source+Code+Pro:400,300,200:latin' ] }
                  };
                  (function() {
                    var wf = document.createElement('script');
                    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
                      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
                    wf.type = 'text/javascript';
                    wf.async = 'true';
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(wf, s);
                  })();
    				//** SVG,PATH 설정
    var w=860; //path가 그려질 svg크기
    var h=680;
    var center = [32.8333, 44.9167];		  //지도의 중앙에 위치한 터키 좌표
	/*var projection = d3.geo.conicConformal().center(center)   //투영법 및 스케인, path translate값 입력
					.clipAngle(180)
					.scale(550)
					.translate([0,h/3 + 100])
					.precision(.1);*/

	var projection = d3.geo.mercator()
					   .center(center)
					   .scale((w+30)/2/Math.PI)
					   .translate([w/2+30,h/2])
					   .center(center)
					   .precision(.1);

	var path = d3.geo.path().projection(projection);  //path의 프로젝션값 설정 

	var graticule = d3.geo.graticule();

	var world_map_path;			//실제 지도를 그리는 path값
	var world_map_label;
	var legend;


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
    var map_legend_num =[1,1000,10000,100000,1000000,250000];

    				//** 카토그램 및 파이 그래프에 필요한 색상들
    var c1 = "#333333";
  	var c2 = "#55BFAA"; //카토그램 첫번째 색
	var c3 = "#991122";
	var c4 = "#CC3344";
	var c_syria = "#772222"; //시리아 지도표시
	
	var color = d3.scale.log()
 							.range([c1,c3,c4]);		//카토그램 칼라스케일
 	var alpha = 90;
 
 	var scale_legend = d3.scale.linear()
 							.domain([0,200])
 							.range([0,1500000]);		//레전드바에 칼라매핑을 하기 위한 실제수치변환 스케일


	var projection2 = d3.geo.conicConformal()
					   .center(center)
					   .scale(580)
					   .translate([w/2,h/2])
					   .center(center)
					   .precision(.1);

	var path2 = d3.geo.path().projection(projection2);  //path의 프로젝션값 설정 
	var graticule2 = d3.geo.graticule();

	var focus_map_path;			//실제 지도를 그리는 path값
	var focus_map_label;
	//레전드바에 칼라매핑을 하기 위한 실제수치변환 스케일


 					
    var svg_focus_map = d3.select(".map_div_map")  //맵이 그려질 svg추가
    				.append("svg")
    				.attr("width",w)
    				.attr("height",h)
    				.attr("class","svg_map")

    	svg_focus_map.append("rect")				//맵을 둘러싸고 있는 SVG경계선
    				  .attr("x",0)
    				  .attr("y",0)
    				  .attr("width",w)
    				  .attr("height",h)
    				  .attr("class","svg_box");

    	svg_focus_map.append("path")
    				  .datum(graticule2)
    				  .attr("class","graticule")
    				  .attr("d",path2);

    	


    var focus_group = svg_focus_map.append("g")		//맵 path를 묶을 그룹 추가
    					.attr("transform","translate(20,0)")
    					.attr("class","world");



    d3.csv("data/refugee_2004_2014_world_ac.csv", function(data){
		data.forEach(function(d){
          d.refugees_value = +d.refugees_value;
          d.AS_value = +d.AS_value;
          });

		data1 = data;
		
	    color.domain([1,500000,d3.max(data1, function(d){ return d.refugees_value;})]);


        popData1 = data1.filter(function(d) {return d.year == start_year});

		d3.json("data/ne_50m_admin_0_countries.geo.json", function(json){   	//시라이+중동+아프리카+유럽 포함된 지도. 

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



		focus_map_path = focus_group.append("g")
						.selectAll("path")
						.data(map_json.features)
						.enter()
		 				.append("path")
						.attr("d",path2)
						.attr("class","map_path")
						.style("fill", function(d){
							var value = d.properties.refugeesValue;
							value = +value;
							if(d.properties.name == "Syria"){
								return c_syria;
							}
							if(value){
								return color(value);
							}
							else{
								return c1;
							}
						
						});

		focus_map_label = focus_group.append("g")
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
									return "translate(" + path2.centroid(d) +")" + "translate(-35,5)";
								}
								else if(d.properties.name == "Syria"){
									return "translate(" + path2.centroid(d) +")";
								}
								else{
									return "translate(" + path2.centroid(d) +")" + "translate(0,-5)";
								}	
							})
							.attr("text-anchor","middle")
							.text(function(d){
								for(var i=0; i<countryList.length; i++){
									if(d.properties.name == countryList[i])	
										return d.properties.name;	
								}
								
							})
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


		focus_map_number = focus_group.append("g")
							.selectAll("text")
							.data(map_json.features)
							.enter()
							.append("text")
							.attr("class","focus_map_number")
							.attr("transform", function(d){
								if(d.properties.name == "Lebanon"){
									return "translate(" + path2.centroid(d) +")" + "translate(-35,17)";
								}
								else{
									return "translate(" + path2.centroid(d) +")" + "translate(0,7)";
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




    var legend_group = svg_focus_map.append("g")		//맵 path를 묶을 그룹 추가
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
			
  

  

