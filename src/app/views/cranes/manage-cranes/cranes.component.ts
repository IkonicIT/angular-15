import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { CranesService } from 'src/app/services/cranes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cranes',
  templateUrl: './cranes.component.html',
  styleUrls: ['./cranes.component.scss'],
})
export class CranesComponent implements OnInit, OnDestroy {
  searchKey: string = '';
  data: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  highestRank: any;
  plantName: any;
  bmdrnk: any;
  bmkey: any;
  bmkey1: any;
  isFromQueryParams: boolean = false;
  previousData: any[] = [];
  historyStack: any[][] = [];

  private subscriptions = new Subscription();

  constructor(
    private cranesService: CranesService,
    private router: Router,
    private location: Location,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.highestRank = sessionStorage.getItem('highestRank') ?? '';
    this.searchKey = sessionStorage.getItem('searchKey') ?? '';

    const historyStackData = sessionStorage.getItem('historyStack');
    const historyStackBackup = sessionStorage.getItem('historyStackBackup');

    this.historyStack = historyStackBackup
      ? JSON.parse(historyStackBackup)
      : [];

    const sub = this.route.queryParams.subscribe((params) => {
      const bmdrnk = params['bmdrnk'];
      const bmkey1 = params['bmkey1'];
      const bmkey = params['bmkey2'];
      if (!bmdrnk && !bmkey1 && !bmkey) {
        this.data = historyStackData ? JSON.parse(historyStackData) : [];
        this.isFromQueryParams = false;
        return;
      } else {
        this.isFromQueryParams = true;
        if (bmdrnk === this.searchKey) {
          this.fetchCranesByBMDRNK(bmdrnk);
        } else {
          this.fetchData(bmkey, bmdrnk);
        }
      }

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { bmdrnk: null, bmkey1: null, bmkey2: null },
        queryParamsHandling: 'merge',
      });
    });

    this.subscriptions.add(sub);
  }

  fetchData(key: string, bmdrnk: string): void {
    this.spinner.show();
    const sub = this.cranesService.getCranesData(key).subscribe(
      (response: any[]) => {
        this.spinner.hide();
        if (response.length === 0) {
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 0);
          this.errorMessage = 'No Data Found For BMDRNK:' + bmdrnk;
        } else {
          this.historyStack.push([...this.data]);
          this.data = response;
          sessionStorage.setItem('historyStack', JSON.stringify(this.data));
          sessionStorage.setItem(
            'historyStackBackup',
            JSON.stringify(this.historyStack)
          );
          this.errorMessage = '';
          this.isFromQueryParams = false;
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
    this.subscriptions.add(sub);
  }

  fetchCranesByBMDRNK(key: string): void {
    this.spinner.show();
    const sub = this.cranesService.getCranesByBMDRNK(key).subscribe(
      (response: any[]) => {
        if (response.length === 0) {
          this.errorMessage = 'No Data Found';
          this.data = [];
        } else {
          this.historyStack.push([...this.data]);
          this.data = response;
          sessionStorage.setItem('historyStack', JSON.stringify(this.data));
          sessionStorage.setItem(
            'historyStackBackup',
            JSON.stringify(this.historyStack)
          );
          this.spinner.hide();
          this.errorMessage = '';
          this.isFromQueryParams = false;
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
    this.subscriptions.add(sub);
  }

  handleSearch(): void {
    this.historyStack.length = 0;
    this.data = [];
    sessionStorage.removeItem('historyStack');
    sessionStorage.removeItem('historyStackBackup');
    sessionStorage.setItem('searchKey', this.searchKey);
    this.fetchCranesByBMDRNK(this.searchKey);
  }

  handleBMDRNKClick(bmkey: string, bmdrnk: string): void {
    this.fetchData(bmkey, bmdrnk);
  }

  navigateToEdit(bmkey1: number): void {
    this.spinner.show();
    setTimeout(() => this.spinner.hide(), 2000);
    this.router.navigateByUrl(`cranes/editCrane/${bmkey1}`);
  }

  navigateToCraneNotes(bmkey1: number): void {
    this.router.navigateByUrl(`cranes/craneNotes/${bmkey1}`);
  }

  goBack(): void {
    const poppedData = this.historyStack.pop();
    if (poppedData) {
      this.data = poppedData;
      sessionStorage.setItem('historyStack', JSON.stringify(this.data));
      sessionStorage.setItem(
        'historyStackBackup',
        JSON.stringify(this.historyStack)
      );
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.errorMessage = '';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
