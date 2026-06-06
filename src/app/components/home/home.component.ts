import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../hero/hero.component';
import { BrandsComponent } from '../brands/brands.component';
import { ServicesComponent } from '../services/services.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { AboutComponent } from '../about/about.component';
import { SkillsComponent } from '../skills/skills.component';
import { CareerComponent } from '../career/career.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    BrandsComponent,
    ServicesComponent,
    PortfolioComponent,
    AboutComponent,
    SkillsComponent,
    CareerComponent,
    ContactComponent
  ],
  template: `
    <main>
      <app-hero></app-hero>
      <app-brands></app-brands>
      <app-services></app-services>
      <app-portfolio id="portfolio"></app-portfolio>
      <app-about></app-about>
      <app-skills id="skills"></app-skills>
      <app-career></app-career>
      <app-contact></app-contact>
    </main>
  `,
  styles: [`
    main { 
      display: block; 
      position: relative;
      z-index: 1;
    }
  `]
})
export class HomeComponent {}
