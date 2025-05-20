import { Component, OnInit } from '@angular/core';
import { CheckoutServiceService } from '../checkout-service.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginaServiceService } from '../services/pagina-service.service';
import { Pagina } from '../models/pagina';
import { HttpClient } from '@angular/common/http';
import { MercadoPagoServiceService } from '../services/mercado-pago-service.service';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  formData: any;
  pixOpen = false;
  cartaoOpen = false;
  registroCompleto = false;
  parcelas = [1, 2, 3, 4, 5, 6];
  parcelaSelecionada = 1;
  primeiroNome = '';
  carregandoRegistro = false;
  planoSelecionado: string | null = null;
  valorPlanoSelecionado: number | null = null;

  constructor(private checkoutService: CheckoutServiceService, private router: Router, private paginaService: PaginaServiceService, private http: HttpClient ,private mpService: MercadoPagoServiceService) {}

  ngOnInit(): void {

    this.formData = this.paginaService.getDadosPagina();
    if (!this.formData) {
      // redirecionar ou tratar erro
    }
    this.loadValoresPlanos();
    this.primeiroNome = this.getPrimeiroNome(this.formData.autor);
  }
  
 loadValoresPlanos(){
 
  this.http.get<any>(`http://192.168.159.1:8080/planos/${this.formData.planoSelecionado}`).subscribe((res)=> {
    this.valorPlanoSelecionado = res.preco;
    this.planoSelecionado = res.nome;

  })
 }
  confirmaCompra(){
    this.registroCompleto = true;
  }
  getPrimeiroNome(nome: string){
    return nome.trim().split(' ')[0]
  }

  togglePix() {
    this.pixOpen = !this.pixOpen;
    if (this.pixOpen) this.cartaoOpen = false;
  }

  toggleCartao() {
    this.cartaoOpen = !this.cartaoOpen;
    if (this.cartaoOpen) this.pixOpen = false;
  }
  revisar(){
    this.router.navigate(['/criarCarta'])
  }
  registrarPagina(){
    console.log(this.formData)
  this.carregandoRegistro = true;
  this.http.post<Pagina>('http://localhost:8080/paginas', this.formData)
    .subscribe((res) => {
      console.log("pagina registrada com sucesso"+res)
      this.registroCompleto = true;
      this.carregandoRegistro = false
    }, (err) => {
      alert('Erro ao registrar página:' + err);
    })
}
cardData = {
    cardNumber: '',
    cardholderName: '',
    expirationMonth: '',
    expirationYear: '',
    securityCode: '',
    identificationType: 'CPF',
    identificationNumber: '',
    email: '',
    validade: '',
  };

pagarCartao() {
    this.carregandoRegistro = true;

    const cardPaymentDTO = {
      transactionAmount: this.valorPlanoSelecionado,
      description: "Página Personalizada LoveLink",
      installments: 1,
      paymentMethodId: 'visa', // ajuste conforme o método identificado
      payer: {
        email: this.cardData.email,
        identification: {
          type: this.cardData.identificationType,
          number: this.cardData.identificationNumber,
        },
      },
      token: '',
    };
    const [month, year] = this.cardData.validade.split('/');
     this.cardData.expirationMonth = month;
      this.cardData.expirationYear = '20' + year; 
     const cardTokenData = {
      cardNumber: this.cardData.cardNumber,
      cardholderName: this.cardData.cardholderName,
      expirationMonth: this.cardData.expirationMonth,
      expirationYear: this.cardData.expirationYear,
      securityCode: this.cardData.securityCode,
      identificationType: this.cardData.identificationType,
      identificationNumber: this.cardData.identificationNumber,
      email: this.cardData.email,
    };
    this.mpService.generateCardToken(cardTokenData).then(
      (tokenResponse: any) => {
        cardPaymentDTO.token = tokenResponse.id;
        this.mpService.payWithCard(cardPaymentDTO).subscribe(
          (res) => {
            this.carregandoRegistro = false;
            alert('Pagamento aprovado! ID: ');
          },
          (err) => {
            this.carregandoRegistro = false;
            alert('Erro no pagamento: ' + err.message);
          }
        );
      },
      (err) => {
        this.carregandoRegistro = false;
        alert('Erro ao gerar token do cartão: ' + err.message);
      }
    );
  }
    
}



