import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChatbotService } from '../../services/chatbot.service';
import { API_BASE_URL } from '../../config/api.config';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSuggestion {
  text: string;
  action: string;
  type?: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  private http = inject(HttpClient);

  isOpen = false;
  isMaximized = false;
  isTyping = false;
  messages: ChatMessage[] = [];
  
  initialSuggestions: ChatSuggestion[] = [
    { text: '🚀 Showcase Projects', action: 'portfolio' },
    { text: '🏗️ Development Process', action: 'workflow' },
    { text: '🛠️ Technical Arsenal', action: 'tech' },
    { text: '🎨 UI Styles & Layouts', action: 'layouts' },
    { text: '📩 Start Collaboration', action: 'contact' }
  ];

  suggestions: ChatSuggestion[] = [...this.initialSuggestions];

  constructor(private chatbotService: ChatbotService) {
    this.addBotMessage("Greetings! I am **Choeun's Virtual IQ**. I can guide you through his high-fidelity projects, end-to-end development process, or even demonstrate how this UI adapts to your needs. How shall we begin?");
  }

  ngOnInit() {
    this.chatbotService.isOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
      if (!this.isOpen) this.isMaximized = false;
      this.updateBodyScroll();
    });
  }

  toggleChat() {
    this.chatbotService.toggle();
  }

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
    this.updateBodyScroll();
  }

  private updateBodyScroll() {
    if (this.isOpen || this.isMaximized) {
      document.body.classList.add('chat-active');
    } else {
      document.body.classList.remove('chat-active');
    }
  }

  handleManualInput(inputEl: HTMLInputElement) {
    const text = inputEl.value.trim();
    if (!text) return;

    this.addUserMessage(text);
    inputEl.value = '';

    const input = text.toLowerCase();
    if (input.includes('clear') || input.includes('reset')) {
      setTimeout(() => this.clearChat(), 300);
      return;
    }

    this.sendToBot(text);
  }

  clearChat() {
    this.messages = [];
    this.addBotMessage("Interaction log decrypted and cleared. 🧹 What's our next objective for Choeun's Virtual IQ?");
    this.suggestions = [...this.initialSuggestions];
  }

  handleSuggestion(suggestion: ChatSuggestion) {
    if (suggestion.action === 'open_cv_file') {
      this.addUserMessage(suggestion.text);
      window.open('assets/Choeun_Lyhuoy_CV.pdf', '_blank');
      this.suggestions = [...this.initialSuggestions];
      return;
    }

    this.addUserMessage(suggestion.text);
    
    if (suggestion.action === 'reset') {
      this.clearChat();
      return;
    }

    this.sendToBot(suggestion.text, suggestion);
  }

  sendToBot(message: string, suggestionFallback?: ChatSuggestion) {
    this.isTyping = true;
    this.suggestions = [];

    const historyPayload = this.messages.map(m => ({
      text: m.text,
      isUser: m.isUser
    }));

    this.http.post<any>(`${API_BASE_URL}/api/chat`, {
      message,
      history: historyPayload
    }).subscribe({
      next: (data) => {
        this.isTyping = false;
        
        if (data.response) {
          this.addBotMessage(data.response);
        }
        
        if (data.action) {
          this.executeAction(data.action);
        }
        
        if (data.suggestions && data.suggestions.length > 0) {
          this.suggestions = data.suggestions;
        } else {
          this.suggestions = [...this.initialSuggestions];
        }
      },
      error: (err) => {
        console.error('Chatbot API error, falling back to local handler:', err);
        if (suggestionFallback) {
          this.handleLocalSuggestion(suggestionFallback);
        } else {
          this.isTyping = false;
          this.addBotMessage("I am experiencing connection issues. Please try again or select one of these topics:");
          this.suggestions = [...this.initialSuggestions];
        }
      }
    });
  }

  executeAction(action: string) {
    if (!action) return;

    if (action === 'portfolio') {
      this.scrollTo('portfolio');
    }
    else if (action === 'workflow') {
      this.scrollTo('services');
    }
    else if (action === 'contact') {
      this.scrollTo('contact');
    }
    else if (action === 'about') {
      this.scrollTo('about');
    }
    else if (action === 'skills_max') {
      window.dispatchEvent(new CustomEvent('max-out-skills'));
      this.scrollTo('skills');
    }
    else if (action === 'bg_aurora') {
      document.body.classList.remove('bg-grid', 'bg-clean');
    }
    else if (action === 'bg_grid') {
      document.body.classList.remove('bg-clean');
      document.body.classList.add('bg-grid');
    }
    else if (action === 'bg_clean') {
      document.body.classList.remove('bg-grid');
      document.body.classList.add('bg-clean');
    }
    else if (action === 'corners_sharp') {
      document.body.classList.remove('corners-playful');
      document.body.classList.add('corners-sharp');
    }
    else if (action === 'corners_default') {
      document.body.classList.remove('corners-sharp', 'corners-playful');
    }
    else if (action === 'corners_playful') {
      document.body.classList.remove('corners-sharp');
      document.body.classList.add('corners-playful');
    }
    else if (action === 'color_default') {
      document.body.classList.remove('theme-emerald', 'theme-purple');
    }
    else if (action === 'color_emerald') {
      document.body.classList.remove('theme-purple');
      document.body.classList.add('theme-emerald');
    }
    else if (action === 'color_purple') {
      document.body.classList.remove('theme-emerald');
      document.body.classList.add('theme-purple');
    }
    else if (action === 'layout_nav') {
      window.dispatchEvent(new CustomEvent('layout-toggle', { detail: { layout: 'navbar' } }));
      this.scrollTo('home');
    }
    else if (action === 'layout_rail') {
      window.dispatchEvent(new CustomEvent('layout-toggle', { detail: { layout: 'sidebar' } }));
    }
    else if (action === 'trigger_light') {
      window.dispatchEvent(new CustomEvent('theme-toggle', { detail: { isDark: false } }));
      localStorage.setItem('theme', 'light');
    }
    else if (action === 'trigger_dark') {
      window.dispatchEvent(new CustomEvent('theme-toggle', { detail: { isDark: true } }));
      localStorage.setItem('theme', 'dark');
    }
    else if (action === 'layout_port_grid') {
      window.dispatchEvent(new CustomEvent('portfolio-layout-toggle', { detail: { mode: 'grid' } }));
      this.scrollTo('portfolio');
    }
    else if (action === 'layout_port_list') {
      window.dispatchEvent(new CustomEvent('portfolio-layout-toggle', { detail: { mode: 'list' } }));
      this.scrollTo('portfolio');
    }
    else if (action === 'card_glass') {
      window.dispatchEvent(new CustomEvent('portfolio-style-toggle', { detail: { cardStyle: 'glass' } }));
      this.scrollTo('portfolio');
    }
    else if (action === 'card_minimal') {
      window.dispatchEvent(new CustomEvent('portfolio-style-toggle', { detail: { cardStyle: 'minimal' } }));
      this.scrollTo('portfolio');
    }
    else if (action === 'card_glow') {
      window.dispatchEvent(new CustomEvent('portfolio-style-toggle', { detail: { cardStyle: 'glow' } }));
      this.scrollTo('portfolio');
    }
    else if (action === 'card_holo') {
      window.dispatchEvent(new CustomEvent('portfolio-style-toggle', { detail: { cardStyle: 'holo' } }));
      this.scrollTo('portfolio');
    }
    else if (action === 'card_cyber') {
      window.dispatchEvent(new CustomEvent('portfolio-style-toggle', { detail: { cardStyle: 'cyber' } }));
      this.scrollTo('portfolio');
    }
    else if (action === 'img_normal') {
      window.dispatchEvent(new CustomEvent('portfolio-style-toggle', { detail: { imageFilter: 'normal' } }));
      this.scrollTo('portfolio');
    }
    else if (action === 'img_gray') {
      window.dispatchEvent(new CustomEvent('portfolio-style-toggle', { detail: { imageFilter: 'grayscale' } }));
      this.scrollTo('portfolio');
    }
    else if (action === 'download_cv') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (window.innerWidth <= 1024);
      if (isMobile) {
        this.addBotMessage("Since you are on a mobile device, if the download did not start automatically, please tap the **📥 Open/Save CV** button below to view it.");
        this.suggestions = [
          { text: '📥 Open/Save CV', action: 'open_cv_file' },
          ...this.initialSuggestions
        ];
        try {
          window.open('assets/Choeun_Lyhuoy_CV.pdf', '_blank');
        } catch (e) {
          console.warn("Direct window.open blocked on mobile, relying on suggestion chip.");
        }
      } else {
        const link = document.createElement('a');
        link.href = 'assets/Choeun_Lyhuoy_CV.pdf';
        link.download = 'Choeun_Lyhuoy_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  private handleLocalSuggestion(suggestion: ChatSuggestion) {
    this.isTyping = true;
    this.suggestions = []; 
    
    setTimeout(() => {
      this.isTyping = false;
      const action = suggestion.action;

      // ── PROJECTS ──
      if (action === 'portfolio') {
        this.scrollTo('portfolio'); // SYNC PAGE SCROLL
        this.addBotMessage("Navigating to the **Projects Gallery**. Choeun specialized in high-performance Web and Mobile ecosystems. Which sector shall we analyze?");
        this.suggestions = [
          { text: '📱 Mobile Innovation', action: 'project_mobile_menu' },
          { text: '🌐 Web Platforms', action: 'project_web_menu' },
          { text: '🏠 Back to Start', action: 'reset' }
        ];
      } 
      else if (action === 'project_mobile_menu') {
        this.addBotMessage("Standalone **Flutter** applications with Clean Architecture. Which deep-dive interests you?");
        this.suggestions = [
          { text: '☕ Vat\' Milktea (POS)', action: 'project_milktea' },
          { text: '✨ Portfolio Hub', action: 'project_portfolio_app' },
          { text: '⬅️ Back', action: 'portfolio' }
        ];
      }
      else if (action === 'project_web_menu') {
        this.addBotMessage("Enterprise **Angular** and **Next.js** solutions. Select a platform to see the process:");
        this.suggestions = [
          { text: '📊 NexaData Dashboard', action: 'project_nexadata' },
          { text: '🛒 E-commerce Hub', action: 'project_ecommerce' },
          { text: '⬅️ Back', action: 'portfolio' }
        ];
      }
      else if (action.startsWith('project_')) {
        this.scrollTo('portfolio'); // Ensure user is in portfolio view
        this.handleProjectDetail(action);
      }

      // ── WORKFLOW / PROCESS ──
      else if (action === 'workflow') {
        this.scrollTo('services'); // Process usually aligns with services section
        this.addBotMessage("Synchronizing to **Workflow & Methodologies**. Choeun follows an elite cycle for every build. Which phase should we investigate?");
        this.suggestions = [
          { text: '🎨 Phase 1: High-Fi Design', action: 'workflow_design' },
          { text: '🏗️ Phase 2: Core Architecture', action: 'workflow_arch' },
          { text: '💻 Phase 3: Rapid Development', action: 'workflow_dev' },
          { text: '🚀 Phase 4: CI/CD Deployment', action: 'workflow_deploy' }
        ];
      }
      else if (action.startsWith('workflow_')) {
        this.handleWorkflowDetail(action);
      }

      // ── LAYOUTS / UX EVENTS ──
      else if (action === 'layouts') {
        this.addBotMessage("Demonstrating **Hybrid UI Logic**. I can trigger different layouts or toggle visual themes for you. Which style event should we execute?");
        this.suggestions = [
          { text: '🌗 Toggle Theme', action: 'style_theme' },
          { text: '🎨 Accent Colors', action: 'style_colors' },
          { text: '✨ Background Effects', action: 'style_backgrounds' },
          { text: '📐 Corner Styles', action: 'style_corners' },
          { text: '🔝 Navbar Layouts', action: 'style_nav_layouts' },
          { text: '📂 Portfolio Layouts', action: 'style_port_layouts' },
          { text: '🎮 Gamify Skill Tree', action: 'style_skills' }
        ];
      }
      else if (action === 'style_skills') {
        this.addBotMessage("I can directly interact with the RPG Skill Tree component. What should I do?");
        this.suggestions = [
          { text: '🔥 Max Out All Skills', action: 'skills_max' },
          { text: '🔙 Back to Layouts', action: 'layouts' }
        ];
      }
      else if (action === 'skills_max') {
        window.dispatchEvent(new CustomEvent('max-out-skills'));
        this.scrollTo('skills');
        this.addBotMessage("God mode activated. 💎 All skills instantly mastered. Your level just skyrocketed!");
        this.suggestions = [{ text: '🔙 Back to Skill Events', action: 'style_skills' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'style_backgrounds') {
        this.addBotMessage("The background drives the mood. What kind of atmosphere do you want?");
        this.suggestions = [
          { text: '🌌 Aurora Blobs (Default)', action: 'bg_aurora' },
          { text: '🕸️ Cyber Grid', action: 'bg_grid' },
          { text: '⚪ Clean & Minimal', action: 'bg_clean' },
          { text: '🔙 Back to Layouts', action: 'layouts' }
        ];
      }
      else if (action === 'bg_aurora') {
        document.body.classList.remove('bg-grid', 'bg-clean');
        this.addBotMessage("Restored the dynamic **Aurora Blobs** background.");
        this.suggestions = [{ text: '✨ Try Other Backgrounds', action: 'style_backgrounds' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'bg_grid') {
        document.body.classList.remove('bg-clean');
        document.body.classList.add('bg-grid');
        this.addBotMessage("Activated the **Cyber Grid** pattern. Perfect for a highly technical feel.");
        this.suggestions = [{ text: '✨ Try Other Backgrounds', action: 'style_backgrounds' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'bg_clean') {
        document.body.classList.remove('bg-grid');
        document.body.classList.add('bg-clean');
        this.addBotMessage("Activated the **Clean & Minimal** background for max focus.");
        this.suggestions = [{ text: '✨ Try Other Backgrounds', action: 'style_backgrounds' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'style_corners') {
        this.addBotMessage("Border radii define the architectural feel of the UI. How sharp should we go?");
        this.suggestions = [
          { text: '⏹️ Sharp Edges (0px)', action: 'corners_sharp' },
          { text: '🔲 Balanced (16px)', action: 'corners_default' },
          { text: '⏺️ Playful Pill (32px)', action: 'corners_playful' },
          { text: '🔙 Back to Layouts', action: 'layouts' }
        ];
      }
      else if (action === 'corners_sharp') {
        document.body.classList.remove('corners-playful');
        document.body.classList.add('corners-sharp');
        this.addBotMessage("Activated **Sharp Edges**. A brutalist, serious corporate look.");
        this.suggestions = [{ text: '📐 Try Other Corners', action: 'style_corners' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'corners_default') {
        document.body.classList.remove('corners-sharp', 'corners-playful');
        this.addBotMessage("Restored **Balanced Rounded Corners**. The sweet spot of modern UI design.");
        this.suggestions = [{ text: '📐 Try Other Corners', action: 'style_corners' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'corners_playful') {
        document.body.classList.remove('corners-sharp');
        document.body.classList.add('corners-playful');
        this.addBotMessage("Activated **Playful Pill Corners**. A very friendly and soft aesthetic.");
        this.suggestions = [{ text: '📐 Try Other Corners', action: 'style_corners' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'style_colors') {
        this.addBotMessage("The portfolio uses CSS variables for effortless re-theming. Which accent color palette should we apply?");
        this.suggestions = [
          { text: '🔷 Default Blue', action: 'color_default' },
          { text: '🟩 Emerald Green', action: 'color_emerald' },
          { text: '🟪 Royal Purple', action: 'color_purple' },
          { text: '🔙 Back to Layouts', action: 'layouts' }
        ];
      }
      else if (action === 'color_default') {
        document.body.classList.remove('theme-emerald', 'theme-purple');
        this.addBotMessage("Restored the **Default Blue** high-tech aesthetic.");
        this.suggestions = [{ text: '🎨 Try Other Colors', action: 'style_colors' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'color_emerald') {
        document.body.classList.remove('theme-purple');
        document.body.classList.add('theme-emerald');
        this.addBotMessage("Switched to **Emerald Green**. Fresh, vibrant, and sustainable.");
        this.suggestions = [{ text: '🎨 Try Other Colors', action: 'style_colors' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'color_purple') {
        document.body.classList.remove('theme-emerald');
        document.body.classList.add('theme-purple');
        this.addBotMessage("Switched to **Royal Purple**. A luxurious and creative aesthetic.");
        this.suggestions = [{ text: '🎨 Try Other Colors', action: 'style_colors' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'style_nav_layouts') {
        this.addBotMessage("The Navigation layout can adapt to your preference.");
        this.suggestions = [
          { text: '🔝 Standard Navbar', action: 'layout_nav' },
          { text: '🛤️ Side Mobile Rail', action: 'layout_rail' },
          { text: '🔙 Back to Layouts', action: 'layouts' }
        ];
      }
      else if (action === 'style_port_layouts') {
        this.addBotMessage("The Portfolio section is highly customizable. What would you like to modify?");
        this.suggestions = [
          { text: '🔲 Grid / List View', action: 'port_grid_list' },
          { text: '🖼️ Card Styles', action: 'port_card_styles' },
          { text: '🎨 Image Filters', action: 'port_image_filters' },
          { text: '🔙 Back to Layouts', action: 'layouts' }
        ];
      }
      else if (action === 'port_grid_list') {
        this.addBotMessage("Choose a structural layout for the portfolio items:");
        this.suggestions = [
          { text: '🔲 Switch to Grid View', action: 'layout_port_grid' },
          { text: '📄 Switch to List View', action: 'layout_port_list' },
          { text: '🔙 Back', action: 'style_port_layouts' }
        ];
      }
      else if (action === 'port_card_styles') {
        this.addBotMessage("Choose a container style for the portfolio cards:");
        this.suggestions = [
          { text: '✨ Premium Glass (Default)', action: 'card_glass' },
          { text: '➖ Minimal Flat', action: 'card_minimal' },
          { text: '🌟 Neon Glow', action: 'card_glow' },
          { text: '🌈 Holographic Foil', action: 'card_holo' },
          { text: '🦾 Cyberpunk', action: 'card_cyber' },
          { text: '🔙 Back', action: 'style_port_layouts' }
        ];
      }
      else if (action === 'port_image_filters') {
        this.addBotMessage("Choose how the thumbnail images are rendered:");
        this.suggestions = [
          { text: '🌈 Full Color', action: 'img_normal' },
          { text: '🖤 Grayscale (Hover to Color)', action: 'img_gray' },
          { text: '🔙 Back', action: 'style_port_layouts' }
        ];
      }
      // -- Portfolio Actions --
      else if (action === 'layout_port_grid') {
        window.dispatchEvent(new CustomEvent('portfolio-layout-toggle', { detail: { mode: 'grid' } }));
        this.scrollTo('portfolio');
        this.addBotMessage("Switched Portfolio to **Grid View**.");
        this.suggestions = [{ text: '📄 Switch to List View', action: 'layout_port_list' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'layout_port_list') {
        window.dispatchEvent(new CustomEvent('portfolio-layout-toggle', { detail: { mode: 'list' } }));
        this.scrollTo('portfolio');
        this.addBotMessage("Switched Portfolio to **List View**.");
        this.suggestions = [{ text: '🔲 Switch to Grid View', action: 'layout_port_grid' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'card_glass') {
        window.dispatchEvent(new CustomEvent('portfolio-style-toggle', { detail: { cardStyle: 'glass' } }));
        this.scrollTo('portfolio');
        this.addBotMessage("Applied **Premium Glass** style to portfolio cards.");
        this.suggestions = [{ text: '🖼️ Other Card Styles', action: 'port_card_styles' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'card_minimal') {
        window.dispatchEvent(new CustomEvent('portfolio-style-toggle', { detail: { cardStyle: 'minimal' } }));
        this.scrollTo('portfolio');
        this.addBotMessage("Applied **Minimal Flat** style to portfolio cards.");
        this.suggestions = [{ text: '🖼️ Other Card Styles', action: 'port_card_styles' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'card_glow') {
        window.dispatchEvent(new CustomEvent('portfolio-style-toggle', { detail: { cardStyle: 'glow' } }));
        this.scrollTo('portfolio');
        this.addBotMessage("Applied **Neon Glow** style to portfolio cards.");
        this.suggestions = [{ text: '🖼️ Other Card Styles', action: 'port_card_styles' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'card_holo') {
        window.dispatchEvent(new CustomEvent('portfolio-style-toggle', { detail: { cardStyle: 'holo' } }));
        this.scrollTo('portfolio');
        this.addBotMessage("Applied **Holographic Foil** style to portfolio cards. Hover them to see the shimmer!");
        this.suggestions = [{ text: '🖼️ Other Card Styles', action: 'port_card_styles' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'card_cyber') {
        window.dispatchEvent(new CustomEvent('portfolio-style-toggle', { detail: { cardStyle: 'cyber' } }));
        this.scrollTo('portfolio');
        this.addBotMessage("Activated **Brutalist Cyberpunk** layout. Glitch-tech aesthetics online.");
        this.suggestions = [{ text: '🖼️ Other Card Styles', action: 'port_card_styles' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'img_normal') {
        window.dispatchEvent(new CustomEvent('portfolio-style-toggle', { detail: { imageFilter: 'normal' } }));
        this.scrollTo('portfolio');
        this.addBotMessage("Restored images to **Full Color**.");
        this.suggestions = [{ text: '🎨 Other Image Filters', action: 'port_image_filters' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'img_gray') {
        window.dispatchEvent(new CustomEvent('portfolio-style-toggle', { detail: { imageFilter: 'grayscale' } }));
        this.scrollTo('portfolio');
        this.addBotMessage("Applied **Grayscale** filter. Images will reveal color on hover!");
        this.suggestions = [{ text: '🎨 Other Image Filters', action: 'port_image_filters' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'style_theme') {
        this.addBotMessage("The system uses **Dynamic CSS Variables**. Would you like me to switch the theme right now?");
        this.suggestions = [
          { text: '☀️ Switch to Light Mode', action: 'trigger_light' },
          { text: '🌙 Switch to Dark Mode', action: 'trigger_dark' },
          { text: '🔙 Back to Layouts', action: 'layouts' }
        ];
      }
      else if (action === 'trigger_light') {
        window.dispatchEvent(new CustomEvent('theme-toggle', { detail: { isDark: false } }));
        localStorage.setItem('theme', 'light');
        this.addBotMessage("Activated **Light Mode**. The UI is now crisp and bright! ☀️");
        this.suggestions = [{ text: '🌙 Revert to Dark Mode', action: 'trigger_dark' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'trigger_dark') {
        window.dispatchEvent(new CustomEvent('theme-toggle', { detail: { isDark: true } }));
        localStorage.setItem('theme', 'dark');
        this.addBotMessage("Activated **Dark Mode**. The UI is now sleek and focused! 🌙");
        this.suggestions = [{ text: '☀️ Switch to Light Mode', action: 'trigger_light' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'layout_nav') {
        window.dispatchEvent(new CustomEvent('layout-toggle', { detail: { layout: 'navbar' } }));
        this.addBotMessage("Switched to the **Standard Navbar**. I've reset your layout to the classic top-fixed flow.");
        this.scrollTo('home');
        this.suggestions = [{ text: '🛤️ Switch to Mobile Rail', action: 'layout_rail' }, { text: '🏠 Back', action: 'reset' }];
      }
      else if (action === 'layout_rail') {
        window.dispatchEvent(new CustomEvent('layout-toggle', { detail: { layout: 'sidebar' } }));
        this.addBotMessage("Switched to the **Mobile Rail** layout. This sidebar maximizes vertical real estate on all screens.");
        this.suggestions = [{ text: '🔝 Switch to Standard Nav', action: 'layout_nav' }, { text: '🏠 Back', action: 'reset' }];
      }

      // ── TECH STACK ──
      else if (action === 'tech') {
        this.scrollTo('services'); // Tech stack usually in services
        this.addBotMessage("Opening **Technical Arsenal**. Mastery of tools selected for sustainability and speed. Which layer to explore?");
        this.suggestions = [
          { text: '🎨 Design & Frontend', action: 'tech_frontend' },
          { text: '⚙️ Systems & Backend', action: 'tech_backend' },
          { text: '🏠 Back', action: 'reset' }
        ];
      }
      else if (action.startsWith('tech_')) {
        this.handleTechDetail(action);
      }

      // ── GENERIC ──
      else if (action === 'contact') {
        this.scrollTo('contact');
        this.addBotMessage("Scrolling to the **Contact Portal**. Choeun is currently taking on new high-performance projects.");
        this.suggestions = [{ text: '🚀 See Projects', action: 'portfolio' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'reset') {
        this.addBotMessage("System reset. I am ready for new technical instructions. What should we analyze next?");
        this.suggestions = [...this.initialSuggestions];
      }
      else if (action === 'about') {
        this.scrollTo('about');
        this.addBotMessage("Navigating to **Professional Bio**. Choeun is a 4th-year CS architect bridging logic and aesthetics.");
        this.suggestions = [{ text: '📄 Journey View', action: 'go_about' }, { text: '🏠 Home', action: 'reset' }];
      }
      else if (action === 'go_about') {
        this.scrollTo('about');
        this.suggestions = [...this.initialSuggestions];
      }
    }, 1000);
  }

  private handleWorkflowDetail(action: string) {
    let msg = "";
    if (action === 'workflow_design') msg = "**Design Phase**: starts in Figma, creating scalable design systems focused on UX micro-interactions.";
    if (action === 'workflow_arch') msg = "**Architecture Phase**: robust schemas with **Prisma**, ensuring data integrity using **Clean Architecture**.";
    if (action === 'workflow_dev') msg = "**Dev Phase**: Fast, type-safe development using **Angular Signals** or **Flutter BLoC**.";
    if (action === 'workflow_deploy') msg = "**Deployment Phase**: utilizes **Docker** and **CI/CD** for automated, zero-downtime deployments.";

    this.addBotMessage(msg);
    this.suggestions = [{ text: '🏗️ Other phases?', action: 'workflow' }, { text: '🚀 See Projects', action: 'portfolio' }, { text: '🏠 Home', action: 'reset' }];
  }

  private handleProjectDetail(action: string) {
    let msg = "";
    if (action === 'project_milktea') msg = "**Vat' Milktea (POS)**: Flutter & Laravel powerhouse. Features inventory branch-syncing and real-time financial tracking.";
    if (action === 'project_nexadata') msg = "**NexaData Dashboard**: Angular analytics engine. Processes complex data via **Signals** and **D3.js**.";
    
    this.addBotMessage(msg || "This project demonstrates technical synergy between design and scalable architecture.");
    this.suggestions = [
      { text: '🏗️ See Workflow', action: 'workflow' },
      { text: '🛠️ See Tech Stack', action: 'tech' },
      { text: '🏠 Home', action: 'reset' }
    ];
  }

  private handleTechDetail(action: string) {
    let msg = "";
    if (action === 'tech_frontend') msg = "**Frontend Expertise**: Angular 17+ (Signals), Next.js, & GSAP for cinematic web animations.";
    if (action === 'tech_backend') msg = "**Backend Mastery**: NestJS, Spring Boot, & Laravel. Optimized PostgreSQL and Secure JWT implementations.";
    
    this.addBotMessage(msg);
    this.suggestions = [{ text: '🏗️ How I build them?', action: 'workflow' }, { text: '🏠 Home', action: 'reset' }];
  }

  private parseMarkdown(text: string): string {
    if (!text) return '';
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    
    let html = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="chat-link" target="_blank" style="color: var(--cyan); text-decoration: underline; font-weight: 600;">$1</a>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  private addBotMessage(text: string) {
    const formattedText = this.parseMarkdown(text);
    this.messages.push({ text: formattedText, isUser: false, timestamp: new Date() });
    this.scrollToBottom();
  }

  private addUserMessage(text: string) {
    const formattedText = this.parseMarkdown(text);
    this.messages.push({ text: formattedText, isUser: true, timestamp: new Date() });
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      const chatBody = document.querySelector('.chat-body');
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }, 100);
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
