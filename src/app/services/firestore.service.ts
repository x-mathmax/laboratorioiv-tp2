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
import { HistoriaClinica } from '../models/HistoriaClinica';


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
          data.foto, data.obraSocial, data.imagenUno, data.imagenDos, data.horaEntrada, data.horaSalida, data.diasTrabaja);
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
            nombrePaciente: data.nombrePaciente,
            especialista: data.especialista,
            nombreEspecialista: data.nombreEspecialista,
            especialidad: data.especialidad,
            diagnostico: data.diagnostico,
            resenia: data.resenia,
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

  getTurnosPorPaciente(email: string): Observable<Turno[]> {
    const usersRef = collection(this.firestore, 'turnos');
    const q = query(usersRef, where('paciente', '==', email));
    
    return from(getDocs(q)).pipe(
      map(querySnapshot => 
        querySnapshot.docs.map(doc => {
          const data = doc.data() as Turno;
          return {
            paciente: data.paciente,
            nombrePaciente: data.nombrePaciente,
            especialista: data.especialista,
            nombreEspecialista: data.nombreEspecialista,
            especialidad: data.especialidad,
            diagnostico: data.diagnostico,
            resenia: data.resenia,
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

  getTurnosPorEspecialista(email: string): Observable<Turno[]> {
    const usersRef = collection(this.firestore, 'turnos');
    const q = query(usersRef, where('especialista', '==', email));
    
    return from(getDocs(q)).pipe(
      map(querySnapshot => 
        querySnapshot.docs.map(doc => {
          const data = doc.data() as Turno;
          return {
            paciente: data.paciente,
            nombrePaciente: data.nombrePaciente,
            especialista: data.especialista,
            nombreEspecialista: data.nombreEspecialista,
            especialidad: data.especialidad,
            diagnostico: data.diagnostico,
            resenia: data.resenia,
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

  async agregarTurno(turno: Turno): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let c = collection(this.firestore, 'turnos');
      addDoc(c, {
        paciente : turno.paciente, 
        nombrePaciente: turno.nombrePaciente,
        especialista: turno.especialista, 
        nombreEspecialista: turno.nombreEspecialista,
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

  async toggleTurnoFinalizar(turno: Turno, estado: string, diagnostico: string, resenia:string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const col = collection(this.firestore, 'turnos');
      const q = query(col, where('paciente', '==', turno.paciente),
      where('especialista', '==', turno.especialista),
      where('horario', '==', turno.horario),
      where('fecha', '==', turno.fecha));
      console.log('Valor de turno.', q);

      getDocs(q)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          return updateDoc(docRef, {
            estado: estado,
            diagnostico: diagnostico,
            resenia: resenia
          });
        } else {
          throw new Error('No se encontró el turno.');
        }
      })
      .then(() => {
        console.log('Turno actualizado exitosamente en Firestore.');
        resolve();
      })
      .catch((error) => {
        console.error('No se pudo actualizar el turno. Error:', error);
        reject(error);
      });
  });
  }

  async toggleTurno(turno: Turno, propiedad: string, newValue: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const col = collection(this.firestore, 'turnos');
      const q = query(col, where('paciente', '==', turno.paciente),
      where('especialista', '==', turno.especialista),
      where('horario', '==', turno.horario),
      where('fecha', '==', turno.fecha));
      console.log('Valor de turno.', q);

      getDocs(q)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          return updateDoc(docRef, {
            [propiedad]: newValue
          });
        } else {
          throw new Error('No se encontró el turno.');
        }
      })
      .then(() => {
        console.log('Turno actualizado exitosamente en Firestore.');
        resolve();
      })
      .catch((error) => {
        console.error('No se pudo actualizar el turno. Error:', error);
        reject(error);
      });
  });
  }

  async toggleEspecialista(userMail: string, valorHoraEntrada: string, valorHoraSalida:string, especialidad: string, diasTrabaja: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const col = collection(this.firestore, 'usuarios');
      const q = query(col, where('email', '==', userMail));
      console.log('Valor de especialista.', q);

      getDocs(q)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          return updateDoc(docRef, {
            horaEntrada : valorHoraEntrada,
            horaSalida: valorHoraSalida,
            especialidad: especialidad,
            diasTrabaja: diasTrabaja
          });
        } else {
          throw new Error('No se encontró el especialista.');
        }
      })
      .then(() => {
        console.log('Especialista actualizado exitosamente en Firestore.');
        resolve();
      })
      .catch((error) => {
        console.error('No se pudo actualizar el especialista. Error:', error);
        reject(error);
      });
  });
  }


  getPacientes(): Observable<Paciente[]> {
    const usersRef = collection(this.firestore, 'usuarios');
    const q = query(usersRef, where('tipoUser', '==', 'paciente'));
    
    return from(getDocs(q)).pipe(
      map(querySnapshot => 
        querySnapshot.docs.map(doc => {
          const data = doc.data() as Paciente;
          return {
            nombre: data.nombre,
            apellido: data.apellido,
            edad: data.edad,
            dni: data.dni,
            email: data.email,
            password: data.password,
            tipoUser: data.tipoUser,
            obraSocial: data.obraSocial,
            imagenUno: data.imagenUno,
            imagenDos: data.imagenDos
          };
        })
      )
    );
  }

  async agregarHC(hc: HistoriaClinica, campoUno: string, campoDos: string, campoTres: string, propiedadUno: string, propiedadDos: string, propiedadTres: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let c = collection(this.firestore, 'historiasclinicas');
      let data: any = {
        nombrePaciente: hc.nombrePaciente,
        emailPaciente: hc.emailPaciente,
        nombreEspecialista: hc.nombreEspecialista,
        emailEspecialista: hc.emailEspecialista,
        fechaTurno: hc.fechaTurno,
        especialidad: hc.especialidad,
        diagnostico: hc.diagnostico,
        altura: hc.altura,
        peso: hc.peso,
        temperatura: hc.temperatura,
        presion: hc.presion,
      };

      if (campoUno && propiedadUno) {
        data[propiedadUno] = campoUno;
      }
      if (campoDos && propiedadDos) {
        data[propiedadDos] = campoDos;
      }
      if (campoTres && propiedadTres) {
        data[propiedadTres] = campoTres;
      }

      addDoc(c, data)
        .then(() => {
          console.log('Historia Clínica agregada exitosamente en Firestore.');
          resolve();
        })
        .catch((error) => {
          console.error('No se pudo agregar la historia clínica. Error: ', error);
          reject(error);
        });
    });
  }

  getHcFiltrado(email: string, user: string): Observable<any[]> {
    const usersRef = collection(this.firestore, 'historiasclinicas') as CollectionReference<DocumentData>;
    const q = query(usersRef, where(user, '==', email));
    
    return new Observable<any[]>(observer => {
      getDocs(q)
        .then(snapshot => {
          if (snapshot.empty) {
            observer.next([]); // Si no coincide devuelvo array vacio
          } else {
            const docs = snapshot.docs.map(doc => {
              const data = doc.data();
              const id = doc.id;
              return { id, ...data }; // Armo doc con sus datos.
            });
            observer.next(docs); //modifique para devolver un array
          }
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  agregarLogUsuarios(email : string) : void{
    try{
      let c = collection(this.firestore, 'logs');
      addDoc(c, { email: email, fecha: new Date()});
    }catch(error){
      console.error('No se pudo agregar el log. Error: ', error);
    }
  }

  getTurnosFinalizadosEsp(especialistaMail: string): Observable<Turno[]> {
    const usersRef = collection(this.firestore, 'turnos');
    const q = query(usersRef, where('especialista', '==', especialistaMail),
    where('estado', '==', 'finalizado'),);
    
    return from(getDocs(q)).pipe(
      map(querySnapshot => 
        querySnapshot.docs.map(doc => {
          const data = doc.data() as Turno;
          return {
            paciente: data.paciente,
            nombrePaciente: data.nombrePaciente,
            especialista: data.especialista,
            nombreEspecialista: data.nombreEspecialista,
            especialidad: data.especialidad,
            diagnostico: data.diagnostico,
            resenia: data.resenia,
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

}
