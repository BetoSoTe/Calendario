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

  addHorario(horario:any){
    return this.http.post<any>(environment.global+'horariosClases', JSON.stringify(horario));
  }

  updateHorario(horario:any){
    return this.http.put<any>(`${environment.global+'horariosClases'}/${horario.id}`, JSON.stringify(horario));
  }

  deleteHorario(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.global+'horariosClases'}/${id}`);
  }
}
