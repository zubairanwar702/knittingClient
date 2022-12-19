import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BusinessPersonService } from '../Services/business-person.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PaymentService } from '../Services/payment.service';
import { formatDate,DatePipe } from '@angular/common';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-generate-bill',
  templateUrl: './generate-bill.component.html',
  styleUrls: ['./generate-bill.component.css']
})
export class GenerateBillComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  constructor(private formBuilder:FormBuilder,private businessPersonService:BusinessPersonService,private paymentServices:PaymentService, private modelServices:NgbModal, private datePipe:DatePipe,) { }
  submitted=false;
  showMessage=false;
  closeModal!: string;
  message='';
  businessPesonList:any=[];
  billList:any;
  editRecord:any;
  numberWithDecimal="^(-?[0-9]+(\.[0-9]+)?)";
  @ViewChild('modalData') modelData!: ElementRef;
  dtOptions: DataTables.Settings = {};
  public generateBillForm: FormGroup = new FormGroup({
    businessPersonId:new FormControl(''),
    billStartDate: new FormControl(''),
    billEndDate: new FormControl(''),
    amount: new FormControl(''),
    description:new FormControl('')
  });
  public generateBillEditForm : FormGroup= new FormGroup({});
  public PopulateEditForm(data:any)
  {
    var billStartDate= new Date(data['billStartDate']);
    var billEndDate = new Date(data['billEndDate']);
    this.generateBillEditForm= this.formBuilder.group({
      businessPersonId: [data['businessPersonId'], Validators.required],
      billStartDate:[billStartDate, Validators.required],
      billEndDate: [billEndDate, Validators.required],
      amount: [data['amount'], Validators.required],
      description: [data['description'], Validators.required],
      transactionType:['db']
    });
    this.triggerModal(this.modelData);
  }
  ngOnInit(): void {
    this.generateBillForm= this.formBuilder.group({
      businessPersonId: ['', Validators.required],
      billStartDate:['', Validators.required],
      billEndDate: ['', Validators.required],
      amount: ['', Validators.required],
      description: ['', Validators.required],
      transactionType:['db']
    });
    this.GetBusinessPersonList();
    this.GetBillList();
  }
  // get form object
  get form() { return this.generateBillForm.controls; }
  GetBusinessPersonList()
  {
    this.blockUI.start();
    this.businessPersonService.GetBusinessPerson()
      .subscribe({
        next: (responce:any) => {
     if(responce["message"]=='success'){
      this.businessPesonList=responce["data"];
     }
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {this.blockUI.stop();}
      });
  }
  triggerModal(content:any) {
    //this.modalService.open(content);
    this.modelServices.open(content,  {size: 'lg',ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
      //this.editMode=false;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
      //this.editMode=false;
    });
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


  GetBillList()
  {
    this.blockUI.start();
    this.paymentServices.GetCreateBillList('db')
      .subscribe({
        next: (responce:any) => {
          console.log(responce);
     if(responce["message"]=='success'){
      this.billList=responce["data"];
      this.BindDataTable(this.billList);
     }
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {this.blockUI.stop();}
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
        title: 'BusinessPerson Name',
        data: 'name'
      },

      {
        title: 'FromDate',
        data: 'billStartDate',
        render: function (data, type, row) {//data
          return row.billStartDate != null ? formatDate(row.billStartDate, 'dd-MM-yyyy', 'en-US') : '';
        }
        
      },
     {
       title: 'To Date',
       data: 'billEndDate',
       render: function (data, type, row) {//data
        return row.billEndDate != null ? formatDate(row.billEndDate, 'dd-MM-yyyy', 'en-US') : '';
      }
     },
     {
      title: 'Amount',
      data: 'amount'
    },
     {
      title: 'Created Date',
      data: 'createdDate',
      render: function (data, type, row) {//data
        return row.createdDate != null ? formatDate(row.createdDate, 'dd-MM-yyyy', 'en-US') : '';
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
        this.PopulateEditForm(data);
       });
       $('.delete',row).on('click',(e)=>
       {
       });
       return row;
     }
   };
  }








  Save()
  {
    console.log('its called');
    this.submitted=true;
    if(this.generateBillForm.valid)
    {
     
      console.log(this.generateBillForm.value);
     this.blockUI.start();
      this.paymentServices
        .CreateBill(this.generateBillForm.value)
        .subscribe({
          next: (responce:any) => {
       if(responce["message"]=='success'){
           this.generateBillForm.reset();
           //this.ngOnInit();
           this.blockUI.stop();
           this.showMessage=true;
           this.message="Bill generated successfully.";
           this.submitted=false;
           //this.closebutton.nativeElement.click();
           
       }
          },
          error: (e) => {
            console.log(e);
          },
          complete: () => {}
        });
    }
  }
}
