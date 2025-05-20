import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private dadosFormulario: any = null;

  setDados(dados: any) {
    this.dadosFormulario = dados;
  }

  getDados() {
    return this.dadosFormulario;
  }

  limparDados() {
    this.dadosFormulario = null;
  }
}