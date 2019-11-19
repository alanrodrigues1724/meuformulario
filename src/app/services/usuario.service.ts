import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../interfaces/usuario';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioColecao: AngularFirestoreCollection<Usuario>;

  constructor(private angularFirestore: AngularFirestore) {
    this.usuarioColecao = this.angularFirestore.collection<Usuario>('Formularios');
  }

  listarFormularios() {
    return this.usuarioColecao.snapshotChanges().pipe(
      map(actions => {
        return actions.map(resultado => {
          const dados = resultado.payload.doc.data();
          const id = resultado.payload.doc.id;

          return { id, ...dados };
        });

      })
    );
  }

  adicionarFormulario(usuario: Usuario) {
    return this.usuarioColecao.add(usuario);
  }

  pegarFormulario(id: string) {
    return this.usuarioColecao.doc<Usuario>(id).valueChanges();
  }

  atualizarFormulario(id: string, usuario: Usuario) {
    return this.usuarioColecao.doc<Usuario>(id).update(usuario);
  }

  excluirFormulario(id: string) {
    return this.usuarioColecao.doc<Usuario>(id).delete();
  }

}
