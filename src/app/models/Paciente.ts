import { Usuario } from "./Usuario";

export class Paciente extends Usuario{
    obraSocial: string;
    imagenUno: string;
    imagenDos: string;
  
    constructor(nombre: string, apellido: string, edad:number, dni: number, email: string, password: string, tipoUser:string,
        obraSocial: string, imagenUno:string, imagenDos: string) {
        super(nombre, apellido, edad, dni, email, password, tipoUser)
        this.obraSocial = obraSocial;
        this.imagenUno = imagenUno;
        this.imagenDos = imagenDos;  
    }
}