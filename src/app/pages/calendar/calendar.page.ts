import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonDatetime, IonIcon } from '@ionic/angular/standalone';
import { NgCalendarModule, CalendarMode } from 'ionic2-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [IonIcon, IonDatetime, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NgCalendarModule]
})
export class CalendarPage implements OnInit {
  eventSource = []; // Aquí puedes cargar eventos desde tu servicio o agregar eventos manualmente
  calendarMode: CalendarMode = 'month'; // Puedes cambiar entre 'month', 'week' y 'day'
  currentDate: Date = new Date();

  constructor() { }

  ngOnInit() {}

  onEventSelected(event: any) { // Usa `any` si no estás seguro del tipo
    console.log('Evento seleccionado:', event);
    // Aquí puedes mostrar detalles del evento seleccionado
  }

  onDateChanged(event: any) {
    this.currentDate = new Date(event.detail.value); // Cambia la fecha actual
    console.log('Fecha seleccionada:', this.currentDate);
  }
}
