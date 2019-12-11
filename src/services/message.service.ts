import { ConstantsService } from './constants.service';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http:HttpClient, 
    public global: ConstantsService) {

    
   }

   autenticar(usuario: string, senha: string) {
  

   const httpOptions = {
      headers: new HttpHeaders({ 
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
        'Content-Type':'application/json',
      })
    };

    
    const url =  this.global.API_ENDPOINT + 'usuario/autenticar/' + usuario + '/' + senha ;
    return this.http.post(url, httpOptions).pipe(res => res);

  }

  listarHorasTotal(cpf:any, data:any){

    const url =  this.global.API_ENDPOINT + 'consulta/dia/' + cpf + '/' + data ;
    return this.http.get(url).pipe(res => res);

  }

  listarMes(cpf:any, data:any){

    const url =  this.global.API_ENDPOINT + 'consulta/listagem/mes/' + cpf + '/' + data ;
    return this.http.get(url).pipe(res => res);

  }

  listarTarefasDia(cpf:any, data:any){

    const url =  this.global.API_ENDPOINT + 'consulta/listagem/dia/' + cpf + '/' + data ;
    return this.http.get(url).pipe(res => res);

  }


  public encodedString(token: any){
     let arrayTojken = JSON.stringify(token);
     return btoa(arrayTojken)
  }

  public decodedString (arrayToken: string){
    let arrayOfStrings = JSON.parse(atob(arrayToken));
    return  arrayOfStrings;

  }
  
}
