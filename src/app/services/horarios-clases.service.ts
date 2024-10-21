import { Injectable } from '@angular/core';
import { HorarioClase } from '../models/horarioClase';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HorariosClasesService {

  constructor(private http: HttpClient) { }

  getHorarios():Observable<HorarioClase[]>{
    return this.http.get<HorarioClase[]>(environment.global+'horariosClases');
  }
}
