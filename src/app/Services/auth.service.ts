import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private showlogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  constructor(private router:Router,private route:ActivatedRoute) { }
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  get showLogin()
  {
    return this.showlogin.asObservable();
  }
  Login() {
    if(localStorage.getItem('login-token')){
    this.loggedIn.next(true);
    this.showlogin.next(false);
    localStorage.setItem('login-token','zzzxxxoo')
    this.router.navigate(['AddBusinessPerson'], { relativeTo: this.route });
    }
    }
  
  Logout() {
    localStorage.removeItem('login-token');
    this.loggedIn.next(false);
    this.showlogin.next(true);
    this.router.navigate([''], { relativeTo: this.route });
  }
}
