import * as d3 from 'd3';

export default class WorldGraph {
  constructor(containerId) {
    this.dataSrcCsv = 'static/data/sustainable-development-goal-6-1.world.020.csv';

    this.containerId = containerId;
    this.container = document.querySelector(this.containerId);

    this.circleRadius = 4;
    this.lineWidth = '1.5';
    this.minDiagramWidth = 500;

    this.reorderedData = null;

    this.initListeners();
  }

  initListeners() {
    window.addEventListener('resize', this.resizeWindow.bind(this));
  }

  resizeWindow() {
    if (this.container.offsetWidth > this.minDiagramWidth) {
      this.redrawDiagram();
    }
  }

  redrawDiagram() {
    d3.select(this.containerId).selectAll('*').remove();
    this.printDiagram();
  }

  reformatData(data) {
    const locations = ["Allarea", "Rural", "Urban"]
    const reorderedData = locations.map((location) => {
      // location = one value of locations

      // filter data array to remove other locations
      let filteredArray = data.filter((currentValue) => {
        if(currentValue.Location === location.toUpperCase()) {
          return currentValue;
        }
      })

      return {
        name: location,
        values: filteredArray.map((d) => {
          return {
            year: d.Year,
            value: d.Value,
          };
        })
      };
    });

    this.reorderedData = reorderedData;
  }

  printDiagram() {
    const margin = {
      top: 10, right: 70, bottom: 30, left: 30,
    };

    let chartWidth = this.container.offsetWidth;
    let chartHeight = 300;

    if (chartWidth < this.minDiagramWidth) {
      chartWidth = this.minDiagramWidth;
      chartHeight = 250;
    } 

    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    // append the svg object
    const svg = d3.select(this.containerId)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        `translate(${margin.left},${margin.top})`);

    // Parse the Data
    d3.dsv(';', this.dataSrcCsv, d3.autoType).then((data) => {
      /**
       * Reformat the data
       */
      this.reformatData(data);

      /**
       * Axis
       */
      // Add X axis
      const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.Year))
        .padding(1); // , rotate(90deg)
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end');

      // Y axis
      const y = d3.scaleLinear()
        //.domain([d3.min(data, (d) => +d.Value), d3.max(data, (d) => +d.Value) ])
        .domain([90, 35])
        .range([0, height]);

      svg.append('g')
        .call(d3.axisLeft(y)) 
        .selectAll('text')
        .text((t) => `${t} %`)
        .attr('id', (t) => `y_Indicator_${t}`);


      /**
       * line generator
       * see: https://github.com/d3/d3-shape
       */
      const line = d3.line()
        .x((d) => x(d.year))
        .y((d) => y(d.value));

        
      /**
       * Add lines
       */
      svg.selectAll('myLines')
        .data(this.reorderedData)
        .enter()
        .append('path')
        .attr('d', (d) => line(d.values))
        .attr('class', (d) => d.name.toLowerCase())
        .style('stroke-width', this.lineWidth)
        .style('fill', 'none')
        
        console.log(this.reorderedData);

      /**
       * Add Dots
       */
      svg.selectAll("myDots")
        .data(this.reorderedData)
        .enter()
          .append('g') // create group
          .attr('class', (d) => `${d.name.toLowerCase()} dotGroup`)
        // Second we need to enter in the 'values' part of this group
        .selectAll('myPoints')
        .data((d) => d.values)
        .enter()
        .append('circle')
          .attr('cx', (d) => x(d.year))
          .attr('cy', (d) => y(d.value))
          .attr('r', this.circleRadius)

      /**
       * Add names
       */
      svg.selectAll('myLabels')
        .data(this.reorderedData)
        .enter()
          .append('g')
          .append('text')
            .datum((d) => {
              return {name: d.name, value: d.values[d.values.length - 1]};
            }) // keep only the last value of each time series
            .attr("transform", (d) => {
              // console.log(d);
              return `translate(${x(d.value.year)},${y(d.value.value)})`; }) // Put the text at the position of the last point
            .attr("x", 20)
            .attr("y", 5)
            .attr('class', (d) => `${d.name}Label lineLabel fill-${d.name.toLowerCase()}`)
            .text((d) => d.name)
    });
  }
}