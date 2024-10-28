import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
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
export class CalModalPage implements OnInit {
  @Input() typeOfTimeSelection?: string;
  @Input() selectedTimeInitial?: string
  selectedDate: string | null | undefined = null;
  selectedHour: string | null = null;
  isTimeSelected: boolean = false;
  constructor(private modalController: ModalController) {}

  ngOnInit(){
    if (this.selectedTimeInitial){
      this.isTimeSelected = true
      this.setSelectedTimeInitial()
    } 
    console.log(this.selectedHour)
  }
  setSelectedTimeInitial(){
    switch(this.typeOfTimeSelection){
      case 'selectedDateInitial': this.selectedDate = this.formatDate(this.selectedTimeInitial);
      break;
      case 'selectedDateFinal': this.selectedDate = this.formatDate(this.selectedTimeInitial);
      break;
      case 'selectedHourInitial': this.selectedHour = this.selectedTimeInitial!;
      break;
      case 'selectedHourFinal': this.selectedHour =this.selectedTimeInitial!;
      break;
      default:
    }
  }

  onDateChange(event: any) {
    this.isTimeSelected = true
    let dateValue = event.detail.value; // Captura el valor del evento
    if(!this.selectedDate) {
      if(this.typeOfTimeSelection === 'selectedDateInitial' || this.typeOfTimeSelection === 'selectedDateFinal') dateValue = dateValue.split('T')[0]
    }
    if(!this.selectedHour) {
      if(this.typeOfTimeSelection === 'selectedHourInitial' || this.typeOfTimeSelection === 'selectedHourFinal') this.selectedHour = this.formatHour(dateValue);
    }else{
      this.selectedHour = dateValue;
    }
    // if(this.selectedDate){}
    this.selectedDate = this.formatDate(dateValue); // Formatea la fecha
    
    console.log(this.selectedHour)
  }

  // Función para formatear la fecha a DD-MM-YYYY
  formatDate(dateString?: string): string { 
    // Divide la fecha en componentes
    const [year, month, day] = dateString!.split('-').map(Number);
    // Crea un nuevo objeto Date en UTC
    const date = new Date(Date.UTC(year, month - 1, day));
    const formattedDay = ('0' + date.getUTCDate()).slice(-2); // Obtiene el día en UTC
    const formattedMonth = ('0' + (date.getUTCMonth() + 1)).slice(-2); // Obtiene el mes en UTC
    const formattedYear = date.getUTCFullYear(); // Obtiene el año en UTC

    return `${formattedYear}-${formattedMonth}-${formattedDay}`; // Retorna en formato YYYY-MM-DD
}

// formatDate(dateString: string): string {
//   const date = new Date(dateString); // Convierte a objeto Date
//   const day = ('0' + date.getDate()).slice(-2); // Obtiene el día
//   const month = ('0' + (date.getMonth() + 1)).slice(-2); // Obtiene el mes
//   const year = date.getFullYear(); // Obtiene el año
//   return `${year}-${month}-${day}`; // Retorna en formato YYYY-MM-DD
// }


  formatHour(dateString?: string): string {
    console.log(dateString);
    const date = new Date(dateString!)
    const hours = (date.getHours())
    const hour = (hours< 10)? '0'+ hours : ''+ hours
    const minutes = (date.getMinutes())
    const minute = (minutes< 10)? '0'+ minutes : ''+ minutes
    return `${hour}:${minute}`
  }
  onConfirmar(){
    console.log(this.selectedHour)
    this.modalController.dismiss({  
      selectedDate: this.selectedDate, 
      typeOfTimeSelection:this.typeOfTimeSelection, 
      selectedHour: this.selectedHour,
      isTimeSelected: this.isTimeSelected
     });
  }
  closeModal() {
    this.isTimeSelected = false
    this.modalController.dismiss({isTimeSelected: this.isTimeSelected})
  }

}
