import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, docData, doc,
  query, where, getDocs, CollectionReference, DocumentData, orderBy, updateDoc
} from '@angular/fire/firestore';
import { Observable, map, from, firstValueFrom, first, of  } from 'rxjs';
import { Administrador } from '../models/Administrador';
import { Especialista } from '../models/Especialista';
import { Paciente } from '../models/Paciente';
import { UsuarioDto } from '../models/UsuarioDto';
import { UserLogData } from '../models/UserLogData';
import { PerfilDto } from '../models/PerfilDto';
import { Turno } from '../models/Turno';
import { Especialidad } from '../models/Especialidad';


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
        obraSocial: paciente.obraSocial, email: paciente.email, password: paciente.password, 
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
      email: especialista.email,
      password: especialista.password,
      foto: especialista.foto,
      habilitado: false,
      tipoUser: 'especialista',
      diasTrabaja: '',
      horaEntrada: '',
      horaSalida: '',
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
        email: administrador.email, password: administrador.password, foto: administrador.foto, tipoUser : 'administrador'
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

  //modificado de paciente a infouser para perfil
  async getAndSaveInfoUserByEmail(email: string): Promise<PerfilDto> {
    try {
      const data = await firstValueFrom(this.getDocDataByEmail(email).pipe(first()));
      if (data) {
        const datosPerfil = new PerfilDto(data.nombre, data.apellido, data.edad, data.dni, data.email, data.password, data.tipoUser, data.habilitado, data.especialidad,
          data.foto, data.obraSocial, data.imagenUno, data.imagenDos);
        return datosPerfil;
      } else {
        throw new Error('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener el tipo de usuario:', error);
      throw error;
    }
  }

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

  async agregarEspecialidad(especialidad: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let c = collection(this.firestore, 'especialidades');
      addDoc(c, {
        nombre : especialidad,
        imagen: 'https://firebasestorage.googleapis.com/v0/b/laboratorioiv-tp2.appspot.com/o/especialidades%2Fdefault.png?alt=media&token=d6161613-0309-4d10-b8c8-d832fa5f3a6b'
      }).then(() => {
        console.log('Especialidad agregada exitosamente en Firestore.');
        resolve(); 
      }).catch((error) => {
        console.error('No se pudo agregar la especialidad. Error: ', error);
        reject(error);
      });
    });
  }

  getEspecialistas(): Observable<Especialista[]> {
    const usersRef = collection(this.firestore, 'usuarios');
    const q = query(usersRef, where('tipoUser', '==', 'especialista'));
    
    return from(getDocs(q)).pipe(
      map(querySnapshot => 
        querySnapshot.docs.map(doc => {
          const data = doc.data() as Especialista;
          return {
            nombre: data.nombre,
            apellido: data.apellido,
            edad: data.edad,
            dni: data.dni,
            email: data.email,
            password: data.password,
            tipoUser: data.tipoUser,
            especialidad: data.especialidad,
            foto: data.foto,
            habilitado: data.habilitado,
            diasTrabaja: data.diasTrabaja,
            horaEntrada: data.horaEntrada,
            horaSalida: data.horaSalida,
          };
        })
      )
    );
  }

  getTurnosOcupadosEspecialistas(email: string): Observable<Turno[]> {
    const usersRef = collection(this.firestore, 'turnos');
    const q = query(usersRef, where('email', '==', email));
    
    return from(getDocs(q)).pipe(
      map(querySnapshot => 
        querySnapshot.docs.map(doc => {
          const data = doc.data() as Turno;
          return {
            paciente: data.paciente,
            especialista: data.especialista,
            especialidad: data.especialidad,
            diagnostico: data.diagnostico,
            reseña: data.reseña,
            estado: data.estado,
            calificacionAtencion: data.calificacionAtencion,
            comentario: data.comentario,
            fecha: data.fecha,
            horario: data.horario,
            encuesta: data.encuesta,
          };
        })
      )
    );
  }

  //modificar para agregar más especialidades correctamente a fb
  async modificarEspecialista(userMail: string, valorHoraEntrada: string, valorHoraSalida:string, especialidad: string) {
    try {
      const col = collection(this.firestore, 'usuarios');
      const q = query(col, where('email', '==', userMail));
      console.log(userMail);

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {   
          horaEntrada : valorHoraEntrada,
          horaSalida: valorHoraSalida,
          especialidad: especialidad});
      } 
    } catch (error) {
      console.error('El especialista no pudo ser actualizado:', error);
      throw error;
    }
  }

  async agregarTurno(turno: Turno): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let c = collection(this.firestore, 'turnos');
      addDoc(c, {
        paciente : turno.paciente, 
        especialista: turno.especialista, 
        especialidad: turno.especialidad,
        estado: turno.estado, 
        fecha: turno.fecha, 
        horario: turno.horario,
      }).then(() => {
        console.log('Turno agregado exitosamente en Firestore.');
        resolve(); 
      }).catch((error) => {
        console.error('No se pudo agregar el Turno. Error: ', error);
        reject(error);
      });
    });
  }
}

