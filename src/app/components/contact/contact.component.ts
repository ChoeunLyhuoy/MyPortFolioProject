import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements AfterViewInit {
  form = {
    firstName: '',
    lastName: '',
    email: '',
    service: '',
    message: ''
  };

  sending = false;
  sent = false;

  contactItems = [
    { icon: '📧', title: 'Email',    value: 'choeunlyhuoy@gmail.com' },
    { icon: '📞', title: 'Phone',    value: '+885 71 591 9535' },
    { icon: '📍', title: 'Location', value: 'Phnom Penh, Cambodia' }
  ];

  socials = [
    { icon: 'assets/github.svg',    label: 'GitHub',    url: 'https://github.com/ChoeunLyhuoy' },
    { icon: 'assets/linkedin.svg',  label: 'LinkedIn',  url: 'https://linkedin.com/' },
    { icon: 'assets/telegram.svg',  label: 'Telegram',  url: 'https://t.me/ChLyhuoy' },
    { icon: 'assets/instagram.svg', label: 'Instagram', url: 'https://www.instagram.com/choeun_lyhuoy?igsh=MXZpOTBlbXMxNXB2dQ%3D%3D&utm_source=qr' },
    { icon: 'assets/facebook.svg',  label: 'Facebook',  url: 'https://www.facebook.com/share/1DfX2tVigA/?mibextid=wwXIfr' }
  ];

  services = [
    'Machine Learning Solutions',
    'Business Development',
    'Predictive Analytics',
    'AI Consulting',
    'Data Engineering',
    'Blockchain Engineering'
  ];

  ngAfterViewInit(): void {
    // Relies on the global IntersectionObserver defined securely in app.component.ts
  }

  submit(): void {
    if (this.sending || this.sent) return;
    this.sending = true;
    setTimeout(() => {
      this.sending = false;
      this.sent = true;
      this.form = { firstName: '', lastName: '', email: '', service: '', message: '' };
      setTimeout(() => { this.sent = false; }, 4000);
    }, 1800);
  }
}
