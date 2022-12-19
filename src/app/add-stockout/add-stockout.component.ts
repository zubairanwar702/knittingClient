import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BusinessPersonService } from '../Services/business-person.service';
import { StockReceivedService } from '../Services/stock-received.service';
import { ThisReceiver } from '@angular/compiler';
import { formatDate,DatePipe } from '@angular/common';
import { PaymentService } from '../Services/payment.service';
@Component({
  selector: 'app-add-stockout',
  templateUrl: './add-stockout.component.html',
  styleUrls: ['./add-stockout.component.css']
})
export class AddStockoutComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  closeModal!: string;
  submitted = false;
  updated=false;
  showMessage=false;
  message='';
  editMode=false;
  paymentList:any=[];
  paymentEditList:any=[];
  stockList:any= [];
  bunisssPersonList:any=[];
 
  totalWeight='';
  totalRate='';
  records:any
  numberonly= "^[0-9]*$";
  numberWithDecimal="^(-?[0-9]+(\.[0-9]+)?)";
  dtOptions: DataTables.Settings = {};
  @ViewChild('modalData') modelData!: ElementRef;
  // declare the form object
  public stockinForm: FormGroup = new FormGroup({
    businessPersonName: new FormControl(''),
    dateReceived:new FormControl(''),
    varityName: new FormControl(''),
    boxes: new FormControl(''),
    weightPerBox: new FormControl(''),
    totalWeight: new FormControl(''),
    description: new FormControl(),
    businessPersonId: new FormControl()
  });
  public stockinEditForm : FormGroup= new FormGroup({});
  // get form object
   get form() { return this.stockinForm.controls; }
   get editForm() { return this.stockinEditForm.controls; }
  constructor(private formBuilder:FormBuilder,
     private businessPersonService:BusinessPersonService, 
     private stockService:StockReceivedService,
     private paymentService: PaymentService,

     private datePipe:DatePipe,
     private modelServices:NgbModal
     ) { }

  ngOnInit(): void {
    this.stockinForm= this.formBuilder.group({
      dateReceived: ['', Validators.required],
      varityType: [''],
      boxes: ['', Validators.required],
      // weightPerBox: ['', Validators.required],
       totalWeight: ['', Validators.required],
      // ratePerKg: ['',Validators.required],
      // paymentAmount:['',Validators.required],
      description: [''],
      businessPersonId: ['',Validators.required],
      transactionType:['out'],
      paymentList:[],
    });
    this.GetBusinessPersonList();
    this.GetStockReceivedList();
    this.AddNewEmptyPayment();
  }
  GetBusinessPersonList()
  {
    this.blockUI.start();
    this.businessPersonService.GetBusinessPerson()
      .subscribe({
        next: (responce:any) => {
     if(responce["message"]=='success'){
      this.bunisssPersonList=responce["data"];
     }
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {this.blockUI.stop();}
      });
  }
  GetStockReceivedList()
  {
    this.blockUI.start();
    this.records=undefined;
    this.stockService.GetStockReceived('out')
      .subscribe({
        next: (responce:any) => {
     if(responce["message"]=='success'){
      this.records=responce["data"];
      console.log(this.records);

      this.BindDataTable(this.records);
     }
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {this.blockUI.stop();}
      });
  }
  GetPayments(invoiceId:any)
  {
    this.paymentService.GetPaymentByInvoiceId(invoiceId)
      .subscribe({
        next: (responce:any) => {
     if(responce["message"]=='success'){
      this.paymentEditList=responce["data"];
      for(let i = 0; i <  this.paymentEditList.length; i++)
      {
        var date= new Date(this.paymentEditList[i]['dateReceived']);
        this.paymentEditList[i]['dateReceived']=date;
      }
     
     }
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {

        }
      });
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
       title: 'Business Person Name',
       data: 'businessPersonName'
     },
     {
      title: 'Cloth Manufacture Type',
      data: 'varityType'
    },
     {
      title: 'Roles Out',
      data: 'boxes'
    },
    {
      title: 'Weight Per Role in kg',
      data: 'weightPerBox'
    },
     {
       title: 'Total Weight in kg',
       data: 'totalWeight'
     },
     {
      title: 'Date of Stock out',
      data: 'dateReceived',
      render: function (data, type, row) {//data
        return row.dateReceived != null ? formatDate(row.dateReceived, 'dd-MM-yyyy', 'en-US') : '';
      }
    },
     {
      title: 'Edit',
       render: function(data, type, item, meta) {
         return '<a class="btn edit btn-primary">Edit</i></a>';
       }
     },
     {
      title: 'Delete',
      render: function(data, type, item, meta) {
        return '<a class="btn delete btn-danger">Delete</i></a>';
      }
    },
     ],
     rowCallback: (row: Node, data: any[] | Object, index: number) => {
       $('.edit',row).on('click',(e)=>
       {
         
         this.PopupEditValue(data);
         
       });
       $('.delete',row).on('click',(e)=>
       {
        this.MakerOrderDelete(data);
       });
       return row;
     }
   };
  }
 
   MakerOrderDelete(data:any)
   {
     this.blockUI.start();
     this.stockService
       .MarkStockDelete(data)
       .subscribe({
         next: (responce:any) => {
      if(responce["message"]=='success'){
        this.showMessage=true;
        this.message="Cloth out deleted succesfully.";
        this.submitted=false;
        this.GetStockReceivedList();
      }
         },
         error: (e) => {
           console.log(e);
         },
         complete: () => { this.blockUI.stop();}
       });
     
   }
   AddNewEmptyPayment()
   {
    this.paymentList.push({invoiceId: 0,dateReceived:null,amountReceived:0});
   }
   AddNewEmptyPaymentRecord()
   {
    this.paymentEditList.push({invoiceId: 0,dateReceived:null,amountReceived:0});
   }
  PopupEditValue(data:any){
    var invoiceId=data['id'];
    this.GetPayments(invoiceId);
    var date= new Date(data['dateReceived']);
    //initialize edit values
    this.stockinEditForm= this.formBuilder.group({
      id: data['id'],
      dateReceived: [date, Validators.required],
      varityType: [data['varityType']],
      boxes: [data['boxes'], [Validators.required]],
      totalWeight: [data['totalWeight'], Validators.required],
      description: [data['description']],
      businessPersonId: [data['businessPersonId'],Validators.required],
      paymentList:[]
    });
    this.triggerModal(this.modelData);
  }
  triggerModal(content:any) {
    //this.modalService.open(content);
    this.modelServices.open(content,  {size: 'lg',ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
      this.editMode=false;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
      this.editMode=false;
    });
   
  }
  Save()
  {
   var dateReceived= this.stockinForm.value["receivedDate"];
   var convertDate=this.datePipe.transform(dateReceived, 'MM-dd-yyyy hh:mm a');
   this.stockinForm.value["receivedDate"]=convertDate;
   this.stockinForm.value["transactionType"]='out';
   this.stockinForm.value["paymentList"]=this.paymentList;
   this.AddRecord();
   //console.log(this.stockinForm.value);
  }
  AddRecord(){
   
    this.submitted=true;
    if(this.stockinForm.valid)
    {
    this.blockUI.start();
      this.stockService
        .AddStockout(this.stockinForm.value)
        .subscribe({
          next: (responce:any) => {
       if(responce["message"]=='success'){
           this.stockinForm.reset();
           //this.ngOnInit();
           this.blockUI.stop();
           this.showMessage=true;
           this.message="Cloth out added succesfully.";
           this.submitted=false;
           //this.closebutton.nativeElement.click();
           this.GetStockReceivedList();
       }
          },
          error: (e) => {
            console.log(e);
          },
          complete: () => {}
        });
    }
    
  }
  UpdateRecord(){
    this.updated=true;
    if(this.stockinEditForm.valid)
    {
     // console.log('updatd inseid')
      var dateReceived= this.stockinEditForm.value["receivedDate"];
      var convertDate=this.datePipe.transform(dateReceived, 'MM-dd-yyyy hh:mm a');
      this.stockinEditForm.value["receivedDate"]=convertDate;
      this.stockinEditForm.value["paymentList"]=this.paymentEditList;
     
      this.blockUI.start();
      this.stockService
        .UpdateStockout(this.stockinEditForm.value)
        .subscribe({
          next: (responce:any) => {
       if(responce["message"]=='success'){
           this.stockinForm.reset();
           this.blockUI.stop();
           this.updated=false;
           this.showMessage=true;
           this.message="Stock shipped update succesfully.";
           this.modelServices.dismissAll();
           this.GetStockReceivedList();
           //this.closebutton.nativeElement.click();
           //this.GetList();
       }
          },
          error: (e) => {
            console.log(e);
          },
          complete: () => {}
        });
      
    }
  }
  AddNewEmptyRecord()
  {
    console.log("add new empty record");
  }
  private getDismissReason(reason: any): string {
    console.log('model closed......')
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  
  // CalculateTotal()
  // {
  //     var boxes= this.stockinForm.value.boxes;
  //     var perbox= this.stockinForm.value.weightPerBox;
  //     this.totalWeight=(boxes* perbox).toFixed(2);
  // }
  CalculateTotalRate()
  {
      var boxes= this.stockinForm.value.ratePerKg;
      var perbox= this.stockinForm.value.totalWeight;
      this.totalRate=(boxes* perbox).toFixed(2);
  }
}