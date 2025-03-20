import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { UsersService } from '../../services/users.service';

// Register required chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: false,
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})

export class ChartComponent {
  chart!: Chart<"bar", number[], string>;
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.chart) {
      this.chart.resize();
    }
  }
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  userRolesCount: { [role: string]: number } = {}; // Object to store role counts

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.users$.subscribe(users => {
      this.userRolesCount = this.countUserRoles(users);
      this.createChart(); // Create chart after data is available
    });
  }

  countUserRoles(users: any[]): { [role: string]: number } {
    const roleCounts: { [role: string]: number } = {};
    users.forEach(user => {
      roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
    });
    return roleCounts;
  }

  createChart(): void {
    if (!this.chartCanvas || !this.chartCanvas.nativeElement) return;
    // **Destroy existing chart instance before creating a new one**
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar', // Bar chart
      data: {
        labels: Object.keys(this.userRolesCount), // Role names (Admin, Editor, etc.)
        datasets: [
          {
            label: 'User Roles',
            data: Object.values(this.userRolesCount), // Count of each role
            backgroundColor: ['#1c4980', '#383838', '#ffce56'], // Colors
            borderColor: '#ffffff',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        color: 'white',
        plugins: {
          legend: {
            display: false // Hide the legend (blue bar above the chart)
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
  }

  ngAfterViewInit(): void {
    this.createChart();
  }
}
