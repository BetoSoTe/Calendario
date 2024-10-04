import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Class } from '../models/class';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor(private http: HttpClient) { }

  getClasses():Observable<Class[]>{
    return this.http.get<Class[]>('assets/files/classes.json'); 
  }
}
