!function(t){function e(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return t[o].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}({0:function(t,e,n){t.exports=n(88)},52:function(t,e){t.exports=function(){var t=[];return t.toString=function(){for(var t=[],e=0;e<this.length;e++){var n=this[e];n[2]?t.push("@media "+n[2]+"{"+n[1]+"}"):t.push(n[1])}return t.join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var o={},i=0;i<this.length;i++){var r=this[i][0];"number"==typeof r&&(o[r]=!0)}for(i=0;i<e.length;i++){var a=e[i];"number"==typeof a[0]&&o[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),t.push(a))}},t}},87:function(t,e,n){function o(t,e){for(var n=0;n<t.length;n++){var o=t[n],i=u[o.id];if(i){i.refs++;for(var r=0;r<i.parts.length;r++)i.parts[r](o.parts[r]);for(;r<o.parts.length;r++)i.parts.push(l(o.parts[r],e))}else{for(var a=[],r=0;r<o.parts.length;r++)a.push(l(o.parts[r],e));u[o.id]={id:o.id,refs:1,parts:a}}}}function i(t){for(var e=[],n={},o=0;o<t.length;o++){var i=t[o],r=i[0],a=i[1],s=i[2],c=i[3],l={css:a,media:s,sourceMap:c};n[r]?n[r].parts.push(l):e.push(n[r]={id:r,parts:[l]})}return e}function r(t,e){var n=g(),o=w[w.length-1];if("top"===t.insertAt)o?o.nextSibling?n.insertBefore(e,o.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),w.push(e);else{if("bottom"!==t.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(e)}}function a(t){t.parentNode.removeChild(t);var e=w.indexOf(t);e>=0&&w.splice(e,1)}function s(t){var e=document.createElement("style");return e.type="text/css",r(t,e),e}function c(t){var e=document.createElement("link");return e.rel="stylesheet",r(t,e),e}function l(t,e){var n,o,i;if(e.singleton){var r=m++;n=v||(v=s(e)),o=f.bind(null,n,r,!1),i=f.bind(null,n,r,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=c(e),o=d.bind(null,n),i=function(){a(n),n.href&&URL.revokeObjectURL(n.href)}):(n=s(e),o=p.bind(null,n),i=function(){a(n)});return o(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;o(t=e)}else i()}}function f(t,e,n,o){var i=n?"":o.css;if(t.styleSheet)t.styleSheet.cssText=b(e,i);else{var r=document.createTextNode(i),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(r,a[e]):t.appendChild(r)}}function p(t,e){var n=e.css,o=e.media;if(o&&t.setAttribute("media",o),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}function d(t,e){var n=e.css,o=e.sourceMap;o&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var i=new Blob([n],{type:"text/css"}),r=t.href;t.href=URL.createObjectURL(i),r&&URL.revokeObjectURL(r)}var u={},h=function(t){var e;return function(){return"undefined"==typeof e&&(e=t.apply(this,arguments)),e}},_=h(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),g=h(function(){return document.head||document.getElementsByTagName("head")[0]}),v=null,m=0,w=[];t.exports=function(t,e){e=e||{},"undefined"==typeof e.singleton&&(e.singleton=_()),"undefined"==typeof e.insertAt&&(e.insertAt="bottom");var n=i(t);return o(n,e),function(t){for(var r=[],a=0;a<n.length;a++){var s=n[a],c=u[s.id];c.refs--,r.push(c)}if(t){var l=i(t);o(l,e)}for(var a=0;a<r.length;a++){var c=r[a];if(0===c.refs){for(var f=0;f<c.parts.length;f++)c.parts[f]();delete u[c.id]}}}};var b=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}()},88:function(t,e,n){var o=n(91);o(),n(93),n(169),n(90),n(170)},90:function(t,e){function n(){screen.width<1200||screen.height<700?$(".sorry").css({visibility:"visible"}):$(".sorry").css({visibility:"hidden"})}$(window).resize(function(){n()}),n()},91:function(t,e){timeline_inner_chart=function(){function t(){var t=new google.visualization.DataTable;return t.addColumn("date","Time"),t.addColumn("number","Shelling"),t.addColumn("number","Air Strike"),t.addColumn("number","Direct Attack"),t.addColumn("number","Battle"),t.addColumn("number","Chemical"),t.addColumn("number","Barrel Bomb"),t}function e(){function e(t,e,n,o,i,r,a){for(var s=-1,c=-1,l=0;e>l;l++)if(t.year[l]>=o&&t.month[l]>=i&&0>s&&(s=l),t.year[l]>=r&&t.month[l]>=a&&0>c&&(c=l),s>0&&0>c)n.addRow([new Date(t.year[l],t.month[l]-1),t.shelling[l],t.air_strike[l],t.direct_attack[l],t.battle[l],t.chemical[l],t.barrel_bomb[l]]);else if(c>0)break}var n=t(),o=t(),i=t(),r=t(),a=t(),s=t(),c=t();t(),$body=$("body"),background_color=$body.css("background-color"),font_color=$body.css("color"),shelling_color="#C23355",air_strike_color="#22abc3",direct_attack_color="#ffcc00",battle_color="#338866",chemical_color="#00C853",barrel_bomb_color="#cc3300";var l={width:420,height:300,backgroundColor:background_color,legend:"none",series:{0:{color:shelling_color},1:{color:air_strike_color},2:{color:direct_attack_color},3:{color:battle_color},4:{color:chemical_color},5:{color:barrel_bomb_color}},vAxis:{textStyle:{color:font_color}},hAxis:{textStyle:{color:font_color},gridlines:{count:-1,color:background_color}}},f=new google.visualization.LineChart(document.getElementById("timeline_inner_chart1_div")),p=new google.visualization.LineChart(document.getElementById("timeline_inner_chart2_div")),d=new google.visualization.LineChart(document.getElementById("timeline_inner_chart3_div")),u=new google.visualization.LineChart(document.getElementById("timeline_inner_chart4_div")),h=new google.visualization.LineChart(document.getElementById("timeline_inner_chart5_div")),_=new google.visualization.LineChart(document.getElementById("timeline_inner_chart6_div")),g=new google.visualization.LineChart(document.getElementById("timeline_inner_chart7_div"));$.getJSON("./data/timeline/war_factor.json",function(t){var v=0;$.each(t.year,function(t,e){v++}),e(t,v,n,2011,3,2011,6),e(t,v,o,2011,5,2012,7),e(t,v,i,2012,7,2013,4),e(t,v,r,2013,4,2014,1),e(t,v,a,2014,1,2014,12),e(t,v,s,2014,12,2015,12),e(t,v,c,2016,1,2016,4),f.draw(n,l),p.draw(o,l),d.draw(i,l),u.draw(r,l),h.draw(a,l),_.draw(s,l),g.draw(c,l)})}google.charts.load("current",{packages:["corechart"]}),google.charts.setOnLoadCallback(e)},t.exports=timeline_inner_chart},93:function(t,e){function n(){$(".pre_war_article").css({"padding-top":window.innerHeight/3*2,"padding-bottom":window.innerHeight/3*1}),$(".pre_war_article").eq(0).css({"padding-top":window.innerHeight/4}),$(".pre_war_article").eq(3).css({"padding-bottom":0})}var o={unfixed:0,fixed:1};$(document).ready(function(){function t(){for(var t=0;t<f.length;t++)p[t]=parseInt(f.eq(t).offset().top)}function e(){var t=parseInt(d.offset().left),e=parseInt(d.css("margin-top"));$("#pre_war_fixed_chart").css({position:"fixed",top:e,left:t});var n=document.getElementById("pre_war_fixed_chart");n.style.left=t+"px",$("#pre_war_chapter_article_div").css({"padding-left":l})}function i(){$("#pre_war_fixed_chart").css({position:"static"}),$("#pre_war_chapter_article_div").css({"padding-left":0})}function r(t){$("#pre_war_fixed_chart").css({position:"absolute",top:t}),$("#pre_war_chapter_article_div").css({"padding-left":l})}function a(t){var n=parseInt(u.offset().top)-parseInt(h.height()),a=parseInt(d.css("margin-top")),s=parseInt(d.offset().top)-a;t>s&&n>t&&_===o.unfixed?(e(),_=o.fixed):_===o.fixed&&(t>n?(r(n),_=o.unfixed):s>t&&(i(),_=o.unfixed));for(var c=p.length-1;c>=1;c--)if(p[c]<t){if(g===c)return;intro_popYear(chapter_list[c]),g=c;break}if(p[1]>t){if(0===g)return;return intro_popYear(chapter_list[0]),void(g=0)}}var s=$(window);n();var c=$("#pre_war_chapter_article_div");c.css({"padding-bottom":window.innerHeight/3*2});var l=$(".chapter_chart_div_s86").width(),f=$(".pre_war_article"),p=[];t();var d=$("#pre_war_refugee_map"),u=$("#pre_war_section_bottom"),h=$("#pre_war_fixed_chart"),_=o.unfixed,g=0;s.on("scroll",function(){var t=s.scrollTop();a(t)}),s.resize(function(){t();var n=s.scrollTop(),o=parseInt(u.offset().top)-parseInt(h.height()),a=parseInt(d.offset().top);n>a&&o>n?e():n>o?r(o):i()})}),$(document).ready(function(){function t(){var t=parseInt(s.offset().top),e=parseInt(s.css("margin-left")),n=parseInt(s.css("margin-top")),o=parseInt(l.css("width")),i=parseInt(l.css("height"));$(".map_div_linegraph").css({left:e+o,top:t+n+190}),$(".map_article_col").css({left:e+o,top:t+n+i+190}),$(".map_article").css({"padding-top":4*window.innerHeight/5,"padding-bottom":window.innerHeight/5,"padding-left":o}),$(".map_article").eq(3).css({"padding-bottom":4*window.innerHeight/5})}function e(){var t=parseInt(s.offset().left),e=parseInt(s.css("margin-top"));l.width(),c.css({position:"fixed",top:e}),l.css({position:"fixed",top:e,left:t+8});for(var n=0;n<f.length;n++)p[n]=parseInt(f.eq(n).offset().top)}function n(){c.css({position:"absolute",top:s.offset().top}),l.css({position:"absolute",top:s.offset().top})}function i(t){c.css({position:"absolute",top:t}),l.css({position:"absolute",top:t})}function r(t){var r=parseInt(h.offset().top)-parseInt(l.height()),a=parseInt(s.offset().top);t>a&&r>t&&d===o.unfixed?(e(),d=o.fix):d===o.fix&&(t>r?(i(r),d=o.unfixed):a>t&&(n(),d=o.unfixed)),d===o.fix&&(u=t<p[1]?0:t<p[2]?1:t<p[3]?2:3,mapTransition(2011+u),pieTransition(2011+u),total_numTransition(2011+u),lineTransition(2011+u))}var a=$(window),s=$("#refugee_map"),c=$("#fixed_graph"),l=$("#fixed_chart"),f=($(".map_article_col"),$(".map_article")),p=[];t();var d=o.unfixed,u=0,h=$("#rms_section_bottom");a.resize(function(){t();var o=a.scrollTop(),r=parseInt(h.offset().top)-parseInt(l.height()),c=parseInt(s.offset().top);o>c&&r>o?e():o>r?i(r):n(),resize_refugeeMap()}),a.on("scroll",function(){var t=a.scrollTop();r(t)})}),$(document).ready(function(){function t(){var t=(parseInt(s.offset().top),parseInt(s.css("margin-left")),parseInt(s.css("margin-top")),parseInt(c.css("width")));parseInt(c.css("height")),$(".gdp_article").css({"padding-top":4*window.innerHeight/5,"padding-bottom":window.innerHeight/5,"padding-left":t}),$(".gdp_article").eq(3).css({"padding-bottom":4*window.innerHeight/5}),$("#gdp_last_article").css({"margin-top":window.innerHeight/2})}function e(){var t=parseInt(s.offset().left),e=parseInt(s.css("margin-top"));parseInt(c.css("width")),c.css({position:"fixed",top:e,left:t});for(var n=0;n<l.length;n++)f[n]=parseInt(l.eq(n).offset().top)}function n(){c.css({position:"absolute",top:s.offset().top})}function i(t){c.css({position:"absolute",top:t})}function r(t){var r=parseInt(u.offset().top)-parseInt(c.height()),a=parseInt(s.offset().top);t>a&&r>t&&p===o.unfixed?(e(),p=o.fix):p===o.fix&&(t>r?(i(r),p=o.unfixed):a>t&&(n(),p=o.unfixed)),p===o.fix&&(d=t<f[1]?0:t<f[2]?1:t<f[3]?2:3,scatterTransition(2011+d))}var a=$(window),s=$("#gdp_compare"),c=$("#scatter_chart_div"),l=($(".gdp_article_col"),$(".gdp_article")),f=[];t();var p=o.unfixed,d=0,u=$("#gdp_section_bottom");a.resize(function(){t();var o=a.scrollTop(),r=parseInt(u.offset().top)-parseInt(c.height()),l=parseInt(s.offset().top);o>l&&r>o?e():o>r?i(r):n()}),a.on("scroll",function(){var t=a.scrollTop();r(t)})}),$(document).ready(function(){function t(){$(".timeline_div_article_content").css({"padding-top":window.innerHeight/3*2,"padding-bottom":window.innerHeight/3*1}),$(".timeline_div_article_content").eq(0).css({"padding-top":window.innerHeight/4})}function e(){var t=parseInt(c.offset().left),e=parseInt(c.css("margin-top")),n=parseInt(s.css("width"));s.css({position:"fixed",top:e,left:t}),l.css({"padding-left":n,width:"auto"})}function n(){s.css("position","static"),l.css({"padding-left":0,width:420})}function i(){for(var t=0;t<f.length&&(p[t]=parseInt(f.eq(t).offset().top),0!==t||d!==p[t]);t++);d=p[0]}var r=$(window);t();var a=$("#c4"),s=$("#timeline_div"),c=$("#timeline"),l=$("#timeline_article");r.resize(function(){var t=r.scrollTop(),o=parseInt(a.offset().top)-parseInt(s.height()),i=parseInt(c.offset().top);if(timeline_resize(),t>i&&o>t)e();else if(t>o){var l=parseInt(c.css("margin-left"));s.css({position:"absolute",top:o,left:l})}else n()});var f=$(".timeline_div_article_content"),p=[],d=0;i();var u=o.unfixed,h=0;r.on("scroll",function(){var t=r.scrollTop();i();var l=parseInt(a.offset().top)-parseInt(s.height()),f=parseInt(c.offset().top)-parseInt(c.css("margin-top"));t>f&&l>t&&u===o.unfixed?(e(),u=o.fix):u===o.fix&&(t>l?(s.css({position:"absolute",top:l+parseInt(c.css("margin-top")),left:parseInt(c.offset().left)}),u=o.unfixed):f>t&&(n(),u=o.unfixed));for(var d=p.length-1;d>=1;d--)if(p[d]<t){if(h===d+2)return;chapter_move(d+2),h=d+2;break}if(p[1]>t){if(2===h)return;return chapter_move(2),void(h=2)}})})},94:function(t,e,n){e=t.exports=n(52)(),e.push([t.id,".gdp_div_textCol_unclick{opacity:.5}.gdp_div_textCol_unclick:hover{opacity:.8}.gdp_div_textCol_click{opacity:1}",""])},95:function(t,e,n){e=t.exports=n(52)(),e.push([t.id,"#non_desktop{width:100%;height:100%;position:fixed;z-index:500000;top:0;left:0;background:#111;visibility:hidden;font-family:Lato,sans-serif}#non_desktop h1{font-size:80px}#non_desktop h2{font-size:60px;color:#c33}",""])},169:function(t,e,n){var o=n(94);"string"==typeof o&&(o=[[t.id,o,""]]),n(87)(o,{}),o.locals&&(t.exports=o.locals)},170:function(t,e,n){var o=n(95);"string"==typeof o&&(o=[[t.id,o,""]]),n(87)(o,{}),o.locals&&(t.exports=o.locals)}});