import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.css']
})
export class CareerComponent implements AfterViewInit {
  jobs = [
    {
      title: 'Backend Developer',
      company: 'Ecoinsoft Solution Co., Ltd.',
      type: 'Full-time',
      location: 'Phnom Penh, Cambodia',
      date: '2024 - 2025',
      description: [
        'Developed robust server-side logic using Grails and Groovy to support and enhance front-end applications.',
        'Designed and implemented RESTful APIs in Grails, enabling smooth communication between front-end and back-end systems.',
        'Worked with Xshell for server management, integrated RabbitMQ for message queuing, and implemented Redis for caching and performance optimization.',
        'Utilized Postman and Swagger for API testing, documentation, and validation to ensure reliable and well-structured services.'
      ],
      tags: ['Grails', 'Groovy', 'RabbitMQ', 'Redis', 'Postman', 'Swagger', 'XShell']
    },
    {
      title: 'Intern Backend Developer',
      company: 'KiloIT',
      type: 'Internship',
      location: 'Phnom Penh, Cambodia',
      date: '2023 - 2024',
      description: [
        'Engineered robust server-side logic to support and enhance front-end applications.',
        'Designed and implemented APIs, facilitating smooth communication between the front-end and back-end systems.',
        'Managed SQL databases, optimizing data handling and ensuring secure storage and retrieval.'
      ],
      tags: ['Java', 'Spring Boot', 'MySQL', 'API Design', 'Database Optimization']
    },
    {
      title: 'Intern Front end Developer',
      company: 'KiloIT',
      type: 'Internship',
      location: 'Phnom Penh, Cambodia',
      date: '2022 - 2023',
      description: [
        'Developed user-friendly interfaces, focusing on responsive design and accessibility.',
        'Created static and dynamic websites, ensuring optimal user engagement and performance.',
        'Integrated third-party APIs to enhance web functionality and user experience.'
      ],
      tags: ['React.js', 'Bootstrap', 'JavaScript', 'HTML5', 'CSS3', 'Responsive Design']
    }
  ];

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('#career .reveal').forEach(el => observer.observe(el));
  }
}
