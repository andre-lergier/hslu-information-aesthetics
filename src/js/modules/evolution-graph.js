import * as d3 from 'd3';

export default class EvolutionGraph {
  constructor(containerId) {
    this.dataSrcCsv = 'static/data/sustainable-development-goal-6-1.evolution.csv';

    this.containerId = containerId;
    this.container = document.querySelector(this.containerId);

    this.circleRadius = 4;
    this.lineWidth = '1.5';
    this.minDiagramWidth = 1000;

    this.svg = null;
    this.x = null;
    this.y = null;
    this.xAxis = null;
    this.yAxis = null;
    this.width = null;
    this.height = null;

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
    const locationLines = [
      {
        geoArea: 'World',
        location: 'Allarea',
      },
      {
        geoArea: 'World',
        location: 'Rural',
      },
      {
        geoArea: 'World',
        location: 'Urban',
      },
      {
        geoArea: 'Uganda',
        location: 'Allarea',
      },
      {
        geoArea: 'Uganda',
        location: 'Rural',
      },
      {
        geoArea: 'Uganda',
        location: 'Urban',
      },
      {
        geoArea: 'Singapore',
        location: 'Allarea',
      },
    ]
    const reorderedData = locationLines.map((locationObj) => {
      // filter data array to remove other locations
      let filteredArray = data.filter((currentValue) => {
        if(currentValue.Location === locationObj.location.toUpperCase() && currentValue.GeoArea.toUpperCase() === locationObj.geoArea.toUpperCase()) {
          return currentValue;
        }
      })

      return {
        location: locationObj.location,
        geoArea: locationObj.geoArea,
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
      top: 10, right: 30, bottom: 30, left: 30,
    };
    const chartWidth = this.container.offsetWidth;
    const chartHeight = chartWidth / 3.3;

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
      console.log(this.reorderedData);

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
        // .domain([90, 35])
        .domain([100, 0])
        .range([0, height]);
      svg.append('g')
        .call(d3.axisLeft(y));


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
        .attr('class', (d) => `evolutionPath ${d.location.toLowerCase()} ${d.geoArea.toLowerCase()}`)
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
          .attr('class', (d) => `dotGroup ${d.location.toLowerCase()} ${d.geoArea.toLowerCase()}`)
        // Second we need to enter in the 'values' part of this group
        .selectAll("myPoints")
        .data((d) => d.values)
        .enter()
        .append('circle')
          .attr('cx', (d) => x(d.year))
          .attr('cy', (d) => y(d.value))
          .attr('r', this.circleRadius)
          .attr('class', (d) => `${d.name.toLowerCase()}Dot`)

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