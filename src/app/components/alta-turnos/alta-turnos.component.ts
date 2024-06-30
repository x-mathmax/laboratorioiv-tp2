import { AfterViewInit, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Observable } from 'rxjs';
import { Turno } from '../../models/Turno';
import { Especialista } from '../../models/Especialista';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Especialidad } from '../../models/Especialidad';
import { Paciente } from '../../models/Paciente';

@Component({
  selector: 'app-alta-turnos',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './alta-turnos.component.html',
  styleUrl: './alta-turnos.component.css'
})
export class AltaTurnosComponent implements AfterViewInit {
  especialistas$!: Observable<any[]>;
  loading: boolean = false;
  especialidades: string[] = [];
  turnosDisponibles: any[] = [];
  turnosOcupados: any[] = [];
  diasHoras: string[] = ['9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00',
    '13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00']
  selectedValueHora: string;
  turnoAlta!: Turno;
  turnos : any[] = [];
  etapa : number = 0;
  diasEspecialista: string[] = [];
  horasEspecialista: string[] = [];
  especialidadesFb: string = '';
  diasFb: string = '';
  especialistaTurno!: Especialista;
  selectedTurno: { fecha: string, hora: string } | null = null; // Turno seleccionado
  especialidades$!: Observable<any[]>;
  especialidadesConFoto: any[] = [];
  especialidadesArray: Especialidad[] = [];
  fechaTurnoFormateada: any;
  currentUser: any;
  dataUser: any;
  usuarioTurno!: Paciente;
  tipoUser: any;
  pacientes$!: Observable<any[]>;
  pacientes : any[] = [];;
  selectedPaciente: string;
  selectedPacienteName: string;

  constructor(private firestoreService : FirestoreService, private cdr: ChangeDetectorRef, private data: DataService, private router: Router){
    this.selectedValueHora = '';
    this.turnoAlta = new Turno('','', '', '', '', '', '', '', '', '', '', '', '');
    this.selectedPaciente = '';
    this.selectedPacienteName = '';
    this.fetchEspecialidades();
    this.currentUser = this.data.getItem('username');
    this.getUser();
  }

  ngAfterViewInit() {
    this.fetchData(); 
    this.fetchPacientes();
    this.cdr.detectChanges();

  }

  onPacienteChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedPaciente = selectElement.value;
    console.log('Paciente seleccionado:', this.selectedPaciente);
    // Puedes agregar aquí el código para manejar el paciente seleccionado
  }

  fetchData() {
    this.loading = true;
    this.especialistas$ = this.firestoreService.getEspecialistas();
    this.especialistas$.subscribe({
      next: (especialistas) => {
        console.log(especialistas);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchPacientes() {
    this.loading = true;
    this.pacientes$ = this.firestoreService.getPacientes();
    this.pacientes$.subscribe({
      next: (pacientes) => {
        console.log(pacientes);
        this.pacientes = pacientes;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching pacientes.', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchEspecialidades() {
    this.especialidades$ = this.firestoreService.getCollectionData('especialidades');
    this.especialidades$.subscribe({
      next: (data) => {
        console.log(data);
        this.especialidadesArray = data;
      },
      error: (err) => {
        console.error('Error fetching esp.:', err);
      }
    });
  }

  getUser() {
    this.dataUser = this.firestoreService.getDocDataByEmail(this.currentUser);
    this.dataUser.subscribe({
      next: (data: any) => {
        console.log('dataUser:', data);
        this.usuarioTurno = data;
        this.tipoUser = data.tipoUser;
        console.log('tipoUser:',data.tipoUser)
      },
      error: (err: any) => {
        console.error('Error trayendo user:', err);
      }
    });
  }

  seleccionarEspecialista(especialista: Especialista) {
    this.especialistaTurno = especialista;
    console.log('Especialista seleccionado:', especialista);
    this.especialidadesFb = especialista.especialidad;
    this.especialidades = this.data.separoString(this.especialidadesFb);
    //cruzo especialidades con las imagenes de las que tienen en fb

    this.diasFb = especialista.diasTrabaja;
    this.diasEspecialista = this.data.separoString(this.diasFb);

    this.horasEspecialista = [especialista.horaEntrada, especialista.horaSalida];
    console.log("horas", this.horasEspecialista);
    
    this.turnoAlta.especialista = especialista.email;
    this.turnoAlta.nombreEspecialista = especialista.nombre;
    //obtengo turnos ocupados de ese especialista
    this.firestoreService.getTurnosOcupadosEspecialistas('turnos').subscribe(res => {
      this.turnosOcupados = res;
      this.generarTurnosDisponibles();
    });;
    this.especialidadesConFoto = this.cruzarEspecialidades(this.especialidadesArray, this.especialidades);
    console.log("fotos", this.especialidadesConFoto);
    console.log("fotosDos", this.especialidadesArray);
    
    this.etapa = 1;
  }

  seleccionarEspecialidad(especialidad: any) {
    console.log('Especidad seleccionada:', especialidad);
    this.turnoAlta.especialidad = especialidad;
    console.log("hola", this.turnoAlta.especialidad);
    this.etapa = 2;
  }

  generarTurnosDisponibles() {
    const turnos: any[] = [];
    const hoy = new Date();
    const diasLaborales = this.diasEspecialista.map(dia => this.getDiaSemana(dia));

    for (let i = 0; i < 15; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);

      if (diasLaborales.includes(fecha.getDay())) {
        const turnosDia = this.diasHoras.filter(hora => 
          this.estaEnFranjaHoraria(hora) && !this.estaOcupado(fecha, hora)
        ).map(hora => ({ fecha, hora }));

        turnos.push(...turnosDia);
      }
    }

    this.turnosDisponibles = turnos;
  }

  getDiaSemana(dia: string): number {
    const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
    return dias.indexOf(dia.toLowerCase());
  }

  estaEnFranjaHoraria(hora: string): boolean {
    return hora >= this.especialistaTurno.horaEntrada && hora <= this.especialistaTurno.horaSalida;
  }

  estaOcupado(fecha: Date, hora: string): boolean {
    return this.turnosOcupados.some(turno => 
      new Date(turno.fecha).toDateString() === fecha.toDateString() && turno.hora === hora
    );
  }

  seleccionarFechaHora(fecha:string, hora: string) {
    console.log('Turno seleccionado:', fecha, hora);
    this.selectedTurno = { fecha, hora };
    this.turnoAlta.fecha = this.conviertoParaFormatearFecha(fecha);
    this.turnoAlta.horario = hora.toString();
    this.etapa = 3;
  }

  async confirmarTurno() {
    if (this.turnoAlta.fecha && this.turnoAlta.horario && this.turnoAlta.especialidad && this.turnoAlta.especialista){
      if (this.tipoUser === 'administrador') {
        if (this.selectedPaciente != null && this.selectedPaciente != '') {
        this.turnoAlta.paciente = this.selectedPaciente;
        const auxPaciente = this.getUsuarioNombrePorEmail(this.selectedPaciente);
        if (auxPaciente != null && auxPaciente != '')
        this.turnoAlta.nombrePaciente = auxPaciente;
        }
        console.log('nombre + mail administrador a pac', this.turnoAlta.nombrePaciente, this.turnoAlta.paciente);
      } else {
        this.turnoAlta.nombrePaciente = this.usuarioTurno.nombre;
        this.turnoAlta.paciente = this.usuarioTurno.email;
        //this.turnoAlta.paciente = this.data.getItem('username');
        console.log('nombre + mail', this.turnoAlta.nombrePaciente, this.turnoAlta.paciente);
      }
      this.turnoAlta.estado = 'pendiente'
      try {
        await this.firestoreService.agregarTurno(this.turnoAlta);  
      } catch (error) {
        console.error('Error al cargar especialista:', error);
      }
      this.data.executePopUp('Turno creado correctamente.');
      this.etapa = 0;
    } else {
      console.error('No se pudo realizar la reserva del turno seleccionado.');
    }
  }

  cancelarTurno() {
    this.router.navigate(['/home']);
  }

  volver() :void{
    this.router.navigate(['/home']);
  }

  getUsuarioNombrePorEmail(email: string): string | undefined {
    const paciente = this.pacientes.find(u => u.email === email);
    return paciente ? paciente.nombre : undefined;
  }

  cruzarEspecialidades(especialidadesArray: any[], especialidades: string[]): any[] {
    
    return especialidades.map(nombreEspecialidad => {
      const especialidad = especialidadesArray.find(e => e.nombre === nombreEspecialidad);
      return {
        nombre: nombreEspecialidad,
        imagen: especialidad ? especialidad.imagen : null
      };
    });
  }

  formatTimeTo12Hour(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;
    return `${this.padNumber(adjustedHours)}:${this.padNumber(minutes)} ${period}`;
  }
  
  padNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  formatearFechaYYYYMMDDParaBD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-11
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  conviertoParaFormatearFecha(dateString: string): string {
    const date = new Date(dateString);
    return this.formatearFechaYYYYMMDDParaBD(date);
  }
}