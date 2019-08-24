import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {QuizService} from '../services/quiz.service';

@Injectable({
    providedIn: 'root'
})
export class FinishGuard implements CanActivate {
    constructor(private router: Router, private quizService: QuizService) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const finished = sessionStorage.getItem('finished-survey');
        if (finished !== null && finished !== undefined) {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }
}
