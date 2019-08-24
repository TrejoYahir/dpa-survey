import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {QuizService} from '../../services/quiz.service';
import {IonContent, LoadingController, ToastController} from '@ionic/angular';
import { environment } from '../../../environments/environment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-first-step',
  templateUrl: './first-step.page.html',
  styleUrls: ['./first-step.page.scss'],
})
export class FirstStepPage implements OnInit, AfterViewInit {

  public loading: boolean;
  public quizItems: any[];
  public quizOptions: any[];
  public submitted: boolean;
  public environment: any;
  @ViewChild(IonContent, {static: false}) private content: IonContent;

  constructor(
      private quizService: QuizService,
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController,
      private router: Router) {
    this.environment = environment;
    this.loading = false;
    this.submitted = false;
    this.quizService.getItems().subscribe((response: any) => {
      this.quizItems = this.quizService.quizItemList;
      this.quizOptions = this.quizService.quizOptions.map((x: any) => ({value: x.value, text: x.text, id: x.id}));
    });

  }

  ngOnInit() {
  }

  async ngAfterViewInit() {

    const loader = await this.loadingCtrl.create({
      message: 'Cargando encuesta'
    });

    this.quizService.loadingItems.subscribe(async (loading: boolean) => {
      loading && loader ? await loader.present() : await loader.dismiss();
    });
  }

  async nextStep() {
    const loader = await this.loadingCtrl.create({
      message: 'Guardando'
    });
    await loader.present();

    this.submitted = true;

    // check for unclasified items
    for (const item of this.quizItems) {
      if (!item.answer) {
        await loader.dismiss();
        const toast = await this.toastCtrl.create({
          header: 'Debes clasificar todas las frases',
          message: 'Se marcaron en rojo las frases faltantes',
          closeButtonText: 'cerrar',
          showCloseButton: true,
          duration: 3000
        });
        await toast.present();
        return;
      }
    }
    // if all items are clasified, save and go to next step
    this.quizService.quizItemList = this.quizItems;
    this.quizService.currentStep = 2;
    this.quizService.saveProgress('first-step', [...this.quizItems]);
    this.router.navigateByUrl('/second-step').then(async () => await loader.dismiss());
  }

  async createDummyData() {
    for (const item of this.quizItems) {
      const randomValue = Math.floor(Math.random() * this.quizOptions.length) + 1;
      item.answer = this.quizOptions.find(x => x.value === randomValue);
    }
    await this.content.scrollToBottom(100);
  }
}
