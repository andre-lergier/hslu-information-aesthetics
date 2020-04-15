import '../scss/style.scss';
import * as d3 from 'd3';

class DataVis {
  constructor() {
    this.dataSrcCsv = 'static/data/sustainable-development-goal-6-1.csv';
    this.dataSrcCsvExtended = 'static/data/sustainable-development-goal-6-1.020.csv';
    this.isResizing = false;

    this.colors = {
      rural: '#a3b147',
      allarea: '#e7b44d',
      urban: '#274c71',
    };

    this.circleRadius = 6;
    this.lineWidth = '1px';
    this.minDiagramWidth = 1000;

    this.previous = null;

    this.initListeners();
  }

  loadCsv() {
    return d3.dsv(';', this.dataSrcCsvExtended, d3.autoType);
  }

  loadJson() {
    return d3.json(this.dataSrcJson, d3.autoType);
  }

  initListeners() {
    window.addEventListener('resize', this.resizeWindow.bind(this));
  }

  resizeWindow() {
    if (document.querySelector('.chart').offsetWidth > this.minDiagramWidth) {
      this.redrawDiagram();
    }
  }

  redrawDiagram() {
    d3.select('.chart').selectAll('*').remove();
    this.printDiagramExtended();
  }

  printSimpleDiagram() {
    const margin = {
      top: 10, right: 30, bottom: 250, left: 30,
    };
    let chartWidth = document.querySelector('.chart').offsetWidth;
    if (chartWidth < this.minDiagramWidth) {
      chartWidth = this.minDiagramWidth;
    }
    const chartHeight = chartWidth / 3;

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

  getCoordinate(x,y,d) {
    let coordinates = {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
    }

    let id = '';
    let line = false;

    // first element
    if(this.previous == null) {
      coordinates.x1 = 0;
      coordinates.x2 = 0;
      coordinates.y1 = 0;
      coordinates.y2 = 0;

      id = `noLine${d.Id}`;
      line = false;
      this.previous = d;
      return coordinates;
    }

    if(this.previous.GeoAreaName === d.GeoAreaName) {
      // same area as element before
      console.log(`from ${this.previous.GeoAreaName}_${this.previous.Location} to ${d.GeoAreaName}_${d.Location}`);
      line = true;
      id = `${this.previous.GeoAreaName.trim().toLowerCase()}_${this.previous.Location}_TO_${d.GeoAreaName.trim().toLowerCase()}_${d.Location}`;
      coordinates.x1 = x(this.previous.Id);
      coordinates.x2 = x(d.Id);
      coordinates.y1 = y(this.previous.latest);
      coordinates.y2 = y(d.latest);
    } else {
      line = false;
      id = `noLine${d.Id}`;
      coordinates.x1 = 0;
      coordinates.x2 = 0;
      coordinates.y1 = 0;
      coordinates.y2 = 0;
    }

    // previousTemp = previous;
    this.previous = d;

    return coordinates;
  }

  printDiagramExtended(target) {
    /**
     * define dimensions
     */
    const margin = {
      top: 10, right: 30, bottom: 50, left: 70,
    };

    let chartWidth = document.querySelector(target).offsetWidth;
    if (chartWidth < this.minDiagramWidth) {
      chartWidth = this.minDiagramWidth;
    }
    const chartHeight = chartWidth / 2.5;

    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    // append the svg object to the .chart
    const svg = d3.select(target)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        `translate(${margin.left},${margin.top})`);

    // Parse the Data
    d3.dsv(';', this.dataSrcCsvExtended, d3.autoType).then((data) => {
      // Add X axis
      const x = d3.scaleBand()
        .range([0, width], .1)
        .domain(data.map((d) => d.Id))
        .padding(1);

      let xAxis = svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end');

      const xGroup = d3.scaleOrdinal();

      // Y axis
      const y = d3.scaleLinear()
        .domain([55, -55]) // min and max values of input data
        .range([0, height]);

      let yAxis = svg.append('g')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .text((t) => {
          if(t == 0){
            return 'World 2017';
          }
          return t + '%';
        })
        .attr('id', (t) => `y_Indicator_${t}`)
        .attr('font-weight', (t) => {
          if(t == 0) {
            return `500`;
          }
        });


      // Zero / world line
      for (let i = -50; i <= 50; i+=5) {
        svg.append('line')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', y(i))
          .attr('y2', y(i))
          .attr('class', () => {
            if(i == 0) {
              return 'zeroLine';
            } else {
              return 'helpLine';
            }
          })
          .attr('stroke-width', '1px')
          .attr('id', `helpLine${i}`);
      }

      let id = '';

      // Connection lines
      svg.selectAll('my1line')
        .data(data) // ab hier wie ein loop
        .enter()
        .append('line')
        .attr('x1', (d) => this.getCoordinate(x,y,d).x1)
        .attr('x2', (d) => this.getCoordinate(x,y,d).x2)
        .attr('y1', (d) => this.getCoordinate(x,y,d).y1)
        .attr('y2', (d) => this.getCoordinate(x,y,d).y2)
        .attr('class', 'connectionLine')
        .attr('id', id)
        .attr('stroke-width', (d) => (d.Rural2 == null || d.AllArea2 == null ? this.lineWidth : this.lineWidth));

      // Circles
      svg.selectAll('myRuralCircle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.Id))
        .attr('cy', (d) => y(d.latest))
        .attr('r', (d) => (d.latest == null ? 0 : this.circleRadius))
        .attr('class', (d) => d.Location.toLowerCase())
        .attr('id', (d) => `${d.GeoAreaName.trim().toLowerCase()}_${d.Location.trim().toLowerCase()}_latest`)
        .attr('data-value', (d) => d.Rural2);
    });
  }
}

const dataVisOb = new DataVis();
dataVisOb.printDiagramExtended('.chart');
