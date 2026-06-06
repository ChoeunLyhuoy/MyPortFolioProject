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
  metrics = [
    { num: '3+', label: 'Years of Study' },
    { num: '2025', label: 'Ecoinsoft Exp' },
    { num: '5.0', label: 'Passion Score' },
    { num: '100%', label: 'Commitment' }
  ];

  values = [
    { icon: '🚀', title: 'Full Stack Architecture', desc: 'Focusing on scalable back-end logic, dynamic front-end interfaces, and seamless data flow.' },
    { icon: '📱', title: 'Cross-Platform Mobile', desc: 'Expertise in building high-performance iOS and Android applications using Flutter.' },
    { icon: '🛠️', title: 'Modern Tech Stack', desc: 'Proficient in Java, Spring Boot, TypeScript, Tailwind, React, Angular, NestJS, and Flutter ecosystem.' }
  ];

  skills = [
    { name: 'Back-end (Java/Spring/Nest/RabbitMQ)', pct: 92 },
    { name: 'Front-end (TS/React/Angular/Tailwind)', pct: 88 },
    { name: 'Mobile (Flutter/Swift/Firebase)', pct: 85 },
    { name: 'Database (MySQL/Postgres/Mongo)', pct: 82 }
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
