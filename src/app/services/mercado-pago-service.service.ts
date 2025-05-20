import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var MercadoPago: any;
@Injectable({
  providedIn: 'root'
})
export class MercadoPagoServiceService {
  mp: any;
   constructor(private http: HttpClient) {
    this.mp = new MercadoPago('TEST-4680fad6-5fa1-46f2-b9e7-7068baa77e08', {
      locale: 'pt-BR',
    });
  }
   generateCardToken(cardData: any) {
    return new Promise((resolve, reject) => {
      this.mp.createCardToken(cardData).then((response: any) => {
        if (response.error) {
          reject(response);
        } else {
          resolve(response);
        }
      });
    });
  }
  payWithCard(cardPaymentDTO: any) {
    return this.http.post('http://localhost:8080/api/payment/card', cardPaymentDTO);
  }
}
