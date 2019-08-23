import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {catchError, finalize, take} from 'rxjs/operators';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // tslint:disable-next-line:variable-name
  public quizItemList: any[];
  public loadingItems: BehaviorSubject<boolean>;
  public quizOptions: any[];

  constructor(private afs: AngularFirestore, private toastCtrl: ToastController) {
    this.loadingItems = new BehaviorSubject<boolean>(false);
    this.quizOptions = [
      {
        text: 'Muy verdadero',
        value: 5
      },
      {
        text: 'Verdadero',
        value: 4
      },
      {
        text: 'Ni falso, ni verdadero',
        value: 3
      },
      {
        text: 'Falso',
        value: 2
      },
      {
        text: 'Muy falso',
        value: 1
      }
    ];
  }

  get quizItems(): Observable<any[]> {
    return (this.quizItemList !== null && this.quizItemList !== undefined) ? of(this.quizItemList) : this.getItems();
  }

  getItems() {
    this.loadingItems.next(true);
    return this.afs.collection('quiz-items', ref => ref.orderBy('id'))
        .valueChanges()
        .pipe(
            take(1),
            catchError(async (error: any) => {
              console.log('load survey error', error);
              const toast = await this.toastCtrl.create({
                header: 'Ocurrió un error al cargar la encuesta',
                message: 'Por favor, intenta de nuevo',
                duration: 2000,
                showCloseButton: true,
                closeButtonText: 'Cerrar'
              });
              await toast.present();
              return [];
            }),
            finalize(() => {
              setTimeout(() => {
                this.loadingItems.next(false);
              }, 800);
            })
        );
  }
}
