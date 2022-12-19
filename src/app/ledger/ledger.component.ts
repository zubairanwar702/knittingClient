import { Component, OnInit } from '@angular/core';
import { BusinessPersonService } from '../Services/business-person.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { formatDate,DatePipe } from '@angular/common';
@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  businessPersonList:any=[];
  businessLedgerList:any=[];
  totalPayment!:number;
  totalPaymentReceived!:number;
  totalWeightin!:number;
  totalWeightout!:number;
  selectList!:number;
  name!:'';
  records:any
  dtOptions: DataTables.Settings = {};
  constructor( private businessPersonService:BusinessPersonService) { }

  ngOnInit(): void {
    this.GetBusinessPersonList();
  }
  BindDataTable(records:any)
  {

   this.dtOptions = {
  
     pagingType: 'full_numbers',
     // paging: false,
     processing: true,
    "autoWidth": false,
     // scrollY: '500',
     pageLength: 15,
     data: records,
     search: false,
     
     columns: [
      {
        title: 'Invoice Number',
        data: 'invoiceNumber'
        // render: function(data, type, full, meta ) {
        //   return  meta.row+1;
        
      },
      {
        title: 'Transit Date',
        data: 'dateReceived',
        render: function (data, type, row) {//data
          return row.dateReceived != null ? formatDate(row.dateReceived, 'dd-MM-yyyy', 'en-US') : '';
        }
      },
     {
      title: 'Transit Type',
      data: 'varityType'
    },
     {
       title: 'Total Weight in kg',
       data: 'totalWeight'
     },
     {
      title: 'Yarn in',
      data: 'transactionType',
      render: function (data, type, row) {//data
        return row.transactionType == 'in' ? 'Yarn in' : '';
      }
    },
    {
      title: 'Cloth out',
      data: 'transactionType',
      render: function (data, type, row) {//data
        return row.transactionType == 'out' ? 'Cloth out' : '';
      }
    },
    {
      title: 'Total Payment',
      data: 'paymentAmount'
    },
    {
      title: 'Received Payment',
      data: 'amountReceived'
    },
     ]
     
   };
  }
  GetTotals(record:any)
  {
     this.totalPayment = record.reduce((accumulator:any, obj:any) => {
      return accumulator + obj.paymentAmount;
    }, 0);
    this.totalPaymentReceived = record.reduce((accumulator:any, obj:any) => {
      return accumulator + obj.amountReceived;
    }, 0);
    // this.totalPayment = record.reduce((accumulator:any, obj:any) => {
    //   return accumulator + obj.paymentAmount;
    // }, 0);
    // this.totalPayment = record.reduce((accumulator:any, obj:any) => {
    //   return accumulator + obj.paymentAmount;
    // }, 0);

  }
  LoadLedger()
  
  {
    let ide=this.selectList;
    console.log(ide);
    var businessName = this.businessPersonList.filter((item:any)=>item.id ===ide)[0];
     this.name=businessName['name'];
    this.blockUI.start();
    this.businessPersonService.GetBusinessPersonLedger(this.selectList)
      .subscribe({
        next: (responce:any) => {
     if(responce["message"]=='success'){
      this.records=responce["data"];
      this.BindDataTable(this.records);
      this.GetTotals(this.records);
     }
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {this.blockUI.stop();}
      });
  }
  
  changeFn(val:any) {
    console.log("Dropdown selection:", val);
}
  GetBusinessPersonList()
  {
    this.blockUI.start();
    this.businessPersonService.GetBusinessPerson()
      .subscribe({
        next: (responce:any) => {
     if(responce["message"]=='success'){
      this.businessPersonList=responce["data"];
      //this.businessPersonList=this.businessPersonList.map((obj:any) => obj.name);
      //console.log(this.businessPersonList);
     }
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {this.blockUI.stop();}
      });
  }
}
