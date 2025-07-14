# 🛒OmniSense – Shopping, Reimagined
## 📌Overview <br>
OmniSense is an AI-powered, emotion-aware shopping assistant developed for the Walmart Sparkathon 2025, designed to help customers make better, kinder, and smarter purchasing decisions based on their mood, needs, and budget. By addressing the emotional and practical challenges faced by shoppers, OmniSense creates a personalized, uplifting retail experience.

🔗Live Demo: https://omni-sense.vercel.app/ <br>
One-Line Pitch: AI-powered assistant for accessible independence. Voice, emotion, AR – all in sync, for everyone.

## ❓Problem Statement
In today’s fast-paced retail environments, shoppers often feel anxious, tired, or overwhelmed, leading to rushed decisions, confusion over product labels, or disengagement. OmniSense targets:  
- Elderly and visually impaired individuals  
- Busy parents, students, or neurodiverse users  
- Anyone feeling emotionally drained or confused by health buzzwords
OmniSense bridges the emotional gap, creating a retail experience that listens, understands, and uplifts.

## 🌟Features
- 🎭AR Mood Detection:Detects customer mood in real-time using front camera via face-api.js or MediaPipe. Suggests tailored product bundles, e.g., “You look tired — here’s a Cozy Kit: Blanket + Tea + Eye Mask.”
- 🎙️Voice-to-Vision Mode:Users can voice commands like “Show me keto snacks under ₹200,” and the AI responds with friendly, voiced suggestions and AR-style visual cues (mocked).
  <img width="1232" height="909" alt="image" src="https://github.com/user-attachments/assets/f663036e-18d2-43fd-800b-49ce2fb25fb1" />

- 🤖Predictive Checkout Concierge:Tracks cart, dietary preferences, and mood in real-time. At checkout, offers suggestions like, “You stayed under budget! Want to add a scented candle for ₹89?”
  <img width="1280" height="667" alt="image" src="https://github.com/user-attachments/assets/a6ce45a3-3231-40d0-bb62-4ed42b43fedf" />

- 🧾Smart Product Explainer:Simplifies complex product terms (e.g., “low-GI,” “fortified oats,” “cold-pressed”) with tap-to-explain, layman-friendly definitions.
  <img width="1233" height="914" alt="image" src="https://github.com/user-attachments/assets/da45128f-0bda-4227-b456-be5f5dd85198" />

- 🧘Comfort Bundles & Mood Uplift:Crafts mood-based bundles like “Relax Kit” or “Energize Pack” tailored to user’s budget and emotional state. Includes self-care tips (e.g., “Text a friend 💌”), mood playlists, or uplifting jokes/missions.
  <img width="1280" height="857" alt="image" src="https://github.com/user-attachments/assets/4053965e-807f-492d-be0d-140f09c86850" />


## 🛠Tech Stack
| Category       | Tech                                                                 |
|----------------|----------------------------------------------------------------------|
| Frontend       | React.js (Next.js), Tailwind CSS                                     |
| Backend        | OpenAI GPT-3.5 via API routes, mock data via JSON                    |
| AI / UX        | GPT-generated suggestions, face-api.js / MediaPipe, Web Speech API   |
| AR Overlay     | Simulated glow border with shelf mapping                             |

## 🚀Installation

- Clone the Repository:  
git clone https://github.com/Khushi-51/OmniSense.git <br>
cd OmniSense

- Install Dependencies:  
npm install

- Run the Application:  
npm run dev

Access the App:Open your browser and navigate to http://localhost:3000 or visit the deployed version at 👉 https://omni-sense.vercel.app/.

## 🗂Project Structure
OmniSense/ <br>
├── app/   <br>
│   ├── features/  <br>
│   │   └── Product-Explainer/  <br>
│   │       ├── page.tsx         # Main UI  <br>
│   │       └── components/      # UI components  <br>
├── public/                      # Static assets  <br>
├── README.md                    # Project documentation  <br>
└── package.json                 # Project dependencies and scripts  <br>


## 📄License
This project is licensed under the MIT License. See the LICENSE file for details.

## 🎓Developed for Walmart Sparkathon 2025.  
Thanks to the open-source community for tools and libraries like face-api.js, and Web Speech API.  

🎥YouTube Demo Link :   <br>
💙Built With Empathy By Team : Sparkers
