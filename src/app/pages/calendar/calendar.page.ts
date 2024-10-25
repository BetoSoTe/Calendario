import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonDatetime, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonButton, IonModal, IonButtons, IonItem, IonInput, IonList, IonText } from '@ionic/angular/standalone';
import { createCalendar, createViewWeek, createViewDay, createViewMonthGrid, viewMonthGrid, CalendarEvent} from "@schedule-x/calendar";
import { CalendarComponent } from "@schedule-x/angular";
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls'
import { createScrollControllerPlugin } from '@schedule-x/scroll-controller'
// import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { HorariosClasesService } from 'src/app/services/horarios-clases.service';
import { HorarioClase } from 'src/app/models/horarioClase';
import { ClassService } from 'src/app/services/class.service';
import { Class } from 'src/app/models/class';
import { createEventRecurrencePlugin, createEventsServicePlugin } from "@schedule-x/event-recurrence";
import { ModalController } from '@ionic/angular';
import { CalModalPage } from './cal-modal/cal-modal.page';

import { map,startWith,debounceTime } from 'rxjs/operators'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonText, IonList, IonInput, IonItem,
            IonButtons, IonModal, IonButton, IonLabel,
            IonSegmentButton, IonSegment, IonIcon, IonDatetime, 
            IonContent, IonHeader, IonTitle, IonToolbar,
            CommonModule, FormsModule, CalendarComponent, ReactiveFormsModule,
            MatAutocompleteModule /*NgCalendarModule*/],
  providers: [ModalController]
})
export class CalendarPage {
  selectedSegment: string = 'mes';
  allClasses: Class[] = [];
  //------Select con autocompletado
  filteredClases?: Observable<Class[]>;;
  form = new FormControl('',[Validators.required]);
  filteredClass? : Observable<Class | undefined>;
  //-----Modal
  isModalOpen = false;
  name: string = ''; clase: string = ''; //Nombre y Clase
  selectedFrequency: string = ''; // Frecuencia seleccionada
  selectedDateInitial: string = ''; // Fecha inicial
  selectedDateFinal: string = ''; // Fecha final
  selectedHourInitial: string = ''; // Hora inicial
  selectedHourFinal: string = ''; // Hora final
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
    plugins: [this.calendarControls, this.scrollController, this.eventsServicePlugin,this.eventModal, createEventRecurrencePlugin()],
    callbacks: {
      onDoubleClickDateTime: (dateTime) => {
        this.selectedDateTime = dateTime; // Guarda la fecha seleccionada
        //this.createEvent(); // Llama a la función dentro del componente
        this.setOpen(true); // Lógica para abrir el modal o diálogo
      },
      onDoubleClickDate: (dateTime) => {
        this.selectedDateInitial = dateTime;
        this.selectedDateFinal = dateTime;
        //this.createEvent();
        this.setOpen(true);
      },
      onEventClick:(calendarEvent) => {
        this.selectedHorario = this.buscarHorario(Number(calendarEvent.id)) 
        this.selectedClaseHorario = this.buscarClase(this.selectedHorario?.idClase!)
      }
    }
  })

  constructor(private horariosClasesService: HorariosClasesService,
              private classService: ClassService,
              private modalControl: ModalController) { }

  ngOnInit() {
    this.getData();
    this.setView('month-grid');
    this.filteredClases = this.form.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.filteredClass = this.form.valueChanges.pipe(
      map(value => this.buscarClase(Number(value))));
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
    })
  }

  // Cada horario lo cambia a eventos, tipo y datos necesarios para que lo admita el calendario
  intercambiarHorarioPorEvento(){
    this.events = this.horariosClases.map((horario)=>{
      //creamos un evento vacio
      const evento = {
        id: 0,
        title: "",
        start: "",
        end: "",
        location: "",
        people: [""],
        rrule: ""
      }
      
      //buscamos la clase con la id que esta en el horario
      const clase = this.buscarClase(horario.idClase)
      //ponemos la fecha con hora inicial y final que es como lo acepta el calendario
      const start = horario.fecha+' '+horario.horaInicio;
      const end = horario.fecha+' '+horario.horaFin;
      //Ponemos la frecuencia como la acepta el calendario
      if (horario.frecuencia !== "Una vez") evento.rrule = this.intercambiarFrecuencia(horario.frecuencia) +  this.convertirFecha(horario.fechaHasta);
      //agregamos los respectivos datos al evento como lo acepta el calendario
      evento.id = Number(horario.id);
      evento.start = start;
      evento.end = end;
      if (clase){
        evento.title = clase.titulo;
        evento.location = clase.club;
        evento.people = [clase.instructor];
      }
      return evento;
    }).sort((a, b) => {
      const [datePartA, timePartA] = a.start.split(' ')
      const [datePartB, timePartB] = b.start.split(' ')
      return timePartA.localeCompare(timePartB)
    })
  }

  //Quita los guiones a la fecha a como lo acepta rrule
  convertirFecha(fecha:string){
    return ';UNTIL=' + fecha.replace(/-/g, '') + 'T235959'; 
  }

  //Intercambiamos la frecuencia a como la acepta rrule
  intercambiarFrecuencia(frecuencia: string){
    const rrule: Record<string, string> = {
      Diario: "FREQ=DAILY",
      Semanal: "FREQ=WEEKLY",
      Mensual: "FREQ=MONTHLY",
      default: ""
    };
    return rrule[frecuencia] ?? rrule['default'];
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

  addEvent() {
    const newEvent = {
      title: this.clase,
      instructor: this.name,
      frequency: this.selectedFrequency,
      startDate: this.selectedDateInitial,
      startHour: this.selectedHourInitial,
      endDate: this.selectedDateFinal,
      endHour: this.selectedHourFinal
    };
    console.log('Nuevo evento:', newEvent);
  }

  confirm() {
    console.log("Clase: ", this.clase);
    console.log("Instructor: ", this.name);
    console.log("Fecha Inicial seleccionada: ", this.selectedDateInitial);
    console.log("Fecha Final seleccionada: ", this.selectedDateFinal);
    console.log("Hora Inicialseleccionada: ", this.selectedHourInitial);
    console.log("Hora Final seleccionada: ", this.selectedHourFinal)
    this.setOpen(false);
  }

  //---Abre y cierra el modal
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
    if(!this.selectedDateInitial) this.setDateInitial()
  }

  setDateInitial(){
  }

  onModalDidDismiss() {
    this.setOpen(false);
  }

  reset() {
    console.log('reset')
    this.selectedDateInitial = '';
    this.selectedDateFinal = '';
    this.selectedHourFinal = '';
    this.selectedHourInitial = '';
    this.selectedDateTime = '';
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

  //Select con autocompletado
  private _filter(value:string):Class[]{
    const filterValue = value.toLocaleLowerCase();

    return this.allClasses.filter(clase => clase.titulo.toLowerCase().includes(filterValue))

  }
  /*************************MODAL PARA MOSTRAR EL CALENDARIO*************************/
  async openCalModal(typeOfTimeSelection: string) {
    const selectedTimeInitial = this.getSelectedTimeInitial(typeOfTimeSelection);
    const modal = await this.modalControl.create({
      component: CalModalPage, // Aquí se especifica el componente modal
      backdropDismiss: true,
      componentProps:{ typeOfTimeSelection, selectedTimeInitial},
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data.isTimeSelected) this.setTimeSelected(data);
  }

  setTimeSelected(data:any){
    switch(data.typeOfTimeSelection){
      case 'selectedDateInitial': this.selectedDateInitial = data.selectedDate
      break;
      case 'selectedDateFinal': this.selectedDateFinal = data.selectedDate
      break;
      case 'selectedHourInitial': this.selectedHourInitial = data.selectedHour
      break;
      case 'selectedHourFinal': this.selectedHourFinal = data.selectedHour
      break;
    }
  }

  getSelectedTimeInitial(typeOfTimeSelection:string):string{
    const timeInitial: Record<string,string> = {
      selectedDateInitial: this.selectedDateInitial,
      selectedDateFinal: this.selectedDateFinal ,
      selectedHourInitial: this.selectedHourInitial,
      selectedHourFinal: this.selectedHourFinal, 
      default: "" 
    }
      
    return timeInitial[typeOfTimeSelection] ?? timeInitial['default']
  }
}