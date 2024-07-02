import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef, } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Turno } from '../../models/Turno';
import { CommonModule} from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Observable } from 'rxjs';
import { ExcelService } from '../../services/excel.service';
import {Chart, registerables, ChartType } from 'chart.js';

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
  medicos$!: Observable<any[]>;
  turnosArray: any[] = [];
  logsArray: any[] = [];
  medicosArray: any[] = [];
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
  @ViewChild('turnosPorMedicoChart') chartContainerTurnosMedico!: ElementRef<HTMLCanvasElement>;
  @ViewChild('turnosFinChart') chartContainerTurnosFin!: ElementRef<HTMLCanvasElement>;
  chartEspecialidad: Chart | undefined;
  chartDia: Chart<"pie", number[], string> | undefined;
  chartTurnosMedico: Chart | undefined;
  chartTurnosFin: Chart<"doughnut", number[], string> | undefined;


  constructor(private router: Router, 
    private excelService: ExcelService,
  private firestoreService: FirestoreService,
  private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.fetchTurnos();
    this.fetchLogs();
    this.cdr.detectChanges();
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
    if (this.chartContainerTurnosMedico && this.chartContainerTurnosMedico.nativeElement) {
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
        this.turnosPorEspecialidadArray = this.getTurnosPorEspecialidad();
        this.turnosPorDiaArray = this.getTurnosPorDia();
        this.turnosPorMedicoArray = this.getTurnosSolicitadosUltimos15Dias();
        this.turnosFinalizadosPorMedicoArray = this.getTurnosFinalizadosUltimos15Dias();
        console.log('finalizados', this.turnosFinalizadosPorMedicoArray);
        this.loading = false;
        this.cdr.detectChanges();

        this.renderChart();
        this.renderChartDia();
        this.renderChartDiaMedico();
        this.renderChartFin();
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
  fetchMedicos() {
    this.loading = true;
    this.medicos$ = this.firestoreService.getEspecialistas();
    this.medicos$.subscribe({
      next: (medicos) => {
        console.log(medicos);
        this.medicosArray = medicos;
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
    const turnosPorEspecialidad: { [key: string]: number } = {};
  
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
    const turnosPorDia: { [key: string]: number } = {};
  
    this.turnosArray.forEach(turno => {
      const fecha = turno.fecha;
      if (turnosPorDia[fecha]) {
        turnosPorDia[fecha]++;
      } else {
        turnosPorDia[fecha] = 1;
      }
    });
  
    return Object.entries(turnosPorDia).map(([fecha, cantidad]) => ({ fecha, cantidad }));
  }


  //por médico en 15d anteriores
  getTurnosSolicitadosUltimos15Dias(): { medico: string; cantidad: number; }[] {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 15);  // Restar 15 días
  
    const turnosPorMedico: { [key: string]: number } = {};
  
    this.turnosArray.forEach(turno => {
      const medico = turno.especialista;
      const fechaTurno = new Date(turno.fecha);
  
      if (fechaTurno >= fechaLimite) {
        if (turnosPorMedico[medico]) {
          turnosPorMedico[medico]++;
        } else {
          turnosPorMedico[medico] = 1;
        }
      }
    });
  
    return Object.entries(turnosPorMedico).map(([medico, cantidad]) => ({ medico, cantidad }));
  }

  //finalizados
  getTurnosFinalizadosUltimos15Dias(): any[] {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 15);  // Restar 15 días
  
    const turnosFinalizadosPorMedico: { medico: string, cantidad: number }[] = [];
  
    // Obtener todos los médicos únicos
    const medicosUnicos = Array.from(new Set(this.turnosArray.map(turno => turno.especialista)));
  
    // Iterar por cada médico y contar los turnos finalizados
    medicosUnicos.forEach(medico => {
      const cantidad = this.turnosArray.filter(turno =>
        turno.especialista === medico &&
        turno.estado === 'finalizado' &&
        new Date(turno.fecha) >= fechaLimite
      ).length;
  
      turnosFinalizadosPorMedico.push({ medico: medico, cantidad: cantidad });
    });
  
    return turnosFinalizadosPorMedico;
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

    if (this.chartEspecialidad) {
      this.chartEspecialidad.destroy(); // Destruir el gráfico anterior si existe
    }

    const labels = this.turnosPorEspecialidadArray.map(data => data.especialidad);
    const data = this.turnosPorEspecialidadArray.map(data => data.cantidad);

    this.chartEspecialidad = new Chart(ctx, {
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

  if (this.chartDia) {
    this.chartDia.destroy(); // Destruir el gráfico anterior si existe
  }

  const labels = this.turnosPorDiaArray.map(data => data.fecha);
  const data = this.turnosPorDiaArray.map(data => data.cantidad);

  this.chartDia = new Chart<'pie', number[], string>(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: '# of Turnos',
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderWidth: 1
      }]
    },
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

//chart turnos por medico por dia
 renderChartDiaMedico(): void {
    const canvas = this.chartContainerTurnosMedico?.nativeElement;
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error('Elemento canvas no encontrado o no es instancia de HTMLCanvasElement');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Contexto 2D no encontrado en el elemento canvas');
      return;
    }

    if (this.chartTurnosMedico) {
      this.chartTurnosMedico.destroy(); // Destruir el gráfico anterior si existe
    }

    const labels = this.turnosPorMedicoArray.map(data => data.medico);
    const data = this.turnosPorMedicoArray.map(data => data.cantidad);

    this.chartTurnosMedico = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de Turnos por Medico en los ultimos 15 días.',
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

  //turnos fin
  renderChartFin(): void {
    const ctx = this.chartContainerTurnosFin.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context from canvas.');
      return;
    }
  
    if (this.chartTurnosFin) {
      this.chartTurnosFin.destroy(); // Destruir el gráfico anterior si existe
    }
  
    const labels = this.turnosFinalizadosPorMedicoArray.map(data => data.medico);
    const data = this.turnosFinalizadosPorMedicoArray.map(data => data.cantidad);
  
    this.chartTurnosFin = new Chart<'doughnut', number[], string>(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: '# of Turnos',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Turnos Finalizados por médico en los últimos 15 Días'
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
