import '../scss/style.scss';
import * as d3 from 'd3';
import MainGraph from './modules/main-graph';
import WorldGraph from './modules/world-graph';

const dataVisOb = new MainGraph();
dataVisOb.printDiagram('#differenceChart');
dataVisOb.updateDiagram('latest');


const worldGraph = new WorldGraph('#worldChart');
worldGraph.printDiagram();
