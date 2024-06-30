import { Timestamp } from "@angular/fire/firestore";

export class Turno {
    paciente: string;
    nombrePaciente: string;
    especialista: string;
    nombreEspecialista: string;
    especialidad: string;
    diagnostico: string;
    resenia: string;
    estado: string;
    calificacionAtencion: string;
    comentario: string;
    fecha: string;
    horario: string;
    encuesta: string;  
  
    constructor(paciente: string, nombrePaciente: string, especialista: string, nombreEspecialista: string, especialidad: string, diagnostico: string, resenia:string,
        estado: string, calificacionAtencion: string, comentario:string, fecha: string, horario: string, encuesta: string 
    ) {
      this.paciente = paciente;
      this.nombrePaciente = nombrePaciente;
      this.especialista = especialista;
      this.nombreEspecialista = nombreEspecialista;
      this.especialidad = especialidad;
      this.diagnostico = diagnostico;
      this.resenia = resenia;
      this.estado = estado;
      this.calificacionAtencion = calificacionAtencion;
      this.comentario = comentario;
      this.fecha = fecha;
      this.horario = horario;
      this.encuesta = encuesta;
    }
  }