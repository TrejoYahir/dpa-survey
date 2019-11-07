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
  private readonly surveyLength: number;
  public differenceData: any[];

  constructor(private quizService: QuizService, public loadingCtrl: LoadingController) {
    this.surveyLength = 72;
    this.results = [];
    this.differenceData = [];
    this.quizService.getResults().subscribe((response: any) => {
      this.results = response.map((x: any) => {
        return {...x, ...this.getValidity(x)};
      });
      this.differenceData = this.countBigDifferences();
      console.log('results', this.results);
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

  getValidity(item: any) {
    const stats: any = {};
    console.log(item);
    if (item['first-step'].length < this.surveyLength || item['second-step'].length < this.surveyLength) {
      stats.incomplete = true;
      stats.valid = false;
      return stats;
    } else {
      let bigDifferences = 0;
      let firstScore = 0;
      let secondScore = 0;
      for (let i = 0; i < this.surveyLength; i++) {
        if (Math.abs(item['first-step'][i].answer.value - item['second-step'][i].answer.value) > 3) {
          bigDifferences++;
        }
        if (item['first-step'][i].answer.value > 3) {
          firstScore += item['second-step'][i].answer.value;
        }
        if (item['second-step'][i].answer.value > 3) {
          secondScore += item['second-step'][i].answer.value;
        }
      }
      stats.score = (firstScore - secondScore) / this.surveyLength;
      stats.bigDifferences = bigDifferences;
      stats.valid = true;
    }
    return stats;
  }

  private countBigDifferences() {
    const map = new Map();
    const list = this.results.filter(x => x.valid)

    list.forEach((el) => {
      if (map.has(el.bigDifferences)) {
        map.get(el.bigDifferences).value++;
      } else {
        map.set(el.bigDifferences, Object.assign(el, { value: 1 }));
      }
    });

    let names = [...map.values()];
    names = names.map(({bigDifferences, value}) => {
      return {name: bigDifferences, value};
    });

    names = names.sort((a, b) => (a.name > b.name) ? 1 : -1);

    console.log(names);
    return names;
  }
}
