import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyTypesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-company-type',
  templateUrl: './add-company-type.component.html',
  styleUrls: ['./add-company-type.component.scss'],
})
export class AddCompanyTypeComponent implements OnInit, OnDestroy {
  model: any = {
    parentType: 0,
  };
  index: number = 0;
  date: number = Date.now();
  companyId: number = 0;
  private sub!: Subscription;
  cmpTypes: any[] = [];
  value: any;
  items: TreeviewItem[] = [];
  config: TreeviewConfig = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  userName: string | null = null;
  helpFlag: boolean = false;
  loader: boolean = false;

  constructor(
    private companyTypesService: CompanyTypesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    const idParam = this.route.snapshot.params['id'];
    this.companyId = idParam ? +idParam : 0;
    console.log('companyId = ' + this.companyId);
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');

    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || this.companyId;
      console.log('Query params companyId = ', this.companyId);
      this.getAllTypes(this.companyId);
    });

    console.log('companyId (onInit) = ' + this.companyId);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getAllTypes(companyId: number): void {
    this.spinner.show();

    this.companyTypesService
      .getAllCompanyTypesWithHierarchy(companyId)
      .subscribe(
        (response: any) => {
          this.spinner.hide();
          this.cmpTypes = response || [];

          if (this.cmpTypes.length > 0) {
            this.items = this.generateHierarchy(this.cmpTypes);
          }
        },
        (error) => {
          this.spinner.hide();
          console.error('Error fetching company types', error);
        }
      );
  }

  generateHierarchy(typeList: any[]): TreeviewItem[] {
    const items: TreeviewItem[] = [];
    typeList.forEach((type) => {
      const children =
        type.typeList && type.typeList.length > 0
          ? this.generateHierarchy(type.typeList)
          : [];

      items.push(
        new TreeviewItem({
          text: type.name,
          value: type.typeId,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  saveCompanyType(): void {
    if (!this.model.nameOfType) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    this.model.by = this.userName;
    this.model.added = this.date;

    const request = {
      attributeSearchDisplay: 0,
      company: {
        companyId: this.companyId,
      },
      description: this.model.description,
      entityTypeId: 0,
      hostingFee: this.model.hostingFee ? this.model.hostingFee : 0,
      isHidden: true,
      lastModifiedBy: this.userName,
      moduleType: 'companytype',
      name: this.model.nameOfType,
      parentId: {
        typeId: this.value ? this.value : 0,
      },
      typeId: 0,
      typeMtbs: 0,
      typeSpareRatio: 0,
    };

    this.spinner.show();
    console.log(JSON.stringify(request));

    this.companyTypesService.saveCompanyType(request).subscribe(
      (response) => {
        this.spinner.hide();
        this.index = 1;

        setTimeout(() => {
          this.index = 0;
        }, 7000);

        window.scroll(0, 0);
        this.router.navigate(['/company/types/' + this.companyId]);
      },
      (error) => {
        this.spinner.hide();
        console.error('Error saving company type', error);
      }
    );
  }

  onValueChange(value: any): void {
    console.log(value);
  }

  cancelCompanyDocument(): void {
    this.router.navigate(['/company/types/' + this.companyId]);
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
