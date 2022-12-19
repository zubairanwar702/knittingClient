import {HttpClient} from '@angular/common/http'
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  baseUri:string= '';
  constructor(private http:HttpClient) {
    this.baseUri=environment.apiEndPoint;
}
GetPaymentByInvoiceId(invoiceId:any)
{
  return this.http.get(this.baseUri+'Payment/GetPaymentsByInvoiceId?invoiceId='+invoiceId+'');
}
CreateBill(bill:any)
{
  return this.http.post(this.baseUri+'Payment/CreateBill',bill);
}
GetCreateBillList(transactionType:any)
{
  return this.http.get(this.baseUri+'Payment/GetPaymentsByTransactionType?transactionType='+transactionType+'');
}
}
