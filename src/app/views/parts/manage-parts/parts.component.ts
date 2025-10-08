import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PartsService } from 'src/app/services/parts.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss'],
})
export class PartsComponent implements OnInit {
  userName: string = '';
  highestRank: any;
  frame: string = '';
  parts: any[] = [];
  frameParts: any;
  selectedPartDetails: any = null;
  errorMessage1: string = '';
  errorMessage2: string = '';

  constructor(
    private partsService: PartsService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName') || '';
    this.highestRank = sessionStorage.getItem('highestRank');
    this.frame = sessionStorage.getItem('frameParts') || '';
    this.onSearch();
  }

  onSearch(): void {
    if (this.frame) {
      sessionStorage.setItem('frameParts', this.frame);
      this.spinner.show();
      this.partsService.getParts(this.frame).subscribe({
        next: (response) => {
          if (!response || response.length === 0) {
            this.errorMessage1 = 'No Data Found';
            this.selectedPartDetails = null;
            this.parts = [];
          } else {
            this.highestRank = sessionStorage.getItem('highestRank');
            this.errorMessage1 = '';
            this.parts = response.map((part: any) => ({
              mpbn: part.mpbn,
              mpvp: part.mpvp,
              mpde: part.mpde,
            }));
          }
          this.spinner.hide();
        },
        error: () => {
          this.spinner.hide();
          this.errorMessage1 = 'No Data Found';
          this.parts = [];
        },
      });
    }
  }

  onMpvpClick(mpvp: string): void {
    this.spinner.show();
    this.partsService.getPartDetails(mpvp).subscribe({
      next: (response) => {
        if (!response || response.length === 0) {
          this.selectedPartDetails = null;
          this.errorMessage2 = 'No Data Found';
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 0);
        } else {
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
              .filter((desc: string | null | undefined) => !!desc)
              .join(', '),
            prqnty: partDetail.prqnty,
            prbloc: partDetail.prbloc,
            PRBLOC: partDetail.prbloc,
            PRSTAT: partDetail.prstat,
            PRAISL: partDetail.praisl,
            PRSECT: partDetail.prsect,
          };
          this.errorMessage2 = '';
          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth',
            });
          }, 0);
        }
        this.spinner.hide();
      },
      error: (error) => {
        this.selectedPartDetails = null;
        this.errorMessage2 =
          error === '404 Not Found' ? 'Part not found' : 'No Data Found';
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 0);
        this.spinner.hide();
      },
    });
  }

  navigateToEdit(BMKEY1: number): void {
    this.router.navigateByUrl(`parts/edit/${BMKEY1}/${this.frame}`);
  }

  navigateToParts(partId: number): void {
    this.router.navigateByUrl(`parts/manageNotes/${partId}/${this.frame}`);
  }
}
