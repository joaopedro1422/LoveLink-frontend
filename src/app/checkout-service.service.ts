import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutServiceService {
   private formDataSource = new BehaviorSubject<any>(null);
  constructor() { }
  setData(data: any) {
    this.formDataSource.next(data);
    localStorage.setItem('checkout_data', JSON.stringify(data)); // fallback
  }

  getData(): any {
    const current = this.formDataSource.value;
    if (current) return current;

    const stored = localStorage.getItem('checkout_data');
    return stored ? JSON.parse(stored) : null;
  }

  clearData() {
    this.formDataSource.next(null);
    localStorage.removeItem('checkout_data');
  }
}
