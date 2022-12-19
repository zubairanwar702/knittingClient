import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class BusinessPersonService {
  baseUri:string= '';
  constructor(private http:HttpClient) {
    this.baseUri= environment.apiEndPoint;
   }
   UpdateBusinessPerson(businessPerson:any)
   {
     return this.http.post(this.baseUri+'Business/UpdateBusinessPerson',businessPerson);
   }
   SaveBusinessPerson(businessPerson:any)
   {
     return this.http.post(this.baseUri+'Business/AddBusinessPerson',businessPerson);
   }
   GetBusinessPerson()
    {
      return this.http.get(this.baseUri+'Business/GetBusinessPerson');
    }
    GetBusinessPersonLedger(businessPersonId:any)
    {
      return this.http.get(this.baseUri+'Business/GetBusinessPersonLedger?businessPersonId='+businessPersonId+'');
    }

   
}
