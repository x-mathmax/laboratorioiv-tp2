import { Timestamp } from "@angular/fire/firestore";

export class Turno {
    paciente: string;
    especialista: string;
    especialidad: string;
    diagnostico: string;
    reseña: string;
    estado: string;
    calificacionEspecialista: string;
    comentarioTurno: string;
    fecha: Timestamp;
  
    constructor(paciente: string, especialista: string, especialidad: string, diagnostico: string, reseña:string,
        estado: string, calificacionEspecialista: string, comentarioTurno:string, fecha: Timestamp  
    ) {
      this.paciente = paciente;
      this.especialista = especialista;
      this.especialidad = especialidad;
      this.diagnostico = diagnostico;
      this.reseña = reseña;
      this.estado = estado;
      this.calificacionEspecialista = calificacionEspecialista;
      this.comentarioTurno = comentarioTurno;
      this.fecha = fecha;
    }
  }