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
var years = [2011, 2012, 2013, 2014]; //선택될 연도 
var countryList = ["Syria","South Korea","Egypt", "Iraq","Iran", "Lebanon","Jordan","Turkey","Italy","Spain","Greece","United Kingdom", "Sweden", "Germany", "Libya", "Saudi Arabia", "Yemen","United States","Canada","Qatar","Oman"]; //이름이 표시될 국가들
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
				   .scale(width*0.98)
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
                                    .attr("height",height);
                                    //.style("background-color","#11181A");

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
                                    return "translate(" + path.centroid(d) +")" + "translate(-20,0)";
                                  }
                                  else if(d.properties.name == "France"){
                                    return "translate(" + path.centroid(d) +")" + "translate(0,-0)";
                                  }
                                  else if(d.properties.name == "Syria"){
                                    return "translate(" + path.centroid(d) +")";
                                  }
                                  else{
                                    return "translate(" + path.centroid(d) +")" + "translate(0,-0)";
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
                                      return "translate(" + path.centroid(d) +")" + "translate(-20,10)";
                                    }
                                    else if(d.properties.name == "France"){
                                      return "translate(" + path.centroid(d) +")" + "translate(0,10)";
                                    }
                                    else if(d.properties.name == "Syria"){
                                      return "";
                                    }
                                    else{
                                      return "translate(" + path.centroid(d) +")" + "translate(0,10)";
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


             var legend_group = svg_chapter2.append("g")   //맵 path를 묶을 그룹 추가
                                       .attr("class","legend_group")
                                       .attr("transform","translate(0,0)");

              legend_group.append("rect")
                          .attr("x",0)
                          .attr("y",0)
                          .attr("width",70)
                          .attr("height",60)
                          .attr("fill","#111111");

              map_legend = legend_group.append("g")
                            .attr("transform","translate(0,0)")
                            .selectAll('g')
                            .data(map_legend_num)
                            .enter()
                            .append("g");



              map_legend.append("rect").attr("x",10)
                            .attr("y",function(d,i){
                              return map_legend_num.length*10 - i*10;
                            })
                            .attr("width",10)
                            .attr("height",10)
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
                          return " " + d3.format(",")(d);
                        })
                        .attr("x",25)
                        .attr("y",function(d,i){
                      
                          return map_legend_num.length*10 - i*10 + 10;
                        })
                        .attr("class","map_legend_text");

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
             .scale(width*0.98)
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
                  return "translate(" + path.centroid(d) +")" + "translate(0,0";
                }
                else if(d.properties.name == "France"){
                  return "translate(" + path.centroid(d) +")" + "translate(0,0)";
                }
                else if(d.properties.name == "Syria"){
                  return "translate(" + path.centroid(d) +")";
                }
                else{
                  return "translate(" + path.centroid(d) +")" + "translate(0,0)";
                } 
            });

    path_group.selectAll(".focus_map_number")
              .attr("transform", function(d){
                if(d.properties.name != "Syria"){
                      if(d.properties.name == "Lebanon"){
                        return "translate(" + path.centroid(d) +")" + "translate(0,7)";
                      }
                      else if(d.properties.name == "France"){
                        return "translate(" + path.centroid(d) +")" + "translate(0,7)";
                      }
                      else{
                        return "translate(" + path.centroid(d) +")" + "translate(0,7)";
                      } 
                  }
                });

}

function mapTransition(year){
          
      popData = dataCon.filter(function(d) {return d.year == year}); //새 데이터 갱신


     //---popData에 매칭되는 값을 map_json에 입력하

      for(var i=0; i<popData.length; i++){
        
        var dataCountry = popData[i].destination;
        var refugeesValue = popData[i].refugees_value;
      
        for(var j =0; j<map_json.features.length; j++){
          
          var jsonCountry = map_json.features[j].properties.name;
          
          if(dataCountry == jsonCountry){
            map_json.features[j].properties.refugeesValue = refugeesValue;
            break;
          }
        }

      }

      map_number.data(map_json.features)
              .transition()
              .delay(function(d,i){
              return i*5;
               })
              .duration(function(d,i){
   
              currentNum = +this.textContent;
                duration[i] = Math.abs(currentNum - d.properties.refugeesValue)/4000;
                if(duration[i]<200){
                  duration[i] = 200;
                }
                return duration[i];
              
            })
              .ease("exp")
              .tween("text", function(d){
                  for(var i=0;i<countryList.length;i++){
                    if(d.properties.name == countryList[i]){
                      var currentNum = +this.textContent;
                      var j = d3.interpolateRound(currentNum, d.properties.refugeesValue);

                      return function(t){
                        this.textContent = j(t);
                      };
                  }
                }
              });


        map_path.data(map_json.features)
            .transition()
            .delay(function(d,i){
              return i*5;
            })
            .duration(function(d,i){
              return duration[i];
            })
            .ease("exp")
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



        map_label.data(map_json.features)
          .transition()
          .delay(function(d,i){
              return i*5;
            })
          .duration(function(d,i){
              return duration[i];
            })
          .ease("exp");
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

                          return rgb;
                        }else{
                          return "#eeeeee";
                        }

          });*/     
}
