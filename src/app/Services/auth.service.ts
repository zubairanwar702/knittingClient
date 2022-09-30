import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private router:Router,private route:ActivatedRoute) { }
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  Login() {
    if(localStorage.getItem('login-token')){
    this.loggedIn.next(true);
    localStorage.setItem('login-token','zzzxxxoo')
    this.router.navigate(['AddBusinessPerson'], { relativeTo: this.route });
    }
    }
  
  Logout() {
    localStorage.removeItem('login-token');
    this.loggedIn.next(false);
    this.router.navigate([''], { relativeTo: this.route });
  }
}
