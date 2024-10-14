import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, ModalController, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText, 
  AlertController, IonSpinner, IonRow, IonCol } from '@ionic/angular/standalone';
import { Class } from 'src/app/models/class';
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'app-add-update-class',
  templateUrl: './add-update-class.page.html',
  styleUrls: ['./add-update-class.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonSpinner, IonText, IonLabel, IonItem, IonInput, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule,
    IonSelect, IonSelectOption,
  ]
})
export class AddUpdateClassPage implements OnInit {
  @Input() clase?: any;
  isLoading:boolean = true;
  clubs = [
    {
      id: 1,
      name: "Club Alpha 2"
    },
    {
      id: 2,
      name: "Club Alpha 3"
    },
    {
      id: 3,
      name: "CIMERA"
    },
    {
      id: 4,
      name: "Sports Plaza"
    },
  ]
  classes: any = [];

  constructor(private modalController: ModalController, private classService: ClassService, private alertController: AlertController) { }

  //Creamos el formulario dinámico donde agregamos parametros de validacion
  form = new FormGroup({
      id: new FormControl(0,[Validators.required]),
      titulo: new FormControl('',[Validators.required,Validators.minLength(1),Validators.maxLength(60)]),//Establce cuantos caracteres requiere
      descripcion: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(200)]),
      club: new FormControl('',[Validators.required]),
      instructor: new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(60)]),
      inscritos: new FormControl(0,[Validators.required]),
      cupo: new FormControl(null,[Validators.required,Validators.min(1),Validators.max(250)]), 
      restan: new FormControl(0,[Validators.required,Validators.min(0),]),
  },{validators:[this.validadorRestan, this.validadorCupo]})

  ngOnInit() {
    if (this.clase) this.form.setValue(this.clase);
      this.getClasses(); //Obtenemos las clases para poner id a clase mientras se usa JSON server
  }
 // Obtenemos las clases en lo que se implementa base de datos
  getClasses(){
    this.classService.getClasses().subscribe({
      next: (data)=>{
        this.classes = data;
        this.isLoading  = !this.isLoading;
      },
      error: (e) =>{
        this.mostrarAlertaError();
        console.error(e);
        this.isLoading  = !this.isLoading;
      }
    }
    )
  }

  //---Validadores personalizados
  validadorRestan(control: AbstractControl): ValidationErrors | null{
      const cupo = control.get('cupo');
      const inscritos = control.get('inscritos');
      const restan = control.get('restan');
      return (cupo && inscritos && restan && (restan.value !== cupo.value - inscritos.value)) ? { restanInvalido: true }: null;
  }

  validadorCupo(control: AbstractControl): ValidationErrors | null  {
    const inscritos = control.get('inscritos');
    const cupo = control.get('cupo');
    return inscritos && cupo && cupo.value >= inscritos.value ? null : { cupoInvalido: true };
  }

  //---Al realizar el submit verificamos si pasaron la clase mediante props para realizar la edicion o creacion de la clase
  onSubmit(){
    if (this.form.valid){
      if (this.clase) this.updateClass()
      else this.createClass()
    }
  }

//----Crea la clase
  async createClass(){
    this.isLoading = true; 
    let clase = this.form.value; //obtenemos los valores ingresados por el usuario en el formulario
    clase.id = this.classes.length + 1; //Obtenemos el numero de elementos de las clases para poner un id solo para pruebas
    clase.club = clase.club ? clase.club.trim() : null; //Eliminamos espacios en blanco al principio y al final
    clase.restan = clase.cupo; //Al crearse restan los mismos lugares que el cupo
    //Manejo de errores al crear la clase
    this.classService.addClass(clase).subscribe({
      next:(data)=>{
        this.mostrarAlertaOk();
        this.isLoading  = !this.isLoading;
        this.modalController.dismiss(); //una vez creada la clase se cierra el modal
    }, error:(e)=>{
      this.mostrarAlertaError();
      console.error(e);
      this.isLoading  = !this.isLoading;
    }});
  }

  //---Actualiza la clase
  async updateClass(){
    this.isLoading= true;
    let clase = this.form.value;  //obtenemos los valores ingresados por el usuario en el formulario
    clase.id = Number(clase.id) //Nos aseguramos que el id sea un numero
    clase.club = clase.club ? clase.club.trim() : null; //Eliminamos espacios en blanco al principio y al final
    this.classService.updateClass(this.form.value).subscribe({
      next: (data)=>{
        this.mostrarAlertaOk();
        this.isLoading  = !this.isLoading;  
        this.modalController.dismiss();
      }, error:(e)=>{
        this.mostrarAlertaError();
        console.error(e);
        this.isLoading  = !this.isLoading;
      }
    });
  }
//----Manejo de alertas-----
  async mostrarAlertaOk(){
    const alert = await this.crearAlert('¡Exito!','La clase se ha registrado correctamente.');
    alert.present().then(async () => {
      this.modalController.dismiss();
    });
  }

  async mostrarAlertaError(){
    const alert = await this.crearAlert('¡Ooops!','Hubo un problema. Intente nuevamente por favor.');
    alert.present();
  }

  async crearAlert(header: string,mensaje: string){
    const alert = await this.alertController.create({
      header: header,
      message: mensaje,
      buttons: ['OK']
    });
    return alert;
  }

  //----Cierra el modal
  close(){
    this.modalController.dismiss();
  }

}
