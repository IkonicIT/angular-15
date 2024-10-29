import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CranesService } from 'src/app/services/cranes.service';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-cranes',
  templateUrl: './edit-cranes.component.html',
  styleUrls: ['./edit-cranes.component.scss'],
})
export class EditCranesComponent implements OnInit {
  craneData: any = {};
  router: any;
  highestRank: any;
  successMessage: string;

  constructor(
    private route: ActivatedRoute,
    private cranesService: CranesService,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    const bmkey1 = this.route.snapshot.paramMap.get('id');
    if (bmkey1) {
      this.cranesService.getCranesInfoData(bmkey1).subscribe((data) => {
        this.craneData = data;
      });
    }
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  navigateToCranes(): void {
    this.location.back();
  }

  updateCrane(): void {
    if (this.craneData.bmkey1) {
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 3000);
      this.cranesService
        .updateCraneData(this.craneData.bmkey1, this.craneData)
        .subscribe((response: any) => {
          this.successMessage = 'Crane updated successfully';
          this.cdr.detectChanges();
          window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top
          this.spinner.hide();
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
          }, 3000); // 3 seconds
        });
    }
  }
}
