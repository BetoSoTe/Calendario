import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonDatetime, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonButton, IonModal, IonButtons, IonItem, IonInput } from '@ionic/angular/standalone';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [IonInput, IonItem, IonButtons, IonModal, IonButton, IonLabel, IonSegmentButton, IonSegment, IonIcon, IonDatetime, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, /*NgCalendarModule*/]
})
export class CalendarPage {
  isModalOpen = false;
  selectedSegment: string = 'mes';
  selectedDate: string = '';
  selectedHourInitial: string = '';
  selectedHourFinal: string = '';
  name: string = ''; clase: string = '';

  constructor() { }

  ngOnInit() {}

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  createEvent() {
    if (this.selectedDate) {
      const eventDate = new Date(this.selectedDate);
      console.log('Evento creado para el día:', eventDate);
      // Aquí puedes manejar la lógica para guardar el evento
    } else {
      console.log('Por favor, selecciona una fecha.');
    }
  }

  confirm() {
    console.log("Clase: ", this.clase);
    console.log("Instructor: ", this.name);
    console.log("Fecha seleccionada: ", this.selectedDate);
    console.log("Hora Inicialseleccionada: ", this.selectedHourInitial);
    console.log("Hora Final seleccionada: ", this.selectedHourFinal)
    this.setOpen(false);
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  reset() {
    this.selectedDate = new Date().toISOString();
    this.clase = '';
    this.name = '';
  }
}
