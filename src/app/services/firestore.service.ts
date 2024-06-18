import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, docData, doc,
  query, where, getDocs, CollectionReference, DocumentData, orderBy, updateDoc
} from '@angular/fire/firestore';
import { Observable, map, from, firstValueFrom, first  } from 'rxjs';
import { Administrador } from '../models/Administrador';
import { Especialista } from '../models/Especialista';
import { Paciente } from '../models/Paciente';
import { UsuarioDto } from '../models/UsuarioDto';
import { UserLogData } from '../models/UserLogData';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public firestore: Firestore) { }

  async agregarPaciente(paciente: Paciente): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let c = collection(this.firestore, 'usuarios');
      addDoc(c, {
        nombre : paciente.nombre, apellido: paciente.apellido, edad: paciente.edad, dni: paciente.dni,
        obraSocial: paciente.obraSocial, email: paciente.mail, password: paciente.password, 
        imagenUno: paciente.imagenUno, imagenDos: paciente.imagenDos, tipoUser : 'paciente'
      }).then(() => {
        console.log('Paciente agregado exitosamente en Firestore.');
        resolve(); 
      }).catch((error) => {
        console.error('No se pudo agregar el Paciente. Error: ', error);
        reject(error);
      });
    });
  }

async agregarEspecialista(especialista: Especialista): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let c = collection(this.firestore, 'usuarios');
    addDoc(c, {
      nombre: especialista.nombre,
      apellido: especialista.apellido,
      edad: especialista.edad,
      dni: especialista.dni,
      especialidad: especialista.especialidad,
      email: especialista.mail,
      password: especialista.password,
      foto: especialista.foto,
      habilitado: false,
      tipoUser: 'especialista'
    }).then(() => {
      console.log('Especialista agregado exitosamente en Firestore.');
      resolve(); 
    }).catch((error) => {
      console.error('No se pudo agregar el Especialista. Error: ', error);
      reject(error);
    });
  });
}
async agregarAdministrador(administrador: Administrador): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let c = collection(this.firestore, 'usuarios');
    addDoc(c, {
      nombre : administrador.nombre, apellido: administrador.apellido, edad: administrador.edad, dni: administrador.dni,
        email: administrador.mail, password: administrador.password, foto: administrador.foto, tipoUser : 'administrador'
    }).then(() => {
      console.log('Administrador agregado exitosamente en Firestore.');
      resolve(); 
    }).catch((error) => {
      console.error('No se pudo agregar el Administrador. Error: ', error);
      reject(error);
    });
  });
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

  // async getAndSaveTipoUserAndStatusByEmail(email: string): Promise<{ tipoUser: string, habilitado: boolean }> {
  //   try {
  //     const data = await firstValueFrom(this.getDocDataByEmail(email).pipe(first()));
  //     if (data) {
  //       const tipoUser = data.tipoUser; 
  //       const habilitado = data.habilitado;
  //       return { tipoUser, habilitado };
  //     } else {
  //       throw new Error('Usuario no encontrado');
  //     }
  //   } catch (error) {
  //     console.error('Error al obtener el tipo de usuario:', error);
  //     throw error;
  //   }
  // }

  async getAndSaveTipoUserAndStatusByEmail(email: string): Promise<{ tipoUser: string, habilitado: boolean }> {
    return new Promise<{ tipoUser: string, habilitado: boolean }>(async (resolve, reject) => {
      try {
        const data = await firstValueFrom(this.getDocDataByEmail(email).pipe(first()));
        if (data) {
          const tipoUser = data.tipoUser;
          const habilitado = data.habilitado;
          resolve({ tipoUser, habilitado });
        } else {
          reject(new Error('Usuario no encontrado'));
        }
      } catch (error) {
        console.error('Error al obtener el tipo de usuario:', error);
        reject(error);
      }
    });
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

  getFilteredData(path: string, emails: string[]): Observable<UserLogData[]> {
    const collectionRef = collection(this.firestore, path);
    const q = query(collectionRef, where('email', 'in', emails));

    return from(getDocs(q)).pipe(
      map(querySnapshot => 
        querySnapshot.docs.map(doc => {
          const data = doc.data() as UserLogData;
          return {
            nombre: data.nombre,
            email: data.email,
            password: data.password,
            foto: data.foto,
            imagenUno : data.imagenUno
          };
        })
      )
    );
  }
}

