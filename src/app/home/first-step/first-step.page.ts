import {AfterViewInit, Component, OnInit} from '@angular/core';
import {QuizService} from '../../services/quiz.service';
import {Observable, pipe} from 'rxjs';
import {LoadingController} from '@ionic/angular';
import {take} from 'rxjs/operators';

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

  constructor(private quizService: QuizService, private loadingCtrl: LoadingController) {
    this.loading = false;
    this.submitted = false;
    this.quizService.quizItems.subscribe((list: any[]) => this.quizItems = list);
    this.quizOptions = this.quizService.quizOptions;
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

  setItemAnswer(item: any, option: any) {
    item.answer = option;
  }

  nextStep() {
    this.submitted = true;
    for (const item of this.quizItems) {
      if (!item.answer) {
        return;
      }
    }
  }
}
