// tsd install react --save
// run watch mode "tsc -w"
/// <reference path="./typings/react/react.d.ts" />
import * as React from "react";
import * as ReactDOM  from "react-dom";

interface SizeCutProps {
    name: string;
}


class SizeCut extends React.Component<SizeCutProps, any> {
    handleReisze() {
        console.log("SizeCut screen :" + screen.width + " // " + screen.height);
        
    }
    componentDidMount() {
        window.addEventListener('resize', this.handleReisze);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleReisze);
    }
    render() {
        var divStyle = {
            
        };
        
        var description1 = "'PROJECT SYRIA' deosn't support mobile experience yet.";
        var description2 = "For the best experience, it is recommended you visit 'PROJECT SYRIA' on your PC or tablet.";
        return 
        <div class="sorry">
            <img class="sorry_img" src="img/sorry.svg">
            <span text-align="center">SORRY</span>
            <br></br>
            {description1}
            <br></br>
            {description2}
	    </div>
    }
    toString() {
        return "hello tsx~! ^^";
    }
}

ReactDOM.render(<SizeCut
    name="park junho"/>,
    document.getElementById('non_desktop'));



//function size_cut_off() {
//    //console.log("size changed");
//    //console.log("screen :" + screen.width + " // " + screen.height);
//    if (screen.width < 1200 || screen.height < 700) {
//        $("#non_desktop").css({
//            "visibility": "visible"
//        });
//    } else {
//        $("#non_desktop").css({
//            "visibility": "hidden"
//        });
//    }
//}

//$(window).resize(function () {
//    size_cut_off();
//});
//size_cut_off()