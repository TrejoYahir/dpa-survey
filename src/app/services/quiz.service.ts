import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {catchError, finalize, map, take} from 'rxjs/operators';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // tslint:disable-next-line:variable-name
  private _quizItemList: any[];
  public loadingItems: BehaviorSubject<boolean>;
  // tslint:disable-next-line:variable-name
  private _quizOptions: any[];
  // tslint:disable-next-line:variable-name
  private _currentStep: number;
  public progress: any;

  constructor(private afs: AngularFirestore, private toastCtrl: ToastController) {
    this.loadingItems = new BehaviorSubject<boolean>(false);
    this._quizOptions = [];
    this._quizItemList = [];
    this.progress = {};
  }

  set currentStep(step: number) {
    this._currentStep = step;
    localStorage.setItem('currentStep', String(step));
  }

  get currentStep() {
    return this._currentStep;
  }

  set quizItemList(itemList: any[]) {
    this._quizItemList = itemList;
    localStorage.setItem('itemList', JSON.stringify(itemList));
  }

  get quizItemList() {
    return this._quizItemList;
  }

  set quizOptions(options: any[]) {
    this._quizOptions = options;
    localStorage.setItem('options', JSON.stringify(options));
  }

  get quizOptions() {
    return this._quizOptions;
  }

  getItems() {
    this.loadingItems.next(true);
    return this.afs.doc('quiz/1')
        .valueChanges()
        .pipe(
            map((response: any) => {
              for (const answer of response.answers) {
                answer.canMoveTo = answer.canMoveTo.map((a) => {
                  const child = response.answers.find(({value}) => value === a);
                  return {value: child.value, text: child.text, color: child.color};
                });
              }
              this.quizItemList = response.questions;
              this.quizOptions = response.answers;
            }),
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
              return {};
            }),
            finalize(() => {
              setTimeout(() => {
                this.loadingItems.next(false);
              }, 800);
            })
        );
  }

  saveProgress(step: string, itemList: any[]) {
    this.progress[step] = itemList;
    localStorage.setItem('progress', JSON.stringify(this.progress));
    console.log('progress', this.progress);
  }

  sendAnswers() {
    return this.afs.collection('reponded-quiz').add(this.progress);
  }

  public getSavedSession(): Promise<any> {
    return new Promise((resolve, reject) => {
      const step: string = localStorage.getItem('currentStep');
      if (step !== undefined && step !== null) {
        this._currentStep = +step;
      }
      const options: string = localStorage.getItem('options');
      if (options !== undefined && options !== null) {
        this._quizItemList = JSON.parse(options);
        console.log('option list', this._quizItemList);
      }
      const list: string = localStorage.getItem('itemList');
      if (list !== undefined && list !== null) {
        this._quizItemList = JSON.parse(list);
        console.log('item list', this._quizItemList);
      }
      const progress: string = localStorage.getItem('progress');
      if (progress !== undefined && progress !== null) {
        this.progress = JSON.parse(progress);
      }
      resolve();
    });
  }
}
