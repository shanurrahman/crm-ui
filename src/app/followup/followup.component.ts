import { Component, OnInit } from "@angular/core";
import { ICampaign } from "../campaign/campaign.interface";
import { CampaignService } from "../home/campaign.service";
import { ILead } from "../home/interfaces/leads.interface";
import { LeadsService } from "../home/leads.service";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { PageEvent } from '@angular/material/paginator';
import { PubsubService } from "../pubsub.service";
import { HEADER_FILTERS } from "src/global.constants";
import * as moment from "moment";

@Component({
  selector: "app-followup",
  templateUrl: "./followup.component.html",
  styleUrls: ["./followup.component.scss"],
})
export class FollowupComponent implements OnInit {
  selectedCampaign: ICampaign;
  selectedInterval = null;
  listOfUpcomingLeads: ILead[] = [];
  objectkeys = Object.keys;

  constructor(
    private leadService: LeadsService,
    private campaignService: CampaignService,
    private pubsub: PubsubService
  ) {}

  ngOnInit() {
    this.populateCampaignDropdown({});
  }


  ionViewWillEnter() {
    this.pubsub.$pub(HEADER_FILTERS, []);
  }

  
  onLeadSelectionChange(event) {
    this.getFollowUps();
  }

  total: number;

  today = new Date();
  month = this.today.getMonth();
  year = this.today.getFullYear();
  
  startDate = new Date(this.year, this.month, this.today.getDate());
  endDate = new Date(this.year, this.month, this.today.getDate()+2);
  selectedCampaignId = 'all';

  dateDropdownSelector: string;
  customSelectorMode = false;

  onSelectionChange() {
    if(this.dateDropdownSelector === 'thisWeek') {
      this.startDate = moment().startOf('week').toDate();
      this.endDate = moment().endOf('week').toDate();
    }else if(this.dateDropdownSelector === 'thisMonth') {
      this.startDate = moment().startOf('month').toDate();
      this.endDate = moment().endOf('month').toDate();
    }else if(this.dateDropdownSelector === 'lastThreeMonths') {
      this.startDate = moment().subtract(3, 'month').toDate();
      this.endDate = moment().toDate();
    }else if(this.dateDropdownSelector === 'lastSixMonths') {
      this.startDate = moment().subtract(6, 'month').toDate();
      this.endDate = moment().toDate();
    }


    this.getFollowUps();
  }

  getFollowUps() {
    // a^b; if either startDate or endDate is undefined return, if none is defined fetch all leads irrespective of campaign
    if(!!this.startDate !== !!this.endDate) {
      return;
    }
    this.leadService
      .getFollowUps({
        page: this.page,
        perPage: this.perPage,
        interval: [new Date(this.startDate).toISOString(), new Date(this.endDate).toISOString()],
        campaignId: this.selectedCampaignId || this.selectedCampaign._id
      })
      .subscribe(
        (result) => {
          this.total = result[0]?.metadata[0]?.total;
          this.listOfUpcomingLeads = result[0]?.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  campaignList: ICampaign[];
  async populateCampaignDropdown(hint) {
    this.campaignList = await this.campaignService.populateCampaignDropdown(
      hint
    );
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };

  leadStatusOptions: string[];
  typeDict = null;


  perPage = 20;
  page = 1;
  onPageSizeChange(size: number) {
    this.perPage = size;
    this.getFollowUps();
  }

  handlePaginationEvent(paginator: PageEvent) {
    this.page = paginator.pageIndex;
    this.getFollowUps();
  }

  displayedColumns: string[] = ['campaign', 'firstName', 'leadStatus', 'email'];
}

