import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { CranesService } from 'src/app/services/cranes.service';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
  index: any;
  message: string = '';
  modalRef: BsModalRef | null = null;
  highestRank: any;
  plantName: any;
  BMDRNK: any;
  BMKEY: any;
  BMKEY1: any;
  isFromQueryParams: boolean = false;
  previousData: any[] = [];
  historyStack: any[][] = [];

  private subscriptions = new Subscription();

  constructor(
    private modalService: BsModalService,
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

    this.historyStack = historyStackBackup ? JSON.parse(historyStackBackup) : [];

    const sub = this.route.queryParams.subscribe((params) => {
      const BMDRNK = params['BMDRNK'];
      const BMKEY1 = params['BMKEY1'];
      const BMKEY = params['BMKEY2'];

      if (!BMDRNK && !BMKEY1 && !BMKEY) {
        this.data = historyStackData ? JSON.parse(historyStackData) : [];
        this.isFromQueryParams = false;
        return;
      } else {
        this.isFromQueryParams = true;
        if (BMDRNK === this.searchKey) {
          this.fetchCranesByBMDRNK(BMDRNK);
        } else {
          this.fetchData(BMKEY, BMDRNK);
        }
      }

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { BMDRNK: null, BMKEY1: null, BMKEY2: null },
        queryParamsHandling: 'merge',
      });
    });

    this.subscriptions.add(sub);
  }

  fetchData(key: string, BMDRNK: string): void {
    this.spinner.show();
    const sub = this.cranesService.getCranesData(key).subscribe(
      (response: any[]) => {
        this.spinner.hide();
        if (response.length === 0) {
          this.errorMessage = 'No Data Found For BMDRNK: ' + BMDRNK;
          this.data = [];
        } else {
          this.historyStack.push([...this.data]);
          this.data = response;
          sessionStorage.setItem('historyStack', JSON.stringify(this.data));
          sessionStorage.setItem('historyStackBackup', JSON.stringify(this.historyStack));
          this.errorMessage = '';
          this.isFromQueryParams = false;
        }
      },
      () => this.spinner.hide()
    );
    this.subscriptions.add(sub);
  }

  fetchCranesByBMDRNK(key: string): void {
    this.spinner.show();
    const sub = this.cranesService.getCranesByBMDRNK(key).subscribe(
      (response: any[]) => {
        this.spinner.hide();
        if (response.length === 0) {
          this.errorMessage = 'No Data Found';
          this.data = [];
        } else {
          this.historyStack.push([...this.data]);
          this.data = response;
          sessionStorage.setItem('historyStack', JSON.stringify(this.data));
          sessionStorage.setItem('historyStackBackup', JSON.stringify(this.historyStack));
          this.errorMessage = '';
          this.isFromQueryParams = false;
        }
      },
      () => this.spinner.hide()
    );
    this.subscriptions.add(sub);
  }

  handleSearch(): void {
    this.historyStack.length = 0;
    this.data = [];
    sessionStorage.removeItem('historyStack');
    sessionStorage.removeItem('historyStackBackup');
    sessionStorage.setItem('searchKey', this.searchKey);

    this.spinner.show();
    this.cranesService.getCranesByBMDRNK(this.searchKey).subscribe({
      next: (response: any[]) => {
        this.spinner.hide();
        this.data = response || [];
        this.errorMessage = this.data.length ? '' : 'No Data Found';
      },
      error: () => this.spinner.hide(),
    });
  }

  handleBMDRNKClick(BMKEY: string, BMDRNK: string): void {
    this.fetchData(BMKEY, BMDRNK);
  }

  navigateToEdit(BMKEY1: number): void {
    this.spinner.show();
    setTimeout(() => this.spinner.hide(), 2000);
    this.router.navigateByUrl(`cranes/editCrane/${BMKEY1}`);
  }

  navigateToCraneNotes(BMKEY1: number): void {
    this.router.navigateByUrl(`cranes/craneNotes/${BMKEY1}`);
  }

  navigateToAdd(BMKEY1: number): void {
    this.router.navigateByUrl(`cranes/addCrane/${BMKEY1}`);
  }

  openModal(template: TemplateRef<any>, id: string): void {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = null;
    }
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
  this.message = 'Confirmed!';

  if (this.modalRef) {
    this.modalRef.hide();
    this.modalRef = null;
  }
  this.forceCloseModal();

  this.spinner.show();

  this.cranesService.deleteCrane(this.index).subscribe({
    next: () => {
      this.data = this.data.filter(item => item.BMKEY1 !== this.index);

      setTimeout(() => {
        this.handleSearch();
      }, 500);

      this.spinner.hide();
      this.forceCloseModal();
    },
    error: () => {
      this.spinner.hide();
      this.forceCloseModal();
    },
  });
}

  decline(): void {
    this.message = 'Declined!';
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = null;
    }
    this.forceCloseModal();
  }

  private forceCloseModal(): void {
    try {
      this.modalService.hide();
    } catch (err) {}

    setTimeout(() => {
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach((b) => b.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'auto';
    }, 100);
  }

  goBack(): void {
    const poppedData = this.historyStack.pop();
    if (poppedData) {
      this.data = poppedData;
      sessionStorage.setItem('historyStack', JSON.stringify(this.data));
      sessionStorage.setItem('historyStackBackup', JSON.stringify(this.historyStack));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.errorMessage = '';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
