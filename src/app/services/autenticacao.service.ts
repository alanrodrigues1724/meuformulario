import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  constructor(public autenticaFirebase: AngularFireAuth) { }

  login(usuario: Usuario) {
    return this.autenticaFirebase.auth.signInWithEmailAndPassword(usuario.email, usuario.senha);
  }

  cadastro(usuario: Usuario) {
    return this.autenticaFirebase.auth.createUserWithEmailAndPassword(usuario.email, usuario.senha);
  }

  logout() {
    return this.autenticaFirebase.auth.signOut();
  }

  getAutenticacao() {
    return this.autenticaFirebase.auth;
  }
}
