import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  year = new Date().getFullYear();

  services = ['Machine Learning','AI Consulting','Data Engineering','Web Development','Blockchain'];
  company  = [
    { label: 'About Us',   id: 'about' },
    { label: 'Portfolio',  id: 'portfolio' },
    { label: 'Careers',    id: 'career' },
    { label: 'Contact',    id: 'contact' }
  ];
  legal = ['Privacy Policy','Terms of Service','Cookie Policy','Sitemap'];
  socials = [
    { icon: 'assets/github.svg',    label: 'GitHub',    url: 'https://github.com/ChoeunLyhuoy' },
    { icon: 'assets/linkedin.svg',  label: 'LinkedIn',  url: 'https://linkedin.com/' },
    { icon: 'assets/telegram.svg',  label: 'Telegram',  url: 'https://t.me/ChLyhuoy' },
    { icon: 'assets/instagram.svg', label: 'Instagram', url: 'https://www.instagram.com/choeun_lyhuoy?igsh=MXZpOTBlbXMxNXB2dQ%3D%3D&utm_source=qr' },
    { icon: 'assets/facebook.svg',  label: 'Facebook',  url: 'https://www.facebook.com/share/1DfX2tVigA/?mibextid=wwXIfr' }
  ];

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
