import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
  selector: 'app-footer',
  styleUrl: './footer.component.scss',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  protected time: Date;

  ngOnInit(): void {
    this.time = new Date();
  }
}
