import { Injectable } from '@angular/core';
import { globalProps } from './menu/globalprops';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  showAlert(message: string, ...actions: any[]) {
    setTimeout(() => {
      globalProps.alert.message = message;
      globalProps.alert.actions = actions;
      globalProps.alert.state = true;
    }, 300);
  }

  hideAlert() {
    setTimeout(() => {
      globalProps.alert.state = false;
    }, 300);
  }
}
