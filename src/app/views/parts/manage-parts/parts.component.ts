// src/app/views/parts/parts.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartsService } from 'src/app/services/parts.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss'],
})
export class PartsComponent implements OnInit {
  userName: string;
  highestRank: any;
  frame: string = '';
  parts: any[] = [];
  selectedPartDetails: any = null;
  errorMessage1: string;
  errorMessage2: string;

  constructor(
    private partsService: PartsService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.userName = sessionStorage.getItem('userName') || '';
    this.highestRank = sessionStorage.getItem('highestRank') || '';
    this.route.params.subscribe((params) => {
      this.frame = params['frame'];
      this.onSearch();
    });
  }

  onSearch() {
    if (this.frame) {
      this.spinner.show();
      this.partsService.getParts(this.frame).subscribe((response: any[]) => {
        if (response.length === 0) {
          this.errorMessage1 = 'No Data Found';
          this.selectedPartDetails = null;
          this.spinner.hide();
          this.parts = [];
        } else {
          this.spinner.hide();
          this.highestRank = sessionStorage.getItem('highestRank');
          console.log(this.highestRank);
          this.errorMessage1 = '';
          this.parts = response.map((part) => ({
            mpbn: part.mpbn,
            mpvp: part.mpvp,
            mpde: part.mpde,
          }));
        }
      });
    }
  }

  onMpvpClick(mpvp: string) {
    this.spinner.show();
    this.partsService.getPartDetails(mpvp).subscribe(
      (response: any) => {
        if (response.length === 0) {
          this.spinner.hide();
          this.selectedPartDetails = null;
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }, 0);
          this.errorMessage2 = 'No Data Found';
        } else {
          this.spinner.hide();
          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth',
            });
          }, 0);
          const partDetail = response[0];
          this.selectedPartDetails = {
            partid: partDetail.partid,
            prnumb: partDetail.prnumb,
            description: [
              partDetail.prdes1,
              partDetail.prdes2,
              partDetail.prdes3,
              partDetail.prdes4,
              partDetail.prdes5,
            ]
              .filter((desc) => desc) // Filter out null or undefined values
              .join(', '),
            prqnty: partDetail.prqnty,
            prbloc: partDetail.prbloc,
            PRBLOC: partDetail.prbloc,
            PRSTAT: partDetail.prstat,
            PRAISL: partDetail.praisl,
            PRSECT: partDetail.prsect,
          };
        }
      },
      (error) => {
        this.spinner.hide();
        this.selectedPartDetails = null;
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }, 0);
        this.errorMessage2 =
          error === '404 Not Found' ? 'Part not found' : 'No Data Found';
      }
    );
  }

  navigateToEdit(bmkey1: number): void {
    this.router.navigateByUrl(`parts/edit/${bmkey1}/${this.frame}`);
  }
}
