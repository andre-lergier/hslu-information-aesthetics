import * as d3 from 'd3';

export default class WorldGraph {
  constructor(containerId) {
    this.dataSrcCsv = 'static/data/sustainable-development-goal-6-1.world.csv';
    this.containerId = containerId;
    this.container = document.querySelector(this.containerId);

    console.log(this.containerId);

    this.circleRadius = 6;
    this.lineWidth = '1px';
    this.minDiagramWidth = 1000;

    this.svg = null;
    this.x = null;
    this.y = null;
    this.xAxis = null;
    this.yAxis = null;
    this.width = null;
    this.height = null;

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

  printDiagram() {
    const margin = {
      top: 10, right: 30, bottom: 250, left: 30,
    };
    let chartWidth = this.container.offsetWidth;
    if (chartWidth < this.minDiagramWidth) {
      chartWidth = this.minDiagramWidth;
    }
    const chartHeight = chartWidth / 3;

    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight + margin.top + margin.bottom;

    // append the svg object to the .chart
    const svg = d3.select(this.containerId)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        `translate(${margin.left},${margin.top})`);

    // Parse the Data
    d3.dsv(';', this.dataSrcCsv, d3.autoType).then((data) => {
      // Add X axis
      const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.GeoAreaName))
        .padding(1); // , rotate(90deg)
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end');

      // Y axis
      const y = d3.scaleLinear()
        .domain([55, -55]) // min and max values of input data
        .range([0, height]);
      svg.append('g')
        .call(d3.axisLeft(y));


      // Zero / world line
      svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(0))
        .attr('y2', y(0))
        .attr('stroke', 'black')
        .attr('stroke-width', '1px')
        .attr('id', 'zeroLine');


      // Line rural to allarea
      svg.selectAll('my1line')
        .data(data) // ab hier wie ein loop
        .enter()
        .append('line')
        .attr('x1', (d) => x(d.GeoAreaName))
        .attr('x2', (d) => x(d.GeoAreaName))
        .attr('y1', (d) => y(d.Rural2))
        .attr('y2', (d) => y(d.AllArea2))
        .attr('stroke', 'pink')
        .attr('stroke-width', (d) => (d.Rural2 == null || d.AllArea2 == null ? 0 : this.lineWidth));

      // Line rural to allarea
      svg.selectAll('my2line')
        .data(data) // ab hier wie ein loop
        .enter()
        .append('line')
        .attr('y1', (d) => y(d.value1))
        .attr('x1', (d) => x(d.GeoAreaName))
        .attr('x2', (d) => x(d.GeoAreaName))
        .attr('y1', (d) => y(d.AllArea2))
        .attr('y2', (d) => y(d.Urban2))
        .attr('stroke', 'green')
        .attr('stroke-width', (d) => (d.AllArea2 == null || d.Urban2 == null ? 0 : this.lineWidth));

      // Circles of rural
      svg.selectAll('myRuralCircle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.GeoAreaName))
        .attr('cy', (d) => y(d.Rural2))
        .attr('r', (d) => (d.Rural2 == null ? 0 : this.circleRadius))
        .attr('class', 'rural')
        .attr('id', (d) => `${d.GeoAreaName}Rural2`)
        .attr('data-value', (d) => d.Rural2);

      // Circles of allarea
      svg.selectAll('myAllareaCircle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.GeoAreaName))
        .attr('cy', (d) => y(d.AllArea2))
        .attr('r', (d) => (d.AllArea2 == null ? 0 : this.circleRadius))
        .attr('class', 'allarea')
        .attr('id', (d) => `${d.GeoAreaName}AllArea2`)
        .attr('data-value', (d) => d.AllArea2);

      // Circles of urban
      svg.selectAll('myUrbanCircle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.GeoAreaName))
        .attr('cy', (d) => y(d.Urban2))
        .attr('r', (d) => (d.Urban2 == null ? 0 : this.circleRadius))
        .attr('class', 'urban')
        .attr('id', (d) => `${d.GeoAreaName}Urban2`)
        .attr('data-value', (d) => d.Urban2);
    });
  }
}