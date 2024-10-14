import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonDatetime, IonIcon, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
//import { NgCalendarModule, CalendarMode } from 'ionic2-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [IonLabel, IonSegmentButton, IonSegment, IonIcon, IonDatetime, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, /*NgCalendarModule*/]
})
export class CalendarPage implements OnInit {
  selectedSegment: string = 'mes';

  constructor() { }

  ngOnInit() {}

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }
}
