import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink,
 } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, 
  trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, add, createOutline, calendarOutline, close, homeOutline, calendar,
  timeOutline, locationOutline,personOutline, footballOutline,
  refreshOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, 
    IonIcon, IonLabel, IonRouterLink, IonRouterOutlet,
  ],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/folder/Home', icon: 'home' },
    { title: 'Clases', url: '/folder/Clases', icon: 'football' },
    { title: 'Calendario', url: '/folder/Calendario', icon: 'calendar' },
  ];
  constructor() {
    addIcons({
      trashOutline,
      add,
      createOutline,
      calendarOutline,
      close,
      homeOutline,
      calendar,
      timeOutline,
      locationOutline,
      personOutline,
      refreshOutline,
      footballOutline,
    });
  }
}
