import { Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../../services/company-management.service';
import { CompanyDocumentsService } from '../../services/company-documents.service';
import { saveAs } from 'file-saver';
import { Chart } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { isUndefined } from 'is-what';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public brandPrimary = '#20a8d8';
  public brandSuccess = '#4dbd74';
  public brandInfo = '#63c2de';
  public brandWarning = '#f8cb00';
  public brandDanger = '#f86c6b';
  order: string = 'description';
  reverse: string = '';
  globalCompanyDocumentFilter: any = '';
  itemsForPagination: number = 5;
  chart: any;
  public currentRole: string = '';
  public highestRank: string = '';
  globalCompany: any;
  documents: any[] = [];
  companyId: any;
  radioModel: string = 'Month';

  public res = {
    message: '',
    cod: '200',
    city_id: 2643743,
    calctime: 0.0875,
    cnt: 3,
    list: [
      {
        main: {
          temp: 279.946,
          temp_min: 279.946,
          temp_max: 279.946,
          pressure: 1016.76,
          sea_level: 1024.45,
          grnd_level: 1016.76,
          humidity: 100,
        },
        wind: { speed: 4.59, deg: 163.001 },
        clouds: { all: 92 },
        weather: [
          { id: 500, main: 'Rain', description: 'light rain', icon: '10n' },
        ],
        rain: { '3h': 2.69 },
        dt: 1485717216,
      },
      {
        main: {
          temp: 282.597,
          temp_min: 282.597,
          temp_max: 282.597,
          pressure: 1012.12,
          sea_level: 1019.71,
          grnd_level: 1012.12,
          humidity: 98,
        },
        wind: { speed: 4.04, deg: 226 },
        clouds: { all: 92 },
        weather: [
          { id: 500, main: 'Rain', description: 'light rain', icon: '10n' },
        ],
        rain: { '3h': 0.405 },
        dt: 1485745061,
      },
      {
        main: {
          temp: 279.38,
          pressure: 1011,
          humidity: 93,
          temp_min: 278.15,
          temp_max: 280.15,
        },
        wind: { speed: 2.6, deg: 30 },
        clouds: { all: 90 },
        weather: [
          { id: 701, main: 'Mist', description: 'mist', icon: '50d' },
          { id: 741, main: 'Fog', description: 'fog', icon: '50d' },
        ],
        dt: 1485768552,
      },
    ],
  };

  public lineChart1Data = [
    { data: [65, 59, 84, 84, 51, 55, 40], label: 'Series A' },
  ];
  public lineChart1Labels = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July'
  ];
  public lineChart1Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          gridLines: { color: 'transparent', zeroLineColor: 'transparent' },
          ticks: { fontSize: 2, fontColor: 'transparent' },
        },
      ],
      yAxes: [
        {
          display: false,
          ticks: { display: false, min: 35, max: 89 },
        },
      ],
    },
    elements: {
      line: { borderWidth: 1 },
      point: { radius: 4, hitRadius: 10, hoverRadius: 4 },
    },
    legend: { display: false },
  };
  public lineChart1Colours = [
    { backgroundColor: this.brandPrimary, borderColor: 'rgba(255,255,255,.55)' },
  ];
  public lineChart1Legend = false;
  public lineChart1Type = 'line';

  public lineChart2Data = [
    { data: [1, 18, 9, 17, 34, 22, 11], label: 'Series A' },
  ];
  public lineChart2Labels = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July'
  ];
  public lineChart2Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          gridLines: { color: 'transparent', zeroLineColor: 'transparent' },
          ticks: { fontSize: 2, fontColor: 'transparent' },
        },
      ],
      yAxes: [
        {
          display: false,
          ticks: { display: false, min: -4, max: 39 },
        },
      ],
    },
    elements: {
      line: { tension: 0.00001, borderWidth: 1 },
      point: { radius: 4, hitRadius: 10, hoverRadius: 4 },
    },
    legend: { display: false },
  };
  public lineChart2Colours = [
    { backgroundColor: this.brandInfo, borderColor: 'rgba(255,255,255,.55)' },
  ];
  public lineChart2Legend = false;
  public lineChart2Type = 'line';

  public lineChart3Data = [
    { data: [78, 81, 80, 45, 34, 12, 40], label: 'Series A' },
  ];
  public lineChart3Labels = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July'
  ];
  public lineChart3Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{ display: false }],
      yAxes: [{ display: false }],
    },
    elements: {
      line: { borderWidth: 2 },
      point: { radius: 0, hitRadius: 10, hoverRadius: 4 },
    },
    legend: { display: false },
  };
  public lineChart3Colours = [
    { backgroundColor: 'rgba(255,255,255,.2)', borderColor: 'rgba(255,255,255,.55)' },
  ];
  public lineChart3Legend = false;
  public lineChart3Type = 'line';

  public barChart1Data = [
    { data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40], label: 'Series A' },
  ];
  public barChart1Labels = [
    '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16'
  ];
  public barChart1Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{ display: false, barPercentage: 0.6 }],
      yAxes: [{ display: false }],
    },
    legend: { display: false },
  };
  public barChart1Colours = [
    { backgroundColor: 'rgba(255,255,255,.3)', borderWidth: 0 },
  ];
  public barChart1Legend = false;
  public barChart1Type = 'bar';

  public mainChartElements = 27;
  public mainChartData1: number[] = [];
  public mainChartData2: number[] = [];
  public mainChartData3: number[] = [];
  public mainChartData = [
    { data: this.mainChartData1, label: 'Current' },
    { data: this.mainChartData2, label: 'Previous' },
    { data: this.mainChartData3, label: 'BEP' },
  ];
  public mainChartLabels = [
    'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday',
    'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday',
    'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday',
    'Monday','Thursday','Wednesday','Thursday','Friday','Saturday','Sunday',
  ];
  public mainChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          gridLines: { drawOnChartArea: false },
          ticks: {
            callback: function (value: any) {
              return value.charAt(0);
            },
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5,
            stepSize: Math.ceil(250 / 5),
            max: 250,
          },
        },
      ],
    },
    elements: {
      line: { borderWidth: 2 },
      point: { radius: 0, hitRadius: 10, hoverRadius: 4, hoverBorderWidth: 3 },
    },
    legend: { display: false },
  };
  public mainChartColours = [
    {
      backgroundColor: this.convertHex(this.brandInfo, 10),
      borderColor: this.brandInfo,
      pointHoverBackgroundColor: '#fff',
    },
    {
      backgroundColor: 'transparent',
      borderColor: this.brandSuccess,
      pointHoverBackgroundColor: '#fff',
    },
    {
      backgroundColor: 'transparent',
      borderColor: this.brandDanger,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5],
    },
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';

  public socialChartData1 = [
    { data: [65, 59, 84, 84, 51, 55, 40], label: 'Facebook' },
  ];
  public socialChartData2 = [
    { data: [1, 13, 9, 17, 34, 41, 38], label: 'Twitter' },
  ];
  public socialChartData3 = [
    { data: [78, 81, 80, 45, 34, 12, 40], label: 'LinkedIn' },
  ];
  public socialChartData4 = [
    { data: [35, 23, 56, 22, 97, 23, 64], label: 'Google+' },
  ];
  public socialChartLabels = [
    'January','February','March','April','May','June','July'
  ];
  public socialChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{ display: false }],
      yAxes: [{ display: false }],
    },
    elements: {
      line: { borderWidth: 2 },
      point: { radius: 0, hitRadius: 10, hoverRadius: 4, hoverBorderWidth: 3 },
    },
    legend: { display: false },
  };
  public socialChartColours = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff',
    },
  ];
  public socialChartLegend = false;
  public socialChartType = 'line';

  public sparklineChartData1 = [
    { data: [35, 23, 56, 22, 97, 23, 64], label: 'Clients' },
  ];
  public sparklineChartData2 = [
    { data: [65, 59, 84, 84, 51, 55, 40], label: 'Clients' },
  ];
  public sparklineChartLabels = [
    'January','February','March','April','May','June','July'
  ];
  public sparklineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{ display: false }],
      yAxes: [{ display: false }],
    },
    elements: {
      line: { borderWidth: 2 },
      point: { radius: 0, hitRadius: 10, hoverRadius: 4, hoverBorderWidth: 3 },
    },
    legend: { display: false },
  };
  public sparklineChartDefault = [
    { backgroundColor: 'transparent', borderColor: '#d1d4d7' },
  ];
  public sparklineChartPrimary = [
    { backgroundColor: 'transparent', borderColor: this.brandPrimary },
  ];
  public sparklineChartInfo = [
    { backgroundColor: 'transparent', borderColor: this.brandInfo },
  ];
  public sparklineChartDanger = [
    { backgroundColor: 'transparent', borderColor: this.brandDanger },
  ];
  public sparklineChartWarning = [
    { backgroundColor: 'transparent', borderColor: this.brandWarning },
  ];
  public sparklineChartSuccess = [
    { backgroundColor: 'transparent', borderColor: this.brandSuccess },
  ];
  public sparklineChartLegend = false;
  public sparklineChartType = 'line';

  constructor(
    private companyManagementService: CompanyManagementService,
    private companyDocumentsService: CompanyDocumentsService,
    private spinner: NgxSpinnerService
  ) {
    this.currentRole = sessionStorage.getItem('currentRole') ?? '';
    this.highestRank = sessionStorage.getItem('highestRank') ?? '';
    if (isUndefined(this.currentRole)) {
      this.currentRole = 'Disabled';
    }
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      if (this.globalCompany) {
        this.companyId = this.globalCompany.companyId;
        this.documents = [];
      }
    });
  }

  ngOnInit(): void {
    for (let i = 0; i <= this.mainChartElements; i++) {
      this.mainChartData1.push(this.random(50, 200));
      this.mainChartData2.push(this.random(80, 100));
      this.mainChartData3.push(65);
    }
    let temp_max = this.res['list'].map((res) => res.main.temp_max);
    let temp_min = this.res['list'].map((res) => res.main.temp_min);
    let alldates = this.res['list'].map((res) => res.dt);

    let weatherDates: any[] = [];
    alldates.forEach((res) => {
      let jsdate = new Date(res * 1000);
      weatherDates.push(
        jsdate.toLocaleTimeString('en', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      );
    });
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: weatherDates,
        datasets: [
          {
            data: temp_max,
            borderColor: '#3cba9f',
            fill: false,
          },
          {
            data: temp_min,
            borderColor: '#ffcc00',
            fill: false,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
        },
        scales: {
          xAxes: { display: true },
          yAxes: { display: true },
        },
      },
    });
  }

  getDocuments(companyId: any) {
    this.companyDocumentsService
      .getAllCompanyDocuments(companyId)
      .subscribe((response) => {
        this.documents = Array.isArray(response) ? response : [];
      });
  }

  downloadFile(companyDocument: any) {
    const blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contentType
    );
    saveAs(blob, companyDocument.fileName);
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  public convertHex(hex: string, opacity: number) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
