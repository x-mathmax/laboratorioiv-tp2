import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef, } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Turno } from '../../models/Turno';
import { CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Observable } from 'rxjs';
import { ExcelService } from '../../services/excel.service';
import {Chart, registerables  } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-informes',
  standalone: true,
  imports: [SpinnerComponent, CommonModule],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.css'
})
export class InformesComponent implements OnInit, AfterViewInit {
  loading: boolean = false;
  turnos$!: Observable<any[]>;
  logs$!: Observable<any[]>;
  turnosArray: any[] = [];
  logsArray: any[] = [];
  jsonLogs: any;
  currentDate = new Date();
  formattedDate = this.currentDate.toISOString().split('T')[0];// yyyy-mm-dd
  fileName = `listado_logs_${this.formattedDate}`;
  turnosPorEspecialidadArray: any[] = [];
  turnosPorDiaArray: any[] = [];
  turnosPorMedicoArray: any[] = [];
  turnosFinalizadosPorMedicoArray: any[] = [];
  @ViewChild('turnosPorEspecialidadChart') chartContainer!: ElementRef<HTMLCanvasElement> | null;
  @ViewChild('turnosPorDiaChart') chartContainerDia!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;


  constructor(private router: Router, 
    private excelService: ExcelService,
  private firestoreService: FirestoreService,
  private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.fetchTurnos();
    this.fetchLogs();
    this.cdr.detectChanges();
    //ver el timing para que se ejecute luego de que fetchea los datos.
    this.turnosPorEspecialidadArray = this.getTurnosPorEspecialidad();
    console.log('porespecialidad',this.turnosPorEspecialidadArray);
    this.turnosPorDiaArray = this.getTurnosPorDia();
    
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    if (this.chartContainer && this.chartContainer.nativeElement) {
      this.renderChart();
    } else {
      console.error('Canvas element not found or not initialized.');
    }
    if (this.chartContainerDia && this.chartContainerDia.nativeElement) {
      this.renderChartDia();
    } else {
      console.error('Canvas element not found or not initialized.');
    }
  }

  fetchTurnos() {
    this.loading = true;
    this.turnos$ = this.firestoreService.getCollectionData('turnos');
    this.turnos$.subscribe({
      next: (turnos) => {
        this.turnosArray = turnos;
        console.log(turnos);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching turnos:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchLogs() {
    this.loading = true;
    this.logs$ = this.firestoreService.getCollectionData('logs');
    this.logs$.subscribe({
      next: (logs) => {
        this.jsonLogs = logs.map(log => ({
          email: log.email,
          fecha: log.fecha,
        }));
        console.log(logs);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching logs:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  //por especialidad
  getTurnosPorEspecialidad(): any[] {
    const turnosPorEspecialidad: { [key: string]: number } = {}; // Inicialización con tipo explícito
  
    this.turnosArray.forEach(turno => {
      const especialidad = turno.especialidad;
      if (turnosPorEspecialidad[especialidad]) {
        turnosPorEspecialidad[especialidad]++;
      } else {
        turnosPorEspecialidad[especialidad] = 1;
      }
    });
  
    return Object.entries(turnosPorEspecialidad).map(([especialidad, cantidad]) => ({ especialidad, cantidad }));
  }

  //por fecha
  getTurnosPorDia(): any[] {
    const turnosPorDia: { [key: string]: number } = {}; // Inicialización con tipo explícito
  
    this.turnosArray.forEach(turno => {
      const fecha = turno.fecha; // Asumiendo que fecha es un string con formato "YYYY-MM-DD"
      if (turnosPorDia[fecha]) {
        turnosPorDia[fecha]++;
      } else {
        turnosPorDia[fecha] = 1;
      }
    });
  
    return Object.entries(turnosPorDia).map(([fecha, cantidad]) => ({ fecha, cantidad }));
  }

  //por médico en 15d
  getTurnosSolicitadosUltimos15Dias(medico: string): number {
    const fechaLimite = new Date();  // Fecha actual
    fechaLimite.setDate(fechaLimite.getDate() - 15);  // Restar 15 días
  
    return this.turnosArray.filter(turno =>
      turno.especialista === medico &&
      new Date(turno.fecha) >= fechaLimite
    ).length;
  }

  //finalizados
  getTurnosFinalizadosUltimos15Dias(medico: string): number {
    const fechaLimite = new Date();  // Fecha actual
    fechaLimite.setDate(fechaLimite.getDate() - 15);  // Restar 15 días
  
    return this.turnosArray.filter(turno =>
      turno.especialista === medico &&
      turno.estado === 'finalizado' &&
      new Date(turno.fecha) >= fechaLimite
    ).length;
  }

  //especialidad chart
  renderChart(): void {
    const canvas = this.chartContainer?.nativeElement;
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error('Elemento canvas no encontrado o no es instancia de HTMLCanvasElement');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Contexto 2D no encontrado en el elemento canvas');
      return;
    }

    const labels = this.turnosPorEspecialidadArray.map(data => data.especialidad);
    const data = this.turnosPorEspecialidadArray.map(data => data.cantidad);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de Turnos por Especialidad',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

 //por dia chart
 renderChartDia(): void {
  const ctx = this.chartContainerDia.nativeElement.getContext('2d');
  if (!ctx) {
    console.error('Failed to get 2D context from canvas.');
    return;
  }

  // Example data for turnos por día
  const data = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
    datasets: [{
      label: '# of Turnos',
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ],
      borderWidth: 1
    }]
  };

  new Chart(ctx, {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Turnos por Día'
        }
      }
    }
  });
}


  logout():void {
    this.router.navigate(['/welcome']);
  }

  goHome():void {
    this.router.navigate(['/home']);
  }

  generarExcel(): void {
    this.excelService.exportAsExcelFile(this.jsonLogs, this.fileName);
  }


}
