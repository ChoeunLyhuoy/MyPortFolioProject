import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements AfterViewInit {
  isMobile = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const isSmall = window.innerWidth <= 1024;
      this.isMobile = isSmall || isTouch;
    }
  }
  metrics = [
    { num: '4', label: 'Years of Study' },
    { num: '3', label: 'Work Roles' },
    { num: '5.0', label: 'Passion Score' },
    { num: '100%', label: 'Commitment' }
  ];

  values = [
    { icon: '🚀', title: 'Backend & APIs', desc: 'Focusing on robust server-side logic, RESTful API design, and scalable system integration.' },
    { icon: '⚡', title: 'Message Queues & Caching', desc: 'Implementing RabbitMQ for reliable message queuing and Redis for optimal caching performance.' },
    { icon: '🛠️', title: 'Modern Stack', desc: 'Proficient in Java, Spring Boot, Grails & Groovy, TypeScript, React.js, Bootstrap, and MySQL.' }
  ];

  skills = [
    { name: 'Back-end (Java/Spring Boot/Grails/.NET)', pct: 92 },
    { name: 'Front-end (TS/JS/React.js/Bootstrap/Angular)', pct: 88 },
    { name: 'Mobile & OS (Flutter/Linux/Windows Server)', pct: 86 },
    { name: 'Architecture & DB (SE/MIS/MySQL/RabbitMQ)', pct: 84 }
  ];

  skillsAnimated = false;

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          if (!this.skillsAnimated) {
            this.skillsAnimated = true;
            setTimeout(() => {
              document.querySelectorAll('.skill-fill').forEach(el => el.classList.add('animated'));
            }, 300);
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('#about .reveal').forEach(el => observer.observe(el));
  }

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;
    const navOffset = 80;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    if (history.pushState) history.pushState(null, '', `#${id}`);
  }
}
