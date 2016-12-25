// 챕터
//2011-01-01 ~ 2011-03-01
//2011-03-01 ~ 2011-06-01
//2011-05-01 ~ 2012-07-01
//2012-07-01 ~ 2013-04-01
//2013-04-01 ~ 2014-01-01
//2014-01-01 ~ 2014-12-01
//2014-12-01 ~ 2015-12-01
//2016-01-01 ~ 2016-04-01

//2011-01-01 ~ 2016-04-01

timeline_inner_chart = function () {
    // Load the Visualization API and the corechart package.
    google.charts.load('current', { 'packages': ['corechart'] });

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    function getData() {
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Time');
        data.addColumn('number', 'Shelling');
        data.addColumn('number', 'Air Strike');
        data.addColumn('number', 'Direct Attack');
        data.addColumn('number', 'Battle');
        data.addColumn('number', 'Chemical');
        data.addColumn('number', 'Barrel Bomb');
        return data;
    }

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {
        // Create the data table.
        var data1 = getData();
        var data2 = getData();
        var data3 = getData();
        var data4 = getData();
        var data5 = getData();
        var data6 = getData();
        var data7 = getData();
        var data8 = getData();

        // 배경 css를 가져온다.
        $body = $("body");
        background_color = $body.css("background-color");
        font_color = $body.css("color");

        // color set
        shelling_color = "#C23355";
        air_strike_color = "#22abc3";
        direct_attack_color = "#ffcc00";
        battle_color = "#338866";
        chemical_color = "#00C853";
        barrel_bomb_color = "#cc3300";
        
        //https://developers.google.com/chart/interactive/docs/gallery/linechart#methods
        // Set chart options
        var options = {
            'width': 420,
            'height': 300,
            'backgroundColor': background_color,
            legend: 'none',
            //'legend': {
            //    position: 'right',
            //    textStyle: {
            //        color: font_color
            //    }
            //},
            series: {
                0: { color: shelling_color },
                1: { color: air_strike_color },
                2: { color: direct_attack_color },
                3: { color: battle_color },
                4: { color: chemical_color },
                5: { color: barrel_bomb_color }
            },
            vAxis: {
                textStyle: {
                    color: font_color
                }
            },
            hAxis: {
                textStyle: {
                    color: font_color
                },
                gridlines: {
                    count: -1,
                    color: background_color
                }
            }
        };

        var chart1 = new google.visualization.LineChart(document.getElementById('timeline_inner_chart1_div'));
        var chart2 = new google.visualization.LineChart(document.getElementById('timeline_inner_chart2_div'));
        var chart3 = new google.visualization.LineChart(document.getElementById('timeline_inner_chart3_div'));
        var chart4= new google.visualization.LineChart(document.getElementById('timeline_inner_chart4_div'));
        var chart5 = new google.visualization.LineChart(document.getElementById('timeline_inner_chart5_div'));
        var chart6 = new google.visualization.LineChart(document.getElementById('timeline_inner_chart6_div'));
        var chart7 = new google.visualization.LineChart(document.getElementById('timeline_inner_chart7_div'));
        //var chart8 = new google.visualization.LineChart(document.getElementById('timeline_inner_chart8_div'));

        function addRow(jsonText, length, data, startYear, startMonth, endYear, endMonth) {
            var start_idx = -1;
            var end_idx = -1;
            for (var idx = 0; idx < length; idx++) {
                if (jsonText.year[idx] >= startYear &&
                    jsonText.month[idx] >= startMonth &&
                    start_idx < 0) {
                    start_idx = idx;
                }
                if (jsonText.year[idx] >= endYear &&
                    jsonText.month[idx] >= endMonth &&
                    end_idx < 0) {
                    end_idx = idx;
                }
                if (start_idx > 0 && end_idx < 0) {
                    // 시작
                    data.addRow([
                        new Date(jsonText.year[idx], jsonText.month[idx]-1),
                        //jsonText.year[idx] + "-" + jsonText.month[idx],
                        jsonText.shelling[idx],
                        jsonText.air_strike[idx],
                        jsonText.direct_attack[idx],
                        jsonText.battle[idx],
                        jsonText.chemical[idx],
                        jsonText.barrel_bomb[idx]]);
                } else if (end_idx > 0) {
                    // 종료
                    break;
                }
            }
        };

        $.getJSON('./data/timeline/war_factor.json', function (jsonText) {
            var length = 0;
            $.each(jsonText.year, function (key, val) {
                    length++;
                }
            );

            //2011-03-01 ~ 2011-06-01
            addRow(jsonText, length, data1, 2011, 3, 2011, 6);
            //2011-05-01 ~ 2012-07-01
            addRow(jsonText, length, data2, 2011, 5, 2012, 7);
            //2012-07-01 ~ 2013-04-01
            addRow(jsonText, length, data3, 2012, 7, 2013, 4);
            //2013-04-01 ~ 2014-01-01
            addRow(jsonText, length, data4, 2013, 4, 2014, 1);
            //2014-01-01 ~ 2014-12-01
            addRow(jsonText, length, data5, 2014, 1, 2014, 12);
            //2014-12-01 ~ 2015-12-01
            addRow(jsonText, length, data6, 2014, 12, 2015, 12);
            //2016-01-01 ~ 2016-04-01
            addRow(jsonText, length, data7, 2016, 1, 2016, 4);

            chart1.draw(data1, options);
            chart2.draw(data2, options);
            chart3.draw(data3, options);
            chart4.draw(data4, options);
            chart5.draw(data5, options);
            chart6.draw(data6, options);
            chart7.draw(data7, options);
            //chart8.draw(data8, options);
        });
    }
};

module.exports = timeline_inner_chart;