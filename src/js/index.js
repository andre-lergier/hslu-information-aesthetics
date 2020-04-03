import '../scss/style.scss';

import * as d3 from 'd3';
// import { FileAttachment } from 'd3';

// data = d3.csvParse(await FileAttachment("data/aapl-bollinger.csv").text(), d3.autoType)

// let values = FileAttachment('values@1.json').json();
// let data = d3.csv('static/data/aapl-bollinger.csv', d3.autoType);
// let data2 = await data;


class DataVis {
  constructor() {
    this.dataSrcCsv = 'static/data/sustainable-development-goal-6-1.csv';
    this.dataSrcJson = 'static/data/values@1.json';
    this.colors = {
      rural: '#a3b147',
      allarea: '#e7b44d',
      urban: '#274c71',
    };
    this.circleRadius = 6;
  }

  loadCsv() {
    return d3.dsv(';', this.dataSrcCsv, d3.autoType);
  }

  loadJson() {
    return d3.json(this.dataSrcJson, d3.autoType);
  }

  printDiagram() {
    const margin = {
      top: 10, right: 30, bottom: 250, left: 30,
    };
    const chartWidth = document.querySelector('.chart').offsetWidth;
    const chartHeight = chartWidth / 2;

    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight + margin.top + margin.bottom;

    // append the svg object to the .chart
    const svg = d3.select('.chart')
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
        .domain([40, -55]) // min and max values of input data
        .range([0, height]);
      svg.append('g')
        .call(d3.axisLeft(y));


      // Line rural to allarea
      svg.select('zeroLine')
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', 'green')
        .attr('stroke-width', '1px');


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
        .attr('stroke-width', '1px');

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
        .attr('stroke-width', '1px');

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

  static testDiagram() {
    // set the dimensions and margins of the graph
    const margin = {
      top: 10, right: 30, bottom: 30, left: 30,
    };
    const chartWidth = document.querySelector('.chart').offsetWidth;
    const chartHeight = document.querySelector('.chart').offsetWidth;

    const width = chartWidth - margin.left - margin.right;
    const height = chartWidth / 2 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select('.chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        `translate(${margin.left},${margin.top})`);

    // Parse the Data
    d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_cleveland.csv', d3.autoType).then((data) => {
      // Add X axis
      const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.group))
        .padding(1);
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      // Y axis
      const y = d3.scaleLinear()
        .domain([40, -50])
        .range([0, height]);
      svg.append('g')
        .call(d3.axisLeft(y));

      // Lines
      svg.selectAll('myline')
        .data(data) // ab hier wie ein loop
        .enter()
        .append('line')
        .attr('y1', (d) => {
          console.log({ val: d, y: y(d.value1) });
          return y(d.value1);
        })
        .attr('x1', (d) => x(d.group))
        .attr('x2', (d) => x(d.group))
        .attr('y1', (d) => y(d.value1))
        .attr('y2', (d) => y(d.value2))
        .attr('stroke', 'grey')
        .attr('stroke-width', '1px');

      // Circles of variable 1
      svg.selectAll('mycircle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.group))
        .attr('cy', (d) => y(d.value1))
        .attr('r', '6')
        .style('fill', '#69b3a2');

      // Circles of variable 2
      svg.selectAll('mycircle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.group))
        .attr('cy', (d) => y(d.value2))
        .attr('r', '6')
        .style('fill', '#4C4082');
    });
  }
}

const dataVisOb = new DataVis();
const loadedData = dataVisOb.loadCsv().then((data) => {
  console.log(data);
  /* console.log(d3.min(data, (d) => {
    console.log(d.AllArea1);
  })); */

  // const chart = d3.select('.chart');
  // .selectAll() // necessary
  // .data(data) // bind data
  // .enter() // create dynamic elements
  // .append('p')
  // .text((d, i) => d);
});

dataVisOb.printDiagram();

// DataVis.testDiagram();

// dataVisOb.histogram();
