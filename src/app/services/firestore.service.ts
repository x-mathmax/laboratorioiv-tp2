import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, query, orderBy, limit, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Administrador } from '../models/Administrador';
import { Especialista } from '../models/Especialista';
import { Paciente } from '../models/Paciente';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public firestore: Firestore) { }
  
  agregarPaciente(paciente: Paciente) : void{
    try{
      let c = collection(this.firestore, 'pacientes');
      addDoc(c, { nombre : paciente.nombre, apellido: paciente.apellido, edad: paciente.edad, dni: paciente.dni,
        obraSocial: paciente.obraSocial, email: paciente.mail, password: paciente.password, 
        imagenUno: paciente.imagenUno, imagenDos: paciente.imagenDos
      });
    }catch(error){
      console.error('No se pudo agregar el Paciente. Error: ', error);
    }
  }

  agregarEspecialista(especialista: Especialista) : void{
    try{
      let c = collection(this.firestore, 'especialistas');
      addDoc(c, { nombre : especialista.nombre, apellido: especialista.apellido, edad: especialista.edad, dni: especialista.dni,
        especialidad: especialista.especialidad, email: especialista.mail, password: especialista.password, foto: especialista.foto
      });
    }catch(error){
      console.error('No se pudo agregar el Especialista. Error: ', error);
    }
  }
}

