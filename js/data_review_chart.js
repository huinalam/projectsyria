var data_review_width = 250;
   var data_review_height = 200;
   var margin = 0;
   var timeline_data_review_svg = d3.select("#data_review_c2")
                                     .append("svg")
                                     .attr("width",250)
                                     .attr("height",220);

    var data_review_g = timeline_data_review_svg.append("g")
                                                .attr("transform","translate("+ margin + "," + margin + ")");


    for(var i=0; i<6; i++){
        for(var j=0; j<6; j++){
            data_review_g.append("rect")
                         .attr("x",i*37)
                         .attr("y",j*32)
                         .attr("width",35)
                         .attr("height",30)
                         .attr("fill","#cc2233");
        }

    }