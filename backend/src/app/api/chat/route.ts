import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not defined! Returning fallback mock response.');
      return NextResponse.json({
        response: "Greetings! Choeun's AI Virtual IQ is running in **offline demo mode** because the `GEMINI_API_KEY` is not set on the server yet. \n\nI can still trigger local actions for you! What would you like to customize?",
        action: "layouts",
        suggestions: [
          { text: "🌗 Toggle Theme", action: "style_theme" },
          { text: "🎨 Accent Colors", action: "style_colors" },
          { text: "🚀 Showcase Projects", action: "portfolio" }
        ]
      });
    }

    // Initialize Google Gen AI client
    const ai = new GoogleGenAI({ apiKey });

    // Format chat history for Gemini API
    const contents = [];
    if (history && Array.isArray(history)) {
      // Limit history to last 10 messages to avoid token bloat
      const contextHistory = history.slice(-10);
      for (const msg of contextHistory) {
        contents.push({
          role: msg.isUser ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }
    
    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const systemInstructions = `
You are the "Virtual IQ" chatbot for Choeun Lyhuoy's personal portfolio website.
Your purpose is to answer questions about Choeun's experience, projects, skills, education, and development workflow in a professional, friendly, and engaging way.

Here is Choeun Lyhuoy's professional information:
- Name: Choeun Lyhuoy
- Role: Full-Stack Developer
- Location: Phnom Penh, Cambodia
- Contact: Email: choeunlyhuoy@gmail.com, Phone: +885 71 591 9535
- Education: Information Technology Graduate from the Royal University of Phnom Penh (RUPP) - successfully passed the final state exam.
- Work Experience:
  * Backend Developer at Ecoinsoft Solution Co., Ltd. (Full-time, 2024 - 2025): Developed server-side logic in Grails/Groovy, designed RESTful APIs, used RabbitMQ, Redis, Xshell, Postman, Swagger.
  * Intern Backend Developer at KiloIT (Internship, 2023 - 2024): Java, Spring Boot, MySQL, API Design, Database Optimization.
  * Intern Frontend Developer at KiloIT (Internship, 2022 - 2023): React.js, Bootstrap, JavaScript, HTML/CSS, responsive design.
- Key Skills:
  * Frontend: HTML/CSS, JavaScript, TypeScript, Bootstrap, Angular, React.js
  * Backend: Java, Grails & Groovy, Spring Boot, MySQL Database, RabbitMQ, Redis Caching, .NET
  * Systems, Mobile & Management: Git & Version Control (GitHub/GitLab/Gitea), Flutter Mobile, Linux & Windows Server, XShell & SSH Tools, Software Engineering (SE) & MIS Concepts, Project Management (Trello & ClickUp)
- Core Projects:
  * Ecoinsoft Backend: Grails & Groovy server-side.
  * Responsive Web Interfaces: user-friendly responsive web designs.
  * API Communication Hub: RESTful APIs in Grails.
  * SQL Database Optimizer: MySQL/Postgres management.
  * Xshell & RabbitMQ Hub: Server management & message queue integrations.
  * ReactJS Web Applications: ReactJS, Redux, React Router.
  * Spring Enterprise Microservices: Spring Boot microservices, JPA, RabbitMQ.
  * Flutter Omni-Shop: Mobile e-commerce solution.
  * Vat' Milktea (POS): Flutter & Laravel POS system with multi-branch sync.
  * NexaData Dashboard: Angular analytics engine with D3.js and Signals.
- Development Workflow:
  * Phase 1: High-Fi Design (Figma, scalable design systems, UX micro-interactions).
  * Phase 2: Core Architecture (Schemas, Prisma, Clean Architecture).
  * Phase 3: Development (Angular Signals, RxJS, Flutter BLoC).
  * Phase 4: CI/CD Deployment (Docker, Automated pipelines).

CRITICAL REQUIREMENT:
You must ALWAYS respond with a JSON object. The JSON object must contain exactly three properties:
1. "response" (string): Your markdown-formatted response answering the user query. Keep it helpful, professional, and relatively concise (1-3 sentences per point). You can use markdown bold, list items, and code blocks.
2. "action" (string or null): If the user asks to navigate, perform an action, or if it fits the conversation context, set this to one of the following strings (otherwise null):
   - "portfolio": Scroll to projects gallery.
   - "workflow": Scroll to development process/workflow (services section).
   - "layouts": Show layout/styling customization options.
   - "contact": Scroll to contact portal.
   - "about": Scroll to about/bio section.
   - "skills_max": "God mode" activation for RPG skills tree.
   - "bg_grid": Set grid background.
   - "bg_aurora": Set aurora blobs background.
   - "bg_clean": Set clean/minimal background.
   - "corners_sharp": Make corners sharp.
   - "corners_default": Make corners balanced.
   - "corners_playful": Make corners playful/pill.
   - "color_default": Use default blue color accent.
   - "color_emerald": Use emerald green color accent.
   - "color_purple": Use royal purple color accent.
   - "layout_nav": Use standard top navbar.
   - "layout_rail": Use mobile side rail.
   - "layout_port_grid": Switch portfolio to grid view.
   - "layout_port_list": Switch portfolio to list view.
   - "card_glass": Switch portfolio cards to glassmorphism.
   - "card_minimal": Switch portfolio cards to flat minimal style.
   - "card_glow": Switch portfolio cards to neon glowing style.
   - "card_holo": Switch portfolio cards to holographic foil card style.
   - "card_cyber": Switch portfolio cards to cyberpunk glitch style.
   - "img_normal": Set project thumbnail image filter to normal color.
   - "img_gray": Set project thumbnail image filter to grayscale.
   - "download_cv": Trigger automatic download of Choeun Lyhuoy's CV/resume PDF file.
3. "suggestions" (array of objects or null): An optional list of up to 3 follow-up chat suggestions. Each suggestion must have:
   - "text" (string): The button label (e.g. "🚀 Showcase Projects")
   - "action" (string): The corresponding action keyword from above, or "reset" to restart.

Example Output format:
{
  "response": "Sure! I am navigating you to Choeun's projects gallery now.",
  "action": "portfolio",
  "suggestions": [
    { "text": "🌐 Web Platforms", "action": "project_web_menu" },
    { "text": "📱 Mobile Innovation", "action": "project_mobile_menu" }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstructions,
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    const parsedData = JSON.parse(responseText.trim());
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({
      response: "Apologies, Choeun's Virtual IQ encountered an error processing your query. Please select one of the default options below:",
      action: null,
      suggestions: [
        { text: "🚀 Showcase Projects", action: "portfolio" },
        { text: "📩 Start Collaboration", action: "contact" },
        { text: "🏠 Reset Chat", action: "reset" }
      ]
    });
  }
}
