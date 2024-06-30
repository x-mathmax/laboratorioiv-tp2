import { Usuario } from "./Usuario";

export class PerfilDto extends Usuario{
    habilitado: boolean;
    //email : string;
    especialidad: string;
    foto: string;
    obraSocial: string;
    imagenUno: string;
    imagenDos: string;
    horaEntrada: string;
    horaSalida: string;
    diasTrabaja: string;
  
    constructor(nombre: string, apellido: string, edad:number, dni: number, mail: string, password: string, tipoUser:string, habilitado: boolean, especialidad : string, foto: string, 
        obraSocial: string, imagenUno: string, imagenDos:string, horaEntrada: string, horaSalida: string, diasTrabaja: string) 
        {
        super(nombre, apellido, edad, dni, mail, password, tipoUser) 
        this.habilitado = habilitado;
        this.especialidad = especialidad;
        this.foto = foto;
        this.obraSocial = obraSocial;
        this.imagenUno = imagenUno;
        this.imagenDos = imagenDos;
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
        this.diasTrabaja = diasTrabaja;

    }
}