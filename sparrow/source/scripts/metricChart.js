Sparrow.metricChart = function (container, chartId, config) {
    this.container = container;
    this.chartId = chartId;
    this.config = config;
};
Sparrow.metricChart.prototype.init = function (echarts) {
    var chartContainer=document.getElementById(this.chartId);
    if(chartContainer==null) {
        chartContainer= document.createElement("div");
        chartContainer.id = this.chartId;
        chartContainer.style.height = this.config.height;
        this.container.appendChild(chartContainer);
    }
    var chart = echarts.init(chartContainer);
    var option = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: []
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: []
    };
    option.title.text = this.config.title;
    option.legend.data = this.config.legend;
    option.series = this.config.data;
    option.xAxis.data=this.config.x;
    chart.setOption(option, true);
    Sparrow.metricChart.containers
    Sparrow.metricChart.charts[this.chartId] = chart;
    Sparrow.metricChart.options[this.chartId] = option;
};
Sparrow.metricChart.charts = {};
Sparrow.metricChart.options = {};
Sparrow.metricChart.changeType = function (chartId, type) {
    var chart = Sparrow.metricChart.charts[chartId];
    var option = Sparrow.metricChart.options[chartId];
    for (var i = 0; i < option.series.length; i++) {
        option.series[i].type = type;
    }
    chart.setOption(option, true);
};