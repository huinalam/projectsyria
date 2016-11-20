// size variable
var margin = {
              top:30,
              left:30,
              bottom:0,
              right:40
              };
              
var width = parseInt(d3.select(".viz").style('width'));
var height = width * 0.8;

//DATA
var dataCon;
var popData;
var map_json;
var start_year = 2011;
var Years = [2011, 2012, 2013, 2014]; //선택될 연도 
var countryList = ["Syria","South Korea","Egypt", "Iraq","Iran", "Lebanon","Jordan","Turkey","Italy","France","Spain","Greece","United Kingdom", "Sweden", "Germany", "Libya", "Saudi Arabia", "Yemen","United States","Canada","Qatar","Oman"]; //이름이 표시될 국가들
var countryList2 = ["South Korea","Egypt", "Iraq", "Lebanon","Jordan","Turkey","Italy","France","Greece","United Kingdom", "Sweden", "Germany", "Libya", "Saudi Arabia", "Yemen","United States","Canada","Qatar","Oman"]; //난민 숫자가 표시될 국가들

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
				   .translate([width/2,height/2])
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

      data.forEach(function(d){
          d.refugees_value = +d.refugees_value;
          d.AS_value = +d.AS_value;
          });

      dataCon = data;
      color.domain(map_num_domain);

      popData = data.filter(function(d) {return d.year == start_year});

      d3.json("data/world_map_min.geo.json", function(json){    //시라이+중동+아프리카+유럽 포함된 지도. 

        map_json = json;

        for(var i=0; i<popData.length; i++){
          
          var dataCountry = popData[i].destination;
          var refugeesValue = popData[i].refugees_value;
      

          for(var j =0; j<map_json.features.length; j++){
            
            var jsonCountry = json.features[j].properties.name;
            
            if(dataCountry == jsonCountry){
              map_json.features[j].properties.refugeesValue = refugeesValue;
              break;
            }
          }
        }

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
                                    return "syria_label label";
                                  }
                                  else{
                                    return "focus_map_label label";
                                  }
                                })
                                .attr("transform", function(d){
                                  if(d.properties.name == "Lebanon"){
                                    return "translate(" + path.centroid(d) +")" + "translate(-35,5)";
                                  }
                                  else if(d.properties.name == "France"){
                                    return "translate(" + path.centroid(d) +")" + "translate(65,-50)";
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
                                    else if(d.properties.name == "France"){
                                      return "translate(" + path.centroid(d) +")" + "translate(65,-38)";
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

      });// end of json functuin

    	
    });

function reDraw(){

    width = parseInt(d3.select(".viz").style('width'));
    height = width * 0.8;

    //*SVG resize
    svg_chapter2.transition()
                .attr("width",width)
                .attr("height",height);

    //Projection 재설정
    projection
             .translate([width/2,height/2])
             .center(center)
             .precision(.1);


    path = d3.geo.path().projection(projection);  //path의 프로젝션값 설정 
    
    //다시 그리기
    map_path.transition()
            .attr("d",path);

    //라벨, 숫자 재위치
    path_group.selectAll(".label").attr("transform", function(d){
                if(d.properties.name == "Lebanon"){
                  return "translate(" + path.centroid(d) +")" + "translate(-35,5)";
                }
                else if(d.properties.name == "France"){
                  return "translate(" + path.centroid(d) +")" + "translate(65,-50)";
                }
                else if(d.properties.name == "Syria"){
                  return "translate(" + path.centroid(d) +")";
                }
                else{
                  return "translate(" + path.centroid(d) +")" + "translate(0,-5)";
                } 
            });

    path_group.selectAll(".focus_map_number")
              .attr("transform", function(d){
                  if(d.properties.name == "Lebanon"){
                    return "translate(" + path.centroid(d) +")" + "translate(-35,17)";
                  }
                  else if(d.properties.name == "France"){
                    return "translate(" + path.centroid(d) +")" + "translate(65,-38)";
                  }
                  else{
                    return "translate(" + path.centroid(d) +")" + "translate(0,7)";
                  } 
                });



}