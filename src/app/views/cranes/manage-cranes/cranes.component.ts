import { Component, OnInit } from '@angular/core'; // Adjust the path as needed
import { Router } from '@angular/router';
import { CranesService } from 'src/app/services/cranes.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cranes',
  templateUrl: './cranes.component.html',
  styleUrls: ['./cranes.component.scss'],
})
export class CranesComponent implements OnInit {
  highestRank: number; // Declare highestRank as a number

  searchKey: string = '';
  data: any[] = [];
  errorMessage: string;
  successMessage: string;
  plantName: any;
  previousData: any[] = []; // To store previous data
  historyStack: any[][] = [];

  constructor(
    private cranesService: CranesService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit() {
    this.highestRank = parseInt(
      sessionStorage.getItem('highestRank') || '0',
      10
    ); // Use parseInt to convert to number
  }

  // Fetch initial cranes data
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
          // Store current data before replacing it
          if (this.data.length > 0) {
            this.historyStack.push([...this.data]); // Store a copy of current data
          } // Save the current data as backup
          this.data = response;
          this.plantName = this.data[0].bmkey2.bmdes1;
          this.errorMessage = '';
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.spinner.hide();
      }
    );
  }

  // Fetch cranes based on BMDRNK
  fetchCranesByBMDRNK(key: string) {
    this.spinner.show();
    this.cranesService.getCranesByBMDRNK(key).subscribe(
      (response: any[]) => {
        this.spinner.hide();
        if (response.length === 0) {
          this.errorMessage = 'No Data Found';
          this.data = [];
        } else {
          if (this.data.length > 0) {
            this.historyStack.push([...this.data]); // Store a copy of current data
          }
          //     this.previousData = [...this.data];  // Save the current data before displaying new data
          this.data = response;
          this.plantName = this.data[0].bmkey2.bmdes1;
          this.errorMessage = '';
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.spinner.hide();
      }
    );
  }

  // Handle search
  handleSearch() {
    this.fetchCranesByBMDRNK(this.searchKey);
  }

  // Handle BMDRNK click
  handleBMDRNKClick(bmkey: string, bmdrnk: string) {
    this.fetchData(bmkey, bmdrnk);
  }

  // Navigate to edit page
  navigateToEdit(bmkey1: number): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
    this.router.navigateByUrl(`cranes/editCrane/${bmkey1}`);
  }

  // Handle "Back" button click - restore previous data
  goBack() {
    if (this.historyStack.length > 0) {
      this.data = this.historyStack.pop() ?? [];
      this.errorMessage = '';
    }
  }
}
