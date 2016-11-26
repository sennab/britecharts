'use strict';

var _ = require('underscore'),
    d3 = require('d3'),

    colors = require('./../src/charts/helpers/colors'),

    stackedAreaChart = require('./../src/charts/stacked-area'),
    tooltip = require('./../src/charts/tooltip'),
    stackedDataBuilder = require('./../test/fixtures/stackedAreaDataBuilder'),
    colorSelectorHelper = require('./helpers/colorSelector');

function createStackedAreaChartWithTooltip(optionalColorSchema) {
    var stackedArea = stackedAreaChart(),
        chartTooltip = tooltip(),
        testDataSet = new stackedDataBuilder.StackedAreaDataBuilder(),
        containerWidth = d3.select('.js-stacked-area-chart-tooltip-container').node().getBoundingClientRect().width,
        container = d3.select('.js-stacked-area-chart-tooltip-container'),
        tooltipContainer,
        dataset;

    // dataset = testDataSet.withReportData().build();
    // dataset = testDataSet.with3Sources().build();
    // dataset = testDataSet.with6Sources().build();
    dataset = testDataSet.withLargeData().build();

    // StackedAreChart Setup and start
    stackedArea
        .tooltipThreshold(400)
        .width(containerWidth)
        .on('customMouseOver', function() {
            chartTooltip.show();
        })
        .on('customMouseMove', function(dataPoint, topicColorMap, dataPointXPosition) {
            chartTooltip.update(dataPoint, topicColorMap, dataPointXPosition);
        })
        .on('customMouseOut', function() {
            chartTooltip.hide();
        });

    if (optionalColorSchema) {
        stackedArea.colorSchema(optionalColorSchema);
    }

    container.datum(dataset.data).call(stackedArea);

    // Tooltip Setup and start
    chartTooltip
        .title('Testing tooltip');

    // Note that if the viewport width is less than the tooltipThreshold value,
    // this container won't exist, and the tooltip won't show up
    tooltipContainer = d3.select('.metadata-group .vertical-marker-container');
    tooltipContainer.datum([]).call(chartTooltip);

    d3.select('#button').on('click',
        function(){
            stackedArea.exportChart();
    });
}


if (d3.select('.js-stacked-area-chart-tooltip-container').node()){
    // Chart creation
    createStackedAreaChartWithTooltip();

    // For getting a responsive behavior on our chart,
    // we'll need to listen to the window resize event
    d3.select(window)
        .on('resize', _.debounce(function(){
            d3.selectAll('.stacked-area').remove();
            createStackedAreaChartWithTooltip();
        }, 200));

    // Color schema selector
    colorSelectorHelper.createColorSelector('.js-color-selector-container', '.stacked-area', createStackedAreaChartWithTooltip);
}
