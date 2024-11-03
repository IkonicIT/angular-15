import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PartsService } from 'src/app/services/parts.service';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-part',
  templateUrl: './edit-parts.component.html',
  styleUrls: ['./edit-parts.component.scss'],
})
export class EditPartComponent implements OnInit {
  partForm: FormGroup;
  highestRank: any;
  successMessage: string;
  frame: any;

  constructor(
    private route: ActivatedRoute,
    private partsService: PartsService,
    private fb: FormBuilder,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.partForm = this.fb.group({
      partid: [],
      prplnt: [],
      prnumb: [],
      prfil1: [''],
      prdes1: [''],
      prdes2: [''],
      prdes3: [''],
      prdes4: [''],
      prdes5: [''],
      pruna1: [''],
      pruna2: [''],
      pruna3: [''],
      pruna4: [''],
      pruna5: [''],
      prunmo: [''],
      prwoin: [''],
      prbloc: [''],
      prcorp: [''],
      prstrm: [],
      prstat: [''],
      praisl: [],
      prsect: [],
      prfil2: [''],
      prropt: [],
      prroqt: [],
      prcydt: [''],
      prcyfr: [],
      prhp01: [],
      prhdt1: [''],
      prhqt1: [],
      prhpr1: [],
      prhfr1: [],
      prhp02: [],
      prhdt2: [''],
      prhqt2: [],
      prhpr2: [],
      prhfr2: [],
      prhp03: [''],
      prhvn3: [''],
      prhdt3: [''],
      prhqt3: [],
      prhpr3: [],
      prhfr3: [],
      prhp04: [''],
      prhvn4: [''],
      prhdt4: [''],
      prhqt4: [],
      prhpr4: [],
      prhfr4: [],
      prunmd: [''],
      prlead: [],
      prlstu: [],
      prytdu: [],
      prvpno: [''],
      prclas: [],
      prwun1: [],
      prwun2: [],
      prwrd2: [''],
      prwun3: [],
      prwrd3: [''],
      prdraw: [''],
      prisq1: [],
      prisd1: [''],
      prisq2: [],
      prisd2: [''],
      prisq3: [],
      prisd3: [''],
      prisq4: [],
      prisd4: [''],
      prisq5: [],
      prisd5: [''],
      prisq6: [],
      prisd6: [''],
      prisq7: [],
      prisd7: [''],
      prisq8: [],
      prisd8: [''],
      prisq9: [],
      prisd9: [''],
      prisqa: [],
      prisda: [''],
      pracct: [],
      prprf1: [''],
      prprf2: [''],
      prprf3: [''],
      prprf4: [''],
      prprf5: [''],
      prush1: [],
      prush2: [],
      prush3: [],
      prush4: [],
      prush5: [],
      prcstc: [],
      prentd: [],
      prvpol: [''],
      prfil3: [''],
      prdchg: [],
      prtchg: [],
      proper: [''],
      prprgm: [''],
      prqnty: [],
      prhvn1: [''],
      prhvn2: [''],
      prwrd1: [''],
    });
  }

  ngOnInit(): void {
    const partId = this.route.snapshot.paramMap.get('id');
    if (partId) {
      this.partsService.getPartData(+partId).subscribe((data) => {
        this.partForm.patchValue(data);
      });
    }
    this.highestRank = sessionStorage.getItem('highestRank');
    this.route.params.subscribe((params) => {
      this.frame = params['frame'] || '';
    });
  }

  navigateToParts() {
    this.location.back();
  }

  updatePart(): void {
    const partId = this.route.snapshot.paramMap.get('id');
    if (partId) {
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 2000);
      this.partsService
        .updatePart(+partId, this.partForm.value)
        .subscribe((response) => {
          this.successMessage = 'Part updated successfully';
          this.cdr.detectChanges();
          window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top
          this.spinner.hide();
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
            this.navigateToParts();
          }, 3000); // 3 seconds
        });
    }
  }
}
