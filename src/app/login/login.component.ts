import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public List = [];
  public status!: string;
  public loginMessage!: string;
  isLoggedIn$!: Observable<boolean>;
  reponsce!:boolean;
  showLoginForm!:boolean;
  submitted!:false;
  constructor(private router:Router,private route:ActivatedRoute,private authService:AuthService) { }

  public LoginForm: FormGroup = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl('')
  })
  get form() { return this.LoginForm.controls; }
  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.showLogin;
    // this.isLoggedIn$.subscribe(val =>this.reponsce=val );
    // this.showLoginForm=this.reponsce;
    // console.log("from login"+this.showLoginForm);
  }
 Login()
 {
  var userName= this.LoginForm.value["userName"];
  var password = this.LoginForm.value["password"];
  console.log(userName);
  console.log(password);
  if(userName=="pak" && password=="1234"){
    
    localStorage.setItem('login-token','zzzxxxoo')
    this.authService.Login();
   
  }
  else {
     this.loginMessage="invalid username/Password"
  }
 }
}
