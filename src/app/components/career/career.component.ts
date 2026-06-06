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
    { title: 'Web Designer',                type: 'Full-time',  location: 'Remote',  dept: 'Design Team',       tags: ['Figma','CSS','UI/UX','Prototyping'] },
    { title: 'Mobile App Developer',        type: 'Full-time',  location: 'Hybrid',  dept: 'Engineering Team',  tags: ['React Native','Flutter','iOS','Android'] },
    { title: 'Digital Marketing Specialist',type: 'Part-time',  location: 'Remote',  dept: 'Growth Team',       tags: ['SEO','Google Ads','Analytics','Content'] },
    { title: 'Project Manager',             type: 'Full-time',  location: 'On-site', dept: 'Operations',        tags: ['Agile','Jira','PMP','Scrum'] },
    { title: 'ML Engineer',                 type: 'Full-time',  location: 'Remote',  dept: 'AI Research Team',  tags: ['Python','PyTorch','TensorFlow','MLOps'] },
    { title: 'Data Engineer',               type: 'Full-time',  location: 'Hybrid',  dept: 'Data Platform',     tags: ['Spark','Kafka','Snowflake','Airflow'] }
  ];

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('#career .reveal').forEach(el => observer.observe(el));
  }

  apply(title: string): void {
    alert(`Thanks for your interest in the "${title}" role!\nPlease send your CV to careers@nexadata.io`);
  }
}
