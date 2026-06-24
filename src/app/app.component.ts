import { Component, HostListener, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    ChatbotComponent
  ],
  template: `
    <div class="background-blobs">
      <div class="blob" style="width: 600px; height: 600px; background: rgba(59, 130, 246, 0.1); top: -100px; left: -100px;"></div>
      <div class="blob" style="width: 500px; height: 500px; background: rgba(6, 182, 212, 0.08); bottom: -100px; right: -100px;"></div>
      <div class="blob" style="width: 400px; height: 400px; background: rgba(99, 102, 241, 0.06); top: 40%; left: 10%;"></div>
    </div>

    <app-navbar></app-navbar>
    
    <router-outlet></router-outlet>
    
    <app-footer></app-footer>
    <app-chatbot></app-chatbot>

    <!-- Custom Cursor -->
    <div *ngIf="isBrowser && !isMobile" class="cursor-dot" #dot></div>
    <div *ngIf="isBrowser && !isMobile" class="cursor-outline" #outline></div>
  `,
  styles: []
})
export class AppComponent implements AfterViewInit {
  isBrowser: boolean;
  isMobile = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.checkMobile();
      
      // Re-trigger reveal on every navigation end
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        setTimeout(() => {
          this.initReveal();
          this.handleInitialScroll();
        }, 100);
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.initReveal();
        this.handleInitialScroll();
      }, 500);
    }
  }

  private handleInitialScroll(): void {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace(/#|\//g, '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.isBrowser) {
      this.checkMobile();
    }
  }

  private checkMobile(): void {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isSmall = window.innerWidth <= 1024;
    this.isMobile = isSmall || isTouch;
  }

  private dotEl: HTMLElement | null = null;
  private outlineEl: HTMLElement | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private isMoving = false;

  private updateCursor(): void {
    if (!this.dotEl) this.dotEl = document.querySelector('.cursor-dot');
    if (!this.outlineEl) this.outlineEl = document.querySelector('.cursor-outline');

    if (this.dotEl && this.outlineEl) {
      this.dotEl.style.left = this.mouseX + 'px';
      this.dotEl.style.top = this.mouseY + 'px';
      this.outlineEl.style.left = this.mouseX + 'px';
      this.outlineEl.style.top = this.mouseY + 'px';
    }
    this.isMoving = false;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.isBrowser || this.isMobile) return;

    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    if (!this.isMoving) {
      this.isMoving = true;
      requestAnimationFrame(() => this.updateCursor());
    }
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(e: MouseEvent): void {
    if (!this.isBrowser || this.isMobile) return;
    const target = e.target as HTMLElement;
    if (target && target.closest('a, button, .btn, .icon-btn, .nav-logo, .portfolio-card, .tab-btn, .icon-card, .scroll-indicator')) {
      document.body.classList.add('cursor-hover');
    }
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut(e: MouseEvent): void {
    if (!this.isBrowser || this.isMobile) return;
    const target = e.target as HTMLElement;
    if (target && target.closest('a, button, .btn, .icon-btn, .nav-logo, .portfolio-card, .tab-btn, .icon-card, .scroll-indicator')) {
      document.body.classList.remove('cursor-hover');
    }
  }

  @HostListener('mousedown')
  onMouseDown(): void {
    if (!this.isBrowser || this.isMobile) return;
    document.body.classList.add('cursor-click');
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    if (!this.isBrowser || this.isMobile) return;
    document.body.classList.remove('cursor-click');
  }

  private initReveal(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }
}
