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

  ngOnInit(): void {
    this.highestRank = sessionStorage.getItem("highestRank") || "";
    sessionStorage.removeItem("bmdrnkHistory"); // reset on fresh load
  }

  private getHistory(): string[] {
    return JSON.parse(sessionStorage.getItem("bmdrnkHistory") || "[]");
  }

  private setHistory(history: string[]): void {
    sessionStorage.setItem("bmdrnkHistory", JSON.stringify(history));
  }

  private pushToHistory(bmdrnk: string): void {
    const history = this.getHistory();
    if (history[history.length - 1] !== bmdrnk) {
      history.push(bmdrnk);
      this.setHistory(history);
    }
  }

  handleSearch(): void {
    if (!this.searchKey || this.searchKey.trim() === "") {
      this.errorMessage = "Please enter a BMDRNK to search.";
      this.data = [];
      return;
    }

    this.errorMessage = "";
    this.pushToHistory(this.searchKey);
    this.fetchCranesByBMDRNK(this.searchKey);
  }

  fetchCranesByBMDRNK(bmdrnk: string): void {
    this.spinner.show();
    this.searchKey = bmdrnk;
    this.cranesService.getCranesByBMDRNK(bmdrnk).subscribe({
      next: (response: any[]) => {
        this.spinner.hide();
        this.data = response || [];
        this.errorMessage = this.data.length ? "" : "No Data Found";
      },
      error: (err) => {
        console.error("Error fetching cranes:", err);
        this.spinner.hide();
        this.errorMessage = "Error fetching data. Please try again.";
      },
    });
  }

  handleBMDRNKClick(BMKEY: string, BMDRNK: string): void {
    this.spinner.show();
    this.cranesService.getCranesData(BMKEY).subscribe({
      next: (response: any[]) => {
        this.spinner.hide();
        this.data = response || [];
        this.errorMessage = this.data.length
          ? ""
          : `No Data Found For BMDRNK: ${BMDRNK}`;
      },
      error: (err) => {
        console.error("Error fetching crane data:", err);
        this.spinner.hide();
        this.errorMessage = "Error fetching data. Please try again.";
      },
    });
  }

  goBack(): void {
    const history = this.getHistory();
    history.pop();

    if (history.length > 0) {
      const previousBMDRNK = history[history.length - 1];
      this.setHistory(history);
      this.fetchCranesByBMDRNK(previousBMDRNK);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.setHistory([]);
      this.searchKey = "";
      this.data = [];
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.errorMessage = "";
    }
     window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
    }
    this.index = id;
    this.inbmd = bmdrnk;
    this.modalRef = this.modalService.show(template, { class: "modal-lg" });
  }

  confirm(): void {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = null;
    }

    this.spinner.show();
    this.cranesService.deleteCrane(this.index).subscribe({
      next: () => this.afterDelete(),
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
  showBackButton(): boolean {
  return this.getHistory().length > 0;
}

  decline(): void {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = null;
    }
  }
}