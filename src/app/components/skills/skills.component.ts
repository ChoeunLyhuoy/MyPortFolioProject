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
          { id: 'bootstrap', name: 'Bootstrap', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg', status: 'mastered', level: 5, maxLevel: 5, cost: 70, desc: 'Responsive CSS layout, grid systems, and component libraries.' }
        ],
        [
          { id: 'angular', name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 120, desc: 'Component architecture, RxJS, and state management.' },
          { id: 'react', name: 'React.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 100, desc: 'Hooks, Redux, React Router, and functional component design.' }
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
          { id: 'groovy', name: 'Grails & Groovy', icon: 'assets/groovy.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 120, desc: 'Rapid web application development with Groovy and Grails framework.' }
        ],
        [
          { id: 'spring', name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 130, desc: 'Enterprise microservices, dependency injection, and JPA.' },
          { id: 'mysql', name: 'MySQL Database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 90, desc: 'Relational database management, SQL tuning, and database optimization.' }
        ],
        [
          { id: 'rabbitmq', name: 'RabbitMQ', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rabbitmq/rabbitmq-original.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 140, desc: 'Message queuing, exchanges, routing, and distributed systems.' },
          { id: 'redis', name: 'Redis Caching', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg', status: 'unlocked', level: 3, maxLevel: 5, cost: 110, desc: 'In-memory caching and session store for performance optimization.' }
        ],
        [
          { id: 'dotnet', name: '.NET', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 120, desc: 'Enterprise application development using C# and the .NET framework.' }
        ]
      ]
    },
    {
      title: 'Systems, Mobile & Management',
      color: 'var(--indigo)',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apple/apple-original.svg',
      nodes: [
        [
          { id: 'git', name: 'Git & Version Control', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', status: 'mastered', level: 5, maxLevel: 5, cost: 40, desc: 'Version control workflows using GitHub, GitLab, and Gitea.' },
          { id: 'flutter', name: 'Flutter Mobile', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 120, desc: 'Cross-platform mobile application development for iOS and Android.' }
        ],
        [
          { id: 'sysadmin', name: 'Linux & Windows Server', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 100, desc: 'Server administration, Linux command line, SSH, and Windows Server management.' },
          { id: 'xshell', name: 'XShell & SSH Tools', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg', status: 'mastered', level: 3, maxLevel: 5, cost: 90, desc: 'Remote server administration, terminal management, and SSH setups.' }
        ],
        [
          { id: 'se_mis', name: 'SE & MIS Concepts', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/diagramsnet/diagramsnet-original.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 90, desc: 'Software Engineering methodologies, systems analysis, and Management Information Systems.' },
          { id: 'pm', name: 'Project Management', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/trello/trello-original.svg', status: 'mastered', level: 4, maxLevel: 5, cost: 80, desc: 'Agile planning and task tracking using Trello and ClickUp.' }
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
