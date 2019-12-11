import { LoadingController, ToastController } from '@ionic/angular';
import { MessageService } from './../../services/message.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tarefas',
  templateUrl: './tarefas.page.html',
  styleUrls: ['./tarefas.page.scss'],
})
export class TarefasPage implements OnInit {

  tarefas:any=[];

  data: any;

  constructor(
    private messageService: MessageService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public route: ActivatedRoute
  ) { 

    let cpf = this.route.snapshot.paramMap.get('cpf');
    let data =  this.route.snapshot.paramMap.get('data');

    this.data = data.replace(/[-"]/g, '/')
    

    this.carregarLista(cpf, data);


  }

  ngOnInit() {
  }


  async carregarLista(cpf:any, data:any){

    
    const loading = await this.loadingCtrl.create({
      message: 'Loading'
    });

    
    await loading.present();
 
 

      const $tarefas = await new Promise(resolve => 
        this.messageService.listarTarefasDia(cpf, data).subscribe(data => {
           resolve(data)
         }));

         console.log($tarefas)
      
          this.tarefas = $tarefas;

         if(this.tarefas.length > 0){
          
          this.presentToast("Registros carregados");
           loading.dismiss();
 
           
          
     }else{
      
 
      this.presentToast("Dados não encontrados");
      loading.dismiss();
     }
    
     
  }

  async presentToast(strMsg: string) {
    const toast = await this.toastCtrl.create({
      message:  strMsg,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 3000,
    });
    toast.present();
  }

}
