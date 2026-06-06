import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent {
  brands = [
    { name: 'Angular',      img: 'assets/angular.svg' },
    { name: 'ReactJS',      img: 'assets/react.svg' },
    { name: 'Flutter',      img: 'assets/flutter.svg' },
    { name: 'Java',         img: 'assets/java.svg' },
    { name: 'Spring Boot',  img: 'assets/springboot.svg' },
    { name: 'NestJS',       img: 'assets/nestjs.svg' },
    { name: 'Grails',       img: 'assets/grails.svg' },
    { name: 'Groovy',       img: 'assets/groovy.svg', invert: true },
    { name: 'MySQL',        img: 'assets/mysql.svg', invert: true },
    { name: 'Redis',        img: 'assets/redis.svg' },
    { name: 'RabbitMQ',     img: 'assets/rabbitmq.svg' },
    { name: 'REST API',     img: 'assets/postman.svg' },
    { name: 'Swagger',      img: 'assets/swagger.svg' },
    { name: 'Deploy',       img: 'assets/docker.svg' },
    { name: 'GitHub',       img: 'assets/github.svg', invert: true }
  ];
}
