import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements AfterViewInit {
  services = [
    { icon: '🚀', title: 'Backend Development', desc: 'Developing robust server-side logic using Grails, Groovy, and Java Spring Boot for scalable enterprise applications.' },
    { icon: '📱', title: 'Frontend Development', desc: 'Building user-friendly and responsive interfaces with React.js, focusing on performance and web accessibility.' },
    { icon: '📡', title: 'RESTful API Engineering', desc: 'Designing and implementing efficient APIs to facilitate seamless communication between front-end and back-end systems.' },
    { icon: '🗄️', title: 'Database Management', desc: 'Managing SQL databases (MySQL) and optimizing data handling for secure and fast storage and retrieval.' },
    { icon: '🛠️', title: 'Integration Services', desc: 'Working with Xshell for server management and RabbitMQ for distributed message queuing.' },
    { icon: '🔍', title: 'Testing & Validation', desc: 'Utilizing Postman and Swagger for rigorous API testing and documentation to ensure reliable and well-structured services.' }
  ];

  whyUs = [
    { icon: '🎯', title: 'Results-Driven', desc: 'Every project is measured by real business impact — not just code shipped.' },
    { icon: '⚡', title: 'Fast Delivery', desc: 'Agile sprints and CI/CD pipelines ensure your product ships on schedule.' },
    { icon: '🔐', title: 'Enterprise Security', desc: 'SOC 2 compliant workflows and security-first engineering throughout.' },
    { icon: '🌍', title: 'Global Expertise', desc: 'A distributed team of specialists across 12 countries and time zones.' }
  ];

  industries = [
    { icon: '💰', label: 'Financial Services & Trading' },
    { icon: '🏥', label: 'Healthcare & MedTech' },
    { icon: '🛒', label: 'E-Commerce & Retail' },
    { icon: '🎮', label: 'Gaming & Entertainment' },
    { icon: '⚡', label: 'Energy & Utilities' },
    { icon: '🏭', label: 'Manufacturing & Supply Chain' },
    { icon: '📦', label: 'Logistics & Transportation' },
    { icon: '🌐', label: 'SaaS & AI Solutions' }
  ];

  faqs = [
    { q: 'How long does a typical project take from kickoff to delivery?', a: 'Most projects range from 6–16 weeks depending on complexity. We begin with a 1-week discovery sprint to define scope, then move into iterative 2-week delivery cycles with regular demo checkpoints.', open: false },
    { q: 'Do you provide ongoing support after the project is delivered?', a: 'Absolutely. We offer flexible retainer packages for post-launch support, monitoring, model retraining, and feature expansions. You\'ll have a dedicated account manager and SLA-backed response times.', open: false },
    { q: 'What technology stack do you primarily use?', a: 'We\'re stack-agnostic but specialize in Python, PyTorch, TensorFlow, React, Angular, Node.js, AWS, GCP, Kubernetes, and Spark. We always recommend the best tools for your specific use case.', open: false },
    { q: 'Can you integrate with our existing systems?', a: 'Yes — integration is often a core part of our work. Whether connecting to legacy ERPs, CRMs, data warehouses, or third-party APIs, we design solutions that fit seamlessly into your existing infrastructure.', open: false }
  ];

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('#services .reveal').forEach(el => observer.observe(el));
  }

  toggleFaq(faq: any): void {
    if (!faq.open) {
      this.faqs.forEach(f => f.open = false);
    }
    faq.open = !faq.open;
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
