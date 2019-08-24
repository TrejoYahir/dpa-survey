import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {QuizService} from '../services/quiz.service';

@Injectable({
    providedIn: 'root'
})
export class StepGuard implements CanActivate {
    constructor(private router: Router, private quizService: QuizService) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.quizService.currentStep === 2) {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }
}
