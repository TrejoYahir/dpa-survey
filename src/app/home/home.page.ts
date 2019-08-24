import { Component } from '@angular/core';
import {QuizService} from '../services/quiz.service';
import {Router} from '@angular/router';
import {LoadingController, ToastController} from '@ionic/angular';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
      private quizService: QuizService,
      private router: Router,
      private loadingCtrl: LoadingController,
      private afAuth: AngularFireAuth,
      private toastCtrl: ToastController) {}

    async startQuiz() {
      const loader = await this.loadingCtrl.create({
        message: 'Iniciando encuesta'
      });
      await loader.present();
      try {
        await this.afAuth.auth.signInAnonymously();
        this.quizService.currentStep = 1;
        this.router.navigateByUrl('/first-step').then(async () => await loader.dismiss());
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
}
