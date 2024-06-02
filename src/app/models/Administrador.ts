import { Usuario } from "./Usuario";

export class Administrador extends Usuario{
    foto: string;
  
    constructor(nombre: string, apellido: string, edad:number, dni: number, mail: string, password: string, tipoUser:string,
        especialidad: string, foto: string) {
        super(nombre, apellido, edad, dni, mail, password, tipoUser)
        this.foto = foto;  
    }
}