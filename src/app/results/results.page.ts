import {AfterViewInit, Component, OnInit} from '@angular/core';
import {QuizService} from '../services/quiz.service';
import {LoadingController} from '@ionic/angular';
import {models, scaleList, scales} from './stats-constants.const';

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
  public correlationAverages: any[];
  public scalesAverages: any[];
  public validResults: any[];
  public scaleList: any[] = scaleList;

  constructor(private quizService: QuizService, public loadingCtrl: LoadingController) {
    this.surveyLength = 72;
    this.results = [];
    this.differenceData = [];
    this.correlationAverages = [];
    this.quizService.getResults().subscribe((response: any) => {
      this.results = response.map((x: any) => {
        return {...x, ...this.getValidity(x)};
      });
      this.validResults = this.results.filter(x => x.valid);
      this.differenceData = this.countBigDifferences();
      console.log('results', this.results);
      this.correlationAverages = this.getCorrelationsAverages();
      this.scalesAverages = this.getScalesAverages();
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
        if (item['first-step'][i].answer.value > 3) {
          firstScore += item['second-step'][i].answer.value;
        }
        if (item['second-step'][i].answer.value > 3) {
          secondScore += item['second-step'][i].answer.value;
        }
        if (Math.abs(item['first-step'][i].answer.value - item['second-step'][i].answer.value) > 3) {
          bigDifferences++;
        }
      }

      if (secondScore !== 120) {
        stats.badProcedure = true;
        stats.valid = false;
        return stats;
      }
      // stats.score = (firstScore - secondScore) / this.surveyLength;
      item['first-step'] = item['first-step'].sort((a, b) => a.id > b.id ? 1 : -1);
      item['second-step'] = item['second-step'].sort((a, b) => a.id > b.id ? 1 : -1);
      stats.resultsArrays = {
        first: item['first-step'].map(x => x.answer.value),
        second: item['second-step'].map(x => x.answer.value)
      };
      stats.scaleProps = this.getScaleProps(stats.resultsArrays);
      const scaleGraphProps = [];
      for (const scale of scaleList) {
        scaleGraphProps.push({name: scale, value: stats.scaleProps[scale].score});
      }
      stats.graphProps = {
        correlations: [
          {name: 'Seguro', value: stats.scaleProps.safePercentage},
          {name: 'Evasivo', value: stats.scaleProps.evasivePercentage},
          {name: 'Preocupado', value: stats.scaleProps.worriedPercentage},
        ],
        scales: scaleGraphProps
      };
      stats.valid = true;
    }
    return stats;
  }

  private getScaleProps(resultsArrays: any) {
    const scaleProps: any = {};
    for (const scale of scaleList) {
      scaleProps[scale] = {};
      scaleProps[scale].firstAnswers = [];
      scaleProps[scale].secondAnswers = [];

      for (const i of scales[scale].questions) {

        scaleProps[scale].firstAnswers.push(resultsArrays.first[i - 1]);
        scaleProps[scale].secondAnswers.push(resultsArrays.second[i - 1]);

        scaleProps[scale].userAverage = scaleProps[scale].firstAnswers.reduce(( p, c ) => p + c, 0) / scaleProps[scale].firstAnswers.length;
        scaleProps[scale].average = scales[scale].average;
        scaleProps[scale].sd = scales[scale].sd;
        scaleProps[scale].name = scale;
        scaleProps[scale].description = scales[scale].name;
        scaleProps[scale].score = (((scaleProps[scale].userAverage - scaleProps[scale].average) / scaleProps[scale].sd) * 10) + 50;
      }
    }

    scaleProps.safeCorrelation = this.correlation(models.safe.model, resultsArrays.second);
    scaleProps.safePercentage = (((scaleProps.safeCorrelation - models.safe.media) / models.safe.deviation) * 10) + 50;

    scaleProps.evasiveCorrelation = this.correlation(models.evasive.model, resultsArrays.second);
    scaleProps.evasivePercentage = (((scaleProps.evasiveCorrelation - models.evasive.media) / models.evasive.deviation) * 10) + 50;

    scaleProps.worriedCorrelation = this.correlation(models.worried.model, resultsArrays.second);
    scaleProps.worriedPercentage = (((scaleProps.worriedCorrelation - models.worried.media) / models.worried.deviation) * 10) + 50;

    return scaleProps;
  }

  correlation(d1, d2) {
    const { min, pow, sqrt } = Math;
    const add = (a, b) => a + b;
    const n = min(d1.length, d2.length);
    if (n === 0) {
      return 0;
    }
    [d1, d2] = [d1.slice(0, n), d2.slice(0, n)];
    const [sum1, sum2] = [d1, d2].map(l => l.reduce(add));
    const [pow1, pow2] = [d1, d2].map(l => l.reduce((a, b) => a + pow(b, 2), 0));
    const mulSum = d1.map((k, i) => k * d2[i]).reduce(add);
    const dense = sqrt((pow1 - pow(sum1, 2) / n) * (pow2 - pow(sum2, 2) / n));
    if (dense === 0) {
      return 0;
    }
    return (mulSum - (sum1 * sum2 / n)) / dense;
  }

  private countBigDifferences() {
    const map = new Map();
    const list = this.results.filter(x => x.valid);

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

  private getCorrelationsAverages() {
    const results = this.results.filter((x) => x.valid);
    const evasiveAverage = results.reduce(( p, {scaleProps}) => p + scaleProps.evasivePercentage, 0) / results.length;
    const safeAverage = results.reduce(( p, {scaleProps}) => p + scaleProps.safePercentage, 0) / results.length;
    const worriedAverage = results.reduce(( p, {scaleProps}) => p + scaleProps.worriedPercentage, 0) / results.length;

    const averages = [
      {
        name: 'Seguro',
        value: safeAverage
      },
      {
        name: 'Evasivo',
        value: evasiveAverage
      },
      {
        name: 'Preocupado',
        value: worriedAverage
      },
    ];
    console.log('averages', averages);
    return averages;
  }

  private getScalesAverages() {
    const results = this.results.filter((x) => x.valid);
    const averages = [];
    for (const scale of scaleList) {
      averages.push({
        name: scale,
        value: results.reduce(( p, {scaleProps}) => p + scaleProps[scale].score, 0) / results.length
      });
    }
    console.log(averages);


    return averages;
  }

}
