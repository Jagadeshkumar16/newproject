import { Component } from '@angular/core';
import { PlanetService } from '../planet.service';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.scss'
})
export class SimulationComponent {
  displayedColumns: string[] = ['Name', 'Count'];
  speciesData: { species: string; count: number; }[] = [];
  organisms: any[] = [];
  organismCount: number = 0;
  intervalId:any;
  giraffeCount:any;
  humanCount:any;
  lionCount:any;
  egaleCount:any;
  pigeonCount:any;
  cellCount:any;
  displayName='simulation';
  chart:any;

  constructor(private planetService: PlanetService) {}

  ngOnInit() {
    this.getAllorganism();
   
  }
  graphs(){
    this.displayName='graph';
    this.getAllorganism();
  }
  start() {
    console.log('Clicked');
    this.intervalId = setInterval(() => {
      this.planetService.simulate().subscribe((data) => {});
      this.getAllorganism();
    }, 10000);
  }
  
  stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); 
      this.intervalId = null; // Reset intervalId after clearing the interval
      this.graphs(); // Call graphs() method after stopping the interval
    } else {
      console.warn('Interval ID is not set'); // Log a warning if intervalId is not set
    }
  }
  calculateSpeciesCount(): void {
    const speciesMap = new Map<string, number>();

    this.organisms.forEach(organism => {
      const species = organism.species;
      speciesMap.set(species, (speciesMap.get(species) || 0) + 1);
    });

    this.speciesData = Array.from(speciesMap).map(([species, count]) => ({ species, count }));
    this.createChart(); 
  }

  createChart() {
    if (this.speciesData.length > 0) {
      const chartData = this.speciesData.map(d => ({ name: d.species, y: d.count }));
      const categories = this.speciesData.map(d => d.species); 
  
      this.chart = Highcharts.chart('container', { 
        title: {
          text: 'Species Remaining' 
        },
        chart: {
          type: 'column'
        },
        xAxis: {
          categories: categories 
        },
        series: [{
          name: 'Species Count',
          type: 'column',
          data: chartData
        }]
      });
    } else {
      console.warn('No data available for chart');
    }
  }

  getAllorganism() {
    this.planetService.getorganisms().subscribe(
      (response: any) => {
        this.organisms = response;
        this.organismCount = this.organisms.length;
       this.giraffeCount = this.organisms.filter(organism => organism.species === 'Giraffee').length;
        console.log(this.giraffeCount,"gcount");
        this.humanCount = this.organisms.filter(organism => organism.species === 'Human').length;
        console.log(this.humanCount,"hcount");
        this.lionCount = this.organisms.filter(organism => organism.species === 'Lion').length;
        console.log(this.lionCount,"licount");
        this.egaleCount = this.organisms.filter(organism => organism.species === 'Eagle').length;
        console.log(this.egaleCount,"eacount");
        this.pigeonCount = this.organisms.filter(organism => organism.species === 'Pigeon').length;
        console.log(this.pigeonCount,"picount");
        this.cellCount = this.organisms.filter(organism => organism.species === 'cell').length;
        console.log(this.cellCount,"cellcount");
        this.calculateSpeciesCount();
        console.log(response,'spieces')
      }
    );
  }
}
