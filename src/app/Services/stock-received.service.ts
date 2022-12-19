import {HttpClient} from '@angular/common/http'
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockReceivedService {
  baseUri:string= '';
  constructor(private http:HttpClient) {
    this.baseUri=environment.apiEndPoint;
   }
   AddStockReceived(stockReceived:any)
   {
     return this.http.post(this.baseUri+'Stock/AddStockReceived',stockReceived);
   }
   AddStockout(stockout:any)
   {
    return this.http.post(this.baseUri+'Stock/AddStockout',stockout);
   }
   UpdateStockout(stockout:any)
   {
    return this.http.post(this.baseUri+'Stock/UpdateStockout',stockout);
   }
   UpdateStockReceived(stockReceived:any)
   {
     return this.http.post(this.baseUri+'Stock/UpdateStockReceived',stockReceived);
   }
   MarkStockDelete(stock:any)
   {
     return this.http.post(this.baseUri+'Stock/MarkStockDelete',stock);
   }
   GetStockReceived(stockType:string)
   {
    return this.http.get(this.baseUri+'Stock/GetStockReceivedAll?stockType='+stockType+'');
   }
}
