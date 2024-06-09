import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, docData, doc,
  query, where, getDocs, CollectionReference, DocumentData, orderBy, updateDoc
} from '@angular/fire/firestore';
import { Observable, map, from, firstValueFrom, first  } from 'rxjs';
import { Administrador } from '../models/Administrador';
import { Especialista } from '../models/Especialista';
import { Paciente } from '../models/Paciente';
import { UsuarioDto } from '../models/UsuarioDto';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public firestore: Firestore) { }
  
  agregarPaciente(paciente: Paciente) : void{
    try{
      let c = collection(this.firestore, 'usuarios');
      addDoc(c, { nombre : paciente.nombre, apellido: paciente.apellido, edad: paciente.edad, dni: paciente.dni,
        obraSocial: paciente.obraSocial, email: paciente.mail, password: paciente.password, 
        imagenUno: paciente.imagenUno, imagenDos: paciente.imagenDos, tipoUser : 'paciente'
      });
    }catch(error){
      console.error('No se pudo agregar el Paciente. Error: ', error);
    }
  }

  agregarEspecialista(especialista: Especialista) : void{
    try{
      let c = collection(this.firestore, 'usuarios');
      addDoc(c, { nombre : especialista.nombre, apellido: especialista.apellido, edad: especialista.edad, dni: especialista.dni,
        especialidad: especialista.especialidad, email: especialista.mail, password: especialista.password, foto: especialista.foto,
        habilitado: false, tipoUser : 'especialista'
      });
    }catch(error){
      console.error('No se pudo agregar el Especialista. Error: ', error);
    }
  }

  agregarAdministrador(administrador: Administrador) : void{
    try{
      let c = collection(this.firestore, 'usuarios');
      addDoc(c, { nombre : administrador.nombre, apellido: administrador.apellido, edad: administrador.edad, dni: administrador.dni,
        email: administrador.mail, password: administrador.password, foto: administrador.foto, tipoUser : 'administrador'
      });
    }catch(error){
      console.error('No se pudo agregar el Administrador. Error: ', error);
    }
  }

  async getAndSaveTipoUserByEmail(email: string): Promise<string> {
    try {
      const data = await firstValueFrom(this.getDocDataByEmail(email).pipe(first()));
      if (data) {
        const tipoUser = data.tipoUser; 
        return tipoUser;
      } else {
        throw new Error('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener el tipo de usuario:', error);
      throw error;
    }
  }

  getDocData(path: string) {
    return  docData(doc(this.firestore, path), {idField:  'id'}) as  Observable<any>
}

  getDocDataByEmail(email: string): Observable<any> {
    const usersRef = collection(this.firestore, 'usuarios') as CollectionReference<DocumentData>;
    const q = query(usersRef, where('email', '==', email));
    
    return new Observable<any>(observer => {
      getDocs(q)
        .then(snapshot => {
          if (snapshot.empty) {
            observer.next(null); // Si no encuentro nada que coincida devuelvo un nullcito
          } else {
            const doc = snapshot.docs[0];
            const data = doc.data();
            const id = doc.id;
            observer.next({ id, ...data }); // Armo doc con sus datos.
          }
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }


  getCollectionData(path: string) {
    return  collectionData(collection(this.firestore, path), {idField:  'id'}) as  Observable<any>
  }


  getUsersForTable(): Observable<UsuarioDto[]> {
    let c = collection(this.firestore, 'usuarios');
    return collectionData(c, { idField: 'id' }) as Observable<UsuarioDto[]>;
  }

  // toggleUserHabilitado(userId: string, newValue: boolean): Promise<void> {
  //   const userRef = this.firestore.collection('usuarios').doc(userId);
  //   return userRef.set({ habilitado: newValue }, { merge: true });
  // }

  async toggleUserHabilitado(userMail: string, newValue: boolean) {
    try {
      const col = collection(this.firestore, 'usuarios');
      const q = query(col, where('email', '==', userMail));
      console.log(userMail);

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {   
          habilitado : newValue });
      } 
    } catch (error) {
      console.error('El estado no pudo ser actualizado:', error);
      throw error;
    }
  }
}

