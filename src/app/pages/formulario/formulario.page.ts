import { Component, OnInit } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Usuario } from 'src/app/interfaces/usuario';
import { Subscription } from 'rxjs';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.page.html',
  styleUrls: ['./formulario.page.scss'],
})
export class FormularioPage implements OnInit {
  public formulario: Usuario = {};
  private loading: any;
  public latLon: any;
  private formularioId: string = null;
  private formularioSubscription: Subscription;
  ngOnInit(): void {
    this.pegarLocalizacao();
    
  }

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private navCtrl: NavController,
    private autenticacaoService: AutenticacaoService,
    private usuarioService: UsuarioService,
    private activeRoute: ActivatedRoute,
    private emailComposer: EmailComposer,
    private geolocation: Geolocation) {
    this.formularioId = this.activeRoute.snapshot.params['id'];

    if (this.formularioId) this.carregarFormulario()

  }

  carregarFormulario() {
    this.formularioSubscription = this.usuarioService.pegarFormulario(this.formularioId).subscribe(data => {
      this.formulario = data;
    });
  }



  pegarLocalizacao() {
    this.geolocation.getCurrentPosition().then((resp) => {

      this.latLon = resp.coords.latitude + ',' + resp.coords.longitude
    }).catch((error) => {
      this.presentToast('Não foi possível pegar a localização');
    });
  }

  
  async enviarEmail(local) {
    let email = {
      to: 'alanskt821@gmail.com',
      subject: 'Dados dos formulários',
      body: 'Nome: ' + this.formulario.nome +"\n"+
      ' Telefone: ' + this.formulario.telefone +"\n"+
      ' E-mail:' + this.formulario.email+"\n"+
      ' Localização: http://maps.google.com/maps?q=' + local, 
      isHtml: true,
      app: "Gmail"
    }

    this.emailComposer.open(email);
 }

  async enviarFormulario() {
    await this.presentLoading();

    this.formulario.usuarioId = this.autenticacaoService.getAutenticacao().currentUser.uid;
    this.formulario.localizacao = this.latLon;
    if (this.formularioId) {
      try {
        this.formulario.localizacao = this.latLon;
        this.enviarEmail(this.latLon);
        await this.usuarioService.atualizarFormulario(this.formularioId, this.formulario);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
        this.presentToast('Formulário atualizado com sucesso');
      } catch (error) {
        this.presentToast('Erro ao tentar salvar');
        this.loading.dismiss();

      }
    } else {
      try {

        this.formulario.localizacao = this.latLon;
        this.enviarEmail(this.latLon);
        await this.usuarioService.adicionarFormulario(this.formulario);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
        this.presentToast('Formulário salvo com sucesso');
        
      
      } catch (error) {

        this.presentToast('Erro ao tentar salvar');
        this.loading.dismiss();

      }
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
