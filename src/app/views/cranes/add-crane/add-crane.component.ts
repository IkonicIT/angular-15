import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CranesService } from 'src/app/services/cranes.service';

@Component({
  selector: 'app-edit-cranes',
  templateUrl: './add-crane.component.html',
  styleUrls: ['./add-crane.component.scss'],
})
export class AddCraneComponent implements OnInit, OnDestroy {
 craneData: any = {
  BMKEY1: null,
  BMKEY2: null,
  BMDRNK: '',
  BMDES1: '',
  BMDES2: '',
  BMDES3: '',
  BMDRNO: '',
  BMSTO1: '',
  BMSTO2: '',
  BMQTYU: null,
  BMCOMM: '',
  BMNOT1: '',
  BMNOT2: '',
  BMNOT3: '',
  BMBIN1: '',
  BMBIN2: '',
  BMFRAM: '',
  BMINIT: '',
  BMTERM: '',
  BMPCHG: null,
  BMDCHG: null,
  BMTCHG: null
};

  highestRank: any;
  successMessage: string = '';
  BMKEY2: any;

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
    this.BMKEY2 = this.route.snapshot.paramMap.get('id');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  navigateToCranes(): void {
    this.location.back();
  }

  addCrane(): void {
  
    this.spinner.show();

    let payload;
    if(this.BMKEY2==0)
    {
      payload = {
      ...this.craneData,
      BMKEY2: null
    };
    }
    else
    {
        payload = {
      ...this.craneData,
      BMKEY2:
      {
        BMKEY1 :this.BMKEY2,
      }
        }
      }

    const sub = this.cranesService.addCrane(payload).subscribe((res) => {
      this.successMessage = 'Crane added successfully';
      this.cdr.detectChanges();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.spinner.hide();
      setTimeout(() => {
        this.successMessage = '';
        this.cdr.detectChanges();
        this.router.navigate(['/cranes'], {
          queryParams: {
            BMDRNK: this.craneData.BMDRNK,
            BMKEY: this.craneData.BMKEY1,
            BMKEY2: this.craneData.BMKEY2? this.craneData.BMKEY1 : null,
          },
        });
      }, 3000);
    });

    this.subscriptions.add(sub);
  
}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
