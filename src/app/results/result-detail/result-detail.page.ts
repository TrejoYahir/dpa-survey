import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {QuizService} from '../../services/quiz.service';
import * as _range from 'lodash/range';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-result-detail',
  templateUrl: './result-detail.page.html',
  styleUrls: ['./result-detail.page.scss'],
})
export class ResultDetailPage implements OnInit {

  public result: any;
  public total: any[];
  public validResult: boolean;

  constructor(private route: ActivatedRoute, private quizService: QuizService, private loadingCtrl: LoadingController) {
    this.validResult = false;
    this.total = _range(72);
  }

  getCategory(category: number, step: number) {
    let res = [];
    if (step === 1) {
      res = [...this.result['first-step']];
    } else {
      res = [...this.result['second-step']];
    }
    return res.filter(x => x.answer.value === category);
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const loader = await this.loadingCtrl.create({
      message: 'Cargando resultado'
    });
    await loader.present();
    this.quizService.getResult(id).subscribe((response: any) => {
      console.log(response);
      this.result = response;
      this.validResult = this.result['first-step'].length === this.total.length && this.result['second-step'].length === this.total.length;
      loader.dismiss();
    }, (error => {
      console.log('error', error);
      loader.dismiss();
    }));
  }

  getPoints(id: number, step: number) {
    let res = [];
    if (step === 1) {
      res = [...this.result['first-step']];
    } else {
      res = [...this.result['second-step']];
    }
    const item = res.find(x => x.id === id);
    return item.answer.value;
  }

  getTotal(step: number) {
    let res = [];
    if (step === 1) {
      res = [...this.result['first-step']];
    } else {
      res = [...this.result['second-step']];
    }
    return res.reduce((a, b) => +a + +b.answer.value, 0);
  }

  getContent(id: any) {
    const res = [...this.result['first-step']];
    const item = res.find(x => x.id === id);
    return item.text;
  }

  getDifference(id: any) {
    const res1 = [...this.result['first-step']];
    const res2 = [...this.result['second-step']];
    const item1 = res1.find(x => x.id === id);
    const item2 = res2.find(x => x.id === id);
    return item2.answer.value - item1.answer.value;
  }

  getTotalDifference(id: any) {
    const res1 = [...this.result['first-step']];
    const res2 = [...this.result['second-step']];
    const total1 = res1.reduce((a, b) => +a + +b.answer.value, 0);
    const total2 = res2.reduce((a, b) => +a + +b.answer.value, 0);
    return total1 - total2;
  }
}
