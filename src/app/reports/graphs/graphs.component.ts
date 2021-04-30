import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { CampaignService } from 'src/app/home/campaign.service';
import { UsersService } from 'src/app/home/users.service';
import { TellecallerCallDetails } from 'src/app/telecaller-talktime/telecaller-talktime.interface';
import { GraphService } from './graphs.service';


interface IGraphDataRes {
  pieData: { type: string; value: number; }[],
  barData: { type: string; value: number; percent: number; }[],
  callDetails: TellecallerCallDetails[]
  stackData: {
    [x: string]: string | number;
    type: string;
  }[]
}

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss'],
})
export class GraphsComponent implements OnInit {

  constructor(
    private graphService: GraphService,
    private menu: MenuController,
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private userService: UsersService
  ) { }

  userList: string[] = [];
  filterForm: FormGroup;


  today = new Date();
  month = this.today.getMonth();
  year = this.today.getFullYear();
  
  startDt = new Date(this.year, this.month-1, 1);
  endDt = new Date(this.year, this.month+1, 28);

  handlerFilter = new FormControl();
  startDate = new FormControl(this.startDt);
  endDate = new FormControl(this.endDt);
  prospectName = new FormControl();
  handler = new FormControl([]);
  campaign = new FormControl()
  listOfCampaigns: any;
  
  ngOnInit() {
    this.initFilters();
    this.initCampaignList();
    this.initHandlerList();
  }

  async initCampaignList() {
    this.listOfCampaigns = await this.campaignService.populateCampaignDropdown({select: ['_id', 'campaignName']});
    this.campaign.setValue(this.listOfCampaigns[0]._id);
    this.getGraphData({});
  }


  openFilter() {
    this.menu.enable(true, 'transactionFilter')
    this.menu.open('transactionFilter');
  }

  initFilters() {
    this.filterForm = this.fb.group({
      startDate: this.startDate,
      endDate: this.endDate,
      prospectName: this.prospectName,
      handler: this.handler,
      campaign: this.campaign
    })
  }

  showBar = false;
  telecallerCallDetails: TellecallerCallDetails[];
  getGraphData(options) {
    console.log(options);
    this.graphService.getGraphData(this.filterForm.value).subscribe((data: IGraphDataRes)=>{
      this.barData = data.barData;
      this.pieData = data.pieData;
      this.stackBarData = data.stackData;
      this.telecallerCallDetails = data.callDetails;
    }, error=>{
      console.log(error);
    });
  }
  
  listOfHandlers: any;
  tempUserList: any;
  initHandlerList() {
    this.userService.getAllUsersHack().subscribe((result: any)=>{
      this.tempUserList = result[0].users;
      this.listOfHandlers = result[0].users;
    });

    this.handlerFilter.valueChanges.subscribe((value: string) => {
      this.listOfHandlers = this.tempUserList.filter((v)=>{
        // search in both email and name
        const t = v.fullName + v.email;
        return t.includes(value)
      });
    })
  }

  barData = [];
  max = 10;


  XAxisLabel = 'month';
  YAxisLabel = 'NOC';
  stackBarData = [
    // { [this.XAxisLabel]: 'January', type: 'Sales', [this.YAxisLabel]: 1000 },
    // { [this.XAxisLabel]: 'September', type: 'Sales', [this.YAxisLabel]: 1170 },
    // { [this.XAxisLabel]: 'March', type: 'Sales', [this.YAxisLabel]: 660 },
    // { [this.XAxisLabel]: 'April', type: 'Sales', [this.YAxisLabel]: 1030 },
    // { [this.XAxisLabel]: 'May', type: 'Expenses', [this.YAxisLabel]: 400 },
    // { [this.XAxisLabel]: 'June', type: 'Expenses', [this.YAxisLabel]: 460 },
    // { [this.XAxisLabel]: 'July', type: 'Expenses', [this.YAxisLabel]: 1120 },
    // { [this.XAxisLabel]: 'January', type: 'Expenses', [this.YAxisLabel]: 540 },
    // { [this.XAxisLabel]: 'September', type: 'Profit', [this.YAxisLabel]: 300 },
    // { [this.XAxisLabel]: 'October', type: 'Profit', [this.YAxisLabel]: 300 },
    // { [this.XAxisLabel]: 'April', type: 'Profit', [this.YAxisLabel]: 300 },
    // { [this.XAxisLabel]: 'June', type: 'Profit', [this.YAxisLabel]: 350 },
  ];


  pieData = [];


  downloadGraph() {

  }
}
