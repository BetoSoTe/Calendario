import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Class } from '../models/class';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  classes: any = [];

  constructor(private http: HttpClient) { }

  getClasses():Observable<Class[]>{
    return this.http.get<Class[]>(environment.global);
  }

  addClass(clase:any){
    return this.http.post<any>(environment.global, JSON.stringify(clase));
  }

  updateClass(clase:any){
    return this.http.put<any>(`${environment.global}/${clase.id}`, JSON.stringify(clase));
  }

  deleteClass(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.global}/${id}`);
  }
}
