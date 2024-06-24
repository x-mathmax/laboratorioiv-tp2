import { Usuario } from "./Usuario";

export class Administrador extends Usuario{
    foto: string;
  
    constructor(nombre: string, apellido: string, edad:number, dni: number, email: string, password: string, tipoUser:string,
        foto: string) {
        super(nombre, apellido, edad, dni, email, password, tipoUser)
        this.foto = foto;  
    }
}