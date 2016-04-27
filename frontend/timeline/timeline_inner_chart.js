timeline_inner_chart = function () {
    // Load the Visualization API and the corechart package.
    google.charts.load('current', { 'packages': ['corechart'] });

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {
        // Create the data table.
        var data1 = new google.visualization.DataTable();
        data1.addColumn('string', 'Time');
        data1.addColumn('number', 'Shelling');
        data1.addColumn('number', 'Air Strike');
        data1.addColumn('number', 'Direct Attack');
        data1.addColumn('number', 'Battle');
        data1.addColumn('number', 'Chemical');
        data1.addColumn('number', 'Barrel Bomb');

        var data2 = new google.visualization.DataTable();
        data2.addColumn('string', 'Time');
        data2.addColumn('number', 'Shelling');
        data2.addColumn('number', 'Air Strike');
        data2.addColumn('number', 'Direct Attack');
        data2.addColumn('number', 'Battle');
        data2.addColumn('number', 'Chemical');
        data2.addColumn('number', 'Barrel Bomb');

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
                }
            }
        };

        var chart1 = new google.visualization.LineChart(document.getElementById('timeline_inner_chart1_div'));
        var chart2 = new google.visualization.LineChart(document.getElementById('timeline_inner_chart2_div'));

        var addRow = function (jsonText, length, data, startYear, startMonth, endYear, endMonth) {
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
                    data.addRow([jsonText.year[idx] + "-" + jsonText.month[idx],
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

            addRow(jsonText, length, data1, 2012, 7, 2013, 4);
            addRow(jsonText, length, data2, 2014, 12, 2015, 12);

            chart1.draw(data1, options);
            chart2.draw(data2, options);
        });
    }
};

module.exports = timeline_inner_chart;