import { Component, OnInit, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { NgxSpinnerService } from "ngx-spinner";
import { CranesService } from "src/app/services/cranes.service";

@Component({
  selector: "app-cranes",
  templateUrl: "./cranes.component.html",
  styleUrls: ["./cranes.component.scss"],
})
export class CranesComponent implements OnInit {
  searchKey: string = "";
  data: any[] = [];
  errorMessage: string = "";
  message: string = "";
  index: any;
  inbmd: any;
  modalRef: BsModalRef | null = null;
  highestRank: any;

  constructor(
    private modalService: BsModalService,
    private cranesService: CranesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.highestRank = sessionStorage.getItem("highestRank") || "";

    this.route.queryParams.subscribe((params) => {
      const BMDRNK = params["BMDRNK"];
      if (BMDRNK) {
        this.refreshByBMDRNK(BMDRNK);

        setTimeout(() => {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { BMDRNK: null },
            queryParamsHandling: "merge",
          });
        }, 300);
      }
    });
  }

  handleSearch() {
    if (!this.searchKey || this.searchKey.trim() === "") {
      this.errorMessage = "Please enter a BMDRNK to search.";
      this.data = [];
      return;
    }

    this.errorMessage = "";
    this.fetchCranesByBMDRNK(this.searchKey);
  }

  fetchCranesByBMDRNK(bmdrnk: string) {
    this.spinner.show();
    this.cranesService.getCranesByBMDRNK(bmdrnk).subscribe({
      next: (response: any[]) => {
        this.spinner.hide();
        if (!response || response.length === 0) {
          this.errorMessage = "No Data Found";
          this.data = [];
           this.spinner.hide();
        } else {
          this.data = response;
          this.errorMessage = "";
          console.log(response);
           this.spinner.hide();
        }
      },
      error: (err) => {
        console.error("Error fetching cranes:", err);
        this.spinner.hide();
        this.errorMessage = "Error fetching data. Please try again.";
      },
    });
  }

  handleBMDRNKClick(BMKEY: string, BMDRNK: string) {
    this.spinner.show();
    this.cranesService.getCranesData(BMKEY).subscribe({
      next: (response: any[]) => {
        this.spinner.hide();
        if (!response || response.length === 0) {
          this.errorMessage = `No Data Found For BMDRNK: ${BMDRNK}`;
          this.data = [];
        } else {
          this.data = response;
          this.errorMessage = "";
        }
      },
      error: (err) => {
        console.error("Error fetching crane data:", err);
        this.spinner.hide();
        this.errorMessage = "Error fetching data. Please try again.";
      },
    });
  }

  refreshByBMDRNK(bmdrnk: string) {
    if (!bmdrnk) return;
    this.searchKey = bmdrnk;
    this.spinner.show();

    this.cranesService.getCranesByBMDRNK(bmdrnk).subscribe({
      next: (response: any[]) => {
        this.spinner.hide();
        if (!response || response.length === 0) {
          this.errorMessage = "No Data Found";
          this.data = [];
        } else {
          this.data = response;
          this.errorMessage = "";
        }
      },
      error: (err) => {
        console.error("Error refreshing cranes:", err);
        this.spinner.hide();
        this.errorMessage = "Error fetching data. Please try again.";
      },
    });
  }

  // navigateToAdd(BMKEY1: number, BMDRNK?: string): void {
  //   this.router.navigate([`cranes/addCrane/${BMKEY1}`], {
  //     queryParams: BMDRNK ? { BMDRNK } : {},
  //   });
  // }
navigateToAdd(BMKEY1: number): void {
    this.router.navigateByUrl(`cranes/addCrane/${BMKEY1}`);
  }

  navigateToEdit(BMKEY1: number, BMDRNK?: string): void {
    this.router.navigate([`cranes/editCrane/${BMKEY1}`], {
      queryParams: BMDRNK ? { BMDRNK } : {},
    });
  }

  navigateToCraneNotes(BMKEY1: number, BMDRNK?: string): void {
  this.router.navigate([`cranes/craneNotes/${BMKEY1}`], {
    queryParams: BMDRNK ? { BMDRNK } : {},
  });
}


  openModal(template: TemplateRef<any>, id: string, bmdrnk: string): void {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = null;
    }
    this.index = id;
    this.inbmd = bmdrnk;
    this.modalRef = this.modalService.show(template, { class: "modal-lg" });
  }

  confirm(): void {
    this.message = "Confirmed!";
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = null;
    }

    this.spinner.show();
    this.cranesService.deleteCrane(this.index).subscribe({
      next: () => {
        this.afterDelete();
      },
      error: (err) => {
        if (err.status === 200 || err.statusText === "OK") {
          this.afterDelete();
        } else {
          this.spinner.hide();
          this.errorMessage = "Failed to delete. Please try again.";
        }
      },
    });
  }

  private afterDelete(): void {
    this.spinner.hide();
    this.data = this.data.filter((item) => item.BMKEY1 !== this.index);
    this.index = null;
    this.inbmd = null;
  }

  decline(): void {
    this.message = "Declined!";
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = null;
    }
  }
}