import '../scss/style.scss';
import * as d3 from 'd3';
import MainGraph from './modules/main-graph';
import WorldGraph from './modules/world-graph';
import EvolutionGraph from './modules/evolution-graph';

const mainGraph = new MainGraph('#differenceChart');
mainGraph.printDiagram();


const worldGraph = new WorldGraph('#worldChart');
worldGraph.printDiagram();
