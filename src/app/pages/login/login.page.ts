import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  private loading: any;
  logarUsuario: Usuario = {};
  cadastrarUsuario: Usuario = {};

  constructor(
    private autenticacaoService: AutenticacaoService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    public keyboard: Keyboard
  ) { }

  ngOnInit() {
  }

  segmentChanged(event: any) {
    if (event.detail.value === 'login') {
      this.slides.slidePrev();

    } else {
      this.slides.slideNext();

    }
  }

  async login() {
    try {
      await this.autenticacaoService.login(this.logarUsuario);
    } catch (error) {
      let message: string;
      switch (error.code) {
        case 'auth/wrong-password':
          message = 'Senha incorreta!';
          break;
        case 'auth/user-not-found':
          message = 'Usuário não encontrado!';
          break;
        case 'auth/invalid-email':
          message = 'E-mail inválido!';
          break;
        case 'auth/argument-error':
          message = 'Por favor preencha todos os campos!';
          break;
      }
      this.presentToast(message);
    } finally {
      this.loading.dismiss()
    }
  }

  async cadastrar() {
    await this.presentLoading();

    try {

      await this.autenticacaoService.cadastro(this.cadastrarUsuario);
    } catch (error) {

      let message: string;
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'E-mail sendo usado!';
          break;
        case 'auth/invalid-email':
          message = 'E-mail inválido';
          break;
        case 'auth/argument-error':
          message = 'Por favor preencha todos os campos';
          break;
        case 'auth/weak-password':
          message = 'Sua senha precisa ter 6 ou mais caracteres'
          break;
      }

      this.presentToast(message);
    } finally {
      this.loading.dismiss()
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
