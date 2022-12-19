import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validator, Validators } from '@angular/forms';
import { BusinessPersonService } from '../Services/business-person.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

@Component({
  selector: 'app-add-business-person',
  templateUrl: './add-business-person.component.html',
  styleUrls: ['./add-business-person.component.css']
})
export class AddBusinessPersonComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  displayStyle = "none";
  closeModal!: string;
  submitted = false;
  showMessage=false;
  message='';
  update=false;
  editMode=false;
  updated=false;
  nameAvailble=true;
  nameAvailableEditMode= true;
  closebtn!:string;
  dtOptions: DataTables.Settings = {};
  records:any;
 @ViewChild('modalData') modelData!: ElementRef;
 public businessPersonEditForm : FormGroup= new FormGroup({});
 //
 public businessForm: FormGroup = new FormGroup({
    Name: new FormControl(''),
    Address: new FormControl('')
  })
  //Edit businessForm
  
  constructor(private formbuilder:FormBuilder,private businessPersonService:BusinessPersonService,private modalService: NgbModal) { }
  
  ngOnInit(): void {

    // inilization the form
    this.businessForm= this.formbuilder.group({
      Name: ['', Validators.required],
      Address: ['', Validators.required]
    });
    // initilize datatbale 
  
    this.GetList();
  }
  get form() { return this.businessForm.controls; }
  get editForm() { return this.businessPersonEditForm.controls; }
  GetList()
  {
    this.blockUI.start();
    this.records=undefined;
    this.businessPersonService
      .GetBusinessPerson()
      .subscribe({
        next: (responce:any) => {
     if(responce["message"]=='success'){
         this.records=responce["data"];
         this.BindDataTable(this.records);
     }
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {this.blockUI.stop();}
      });
  }
 save() {
  this.AddRecord();
}
AddRecord(){
  this.submitted=true;
  this.showMessage=false;
  if(this.businessForm.valid)
  {
  this.blockUI.start();
    this.businessPersonService
      .SaveBusinessPerson(this.businessForm.value)
      .subscribe({
        next: (responce:any) => {
     if(responce["message"]=='success'){
         this.businessForm.reset();
         this.showMessage=true;
         this.message="New business person add successfully."
         this.submitted=false;
         this.nameAvailble=true;
         //this.closebutton.nativeElement.click();
         this.modalService.dismissAll();
         this.GetList();
     }
     else if(responce["message"]=='NotAvailable'){
       this.nameAvailble=false;
     }
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => { this.blockUI.stop();}
      });
    
  }
}
UpdateRecord(){
  this.updated=true;
  this.showMessage=false;
  if(this.businessPersonEditForm.valid)
  {
  this.blockUI.start();
    this.businessPersonService
      .UpdateBusinessPerson(this.businessPersonEditForm.value)
      .subscribe({
        next: (responce:any) => {
     if(responce["message"]=='success'){
         this.businessPersonEditForm.reset();
         this.update=true;
         this.updated=false;
         this.showMessage=true;
         this.message="business person update successfully."
         //this.closebutton.nativeElement.click();
         this.modalService.dismissAll();
          this.GetList();
         
     }
     else if(responce["message"]=='NotAvailable'){
      this.nameAvailableEditMode=false;
    }
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {  this.blockUI.stop();}
      });
    // , error => {
    //    console.log(error);
    // });
  }
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
        title: 'Row Number',
        render: function(data, type, full, meta ) {
          return  meta.row+1;
        }
      },
    {
      title: 'Name',
      data: 'name'
    },
    {
      title: 'Address',
      data: 'address'
    },
    {
      title: 'Edit',
      render: function(data, type, item, meta) {
        return '<a class="btn edit btn-primary">Edit</i></a>';
      }
    }
    ],
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
      $('.edit',row).on('click',(e)=>
      {
        this.PopupEditValue(data);
      });
      const self = this;
      // Unbind first in order to avoid any duplicate handler
      // (see https://github.com/l-lin/angular-datatables/issues/87)
      // Note: In newer jQuery v3 versions, `unbind` and `bind` are 
      // deprecated in favor of `off` and `on`
     
      return row;
    }
  };
 }

 
 PopupEditValue(data:any){
  console.log(data);
  //initialize edit values
   this.editMode=true;
  this.businessPersonEditForm= this.formbuilder.group({
    id: data['id'],
    Name: [data['name'], Validators.required],
    Address: [data['address'], Validators.required]
  });

  this.triggerModal(this.modelData);
  }
  
  triggerModal(content:any) {
    console.log(content);
    //this.modalService.open(content);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
      this.editMode=false;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
      this.editMode=false;
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

}

