import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AutenticacaoService } from '../services/autenticacao.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoGuard implements CanActivate {

  constructor(
    private autenticacaoService: AutenticacaoService,
    private router: Router) { }

  canActivate(): Promise<boolean> {
    return new Promise(resolve => {
      this.autenticacaoService.getAutenticacao().onAuthStateChanged(autenticado => {
        if (!autenticado) this.router.navigate(['login']);

        resolve(autenticado ? true : false);
      })
    })
  }

}
