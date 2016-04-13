function mapTransition(year){
	        
	          popData1 = data1.filter(function(d) {return d.year == year}); //새 데이터 갱신

	

	//---popData에 매칭되는 값을 map_json에 입력하

	        for(var i=0; i<popData1.length; i++){
				
				var dataCountry = popData1[i].destination;
				var refugeesValue = popData1[i].refugees_value;
			
				for(var j =0; j<map_json.features.length; j++){
					
					var jsonCountry = map_json.features[j].properties.name;
					
					if(dataCountry == jsonCountry){
						map_json.features[j].properties.refugeesValue = refugeesValue;
						break;
					}
				}

			}

			focus_map_number.data(map_json.features)
	    			  .transition()
	    			  .delay(function(d,i){
	    				return i*5;
	    			   })
	    			  .duration(function(d,i){
	 
	    				currentNum = +this.textContent;
	    			  	duration[i] = Math.abs(currentNum - d.properties.refugeesValue)/1000;
	    			  	if(duration[i]<200){
	    			  		duration[i] = 200;
	    			  	}
	    			  	return duration[i];
	    				
	    			})
	    			  .ease("exp")
	    			  .tween("text", function(d){
		    			  	for(var i=0;i<countryList2.length;i++){
		    			  		if(d.properties.name == countryList2[i]){
				    			  	var currentNum = +this.textContent;
				    			  	var j = d3.interpolateRound(currentNum, d.properties.refugeesValue);

				    			    return function(t){
				    			    	this.textContent = j(t);
				    			    };
				    			}
	    					}
	    			  });


	    	focus_map_path.data(map_json.features)
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
								console.log(d.properties.name);
								return color_list[0];
							}else if(value){
								return color(value)
							}
							else{
								return color_list[0];
							}
						
						});



	    	focus_map_label.data(map_json.features)
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