import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonDatetime, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonButton, IonModal, IonButtons, IonItem, IonInput, IonList, IonText } from '@ionic/angular/standalone';
import { createCalendar, createViewWeek, createViewDay, createViewMonthGrid, viewMonthGrid, CalendarEvent} from "@schedule-x/calendar";
import { CalendarComponent } from "@schedule-x/angular";
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls'
import { createScrollControllerPlugin } from '@schedule-x/scroll-controller'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { HorariosClasesService } from 'src/app/services/horarios-clases.service';
import { HorarioClase } from 'src/app/models/horarioClase';
import { ClassService } from 'src/app/services/class.service';
import { Class } from 'src/app/models/class';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonText, IonList, IonInput, IonItem, IonButtons, IonModal, IonButton, IonLabel, IonSegmentButton, IonSegment, IonIcon, IonDatetime, 
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,CalendarComponent /*NgCalendarModule*/]
})
export class CalendarPage {
  selectedSegment: string = 'mes';
  allClasses: Class[] = [];

  //-----Modal
  isModalOpen = false;
  selectedDateInitial: string = '';
  selectedDateFinal: string = '';
  selectedHourInitial: string = '';
  selectedHourFinal: string = '';
  name: string = ''; clase: string = '';
  selectedHorario?: HorarioClase;
  selectedClaseHorario?: Class;

  //---Calendario
  horariosClases: HorarioClase[] = [];
  events: any[] = [];
  selectedDateTime: string = '';
  calendarControls = createCalendarControlsPlugin();
  scrollController = createScrollControllerPlugin({initialScroll: '00:01'})
  eventsServicePlugin = createEventsServicePlugin();
  eventModal = createEventModalPlugin();

  calendar = createCalendar({
    isDark: true,
    events: this.events,
    defaultView: viewMonthGrid.name,
    views: [createViewMonthGrid(),createViewWeek(),createViewDay()],
    locale: 'es-ES',
    monthGridOptions: {
      nEventsPerDay: 5
    },
    plugins: [this.calendarControls, this.scrollController, this.eventsServicePlugin,this.eventModal],
    callbacks: {
      onDoubleClickDateTime: (dateTime) => {
        this.selectedDateTime = dateTime; // Guarda la fecha seleccionada
        //this.createEvent(); // Llama a la función dentro del componente
        this.setOpen(true); // Lógica para abrir el modal o diálogo
      },
      onDoubleClickDate: (dateTime) => {
        this.selectedDateInitial = dateTime;
        //this.createEvent();
        this.setOpen(true);
      },
      onEventClick:(calendarEvent) => {
        this.selectedHorario = this.buscarHorario(Number(calendarEvent.id)) 
        this.selectedClaseHorario = this.buscarClase(this.selectedHorario?.idClase!)
      }
    }
  })


  constructor(private horariosClasesService: HorariosClasesService, private classService: ClassService) { }

  ngOnInit() {
    this.getData();
    this.setView('month-grid');
  }

  getData(){
    this.horariosClasesService.getHorarios().subscribe({
      next: (data) =>{
        this.horariosClases = data;
        if(this.allClasses.length<1) this.getClasses();
      },
      error: (e) => {
        console.error(e);
      }
    })
  }

  getClasses(){
    this.classService.getClasses().subscribe({
      next: (data)=>{
        this.allClasses = data; 
        this.intercambiarHorarioPorEvento();
        this.eventsServicePlugin.set(this.events);
      },
      error: (e) =>{
        console.error(e)
      }
    }
    )
  }


  // Cada horario lo cambia a eventos, tipo y datos necesarios para que lo admita el calendario
  intercambiarHorarioPorEvento(){
    this.events = this.horariosClases.map((horario)=>{
      //creamos un evento vacio
      const evento={
        id: 0,
        title: "",
        start: "",
        end: "",
        location: "",
        people: [""],
      }
      //buscamos la clase con la id de la clase que esta en el horario
      const clase = this.buscarClase(horario.idClase)
      //creamos la fecha con hora inicial y final que es como lo acepta el calendario
      const start = horario.fecha+' '+horario.horaInicio;
      const end = horario.fecha+' '+horario.horaFin;
      
      //agregamos los respectivos datos al evento
      evento.id = Number(horario.id)
      evento.start = start
      evento.end = end
      if (clase){
        evento.title = clase.titulo;
        evento.location = clase.club;
        evento.people = [clase.instructor];
      }

      return evento;
    }).sort((a, b) => a.start.localeCompare(b.start))
  }

  //Busca la clase para obtener los datos a poner en el evento.
  buscarClase(id:number){
    return this.allClasses.find((clase)=> Number(clase.id) === id);
  }

  buscarHorario(id:number){
    return this.horariosClases.find((horario)=> Number(horario.id) === id);
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }


 //---
  /*createEvent() {
    if (this.selectedDate) {
      console.log(this.selectedDate)
      const eventDate = new Date(this.selectedDate);
      console.log('Evento creado para el día:', eventDate);
      // Aquí puedes manejar la lógica para guardar el evento
    } else {
      console.log('Por favor, selecciona una fecha.');
    }
  }*/

  confirm() {
    console.log("Clase: ", this.clase);
    console.log("Instructor: ", this.name);
    console.log("Fecha Inicial seleccionada: ", this.selectedDateInitial);
    console.log("Fecha Final seleccionada: ", this.selectedDateFinal);
    console.log("Hora Inicialseleccionada: ", this.selectedHourInitial);
    console.log("Hora Final seleccionada: ", this.selectedHourFinal)
    this.setOpen(false);
  }

  //---Abre y cierra el mdal
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    if(isOpen && this.selectedDateTime){
      //Al abrir el modal colocamos la fecha y la hora seleccionada.
      if(this.selectedDateTime){
        const [datePart, timePart] = this.selectedDateTime.split(' ')
        this.selectedDateInitial = datePart;
        this.selectedDateFinal = datePart;
        this.selectedHourInitial = timePart;
        this.selectedHourFinal = timePart;
      }
      
    }
  }

  onModalDidDismiss() {
    this.setOpen(false);
  }

  reset() {
    this.selectedDateInitial = new Date().toISOString();
    this.clase = '';
    this.name = '';
  }
  //----Cambia el tipo de vista del calendario
  setView(view:string){
    this.calendarControls.setView(view);

  }

  onCloseEventModal(){
    this.eventModal.close()
  }
}
