import { Usuario } from "./Usuario";

export class Especialista extends Usuario{
    especialidad: string;
    foto: string;
    habilitado: boolean;
    diasTrabaja: string;
    horaEntrada: string;
    horaSalida: string;
  
    constructor(nombre: string, apellido: string, edad:number, dni: number, mail: string, password: string, tipoUser:string,
        especialidad: string, foto: string, habilitado: boolean, diasTrabaja: string, horaEntrada: string, horaSalida: string) {
        super(nombre, apellido, edad, dni, mail, password, tipoUser)
        this.especialidad = especialidad;
        this.foto = foto;  
        this.habilitado = habilitado;
        this.diasTrabaja = diasTrabaja;
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
    }
}