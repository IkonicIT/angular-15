import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CranesService } from 'src/app/services/cranes.service';

@Component({
  selector: 'app-edit-cranes',
  templateUrl: './edit-cranes.component.html',
  styleUrls: ['./edit-cranes.component.scss'],
})
export class EditCranesComponent implements OnInit, OnDestroy {
  craneData: any = {};
  highestRank: any;
  successMessage: string = '';
  bmkey1: any;

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private cranesService: CranesService,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bmkey1 = this.route.snapshot.paramMap.get('id');
    if (this.bmkey1) {
      const sub = this.cranesService
        .getCranesInfoData(this.bmkey1)
        .subscribe((data) => {
          this.craneData = data;
        });
      this.subscriptions.add(sub);
    }
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  navigateToCranes(): void {
    this.location.back();
  }

  updateCrane(): void {
    if (this.craneData.bmkey1) {
      this.spinner.show();
      const sub = this.cranesService
        .updateCraneData(this.craneData.bmkey1, this.craneData)
        .subscribe(() => {
          this.successMessage = 'Crane updated successfully';
          this.cdr.detectChanges();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.spinner.hide();

          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
            this.router.navigate(['/cranes'], {
              queryParams: {
                bmdrnk: this.craneData.bmdrnk,
                bmkey: this.craneData.bmkey1,
                bmkey2: this.craneData.bmkey2?.bmkey1,
              },
            });
          }, 3000);
        });
      this.subscriptions.add(sub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
