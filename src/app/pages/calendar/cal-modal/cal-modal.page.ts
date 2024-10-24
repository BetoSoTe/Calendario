import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-cal-modal',
  templateUrl: './cal-modal.page.html',
  styleUrls: ['./cal-modal.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule]
})
export class CalModalPage {
  selectedDate: string | null = null;
  constructor(private modalController: ModalController) {}

  onDateChange(event: any) {
    const dateValue = event.detail.value; // Captura el valor del evento
    this.selectedDate = this.formatDate(dateValue); // Formatea la fecha
  }

  // Función para formatear la fecha a DD-MM-YYYY
  formatDate(dateString: string): string {
    const date = new Date(dateString); // Convierte a objeto Date
    const day = ('0' + date.getDate()).slice(-2); // Obtiene el día
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Obtiene el mes
    const year = date.getFullYear(); // Obtiene el año
    return `${day}-${month}-${year}`; // Retorna en formato DD-MM-YYYY
  }

  closeModal() {
    this.modalController.dismiss({ selectedDate: this.selectedDate });
  }

}
