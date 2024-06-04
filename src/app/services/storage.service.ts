import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { finalize, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  uploadImage(file: File) {
    const filePath = `movies/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return from(new Promise<string>((resolve, reject) => {
      uploadTask.on('state_changed',
        () => { },  
        error => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => resolve(downloadURL));
        }
      );
    }));
  }
}
