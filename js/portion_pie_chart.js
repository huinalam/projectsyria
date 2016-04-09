var title_text;
var total_text;
var pie_arc;
var pie_text;
var total_text;
var total_num;
var currentNum;
var example ="example";
var total_num_list = [];

var portion_height = 170;
var portion_width = 280;
var pie_width = 160;
var pie_height = 160;
var outerRadius = pie_width/2;
var innerRadius = 40;

var total_width = 270;
var total_height = 170;

var formatCom = d3.format(",");

var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

var pie = d3.layout
            .pie()
            .sort(null)
            .value(function(d) {return d.value;});

var pie_svg = d3.select(".map_div_portion")		//대륙간 비교 파이차
                .append("svg")
                .attr("width",portion_width)
                .attr("height",portion_height);

var total_svg = d3.select(".map_div_total")   //대륙간 비교 파이차
                .append("svg")
                .attr("width",total_width)
                .attr("height",total_height);

var total_g = total_svg.append("g")
             .attr("transform","translate(0,0)");

d3.csv("data/refugees_sum_year_2011_2014.csv", function(error, data){

      data.forEach(function(d){
        d.value = +d.value;
        d.year = +d.year;
      });

      //** data filtering **//
      data2 = data;
      popData2 = data2.filter(function(d) {return d.year == start_year});
      
      sum = popData2[0].value + popData2[1].value;//각 연도 대륙별 합계
      for(var i=0; i<4; i++){
        total_num_list[i] = data2[i].value + data2[i+4].value;//두개 대륙 합계
      }



      //** Drawing Arc **//
      var arc_g = pie_svg
                .append("g")
                .attr("transform", "translate(" + (outerRadius + 15) +","+ (outerRadius + 10) +")");

      title_text = pie_svg.append("g")
                        .attr("transform","translate(10,10)")
                        .append("text")
                        .attr("class","portion_title");

      title_text.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("Portions");

      title_text.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("between");

      title_text.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("Continents");

      pie_arc = arc_g.append("g")
      					.attr("class","pie_arc")
                .attr("transform", "translate(90,0)");

      pie_text = arc_g.append("g")
                .attr("transform", "translate(90,0)")
      					.attr("class","pie_text");

      var pie_legend = arc_g.append("g")
      					.attr("class","pie_legend")
      					.attr("transform","translate(-90,45)")

      pie_arc.selectAll("path")
      		 .data(pie(popData2))
             .enter()
             .append("path")
              .attr("d",arc)
              .each(function(d) {this._current = d;})
              .style("fill", function(d) { if(d.data.div =="sum_mid"){
                     return c3;
              }else{
                     return c2; 
              }});

      pie_text.selectAll("text")
      		 .data(pie(popData2))
             .enter()
             .append("text")
             .attr("d",arc)
             .attr("transform", function(d){
                     return "translate(" + arc.centroid(d) + ")";
             })
             .attr("text-anchor", "middle")
             .attr("class","pie_text")
             .text(function(d){
                    return d3.format("%")(d.value/sum);
            });

      
      pie_legend.append("rect")
     		 .attr("x",0)
      		 .attr("y",20)
      		 .attr("width",13)
      		 .attr("height",13)
      		 .attr("fill",c3);

      pie_legend.append("rect")
      		 .attr("x",0)
      		 .attr("y",0)
      		 .attr("width",13)
      		 .attr("height",13)
      		 .attr("fill",c2);

      pie_legend.append("text")
      		 .attr("x",20)
      		 .attr("y",10)
      		 .text("EUROPE")
      		 .attr("class","legend_text");

      pie_legend.append("text")
      		 .attr("x",20)
      		 .attr("y",30)
      		 .text("MIDDLE EAST")
      		 .attr("class","legend_text");



      //** Total Number **//

      total_text = total_g.append("g")
                        .attr("transform","translate(10,10)")
                        .append("text")
                        .attr("class","portion_title");

      total_text.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("Total Number of");

      total_text.append("tspan")
                .attr("dy","1.1em")
                .attr("x",0)
                .text("Syrian Refugees");

      total_num = total_g.append("g")
                         .attr("transform","translate(" + (total_width - 30) + ","+ total_height/2 +")")
                         .attr("class","total_num")
                         .append("text")
                         .attr("text-anchor","end")
                         .attr("x",0)
                         .attr("y",30)
                         .text(formatCom(total_num_list[0]));

 });

function total_numTransition(index){
    total_num.transition()
             .duration(300)
             .tween("text",function(){
                 currentNum = this.textContent;
                 console.log("currentNum"+ currentNum);
                 currentNum = currentNum.replace(/,/g,"");
                 console.log("remove comma"+ currentNum);
                 currentNum = +currentNum;
                 //console.log(currentNum);
                 var j = d3.interpolateRound(currentNum, total_num_list[index]);

                return function(t){
                    d3.select(this).text(formatCom(j(t)));
                }
             });
}


function pieTransition(year){

       popData2 = data2.filter(function(d) {return d.year == year});
       sum = popData2[0].value + popData2[1].value;
       


          //arc_g = arc_g.data(pie(popData2));

          pie_arc.selectAll("path").data(pie(popData2)).transition().duration(1000).ease("exp").attr("d",arc).attrTween("d",arcTween);


          
         // arc_g.select("path").attr("d",arc).transition().delay(250).duration(1000).attrTween("d",arcTween);

          pie_text.selectAll("text").transition()
                        .duration(100)
                        .style("opacity",0);


          pie_text.selectAll("text").data(pie(popData2)).transition()
                      .delay(1000)
                      .attr("transform", function(d){
                              return "translate(" + arc.centroid(d) + ")";
                      })
                      .attr("text-anchor", "middle")
                      .text(function(d){
                              return d3.format("%")(d.value/sum);
                      })
                      .transition()
                      .duration(100)
                      .style("opacity",1);
}



function arcTween(a) {
      var delay=250;
      var duration=200;

      var i = d3.interpolate(this._current, a);
      
      this._current = i(0);

        return function(t) {
          return arc(i(t));
      };
}