import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  scrolled = false;
  mobileOpen = false;
  activeSection = 'home';
  isDarkMode = true;
  showRailControls = false;

  layout: 'navbar' | 'sidebar' = 'navbar';
  
  constructor(private chatbotService: ChatbotService) {}
  
  toggleChat(): void {
    this.chatbotService.toggle();
  }
  
  navLinks = [
    { id: 'home',      label: 'Home',      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'services',  label: 'Services',  icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'portfolio', label: 'Portfolio', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'about',     label: 'About',     icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'career',    label: 'Career',    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'contact',   label: 'Contact',   icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 20;
    this.updateActiveSection();
  }

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') !== 'light';
    this.applyTheme();
    this.updateActiveSection();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }

  @HostListener('window:theme-toggle', ['$event'])
  onThemeToggle(event: any): void {
    if (event.detail && typeof event.detail.isDark === 'boolean') {
      this.isDarkMode = event.detail.isDark;
      this.applyTheme();
    }
  }

  @HostListener('window:layout-toggle', ['$event'])
  onLayoutToggle(event: any): void {
    if (event.detail && typeof event.detail.layout === 'string') {
      this.layout = event.detail.layout;
      if (this.layout === 'sidebar') {
        document.body.classList.add('sidebar-layout');
      } else {
        document.body.classList.remove('sidebar-layout');
      }
    }
  }

  updateActiveSection(): void {
    const sections = ['home', 'services', 'portfolio', 'about', 'career', 'contact'];
    let currentSection = 'home';
    const threshold = (window.innerHeight * 0.4); // 40% threshold from top

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) {
          currentSection = id;
        }
      }
    }
    this.activeSection = currentSection;
  }

  scrollTo(id: string): void {
    this.mobileOpen = false;
    const el = document.getElementById(id);
    if (!el) return;
    
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // Update URL hash without jumping
    if (history.pushState) {
      history.pushState(null, '', `#${id}`);
    } else {
      location.hash = id;
    }
  }

  toggleMobile(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  toggleRailControls(): void {
    this.showRailControls = !this.showRailControls;
  }

  toggleLayout(): void {
    this.mobileOpen = false; /* Close drawer if opened from hamburger */
    this.layout = this.layout === 'navbar' ? 'sidebar' : 'navbar';
    if (this.layout === 'sidebar') {
      document.body.classList.add('sidebar-layout');
    } else {
      document.body.classList.remove('sidebar-layout');
    }
  }
}
