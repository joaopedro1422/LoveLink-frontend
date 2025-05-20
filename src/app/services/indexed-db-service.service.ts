import { Injectable } from '@angular/core';
import { openDB } from 'idb';
@Injectable({
  providedIn: 'root'
})
export class IndexedDbServiceService {

  private dbPromise = openDB('AppDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('form')) {
        db.createObjectStore('form');
      }
    }
  });

  async saveForm(form: any) {
    const db = await this.dbPromise;
    await db.put('form', form, 'dadosCadastro');
  }

  async getForm() {
    const db = await this.dbPromise;
    return db.get('form', 'dadosCadastro');
  }

  async clearForm() {
    const db = await this.dbPromise;
    return db.delete('form', 'dadosCadastro');
  }
}
