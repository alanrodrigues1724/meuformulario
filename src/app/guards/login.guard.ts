import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacaoService } from '../services/autenticacao.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
  private autenticacaoService: AutenticacaoService,
  private router: Router
  ){}

  canActivate(): Promise<boolean>{
    return new Promise(resolve => {
      this.autenticacaoService.getAutenticacao().onAuthStateChanged(autenticado => {
        if(autenticado) this.router.navigate(['home']);

        resolve(!autenticado ? true : false);
      });
    });
  }
  
}
