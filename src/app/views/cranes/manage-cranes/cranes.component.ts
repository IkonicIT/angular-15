import { Component, OnInit } from '@angular/core'; // Adjust the path as needed
import { Router } from '@angular/router';
import { CranesService } from 'src/app/services/cranes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cranes',
  templateUrl: './cranes.component.html',
  styleUrls: ['./cranes.component.scss'],
})
export class CranesComponent implements OnInit {
  searchKey: string = '';
  data: any[] = [];
  errorMessage: string;
  successMessage: string;
  highestRank: any;
  plantName: any;
  bmdrnk: any;
  bmkey: any;
  bmkey1: any;
  isFromQueryParams: boolean = false;
  previousData: any[] = [];
  historyStack: any[][] = [];

  constructor(
    private cranesService: CranesService,
    private router: Router,
    private location: Location,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.highestRank = sessionStorage.getItem('highestRank') ?? '';
    this.searchKey = sessionStorage.getItem('searchKey') ?? '';
    const historyStackData = sessionStorage.getItem('historyStack');
    const historyStackBackup = sessionStorage.getItem('historyStackBackup');
    this.historyStack = historyStackBackup
      ? JSON.parse(historyStackBackup)
      : [];
    console.log('Data::', this.data, this.historyStack);

    this.route.queryParams.subscribe((params) => {
      const bmdrnk = params['bmdrnk'];
      const bmkey1 = params['bmkey1'];
      const bmkey = params['bmkey2'];
      console.log('bmkey:::', bmdrnk, bmkey1, bmkey);
      if (!bmdrnk && !bmkey1 && !bmkey) {
        this.data = historyStackData ? JSON.parse(historyStackData) : [];
        this.isFromQueryParams = false;
        return;
      } else {
        if (bmdrnk === this.searchKey) {
          this.isFromQueryParams = true;
          this.fetchCranesByBMDRNK(bmdrnk);
        } else {
          this.isFromQueryParams = true;
          this.fetchData(bmkey, bmdrnk);
        }
      }
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { bmdrnk: null, bmkey1: null, bmkey2: null },
        queryParamsHandling: 'merge',
      });
    });
  }

  fetchData(key: string, bmdrnk: string) {
    this.spinner.show();
    this.cranesService.getCranesData(key).subscribe(
      (response: any[]) => {
        this.spinner.hide();
        if (response.length === 0) {
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
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
          // }
          this.isFromQueryParams = false;
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.spinner.hide();
      }
    );
  }

  fetchCranesByBMDRNK(key: string) {
    this.spinner.show();
    this.cranesService.getCranesByBMDRNK(key).subscribe(
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
          // }
          this.isFromQueryParams = false;
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.spinner.hide();
      }
    );
  }

  handleSearch() {
    this.historyStack.length = 0;
    this.data = [];
    sessionStorage.removeItem('historyStack');
    sessionStorage.removeItem('historyStackBackup');
    sessionStorage.setItem('searchKey', this.searchKey);
    this.fetchCranesByBMDRNK(this.searchKey);
  }

  handleBMDRNKClick(bmkey: string, bmdrnk: string) {
    this.fetchData(bmkey, bmdrnk);
  }

  navigateToEdit(bmkey1: number): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
    this.router.navigateByUrl(`cranes/editCrane/${bmkey1}`);
  }

  navigateToCraneNotes(bmkey1: number): void {
    this.router.navigateByUrl(`cranes/craneNotes/${bmkey1}`);
  }
  goBack() {
    const poppedData = this.historyStack.pop();
    if (poppedData) {
      this.data = poppedData;
      sessionStorage.setItem('historyStack', JSON.stringify(this.data));
      sessionStorage.setItem(
        'historyStackBackup',
        JSON.stringify(this.historyStack)
      );
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    this, (this.errorMessage = '');
  }
}
