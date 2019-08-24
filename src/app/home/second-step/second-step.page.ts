import {Component, OnInit, ViewChild} from '@angular/core';
import {IonContent, LoadingController, ToastController} from '@ionic/angular';
import {environment} from '../../../environments/environment';
import {QuizService} from '../../services/quiz.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-second-step',
  templateUrl: './second-step.page.html',
  styleUrls: ['./second-step.page.scss'],
})
export class SecondStepPage implements OnInit {

  public loading: boolean;
  public quizItems: any[];
  public quizOptions: any[];
  public submitted: boolean;
  public environment: any;
  public categories: any[];
  @ViewChild(IonContent, {static: false}) private content: IonContent;

  constructor(
      private quizService: QuizService,
      private loadingCtrl: LoadingController,
      private toastCtrl: ToastController,
      private router: Router
  ) {
    this.environment = environment;
    this.loading = false;
    this.submitted = false;
    this.quizItems = this.quizService.quizItemList;
    this.quizOptions = this.quizService.quizOptions;
  }

  ngOnInit() {
    this.categorizeItems();
  }

  categorizeItems() {
    this.categories = [];
    for (const option of this.quizOptions) {
      let items = [...this.quizItems];
      items = items.filter(x => x.answer.value === option.value);
      const category = { option, items, expanded: true };
      this.categories.push(category);
    }
  }

  changeCategory(category: any, item: any, move: any) {
    category.items = category.items.filter(x => x.id !== item.id);
    const newCategory = this.categories.find(x => x.option.value === move.value);
    newCategory.items.push(item);
  }

  async sendResults() {
    this.submitted = true;
    // check quantities
    const finalItems = [];
    for (const category of this.categories) {
      if (category.items.length !== category.option.limit) {
        const toast = await this.toastCtrl.create({
          header: 'Cantidades incorrectas',
          message: 'Debes organizar las categorías de modo que las cantidades indicadas coincidan',
          duration: 5000,
          closeButtonText: 'Cerrar',
          showCloseButton: true
        });
        await toast.present();
        return;
      }
      finalItems.push(...category.items);
    }
    // if quantities are correct build and send result
    const loader = await this.loadingCtrl.create({
      message: 'Guardando'
    });
    await loader.present();

    try {
      this.quizService.saveProgress('second-step', [...finalItems]);
      await this.quizService.sendAnswers();
      localStorage.clear();
      sessionStorage.setItem('finished-survey', String(true));
      this.router.navigateByUrl('/thank-you').then(async () => await loader.dismiss());
    } catch (error) {
      console.log('error', error);
      const toast = await this.toastCtrl.create({
        header: 'Error de servidor',
        message: 'Ocurrió un error de nuestra parte, vuelve a intentarlo.',
        duration: 2500,
        closeButtonText: 'Cerrar',
        showCloseButton: true
      });
      await toast.present();
      await loader.dismiss();
    }
  }

  toggleCategory(category: any) {
    category.expanded = !category.expanded;
  }
}
