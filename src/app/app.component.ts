import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './Services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn$!: Observable<boolean>;
  reponsce!:boolean;
  title = 'knittingClient';
  showLoginForm!:boolean;
  constructor(private authService:AuthService) { }
  ngOnInit(): void {
     this.isLoggedIn$ = this.authService.isLoggedIn;
     this.isLoggedIn$.subscribe(val =>this.reponsce=val );
     this.showLoginForm=this.reponsce;
     console.log(this.showLoginForm);
  }

}
