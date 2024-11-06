import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CranesService } from 'src/app/services/cranes.service';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-cranes',
  templateUrl: './edit-cranes.component.html',
  styleUrls: ['./edit-cranes.component.scss'],
})
export class EditCranesComponent implements OnInit {
  craneData: any = {};
  highestRank: any;
  successMessage: string;
  bmkey1: any;
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
      this.cranesService.getCranesInfoData(this.bmkey1).subscribe((data) => {
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
        .subscribe((response) => {
          this.successMessage = 'Crane updated successfully';
          this.cdr.detectChanges();
          window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top
          this.spinner.hide();
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
            this.router.navigate([`/cranes`], {
              queryParams: {
                bmdrnk: this.craneData.bmdrnk,
                bmkey: this.craneData.bmkey1,
                bmkey2: this.craneData.bmkey2.bmkey1,
              },
            });
          }, 3000); // 3 seconds
        });
    }
  }
}
