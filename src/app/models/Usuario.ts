export class Usuario {
    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    email: string;
    password: string;
    tipoUser: string;
  
    constructor(nombre: string, apellido: string, edad:number, dni: number, email: string, password: string, tipoUser:string) {
      this.nombre = nombre;
      this.apellido = apellido;
      this.edad = edad;
      this.dni = dni;
      this.email = email;
      this.password = password;
      this.tipoUser = tipoUser;
    }
  }