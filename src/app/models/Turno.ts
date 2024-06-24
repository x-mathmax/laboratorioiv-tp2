import { Timestamp } from "@angular/fire/firestore";

export class Turno {
    paciente: string;
    especialista: string;
    especialidad: string;
    diagnostico: string;
    reseña: string;
    estado: string;
    calificacionAtencion: string;
    comentario: string;
    fecha: string;
    horario: string;
    encuesta: string;  
  
    constructor(paciente: string, especialista: string, especialidad: string, diagnostico: string, reseña:string,
        estado: string, calificacionAtencion: string, comentario:string, fecha: string, horario: string, encuesta: string 
    ) {
      this.paciente = paciente;
      this.especialista = especialista;
      this.especialidad = especialidad;
      this.diagnostico = diagnostico;
      this.reseña = reseña;
      this.estado = estado;
      this.calificacionAtencion = calificacionAtencion;
      this.comentario = comentario;
      this.fecha = fecha;
      this.horario = horario;
      this.encuesta = encuesta;
    }
  }