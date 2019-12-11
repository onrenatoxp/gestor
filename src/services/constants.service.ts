import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

 // public API_ENDPOINT: 'http://127.0.0.1:8000/';
  //public API_ENDPOINT: string = 'http://192.168.0.8:8000/';
  public API_ENDPOINT: string = 'https://desenvolvimento.tjma.jus.br/gestorapi/';
 //public API_ENDPOINT: string = 'http://192.168.25.36:8000/';
   

   public API_CEP: string = 'http://viacep.com.br/ws/';

   public TOTAL_DESAFIO_TAREFA = 10;
   public PESO_MEDALHA_BONZE = 1;
   public PESO_MEDALHA_PRATA = 2;
   public PESO_MEDALHA_OURO = 4;


  constructor() { }
}
