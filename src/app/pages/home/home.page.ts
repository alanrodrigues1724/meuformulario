import { Component } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private formularios = new Array<Usuario>();
  private formularioSubscription: Subscription;
  private loading: any;

  constructor(   
    private loadingController: LoadingController,
    private toastController: ToastController,
    private autenticacaoService: AutenticacaoService,
    private usuarioService: UsuarioService,) {
    this.formularioSubscription = this.usuarioService.listarFormularios().subscribe(data => {
      this.formularios = data;
    })
  }

  ngOnDestroy() {
    this.formularioSubscription.unsubscribe();
  }

  async logout(){
    try{
      await this.autenticacaoService.logout()
    }catch(error){
      this.presentToast('Não foi possível desconectar')
    }
  }

  async excluirFormulario(id){
    try{
    await this.usuarioService.excluirFormulario(id);
    }catch(error){
      this.presentToast('Erro ao tentar excluir')
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Por favor aguarde...'
    });
    return this.loading.present();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
