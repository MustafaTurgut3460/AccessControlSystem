import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  apiUrl = "http://localhost:5000"

  // get methods
  getErisimKayitlari():Observable<any>
  {
    return this.http.get(`${this.apiUrl}/erisim-kayitlari`)
  }

  getErisimNoktalari():Observable<any>
  {
    return this.http.get(`${this.apiUrl}/erisim-noktalari`)
  }

  getKartlar():Observable<any>
  {
    return this.http.get(`${this.apiUrl}/kartlar`);
  }

  getDashboard():Observable<any>
  {
    return this.http.get(`${this.apiUrl}`);
  }

  getIstatistikler():Observable<any>
  {
    return this.http.get(`${this.apiUrl}/istatistikler`)
  }

  // add methods

  addErisimNoktasi(data:any):Observable<any>
  {
    return this.http.post(`${this.apiUrl}/erisim-noktalari/ekle`, data);
  }

  addKart(data:any):Observable<any>
  {
    return this.http.post(`${this.apiUrl}/kartlar/ekle`, data);
  }

  // delete methods

  deleteErisimKayit(id:any):Observable<any>
  {
    return this.http.delete(`${this.apiUrl}/erisim-kayitlari/delete/${id}`)
  }

  deleteErisimNoktasi(id:any):Observable<any>
  {
    return this.http.delete(`${this.apiUrl}/erisim-noktalari/delete/${id}`)
  }

  deleteKart(id:any):Observable<any>
  {
    return this.http.delete(`${this.apiUrl}/kartlar/delete/${id}`)
  }

  // search methods

  searchErisimKayit(data:any):Observable<any>
  {
    return this.http.post(`${this.apiUrl}/erisim-kayitlari`, data)
  }

  searchErisimNoktasi(data:any):Observable<any>
  {
    return this.http.post(`${this.apiUrl}/erisim-noktalari`, data)
  }

  searchKart(data:any):Observable<any>
  {
    return this.http.post(`${this.apiUrl}/kartlar`, data)
  }

  // update

  getSingleData(id:any):Observable<any>
  {
    return this.http.get(`${this.apiUrl}/erisim-noktalari/update/${id}`);
  }

  updateErisimNoktasi(id:any, data:any):Observable<any>
  {
    return this.http.post(`${this.apiUrl}/erisim-noktalari/update/${id}`, data);
  }

  getDataUpdateCard(id:any):Observable<any>
  {
    return this.http.get(`${this.apiUrl}/kartlar/update/${id}`)
  }

  updateCard(id:any, data:any):Observable<any>
  {
    return this.http.put(`${this.apiUrl}/kartlar/update/${id}`, data)
  }

}
