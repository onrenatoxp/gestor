import { Router } from '@angular/router';
import { MessageService } from './../../services/message.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from 'rxjs';
import { LoadingController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public formGrupo: FormGroup;
 
  data_pesquisa:any;
  dia:any;
  mes:any;
  ano:any;
  horasTotal: any;
  listaMes: any=[];
  isRegistrosDia: boolean=false;

  previsao:number=0;
  saldoMes:String= null;
  saldoDia:String = null;
  horaSaldo:number=0;

  constructor(public formBuilder: FormBuilder,
    private http:HttpClient,
    private router:Router,
    private messageService: MessageService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {

    this.formGrupo = formBuilder.group({
      cpf:[null, Validators.compose([Validators.required])],
      data:[null, Validators.compose([Validators.required])],

    });


  }


  async pesquisar(){

    this.isRegistrosDia = false;

    const loading = await this.loadingCtrl.create({
      message: 'Loading'
    });

    
    await loading.present();

    let data = this.formGrupo.value.data;
    let cpf =  this.formGrupo.value.cpf.replace(/\D+/g, '')

    if(data != null){
      this.data_pesquisa = this.formatarData(this.formGrupo.value.data);
   }

    if(this.TestaCPF(cpf)==false){
      this.presentToast("CPF inválido");
      loading.dismiss();
     }else{


       const $horas = await new Promise(resolve => 
        this.messageService.listarHorasTotal(cpf, this.data_pesquisa).subscribe(data => {
           resolve(data)
         }));
      
         this.horasTotal = $horas;

         const $listaMes = await new Promise(resolve => 
          this.messageService.listarMes(cpf, this.data_pesquisa).subscribe(data => {
             resolve(data)
           }));
        
           this.listaMes = $listaMes;

           if(this.listaMes.length > 0){
                this.previsao = this.listaMes.length * 8;
           }

           this.saldoDia =  this.subtraiHora(this.horasTotal.dia, "08:00:00");
  

           this.saldoMes =  this.subtraiHora(this.horasTotal.mes,  this.previsao + ":00:00");

         if(this.saldoDia !=""){
          this.isRegistrosDia = true;
          this.presentToast("Registros carregados");
           loading.dismiss();
          
          }else{
            
            this.isRegistrosDia = false;
            this.presentToast("Dados não encontrados");
            loading.dismiss();
          }
    
     }

 

  }

  subtraiHora(hrA:any, hrB:any) {
   
    var temp = 0;
    let nova_h = 0;
    let novo_m = 0;
    let novo_s = 0;

    let hora1 = hrA.split(":")[0] * 1;
    let hora2 = hrB.split(":")[0] * 1;
    let minu1 = hrA.split(":")[1] * 1;
    let minu2 = hrB.split(":")[1] * 1;
    let seg1 = hrA.split(":")[2] * 1;
    let seg2 = hrB.split(":")[2] * 1;


    //transformar tudo para milsegundos
    let MilSegIni = hora1 * 3600000 + minu1 * 60000 + seg1*1000;
    let MilSegFim = hora2 * 3600000 + minu2 * 60000 + seg2*1000;

    let MilSegDif = MilSegIni - MilSegFim;
    
    if(MilSegDif < 0){ //inverte  a ordem
    
      temp = seg2 - seg1;
    }else{
      temp = seg1 - seg2;
    
    }

    while(temp < 0) {
      novo_s++;
      temp = temp + 60;
    }
    novo_s = temp.toString().length == 2 ? temp : parseInt("0" + temp);


    if(MilSegDif < 0){ //inverte  a ordem
     
      temp = minu2 - minu1;
    }else{
      temp = minu1 - minu2;
     
    }


    while(temp < 0) {
            nova_h++;
            temp = temp + 60;
    }
    novo_m = temp.toString().length == 2 ? temp : parseInt("0" + temp);

    
    if(MilSegDif < 0){ //inverte  a ordem
      
      temp = hora2 - hora1 - nova_h;
    }else{
      temp = hora1 - hora2 - nova_h; 
      
    }

 
    while(temp < 0) {
            temp = temp + 24;
    }
    nova_h = temp.toString().length == 2 ? temp : parseInt("0" + temp);

    
    return ((MilSegDif < 0 ?'-':'') + nova_h.toString().padStart(2, '0') + ":" + novo_m.toString().padStart(2, '0') + ":" + novo_s.toString().padStart(2, '0'));
}


  formatarData(data:any){

    let dataAbrevidada = data.split("T")[0];
    this.ano = dataAbrevidada.split("-")[0];
    this.mes = dataAbrevidada.split("-")[1];
    this.dia = dataAbrevidada.split("-")[2];

    return this.dia +"-" + this.mes + "-" + this.ano;

  }

  async presentToast(strMsg: string) {
    const toast = await this.toastCtrl.create({
      message:  strMsg,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 2000,
    });
    toast.present();
  }

  openTarefa(item:any){


    this.router.navigate(['/tarefas/', {data: item.dataInicio.replace(/[/"]/g, '-'), cpf:  this.formGrupo.value.cpf.replace(/\D+/g, '')}])
  }

  TestaCPF(strCPF) {
    let Soma:any;;
    let Resto:any;;
    Soma = 0;
      if (strCPF == "00000000000") return false;
        
      for (let i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
      Resto = (Soma * 10) % 11;
      
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
      
      Soma = 0;
        for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;
      
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;

        return true;
    }

}
