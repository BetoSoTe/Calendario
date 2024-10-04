import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonText, IonLabel, IonCard, IonRow, IonCol, IonItem, IonSearchbar, IonIcon } from '@ionic/angular/standalone';
import { ClassService } from 'src/app/services/class.service';
import { Class } from 'src/app/models/class';

@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCard, IonLabel, IonText, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonRow, IonCol, IonItem, IonSearchbar]
})
export class ClassPage implements OnInit {
  classes: Class[] = [];

  constructor(private classService: ClassService) { }

  ngOnInit() {
    this.classService.getClasses().subscribe(
      data=>{
        this.classes = data;
        console.log("clases",this.classes)
      },
      error =>{
        console.error(error)
      }

    )
  }

}
