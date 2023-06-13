import { Component } from '@angular/core';
import { ChartType, ChartData } from 'chart.js';

@Component({
  templateUrl: 'widgets.component.html',
})
export class WidgetsComponent {
  public brandPrimary = '#20a8d8';
  public brandSuccess = '#4dbd74';
  public brandInfo = '#63c2de';
  public brandWarning = '#f8cb00';
  public brandDanger = '#f86c6b';

  // lineChart1
  public lineChart1Data: ChartData<'line'> = {
    datasets: [
      {
        data: [65, 59, 84, 84, 51, 55, 40],
        label: 'Series A',
        // grey
        backgroundColor: this.brandPrimary,
        borderColor: 'rgba(255,255,255,.55)',
      },
    ],
  };
  public lineChart1Labels: Array<any> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];
  public lineChart1Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          gridLines: {
            color: 'transparent',
            zeroLineColor: 'transparent',
          },
          ticks: {
            fontSize: 2,
            fontColor: 'transparent',
          },
        },
      ],
      yAxes: [
        {
          display: false,
          ticks: {
            display: false,
            min: 40 - 5,
            max: 84 + 5,
          },
        },
      ],
    },
    elements: {
      line: {
        borderWidth: 1,
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false,
    },
  };
  public lineChart1Legend = false;
  public lineChart1Type: ChartType = 'line';

  // lineChart2
  public lineChart2Data: ChartData<'line'> = {
    datasets: [
      {
        data: [1, 18, 9, 17, 34, 22, 11],
        label: 'Series A',
        // grey
        backgroundColor: this.brandInfo,
        borderColor: 'rgba(255,255,255,.55)',
      },
    ],
  };
  public lineChart2Labels: Array<any> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];
  public lineChart2Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          gridLines: {
            color: 'transparent',
            zeroLineColor: 'transparent',
          },
          ticks: {
            fontSize: 2,
            fontColor: 'transparent',
          },
        },
      ],
      yAxes: [
        {
          display: false,
          ticks: {
            display: false,
            min: 1 - 5,
            max: 34 + 5,
          },
        },
      ],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1,
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false,
    },
  };
  public lineChart2Legend = false;
  public lineChart2Type: ChartType = 'line';

  // lineChart3
  public lineChart3Data: ChartData<'line'> = {
    datasets: [
      {
        data: [78, 81, 80, 45, 34, 12, 40],
        label: 'Series A',
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
      },
    ],
  };
  public lineChart3Labels: Array<any> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];
  public lineChart3Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          display: false,
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false,
    },
  };
  public lineChart3Legend = false;
  public lineChart3Type: ChartType = 'line';

  // barChart1
  public barChart1Data: ChartData<'bar'> = {
    datasets: [
      {
        data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
        label: 'Series A',
        backgroundColor: 'rgba(255,255,255,.3)',
        borderWidth: 0,
      },
    ],
  };
  public barChart1Labels: Array<any> = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
  ];
  public barChart1Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          display: false,
          barPercentage: 0.6,
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
    legend: {
      display: false,
    },
  };
  public barChart1Legend = false;
  public barChart1Type: ChartType = 'bar';

  // lineChart4
  public lineChart4Data: ChartData<'line'> = {
    datasets: [
      {
        data: [4, 18, 9, 17, 34, 22, 11, 3, 15, 12, 18, 9],
        label: 'Series A',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        borderWidth: 2,
      },
    ],
  };
  public lineChart4Labels: Array<any> = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  public lineChart4Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          display: false,
          points: false,
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
    elements: { point: { radius: 0 } },
    legend: {
      display: false,
    },
  };
  public lineChart4Legend = false;
  public lineChart4Type: ChartType = 'line';

  // barChart2
  public barChart2Data: ChartData<'bar'> = {
    datasets: [
      {
        data: [4, 18, 9, 17, 34, 22, 11, 3, 15, 12, 18, 9],
        label: 'Series A',
        backgroundColor: 'rgba(0,0,0,.2)',
        borderWidth: 0,
      },
    ],
  };
  public barChart2Labels: Array<any> = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  public barChart2Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          display: false,
          barPercentage: 0.6,
        },
      ],
      yAxes: [
        {
          display: false,
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
  };
  public barChart2Legend = false;
  public barChart2Type: ChartType = 'bar';

  // barChart3
  public barChart3Data: ChartData<'bar'> = {
    datasets: [
      {
        data: [4, 18, 9, 17, 34, 22, 11, 3, 15, 12, 18, 9],
        label: 'Series A',
      },
    ],
  };
  public barChart3Labels: Array<any> = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  public barChart3Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          display: false,
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
    legend: {
      display: false,
    },
  };
  public barChart3Primary: Array<any> = [
    {
      backgroundColor: this.brandPrimary,
      borderColor: 'transparent',
      borderWidth: 1,
    },
  ];
  public barChart3Danger: Array<any> = [
    {
      backgroundColor: this.brandDanger,
      borderColor: 'transparent',
      borderWidth: 1,
    },
  ];
  public barChart3Success: Array<any> = [
    {
      backgroundColor: this.brandSuccess,
      borderColor: 'transparent',
      borderWidth: 1,
    },
  ];
  public barChart3Legend = false;
  public barChart3Type: ChartType = 'bar';

  // lineChart5
  public lineChart5Data: ChartData<'line'> = {
    datasets: [
      {
        data: [65, 59, 84, 84, 51, 55, 40],
        label: 'Series A',
      },
    ],
  };
  public lineChart5Labels: Array<any> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];
  public lineChart5Options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          display: false,
          points: false,
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
    elements: { point: { radius: 0 } },
    legend: {
      display: false,
    },
  };
  public lineChart5Info: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandInfo,
      borderWidth: 2,
    },
  ];
  public lineChart5Success: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandInfo,
      borderWidth: 2,
    },
  ];
  public lineChart5Warning: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: this.brandWarning,
      borderWidth: 2,
    },
  ];
  public lineChart5Legend = false;
  public lineChart5Type: ChartType = 'line';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
