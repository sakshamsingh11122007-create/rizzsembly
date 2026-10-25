# 💖 Rizzsembly — Premium Paid Dating & Global Video Call Web Platform

**Rizzsembly** is a modern dating web application with an entry paywall, smooth scroll & parallax animations, opposite-gender match discovery, Omegle-style worldwide random video calls, unique **Rizz Number** identity tags, and friends list with 1-on-1 private chat & video calling.

---

## 🌟 Key Features

### 1. 💳 Micro-Payment Entry Paywall
Visitors are presented with an interactive pricing section:
- **1 Day Pass**: ₹20 (INR)
- **1 Year Pass**: ₹50 (INR)
- **Lifetime VIP Pass**: ₹59 (INR)
- Includes simulated Indian Payment Gateway (UPI apps like **Google Pay, PhonePe, Paytm, BHIM, QR code scanner**) with instant verification, confetti animation, and sound effects.

### 2. 🌌 Smooth Scroll & Parallax Aesthetics
- Built with smooth gradient meshes, glowing orbs, glassmorphism cards, and responsive parallax motion.
- Modern dark-mode UI with neon rose & cyber violet accents.

### 3. 📝 Interactive Onboarding & Profile Detail Form
- **Name**, **Age** (strictly validated **18 to 99 years old**).
- **Gender selection**: Male (discovers females), Female (discovers males), or Non-binary/All.
- **Qualification / Profession** and **Hobbies**.
- **Preferred Target Age Group Slider**: 18 to 99 years old.
- **Photo Upload**: Upload 1 to 5 photos with live previews, primary badge, slot remover, and sample photo quick-loader.

### 4. 💘 Opposite Gender Match Discovery
- Automatically filters and serves profiles of the opposite gender according to the user's setup.
- Interactive cards featuring verified badges, photos, profession, location, hobbies, and quick action buttons for **Chat**, **Video Call**, and **Add Friend**.

### 5. ⚡ Worldwide Random Video Call (Omegle / OmeTV Style)
- Prominent button on the home page: **"Start Random Video Call"**.
- Gender does not matter — connects with random people from all over the world.
- Real webcam & microphone access (`navigator.mediaDevices.getUserMedia`) with mirror picture-in-picture (PIP) view.
- In-call controls:
  - ⏭️ **Skip**: Instantly disconnects and scans the globe for the next person.
  - 💬 **Live Chat Drawer**: Send and receive instant messages during the video call.
  - ➕ **Add Friend**: Instantly saves the stranger and their unique Rizz Number to your friends list.
  - 📷 **Camera Toggle**: Mute/unmute video feed.
  - 🔴 **End Call**: Returns smoothly to home.

### 6. 🧭 Navigation System
Top header bar and mobile bottom navigation dock with:
- 🏠 **Home / Discover**: Opposite-gender curated matches and random video call hub.
- 👥 **Friends**: View added friends with online badges, direct 1-on-1 chat, and private video calls.
- ➕ **Add Friend**: Search and add anyone worldwide using their unique 6-digit Rizz Number.
- ⚙️ **Settings**: View account information, edit profile details, and inspect/copy your personal Rizz Number.

### 7. 👑 Unique Rizz Number System
- Every user is minted a unique identifier (e.g. `#RIZZ-882194`).
- Can be copied to clipboard with 1 click.
- Share your Rizz Number with anyone so they can find and add you instantly.

---

## 🚀 How to Run the Website

### Option 1: Using Python (Recommended)
Open a terminal (PowerShell or Command Prompt) and run:
```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\rizzsembly
python start_server.py
```
This starts the local web server on `http://localhost:8000` and automatically launches your default web browser.

### Option 2: Direct Browser Open
Double click or open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Brave):
`C:\Users\HP\.gemini\antigravity\scratch\rizzsembly\index.html`

---

## 🛠️ Tech Stack
- **HTML5 & Semantic Markup**
- **Tailwind CSS** (via CDN for sleek, responsive styling)
- **Lucide Icons** (modern SVG icons)
- **Web Audio API** (synthesized pleasant chime & interaction feedback)
- **WebRTC & MediaDevices API** (real webcam and mic video calling)
- **Canvas Confetti** (celebration effects on payment and friending)
- **Vanilla JavaScript (ES6+)** with reactive state management and `localStorage` persistence.
