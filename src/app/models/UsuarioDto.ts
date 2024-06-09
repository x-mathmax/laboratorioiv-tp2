import { Usuario } from "./Usuario";

export class UsuarioDto extends Usuario{
    habilitado: boolean;
  
    constructor(nombre: string, apellido: string, edad:number, dni: number, mail: string, password: string, tipoUser:string, habilitado: boolean) {
        super(nombre, apellido, edad, dni, mail, password, tipoUser) 
        this.habilitado = habilitado;
    }
}