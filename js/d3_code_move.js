(function() {
    'use strict';

    var data = d3.range(0, 40); // [0, 1, 2, 3, 4 etc]
    console.log('number of items in array: ' + data.length);

    // https://github.com/wbkd/d3-extended
    d3.selection.prototype.moveToFront = function() {  
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };
    d3.selection.prototype.moveToBack = function() {  
        return this.each(function() { 
            var firstChild = this.parentNode.firstChild; 
            if (firstChild) { 
                this.parentNode.insertBefore(this, firstChild); 
            } 
        });
    };

    var colour = d3.scale.category10();

    // vars
    var rectWidth = 100,
        rectHeight = 300;
    
    var svg = d3.select('#container').append('svg');
    // set width & height in css

    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
            .attr({
                width: rectWidth,
                height: rectHeight, 
                x: function(d,i) { 
                    // overlap the rects intentionally
                    return (rectWidth-40)*i;
                },
                y: 10
            })
            .style({
                fill: function(d, i) {
                    return colour(i);
                },
                stroke: 'none'
            })
        .on('mouseover', function(d) {
            d3.select(this).moveToFront();
        })
        .on('click', function(d) {
            d3.select(this).moveToBack();
        });    

})();