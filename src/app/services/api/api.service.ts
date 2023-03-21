import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, docData, Firestore, getDoc, getDocs, orderBy, OrderByDirection, query, setDoc, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private firestore:Firestore) { }
  docRef(path){
    return doc(this.firestore, path);
  }
  setDocument(path, data){
    const dataRef=this.docRef(path);
    return setDoc<any>(dataRef,data);
  }
  getDocById(path){
    const dataRef=this.docRef(path);
    return getDoc(dataRef);
  }
  getDocs(path,queryFn?){
    let dataRef:any=this.collectionRef(path);
    if(queryFn){
      const q =query(dataRef,queryFn);
      dataRef=q;
    }
    return getDocs<any>(dataRef);
  }
  addDocument(path, data){
    const dataRef = this.collectionRef(path);
    return addDoc<any>(dataRef,data);
  }
  collectionDataQuery(path,queryFn?){
    let dataRef:any = this.collectionRef(path);
    if(queryFn){
      const q = query(dataRef,queryFn);
      dataRef=q;
    }
    
    const collection_data = collectionData<any>(dataRef,{idField:'id'});
    
    return collection_data;
  }
  collectionRef(path){
    return collection(this.firestore,path); 
  }
  whereQuery(fieldPath,condition,value){
    return where(fieldPath,condition,value);
  }

  orderByQuery(fieldPath,directionStr:OrderByDirection='asc'){
    return orderBy(fieldPath,directionStr);
  }

  docDataQuery(path,id?,queryFn?){
    let dataRef:any=this.docRef(path);
    if(queryFn){
      const q = query(dataRef,queryFn);
      dataRef=q;
    }
    let doc_data;
    if(id) doc_data=docData<any>(dataRef,{idField:'id'});
    else doc_data=docData<any>(dataRef);
    return doc_data;
  }
  

}
