import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButtons,IonMenuButton, IonSkeletonText, IonText, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonList, IonText, IonSkeletonText, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButtons,IonMenuButton]
})
export class HomePage implements OnInit {
  pages =  [
    {
      title: 'Clases',
      url: 'folder/Clases',
    },
    {
      title: 'Calendario',
      url: 'folder/Calendario',
    },
  ];

  private router = inject(Router)

  constructor() { }

  ngOnInit() {
  }

  onItemTap(page: any){
    this.router.navigateByUrl(page?.url);
  }

}
