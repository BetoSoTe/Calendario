import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonText, IonLabel, IonCard, IonRow, IonCol, IonItem, IonSearchbar, IonIcon,
   ModalController, AlertController } from '@ionic/angular/standalone';
import { ClassService } from 'src/app/services/class.service';
import { Class } from 'src/app/models/class';
import { AddUpdateClassPage } from './add-update-class/add-update-class.page';

@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCard, IonLabel, IonText, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonRow, IonCol, IonItem, 
    IonSearchbar]
})
export class ClassPage implements OnInit {
  allClasses: Class[] = [];
  classes: Class[] = [];
  isLoading = false;
  query!:string;

  constructor(private classService: ClassService, private modalController: ModalController, private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getClasses()
  }

  //Obtiene todas las claases desde la base de datos
  getClasses(){
    this.classService.getClasses().subscribe({
      next: (data)=>{
        this.allClasses = data; //Respaldamos todas las clases
        this.classes = [...this.allClasses]; //Array que modificamos para obtener clases segun busquedas
      },
      error: (e) =>{
        this.mostrarAlertaError();
        console.error(e)
      }
    }
    )
  }

  ///----Manejo de alertas----//

  async mostrarAlertaError(){
    const alert = await this.crearAlert('¡Ooops!','Hubo un problema. Intente más tarde.');
    alert.present();
  }

  async mostrarAlertaOk(){
    const alert = await this.crearAlert('¡Exito!','La acción se ha producido correctamente.');
    alert.present().then(async () => {
      this.modalController.dismiss();
    });
  }

  async crearAlert(header: string,mensaje: string){
    const alert = await this.alertController.create({
      header: header,
      message: mensaje,
      buttons: ['OK']
    });
    return alert;
  }

  //----Elimina una clase ----

 deleteClass(id: number){
    this.isLoading = true
    this.classService.deleteClass(id).subscribe({
      next: (data)=>{
        this.getClasses(); //con esto actualizamos los cambios en la pagina
        this.mostrarAlertaOk();
        this.isLoading  = !this.isLoading;  
      }, error:(e)=>{
        this.mostrarAlertaError();
        console.error(e);
        this.isLoading  = !this.isLoading;
      }
    });
  }

  //---Preguntamos si el usuario esta seguro de querer eliminar una clase---
  async onDeleteClass(id: number){
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: '¿Esta seguro que desea eliminar la clase?',
      buttons:  [
        {
          text: 'Cancelar',
          role: 'cancel', 
          handler: () => {
            console.log('Eliminación cancelada')
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteClass(id); // Llama a la función para eliminar
          }
        }
      ]
    });
    alert.present();
  }

  //Agrega o edita una clase, si enviamos la clase como prop al modal, editará si no creará una nueva clase
  async onAddUpdateClass(clase?:Class){
    const modal = await this.modalController.create({
      component: AddUpdateClassPage,
      cssClass: 'clases-modal',
      backdropDismiss: true,
      componentProps:{ clase }
    })

    modal.onDidDismiss().then(()=>{
      this.getClasses()//con esto actualizamos los cambios en la pagina
    })

    modal.present();
  }

  //-----Búsqueda-----
  onSearchChange(event: any){
    this.query = event.detail.value.toLowerCase().normalize('NFD');
    this.querySearch(); 
  }

  querySearch(){
    this.classes = [];
    if (this.query.length > 0){
      this.searchItems();
    }else{
      this.classes = [...this.allClasses];
    }
  }
  searchItems(){
    this.classes = this.allClasses.filter((clase) =>
      clase.titulo.toLowerCase().normalize('NFD').includes(this.query)
    );
  }
}
