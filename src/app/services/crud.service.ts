import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private angularFirestore: AngularFirestore) {
  }

  getCollection(collection: string) {
    return this.angularFirestore.collection(collection).snapshotChanges();
  }

  createCollection(collection: string, data: any) {
    return this.angularFirestore.collection(collection).add(data);
  }

  getDocument(collection: string, id: string) {
    return this.angularFirestore.doc(`${collection}/${id}`).ref.get();
  }

  getDocumentByParam(collection: string, id: string) {
    return this.angularFirestore.collection(collection, ref => ref.where('userId', '==', id)).snapshotChanges();
  }

  createDocument(collection: string, data: any) {
    return this.angularFirestore.collection(collection).add(data);
  }

  createDocumentWithId(collection: string, id: string, data: any) {
    return this.angularFirestore.collection(collection).doc(id).set(data);
  }

  updateDocument(collection: string, id: string, data: any) {
    return this.angularFirestore.doc(`${collection}/${id}`).update(data);
  }

  deleteDocument(collection: string, id: string) {
    return this.angularFirestore.doc(`${collection}/${id}`).delete();
  }
}
