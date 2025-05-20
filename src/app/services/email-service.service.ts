import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {
  private baseUrl = 'http://localhost:8080/api/email';
  constructor(private http: HttpClient) { }

  enviarCodigo(email: string) {
    return this.http.post(`${this.baseUrl}/enviar-codigo`, { email });
  }

  validarCodigo(email: string, codigo: string) {
    return this.http.post(`${this.baseUrl}/validar-codigo`, { email, codigo });
  }
}
