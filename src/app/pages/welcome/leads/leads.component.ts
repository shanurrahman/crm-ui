import { Component, OnInit } from '@angular/core';
import { LeadsService } from 'src/app/leads.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ColumnItem, listOfColumns, DataItem } from './listOfCols';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ILeadColumn } from './lead.interface';
import {FormlyFieldConfig} from '@ngx-formly/core';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { UsersService } from 'src/app/service/users.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit{
  constructor(
    private msg: NzMessageService,
    private leadsService: LeadsService,
    private nzContextMenuService: NzContextMenuService,
    private router: Router,
    private fb: FormBuilder,
    private usersService: UsersService
  ) {}

  page: number = 1;
  perPage: number = 15;
  tagPlaceHolder = 3

  showCols = [];
  listOfColumns: ColumnItem[]
  listOfOption: any[] = []
  visible: boolean;
  placement = "right";
  managers: any;
  isTimelineModalVisible = false;
  ngOnInit() {
    this.visible = false;
    this.listOfOption = ["LEAD", "TICKET", "USER", "CUSTOMER"];
    this.initFilterForm();
    this.rerenderCols();
    this.getAllLeadColumns();
    this.initRightClickActions();
  }


  initRightClickActions() {
    this.usersService.getUsers(0, 20, "abc", "asc").subscribe(data=>{
      this.managers = data;
    }, error=> {
      console.log(error)
    })
  }

  listOfData: DataItem[] = [];
  objectkeys = Object.keys


  // showCols: this.showCols.filter(cols=>cols.checked).map(col=>col.value)
  leadOptions: { page: number, perPage: number, showCols?: string[], searchTerm: string } = { page: this.page || 1, perPage: this.perPage || 1, searchTerm: "" };
  getData() {
    this.leadsService.getLeads(this.leadOptions).subscribe((response: any)=>{
      this.msg.info("Retrieved some leads");
      this.generateListOfCols(response[0]);
      this.listOfData = response;
    }, error=>{
      this.msg.error("Some error occured while fetching leads");
    });
  }

  typeDict: {[key: string]: {label: string, value: string, type: string, checked: boolean}};
  dataLoaded: boolean = false;
  getAllLeadColumns() {
    this.leadsService.getAllLeadColumns().subscribe((mSchema: {paths: ILeadColumn[]})=>{
      mSchema.paths.forEach((path: ILeadColumn)=>{
        this.showCols.push({
          label: path.readableField,
          value: path.internalField,
          checked: path.checked,
          type: path.type
        })
      });

      // for tables
      this.typeDict = Object.assign({}, ...this.showCols.map((x) => ({[x.value]: x})));
    })
  }

  // get the mapper here and change the names, the key value pairs for data elements will not change
  generateListOfCols(row) {
    this.listOfColumns = Object.keys(row).map(key=>{
      return {
        name: key
      }
    })
  }

  createLead() {
    this.router.navigate(['welcome', 'leads', 'create']);
  }


  filterForm: FormGroup
  initFilterForm() {
    this.filterForm = this.fb.group({
      handlerEmail: [null],
      dateRange: [null],
      moduleTypes: []
    });
  }
  submitForm() {
    console.log(this.filterForm.value);
  }

  rerenderCols() {
    this.leadOptions.showCols = this.showCols.filter(col=>col.checked).map(col=>col.value);

    this.getData();
  }

  onPageIndexChange(page: number) {
    this.page = page;
    this.getData();
  }

  onPageSizeChange(perPage: number){
    this.perPage = perPage;
    this.getData();
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  handleSearchTerm() {
    this.getData();
  }



  showLeadHistory(lead) {
    this.isTimelineModalVisible = true;
  }


  isVisible = false;
  showEmailModal(customerData): void {
    console.log(customerData)
    this.initEmailForm();
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }


  emailForm: FormGroup;
  emailModel;
  emailFields:FormlyFieldConfig[];
  initEmailForm() {
    this.emailForm = this.fb.group({
      subject: [null],
      text: [null],
      attachments: [null]
    });
  }

  submitEmailForm(model) {
    console.log(model);
  }


  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }


  reassignLead(newManager: any) {
    console.log(this.selectedLead, newManager);
    this.leadsService.reassignLead(this.selectedLead.email, newManager.email, this.selectedLead).subscribe(result => {
      this.msg.success("Successfully reassigned lead");
    }, error => {
      this.msg.error(error.error);
    })
  }


  selectedLead: any;
  isReassignmentModalVisible;
  selectedManager: FormControl;
  openReassignModal(leadData) {
    this.selectedLead = leadData;
    this.selectedManager = new FormControl(null);
    this.selectedManager.valueChanges.subscribe(data=>{
      console.log(data);
    })
    this.isReassignmentModalVisible = true;
    // now show managers on modal, wait for a manager to click and send for reassignment also set the typings file now, its required
  }


  handleReassignmentCancel() {
    this.isReassignmentModalVisible = false;
  }

  handleTimelineClose() {
    this.isTimelineModalVisible = false;
  }

  handleReassignmentSubmit () {

  }
}











