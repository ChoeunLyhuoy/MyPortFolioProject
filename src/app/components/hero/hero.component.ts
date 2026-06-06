import { Component, AfterViewInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements AfterViewInit {
  private isBrowser: boolean;
  parallaxOffset = { x: 0, y: 0 };

  iconCards = [
    { icon: 'assets/angular.svg',    label: 'Angular' },
    { icon: 'assets/react.svg',      label: 'React.js' },
    { icon: 'assets/flutter.svg',    label: 'Flutter' },
    { icon: 'assets/java.svg',       label: 'Java' },
    { icon: 'assets/springboot.svg', label: 'Spring Boot' },
    { icon: 'assets/nestjs.svg',     label: 'NestJS' },
    { icon: 'assets/grails.svg',     label: 'Grails' },
    { icon: 'assets/groovy.svg',     label: 'Groovy', invert: true },
    { icon: 'assets/mysql.svg',      label: 'MySQL', invert: true },
    { icon: 'assets/redis.svg',      label: 'Redis' },
    { icon: 'assets/rabbitmq.svg',   label: 'RabbitMQ' },
    { icon: 'assets/postman.svg',    label: 'REST API' },
    { icon: 'assets/docker.svg',     label: 'Deploy' },
    { icon: 'assets/github.svg',     label: 'GitHub', invert: true },
    { icon: 'assets/swagger.svg',    label: 'Swagger' },
    { icon: 'assets/mobiledev.svg',  label: 'Mobile Dev' }
  ];

  stats = [
    { num: '4th Year', label: 'CS Student' },
    { num: '2+', label: 'Web Apps Built' },
    { num: '3+', label: 'Years Experience' },
    { num: '10+', label: 'Tech Stack' }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    
    setTimeout(() => {
      document.querySelectorAll('.stat-num').forEach((el, index) => {
        setTimeout(() => el.classList.add('animated'), index * 120);
      });
    }, 400);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.isBrowser) return;
    
    const x = (e.clientX - window.innerWidth / 2) / 40;
    const y = (e.clientY - window.innerHeight / 2) / 40;
    this.parallaxOffset = { x, y };
  }

  scrollTo(sectionId: string): void {
    if (!this.isBrowser) return;
    const el = document.getElementById(sectionId);
    if (!el) return;

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    if (history.pushState) {
      history.pushState(null, '', `#${sectionId}`);
    } else {
      location.hash = sectionId;
    }
  }
}
