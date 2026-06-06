import { Component, AfterViewInit, Inject, PLATFORM_ID, signal, computed, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Project {
  icon: string;
  tag: string;
  name: string;
  desc: string;
  cat: string;
  url: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements AfterViewInit {
  private isBrowser: boolean;
  
  // High-performance Reactive State
  activeFilter = signal<string>('all');
  viewMode = signal<'grid' | 'list'>('grid');
  cardStyle = signal<'glass' | 'minimal' | 'glow' | 'holo' | 'cyber'>('glass');
  imageFilter = signal<'normal' | 'grayscale'>('normal');

  @HostListener('window:portfolio-layout-toggle', ['$event'])
  onPortfolioLayoutToggle(event: any): void {
    if (event.detail && typeof event.detail.mode === 'string') {
      this.viewMode.set(event.detail.mode as 'grid' | 'list');
    }
  }

  @HostListener('window:portfolio-style-toggle', ['$event'])
  onPortfolioStyleToggle(event: any): void {
    if (event.detail) {
      if (event.detail.cardStyle) this.cardStyle.set(event.detail.cardStyle);
      if (event.detail.imageFilter) this.imageFilter.set(event.detail.imageFilter);
    }
  }

  tabs = [
    { key: 'all',        label: 'All Projects' },
    { key: 'frontend',   label: 'Front-end' },
    { key: 'backend',    label: 'Back-end' },
    { key: 'api',        label: 'API/Integration' }
  ];

  projectsList: Project[] = [
    { icon: 'assets/java.svg',       tag: 'Backend Development', name: 'Ecoinsoft Backend',         desc: 'Developed robust server-side logic using Grails and Groovy to support front-end applications.', cat: 'backend', url: 'https://github.com/ChoeunLyhuoy' },
    { icon: 'assets/angular.svg',    tag: 'Frontend Development', name: 'Responsive Web Interfaces', desc: 'Developed user-friendly interfaces focusing on responsive design and accessibility.', cat: 'frontend', url: 'https://github.com/ChoeunLyhuoy' },
    { icon: 'assets/postman.svg',    tag: 'RESTful API',        name: 'API Communication Hub',     desc: 'Designed and implemented RESTful APIs in Grails for smooth front-to-back communication.', cat: 'api', url: 'https://github.com/ChoeunLyhuoy' },
    { icon: 'assets/mysql.svg',      tag: 'Database Optimizer',  name: 'SQL Database Optimizer',    desc: 'Managed and optimized SQL databases for secure storage and efficient data retrieval.', cat: 'backend', url: 'https://github.com/ChoeunLyhuoy' },
    { icon: 'assets/rabbitmq.svg',   tag: 'Message Queuing',      name: 'Xshell & RabbitMQ Hub',    desc: 'Managed servers with Xshell and integrated RabbitMQ for reliable message queuing.', cat: 'api', url: 'https://github.com/ChoeunLyhuoy' },
    { icon: 'assets/react.svg',      tag: 'React Development',   name: 'ReactJS Web Applications',  desc: 'Built complex web applications using ReactJS, Redux, and React Router.', cat: 'frontend', url: 'https://github.com/ChoeunLyhuoy' },
    { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg', tag: 'Enterprise Backend', name: 'Spring Enterprise API', desc: 'Developed high-performance microservices using Spring Boot, JPA, and RabbitMQ.', cat: 'api', url: 'https://github.com/ChoeunLyhuoy' },
    { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg', tag: 'Mobile Development', name: 'Flutter Omni-Shop', desc: 'A multi-platform e-commerce solution with real-time sync and payment integration.', cat: 'api', url: 'https://github.com/ChoeunLyhuoy' }
  ];

  projects = signal<Project[]>(this.projectsList);

  filtered = computed(() => {
    const filter = this.activeFilter();
    const all = this.projects();
    return filter === 'all' ? all : all.filter(p => p.cat === filter);
  });
  
  // Mouse drag scrolling state
  isDown = false;
  startX = 0;
  scrollLeft = 0;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setFilter(key: string): void {
    this.activeFilter.set(key);
  }

  onMouseDown(e: MouseEvent): void {
    const el = e.currentTarget as HTMLElement;
    this.isDown = true;
    this.startX = e.pageX - el.offsetLeft;
    this.scrollLeft = el.scrollLeft;
  }

  onTouchStart(e: TouchEvent): void {
    const el = e.currentTarget as HTMLElement;
    this.isDown = true;
    this.startX = e.touches[0].pageX - el.offsetLeft;
    this.scrollLeft = el.scrollLeft;
  }

  onMouseLeave(): void {
    this.isDown = false;
  }

  onMouseUp(): void {
    this.isDown = false;
  }

  onTouchEnd(): void {
    this.isDown = false;
  }

  onMouseMove(e: MouseEvent): void {
    if (!this.isDown) return;
    e.preventDefault(); 
    const el = e.currentTarget as HTMLElement;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - this.startX) * 2; 
    el.scrollLeft = this.scrollLeft - walk;
  }

  onTouchMove(e: TouchEvent): void {
    if (!this.isDown) return;
    const el = e.currentTarget as HTMLElement;
    const x = e.touches[0].pageX - el.offsetLeft;
    const walk = (x - this.startX) * 2;
    el.scrollLeft = this.scrollLeft - walk;
  }

  openProject(p: Project): void {
    if (this.isBrowser) {
      window.open(p.url, '_blank');
    }
  }

  // ── Dynamic 3D Card Tilt Event ──
  onCardMouseEnter(event: MouseEvent) {
    if (this.cardStyle() !== 'holo') return;
    const card = event.currentTarget as HTMLElement;
    card.style.transition = 'none'; // Snappy tracking
  }

  onCardMouseMove(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Spotlight effect variables
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    
    if (this.cardStyle() !== 'holo') return;
    
    // Calculate rotation (-15deg to +15deg)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    // Apply exact 3D coordinates based on cursor position
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  }

  onCardMouseLeave(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    // Smooth reset
    card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    card.style.transform = ``; // Revert to stylesheet default
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      console.log('Portfolio ready');
    }
  }
}
