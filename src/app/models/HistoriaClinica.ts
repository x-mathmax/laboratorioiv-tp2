export class HistoriaClinica {
    nombrePaciente: string;
    emailPaciente: string;
    nombreEspecialista: string;
    emailEspecialista: string;
    fechaTurno: string;
    especialidad: string;
    diagnostico: string;
    altura: string;
    peso: string;
    temperatura: string;
    presion: string;
  
    constructor(nombrePaciente: string, emailPaciente: string, nombreEspecialista:string, emailEspecialista: string, fechaTurno: string, especialidad: string,
        diagnostico:string, altura:string, peso:string, temperatura:string, presion: string) {
      this.nombrePaciente = nombrePaciente;
      this.emailPaciente = emailPaciente;
      this.nombreEspecialista = nombreEspecialista;
      this.emailEspecialista = emailEspecialista;
      this.fechaTurno = fechaTurno;
      this.especialidad = especialidad;
      this.diagnostico = diagnostico;
      this.altura = altura;
      this.peso = peso;
      this.temperatura = temperatura;
      this.presion = presion;
    }
  }