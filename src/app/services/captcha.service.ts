import { Injectable } from '@angular/core';
import { ReCaptcha2Component } from 'ngx-captcha';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  constructor() { }

  //const token = await grecaptcha.enterprise.execute('6Ldxh_QpAAAAAONdr7WSeAKb8NfgIqHvTdtpwobl', {action: 'LOGIN'});

  
}
