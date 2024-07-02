import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { DataService } from '../services/data.service';


export const authGuard: CanActivateFn = (route, state) => {
  const data = inject(DataService);

  if(data.getUser()) {
    console.log("Puede ingresar ya que está logueado");
    return true;
  }
  console.log("No puede ingresar ya que no está logueado.");
  return false;
};
