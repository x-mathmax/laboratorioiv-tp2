import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  setUserAndPassTest(username:string, password:string): void {
    localStorage.setItem('username', JSON.stringify(username));
    localStorage.setItem('password', JSON.stringify(password));
  }

  executePopUp(mensaje : string):void {
    Swal.fire({
      title: mensaje,
      width: 600,
      padding: "3em",
      color: "#000",
      background: "#fff url(/assets/swalBackground.jpg)",
      backdrop: `
        rgba(0,0,0,0.6)
      `,
      customClass: {
        confirmButton: 'custom-confirm-button-class'
      },
      confirmButtonColor: '#285E96',
      confirmButtonText: 'Aceptar'
    });
  }

  separoString(input: string): string[] {
    return input.split(',').map(campo => campo.trim());
  }

  async executePopupWithInputCancel(): Promise<string | null> {
    const { value: comentario } = await Swal.fire({
      title: 'Motivo de cancelación',
      input: 'textarea',
      inputLabel: 'Escribe un breve comentario',
      inputPlaceholder: 'Escribe tu comentario aquí...',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    });

    if (comentario) {
      return comentario;
    } else if (comentario === '') {
      Swal.fire('Error', 'El comentario no puede estar vacío', 'error');
    }
    
    return null;
  }

  async executePopupWithCalificacion(): Promise<string | null> {
    const { value: comentario } = await Swal.fire({
      title: 'Califique su atención',
      input: 'textarea',
      inputLabel: 'Escriba una breve calificación',
      inputPlaceholder: 'Escribe tu comentario aquí...',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    });

    if (comentario) {
      return comentario;
    } else if (comentario === '') {
      Swal.fire('Error', 'La calificación no puede estar vacía', 'error');
    }
    return null;
  }


//Encuesta estrellitas
  showRatingPopup(): Promise<number | null> {
    return Swal.fire({
      title: 'Califica este elemento',
      html: this.getRatingHtml(),
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      didOpen: () => {
        this.initStarRating();
      },
      preConfirm: () => {
        const selectedStars = document.querySelectorAll('#stars i.selected').length;
        return selectedStars;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        return result.value;
      } else {
        return null;
      }
    });
  }

  private getRatingHtml(): string {
    return `
      <div id="stars">
        ${Array(5).fill('<i class="fa fa-star" aria-hidden="true" style="cursor:pointer;"></i>').join(' ')}
      </div>
      <style>
        #stars i {
          font-size: 2rem;
          color: gray;
        }
        #stars i.selected {
          color: #c79924;
        }
      </style>
    `;
  }

  private initStarRating(): void {
    document.querySelectorAll('#stars i').forEach((star, index) => {
      star.addEventListener('click', () => {
        document.querySelectorAll('#stars i').forEach((s, i) => {
          if (i <= index) {
            s.classList.add('selected');
          } else {
            s.classList.remove('selected');
          }
        });
      });
    });
  }

  //pup diagnostico - reseña
  showDiagnosisPopup(): Promise<{ diagnostico: string; resenia: string } | null> {
    return Swal.fire({
      title: 'Ingrese Diagnóstico y Reseña',
      html: `
        <label for="diagnostico">Diagnóstico:</label>
        <input id="diagnostico" class="swal2-input">
        <label for="resenia">Reseña:</label>
        <input id="resenia" class="swal2-input">
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      preConfirm: () => {
        const diagnostico = (document.getElementById('diagnostico') as HTMLInputElement).value;
        const resenia = (document.getElementById('resenia') as HTMLInputElement).value;
        if (!diagnostico || !resenia) {
          Swal.showValidationMessage('Por favor, ingrese tanto el diagnóstico como la reseña.');
          return null;
        }
        return { diagnostico, resenia };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        return result.value;
      } else {
        return null;
      }
    });
  }

  getUser():boolean {
    const userData = localStorage.getItem('username');
    return userData ? JSON.parse(userData) : null;
}
}
