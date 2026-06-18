import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../config/api.config';

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

  selectedFile: File | null = null;
  selectedFileName = '';
  sending = false;
  sent = false;

  // OTP Verification States
  sendingOtp = false;
  otpSent = false;
  otpCode = '';

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

  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    } else {
      this.selectedFile = null;
      this.selectedFileName = '';
    }
  }

  private http = inject(HttpClient);

  sendOtp(): void {
    if (!this.form.email || this.sendingOtp || this.otpSent) return;
    this.sendingOtp = true;

    this.http.post<any>(`${API_BASE_URL}/api/contact/send-otp`, { email: this.form.email }).subscribe({
      next: () => {
        this.sendingOtp = false;
        this.otpSent = true;
      },
      error: (err) => {
        this.sendingOtp = false;
        console.error('Failed to send verification code:', err);
        alert(err.error?.error || 'Failed to send verification code. Please check your email and try again.');
      }
    });
  }

  submit(): void {
    if (this.sending || this.sent) return;
    this.sending = true;

    const formData = new FormData();
    formData.append('firstName', this.form.firstName);
    formData.append('lastName', this.form.lastName);
    formData.append('email', this.form.email);
    formData.append('service', this.form.service);
    formData.append('message', this.form.message);
    formData.append('otpCode', this.otpCode);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.http.post(`${API_BASE_URL}/api/contact`, formData).subscribe({
      next: () => {
        this.sending = false;
        this.sent = true;
        this.form = { firstName: '', lastName: '', email: '', service: '', message: '' };
        this.selectedFile = null;
        this.selectedFileName = '';
        this.otpSent = false;
        this.otpCode = '';
        const fileInput = document.getElementById('contactFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        setTimeout(() => { this.sent = false; }, 4000);
      },
      error: (err) => {
        this.sending = false;
        console.error('Failed to send message:', err);
        alert(err.error?.error || 'Failed to send message. Please try again.');
      }
    });
  }
}
