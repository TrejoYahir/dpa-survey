import {AfterViewInit, Component, OnInit} from '@angular/core';
import {QuizService} from '../services/quiz.service';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit, AfterViewInit {

  public results: any[];
  public loading: boolean;

  constructor(private quizService: QuizService, public loadingCtrl: LoadingController) {
    this.results = [];
    this.quizService.getResults().subscribe((response: any) => {
      this.results = response;
      console.log('results', response);
    });
  }

  ngOnInit() {
  }

  async ngAfterViewInit() {

    const loader = await this.loadingCtrl.create({
      message: 'Cargando encuestas'
    });

    this.quizService.loadingResults.subscribe(async (loading: boolean) => {
      loading && loader ? await loader.present() : await loader.dismiss();
    });
  }

}
