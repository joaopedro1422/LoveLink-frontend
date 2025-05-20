import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginaServiceService {
  private dadosPagina: any = null;

  setDadosPagina(dados: any){
    this.dadosPagina = dados;
  }

  getDadosPagina(){
    return this.dadosPagina;
  }

  clearDadosPagina(){
    this.dadosPagina = null;
  }
}
