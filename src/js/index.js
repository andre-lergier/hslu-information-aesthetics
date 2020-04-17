import '../scss/style.scss';
import MainGraph from './modules/main-graph';
import WorldGraph from './modules/world-graph';

const mainGraph = new MainGraph('#differenceChart');
mainGraph.printDiagram();

const worldGraph = new WorldGraph('#worldChart');
worldGraph.printDiagram();
