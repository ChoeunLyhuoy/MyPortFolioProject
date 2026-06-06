import { Component, signal, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SkillNode {
  id: string;
  name: string;
  icon: string;
  status: 'locked' | 'unlocked' | 'mastered';
  level: number;
  maxLevel: number;
  cost: number;
  desc: string;
  isShaking?: boolean;
  isUpgrading?: boolean;
  justUnlocked?: boolean;
}

interface SkillCategory {
  title: string;
  color: string;
  icon: string;
  nodes: SkillNode[][]; // Rows of nodes
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent implements OnInit {
  level = signal(24);
  coins = signal(1420);
  recommendedPath = signal(true);
  initialCategoriesState!: string;

  categories: SkillCategory[] = [
    {
      title: 'Frontend',
      color: 'var(--cyan)',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg',
      nodes: [
        [
          { id: 'html', name: 'HTML/CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg', status: 'mastered', level: 5, maxLevel: 5, cost: 50, desc: 'Advanced responsive layouts, animations, and modern CSS architecture.' },
          { id: 'js', name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', status: 'mastered', level: 5, maxLevel: 5, cost: 50, desc: 'ES6+, async programming, and complex DOM manipulation.' }
        ],
        [
          { id: 'ts', name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg', status: 'mastered', level: 5, maxLevel: 5, cost: 80, desc: 'Strict typing, interfaces, and scalable JS development.' },
          { id: 'tailwind', name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', status: 'mastered', level: 5, maxLevel: 5, cost: 70, desc: 'Utility-first CSS and rapid UI development.' }
        ],
        [
          { id: 'angular', name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 120, desc: 'Component architecture, RxJS, and state management.' },
          { id: 'react', name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', status: 'unlocked', level: 3, maxLevel: 5, cost: 100, desc: 'Hooks, Context API, and functional component design.' }
        ],
        [
          { id: 'threejs', name: 'Three.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg', status: 'unlocked', level: 2, maxLevel: 5, cost: 150, desc: '3D rendering, scene graphs, and web-based AR/VR.' },
          { id: 'vue', name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg', status: 'locked', level: 0, maxLevel: 5, cost: 200, desc: 'Progressive framework and composition API.' }
        ]
      ]
    },
    {
      title: 'Backend',
      color: 'var(--blue)',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg',
      nodes: [
        [
          { id: 'java', name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', status: 'mastered', level: 5, maxLevel: 5, cost: 100, desc: 'Object-oriented programming, JVM, and enterprise applications.' },
          { id: 'node', name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', status: 'mastered', level: 5, maxLevel: 5, cost: 80, desc: 'Event-driven architecture and high-performance APIs.' }
        ],
        [
          { id: 'spring', name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 130, desc: 'Enterprise microservices, dependency injection, and JPA.' },
          { id: 'sql', name: 'Databases', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 90, desc: 'PostgreSQL, MongoDB, indexing, and query optimization.' }
        ],
        [
          { id: 'nest', name: 'NestJS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg', status: 'unlocked', level: 3, maxLevel: 5, cost: 120, desc: 'Enterprise microservices and scalable modular backend design.' },
          { id: 'docker', name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', status: 'unlocked', level: 2, maxLevel: 5, cost: 150, desc: 'Containerization, volumes, and robust environment setups.' }
        ],
        [
          { id: 'mysql', name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', status: 'unlocked', level: 4, maxLevel: 5, cost: 90, desc: 'Relational database management and performance tuning.' },
          { id: 'rabbitmq', name: 'RabbitMQ', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rabbitmq/rabbitmq-original.svg', status: 'unlocked', level: 3, maxLevel: 5, cost: 140, desc: 'Message queuing, exchanges, and distributed systems.' }
        ],
        [
          { id: 'k8s', name: 'Kubernetes', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg', status: 'locked', level: 0, maxLevel: 5, cost: 250, desc: 'Cluster orchestration, auto-scaling, and load balancing.' }
        ]
      ]
    },
    {
      title: 'Mobile & Tools',
      color: 'var(--indigo)',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apple/apple-original.svg',
      nodes: [
        [
          { id: 'git', name: 'Git/CI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', status: 'mastered', level: 5, maxLevel: 5, cost: 40, desc: 'Advanced version control, rebase, and GitHub Actions pipelines.' },
          { id: 'firebase', name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 100, desc: 'Auth, Firestore, Cloud Functions, and Realtime Database.' }
        ],
        [
          { id: 'flutter', name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg', status: 'unlocked', level: 3, maxLevel: 5, cost: 120, desc: 'Cross-platform mobile apps, state management, and native bridging.' },
          { id: 'android', name: 'Android', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/android/android-original.svg', status: 'locked', level: 0, maxLevel: 5, cost: 180, desc: 'Native bridging, Expo, and fast-refresh mobile UI.' }
        ],
        [
          { id: 'swift', name: 'iOS (Swift)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg', status: 'locked', level: 0, maxLevel: 5, cost: 200, desc: 'Native iOS development with Swift and SwiftUI.' }
        ]
      ]
    }
  ];

  ngOnInit() {
    this.initialCategoriesState = JSON.stringify(this.categories);
  }

  @HostListener('window:max-out-skills')
  maxOutSkills() {
    this.coins.set(9999);
    this.categories.forEach(cat => {
      cat.nodes.forEach(row => {
        row.forEach(skill => {
          if (skill.status !== 'mastered') {
            skill.status = 'mastered';
            skill.level = skill.maxLevel;
            this.level.update(l => l + 1);
          }
        });
      });
    });
  }

  @HostListener('window:reset-skills')
  resetSkills() {
    this.coins.set(1420);
    this.level.set(24);
    this.categories = JSON.parse(this.initialCategoriesState);
  }

  isRowActive(row: SkillNode[]): boolean {
    return row.some(skill => skill.status === 'mastered' || skill.status === 'unlocked');
  }

  toggleRecommended() {
    this.recommendedPath.set(!this.recommendedPath());
  }

  upgradeSkill(skill: SkillNode, categoryIndex: number, rowIndex: number, skillIndex: number) {
    if (skill.status === 'locked') {
      skill.isShaking = true;
      setTimeout(() => skill.isShaking = false, 300);
      return;
    }
    
    if (skill.level < skill.maxLevel) {
      if (this.coins() >= skill.cost) {
        this.coins.update(c => c - skill.cost);
        skill.level++;
        
        skill.isUpgrading = true;
        setTimeout(() => skill.isUpgrading = false, 800);

        if (skill.level === skill.maxLevel) {
          skill.status = 'mastered';
          this.level.update(l => l + 1);
          this.checkUnlocks(categoryIndex, rowIndex);
        }
      } else {
        skill.isShaking = true;
        setTimeout(() => skill.isShaking = false, 300);
        console.warn(`Not enough coins to upgrade ${skill.name}. Required: ${skill.cost}`);
      }
    }
  }

  checkUnlocks(categoryIndex: number, rowIndex: number) {
    const category = this.categories[categoryIndex];
    if (rowIndex + 1 < category.nodes.length) {
      // If any skill in the current row is mastered, unlock the next row
      const currentRow = category.nodes[rowIndex];
      const anyMastered = currentRow.some(s => s.status === 'mastered');
      
      if (anyMastered) {
        const nextRow = category.nodes[rowIndex + 1];
        nextRow.forEach(s => {
          if (s.status === 'locked') {
            s.status = 'unlocked';
            s.justUnlocked = true;
            setTimeout(() => s.justUnlocked = false, 1000);
          }
        });
      }
    }
  }
}
