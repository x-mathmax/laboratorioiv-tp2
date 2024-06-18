export class Turno {
    paciente: string;
    especialista: string;
    especialidad: string;
    diagnostico: string;
    reseña: string;
    estado: string;
    calificacionEspecialista: string;
    comentarioTurno: string;
  
    constructor(paciente: string, especialista: string, especialidad: string, diagnostico: string, reseña:string,
        estado: string, calificacionEspecialista: string, comentarioTurno:string  
    ) {
      this.paciente = paciente;
      this.especialista = especialista;
      this.especialidad = especialidad;
      this.diagnostico = diagnostico;
      this.reseña = reseña;
      this.estado = estado;
      this.calificacionEspecialista = calificacionEspecialista;
      this.comentarioTurno = comentarioTurno;
    }
  }