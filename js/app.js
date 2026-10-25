/**
 * Rizzsembly Main Application Logic
 * Handles Payment Gateway, Onboarding, Opposite-Gender Feed,
 * Omegle-style Random Video Call, Friends, Chat, and Rizz Number system.
 */

// Audio Synthesizer for UI sound effects (Web Audio API)
const SoundEffects = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  playChime(freq = 587.33, type = 'sine', duration = 0.25) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play blocked", e);
    }
  },
  success() {
    this.playChime(523.25, 'triangle', 0.15); // C5
    setTimeout(() => this.playChime(659.25, 'sine', 0.3), 120); // E5
    setTimeout(() => this.playChime(783.99, 'sine', 0.4), 240); // G5
  },
  pop() {
    this.playChime(880, 'sine', 0.1);
  },
  skip() {
    this.playChime(350, 'sawtooth', 0.15);
  }
};

const RizzApp = {
  // Current user state
  user: null,
  friends: [],
  selectedPhotos: [],
  pendingPlan: null,
  activeChatFriend: null,
  currentStranger: null,
  localMediaStream: null,
  cameraEnabled: true,
  currentPhotoSlotIndex: 0,
  inCallChatMessages: [],

  init() {
    this.loadState();
    this.bindEvents();
    this.refreshIcons();
    this.checkInitialRoute();
  },

  refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  // Load persisted state from localStorage
  loadState() {
    // Reset any prior automatic bypass so the payment landing page is always presented first
    const savedUser = localStorage.getItem('rizzsembly_user');
    const savedFriends = localStorage.getItem('rizzsembly_friends');

    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
      } catch (e) {
        this.user = null;
      }
    }
    if (savedFriends) {
      try {
        this.friends = JSON.parse(savedFriends);
      } catch (e) {
        this.friends = [];
      }
    } else {
      // Default initial friend connection
      this.friends = [
        {
          id: "friend_1",
          name: "Tara Malhotra",
          age: 25,
          gender: "female",
          rizzNumber: "RIZZ-771203",
          qualification: "Brand Strategist",
          hobby: "Gym & Scuba Diving",
          location: "Delhi NCR, India",
          avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
          online: true,
          messages: [
            { sender: 'them', text: 'Hey there! Saw your Rizz Number on the feed! ✨', time: '10:20 AM' },
            { sender: 'them', text: 'Ready for a quick coffee debate anytime!', time: '10:21 AM' }
          ]
        }
      ];
      this.saveFriends();
    }
  },

  saveUser() {
    localStorage.setItem('rizzsembly_user', JSON.stringify(this.user));
    this.updateUserNavUI();
  },

  saveFriends() {
    localStorage.setItem('rizzsembly_friends', JSON.stringify(this.friends));
    this.updateFriendsBadge();
  },

  updateFriendsBadge() {
    const badge = document.getElementById('friends-badge');
    if (badge) {
      if (this.friends.length > 0) {
        badge.innerText = this.friends.length;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  },

  updateUserNavUI() {
    if (!this.user) return;
    const userPill = document.getElementById('user-header-pill');
    const landingBtn = document.getElementById('landing-cta-btn');
    const videocallBtn = document.getElementById('header-videocall-btn');
    const appNav = document.getElementById('app-nav');
    const mobileDock = document.getElementById('mobile-bottom-dock');

    if (this.user.paid && this.user.name) {
      userPill.classList.remove('hidden');
      userPill.classList.add('flex');
      landingBtn.classList.add('hidden');
      videocallBtn.classList.remove('hidden');
      appNav.classList.remove('hidden');
      mobileDock.classList.remove('hidden');

      document.getElementById('nav-user-name').innerText = this.user.name;
      document.getElementById('nav-user-rizz').innerText = '#' + (this.user.rizzNumber || 'RIZZ');
      const avatarUrl = (this.user.photos && this.user.photos.length > 0) ? this.user.photos[0] : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
      document.getElementById('nav-user-avatar').src = avatarUrl;
    } else {
      userPill.classList.add('hidden');
      landingBtn.classList.remove('hidden');
      videocallBtn.classList.add('hidden');
      appNav.classList.add('hidden');
      mobileDock.classList.add('hidden');
    }
    this.updateFriendsBadge();
  },

  checkInitialRoute() {
    // Check if URL has hash (e.g. #pricing-section)
    if (window.location.hash === '#pricing-section') {
      this.showView('landing');
      setTimeout(() => {
        const el = document.getElementById('pricing-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
      this.updateUserNavUI();
      return;
    }

    // Always welcome users on the Landing & Pricing Gateway first
    // If they already paid, they can easily click "Go to Feed" or view the pricing anytime
    if (!this.user || !this.user.paid) {
      this.showView('landing');
    } else {
      // Show landing page with an active pass banner, or allow them to go straight to feed
      this.showView('landing');
      this.renderPaidStatusBanner();
    }
    this.updateUserNavUI();
  },

  renderPaidStatusBanner() {
    const banner = document.getElementById('paid-visitor-banner');
    if (banner && this.user && this.user.paid) {
      banner.classList.remove('hidden');
      document.getElementById('paid-banner-plan').innerText = `${this.user.plan || 'Lifetime Pass'} Active (₹${this.user.price || 59})`;
    }
  },

  resetToPaywall() {
    localStorage.removeItem('rizzsembly_user');
    this.user = null;
    this.showToast("Paywall Reset! You are now in fresh new-user mode.", "info");
    const banner = document.getElementById('paid-visitor-banner');
    if (banner) banner.classList.add('hidden');
    this.showView('landing');
    this.updateUserNavUI();
    const pricing = document.getElementById('pricing-section');
    if (pricing) pricing.scrollIntoView({ behavior: 'smooth' });
  },

  showView(viewName) {
    document.querySelectorAll('.view-screen').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav button
    document.querySelectorAll('.nav-btn, .nav-item').forEach(btn => {
      if (btn.dataset.page === viewName) {
        btn.classList.add('text-rose-500', 'bg-white/10', 'active');
        btn.classList.remove('text-slate-300');
      } else {
        btn.classList.remove('text-rose-500', 'bg-white/10', 'active');
        btn.classList.add('text-slate-300');
      }
    });

    if (viewName === 'home') this.renderFeed();
    if (viewName === 'friends') this.renderFriendsList();
    if (viewName === 'settings') this.renderSettings();

    this.refreshIcons();
  },

  navigateTo(page) {
    if (!this.user || !this.user.paid) {
      this.showToast("Please choose a membership plan to start! ✨", "info");
      this.showView('landing');
      const pricingSection = document.getElementById('pricing-section');
      if (pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!this.user.name) {
      this.showView('onboarding');
      return;
    }
    this.showView(page);
  },

  // =========================================================================
  // PAYMENT FLOW (₹20 for 1 Day, ₹50 for 1 Year, ₹59 for Lifetime)
  // =========================================================================
  initiatePayment(planId, price, planName) {
    SoundEffects.pop();
    this.pendingPlan = { planId, price, planName };
    document.getElementById('modal-plan-name').innerText = planName;
    document.getElementById('modal-plan-price').innerText = `₹${price}`;
    document.getElementById('pay-button-text').innerText = `I Have Paid ₹${price} • Unlock Website`;
    
    const modal = document.getElementById('payment-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    this.refreshIcons();
  },

  closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  },

  simulatePaymentSuccess(methodName) {
    SoundEffects.success();
    const btn = document.getElementById('pay-confirm-btn');
    btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Verifying with ${methodName}...`;
    this.refreshIcons();

    setTimeout(() => {
      // Confetti burst
      if (window.confetti) {
        window.confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      this.closePaymentModal();
      btn.innerHTML = `<i data-lucide="check-circle-2" class="w-5 h-5"></i> <span id="pay-button-text">I Have Paid • Unlock Website</span>`;

      const plan = this.pendingPlan || { planId: 'lifetime', price: 59, planName: 'Lifetime Pass' };

      // Mint or update User
      if (!this.user) {
        this.user = {
          paid: true,
          plan: plan.planName,
          planId: plan.planId,
          price: plan.price,
          paidAt: new Date().toISOString(),
          rizzNumber: this.generateUniqueRizzNumber()
        };
      } else {
        this.user.paid = true;
        this.user.plan = plan.planName;
        this.user.planId = plan.planId;
        this.user.price = plan.price;
      }

      this.saveUser();
      this.showToast(`🎉 Payment of ₹${plan.price} Successful! Welcome to Rizzsembly.`, "success");
      
      // Move to Onboarding Detail Form
      document.getElementById('onboarding-plan-label').innerText = `${plan.planName} Active (₹${plan.price})`;
      this.showView('onboarding');
    }, 1000);
  },

  // Generates unique 6-digit Rizz Number
  generateUniqueRizzNumber() {
    const digits = Math.floor(100000 + Math.random() * 900000);
    return `RIZZ-${digits}`;
  },

  // =========================================================================
  // ONBOARDING & PROFILE SETUP
  // =========================================================================
  updateAgeRangeDisplay() {
    const minVal = parseInt(document.getElementById('ob-target-min').value);
    const maxVal = parseInt(document.getElementById('ob-target-max').value);
    const label = document.getElementById('target-age-label');

    if (minVal > maxVal) {
      document.getElementById('ob-target-max').value = minVal;
    }
    const realMin = Math.min(minVal, maxVal);
    const realMax = Math.max(minVal, maxVal);
    label.innerText = `${realMin} - ${realMax}`;
  },

  triggerPhotoSelect(slotIndex) {
    this.currentPhotoSlotIndex = slotIndex;
    document.getElementById('photo-file-input').click();
  },

  handlePhotoUploaded(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target.result;
      this.selectedPhotos[this.currentPhotoSlotIndex] = base64Url;
      this.renderPhotoSlots();
      SoundEffects.pop();
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  },

  renderPhotoSlots() {
    for (let i = 0; i < 5; i++) {
      const slot = document.getElementById(`slot-${i}`);
      const photoUrl = this.selectedPhotos[i];
      if (photoUrl) {
        slot.innerHTML = `
          <img src="${photoUrl}" alt="Photo ${i + 1}" class="w-full h-full object-cover">
          <button type="button" onclick="event.stopPropagation(); RizzApp.removePhoto(${i})" class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center text-xs">
            ✕
          </button>
          ${i === 0 ? '<span class="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-rose-500 text-[9px] font-bold text-white">Main</span>' : ''}
        `;
      } else {
        slot.innerHTML = `
          <i data-lucide="plus" class="w-6 h-6 text-slate-400 mb-1"></i>
          <span class="text-[11px] text-slate-400">${i === 0 ? 'Photo 1 (Main)' : `Photo ${i + 1}`}</span>
        `;
      }
    }
    const count = this.selectedPhotos.filter(Boolean).length;
    document.getElementById('photo-count-badge').innerText = `${count} / 5 Photos`;
    this.refreshIcons();
  },

  removePhoto(index) {
    this.selectedPhotos[index] = null;
    this.renderPhotoSlots();
  },

  useSamplePhotos() {
    SoundEffects.pop();
    const gender = document.getElementById('ob-gender').value;
    if (gender === 'female') {
      this.selectedPhotos = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
      ];
    } else {
      this.selectedPhotos = [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
      ];
    }
    this.renderPhotoSlots();
    this.showToast("Loaded sample demo photos ✨", "success");
  },

  submitOnboarding(event) {
    event.preventDefault();
    const name = document.getElementById('ob-name').value.trim();
    const age = parseInt(document.getElementById('ob-age').value);
    const gender = document.getElementById('ob-gender').value;
    const qualification = document.getElementById('ob-qualification').value.trim();
    const hobby = document.getElementById('ob-hobby').value.trim();
    const bio = document.getElementById('ob-bio').value.trim() || 'Excited to meet interesting people on Rizzsembly!';
    const targetMin = parseInt(document.getElementById('ob-target-min').value);
    const targetMax = parseInt(document.getElementById('ob-target-max').value);

    // Validate Age 18 to 99
    if (isNaN(age) || age < 18 || age > 99) {
      this.showToast("Age must be between 18 and 99 years old.", "error");
      return;
    }

    const validPhotos = this.selectedPhotos.filter(Boolean);
    if (validPhotos.length === 0) {
      this.showToast("Please upload at least 1 photo to continue.", "error");
      return;
    }

    this.user = {
      ...this.user,
      name,
      age,
      gender,
      qualification,
      hobby,
      bio,
      targetMin,
      targetMax,
      photos: validPhotos,
      rizzNumber: this.user.rizzNumber || this.generateUniqueRizzNumber()
    };

    this.saveUser();
    SoundEffects.success();
    this.showToast(`Welcome ${name}! Your Rizz Number is #${this.user.rizzNumber}`, "success");
    this.showView('home');
  },

  // =========================================================================
  // OPPOSITE GENDER DISCOVERY FEED
  // =========================================================================
  renderFeed() {
    const feedGrid = document.getElementById('feed-grid');
    if (!feedGrid || !this.user) return;

    // Filter profiles based on Opposite Gender
    // If User is male -> show female
    // If User is female -> show male
    // If User is other -> show all
    const targetGender = this.user.gender === 'male' ? 'female' : (this.user.gender === 'female' ? 'male' : 'all');
    
    const badge = document.getElementById('target-filter-badge');
    if (badge) {
      badge.innerText = `Showing ${targetGender === 'all' ? 'All Genders' : targetGender.toUpperCase()} Profiles`;
    }

    let profiles = MOCK_PROFILES.filter(p => {
      if (targetGender === 'all') return true;
      return p.gender === targetGender;
    });

    // Apply keyword and age filters
    const searchVal = (document.getElementById('feed-search-input')?.value || '').toLowerCase();
    const ageFilter = document.getElementById('feed-age-filter')?.value || 'all';

    if (searchVal) {
      profiles = profiles.filter(p => 
        p.name.toLowerCase().includes(searchVal) ||
        p.hobby.toLowerCase().includes(searchVal) ||
        p.qualification.toLowerCase().includes(searchVal) ||
        p.location.toLowerCase().includes(searchVal)
      );
    }

    if (ageFilter === '18-24') {
      profiles = profiles.filter(p => p.age >= 18 && p.age <= 24);
    } else if (ageFilter === '25-30') {
      profiles = profiles.filter(p => p.age >= 25 && p.age <= 30);
    } else if (ageFilter === '31+') {
      profiles = profiles.filter(p => p.age >= 31);
    }

    if (profiles.length === 0) {
      feedGrid.innerHTML = `
        <div class="col-span-full py-16 text-center space-y-3">
          <i data-lucide="frown" class="w-12 h-12 text-slate-500 mx-auto"></i>
          <h4 class="text-lg font-bold text-slate-300">No matches found with this filter</h4>
          <p class="text-xs text-slate-500">Try adjusting your search or age filters</p>
        </div>
      `;
      this.refreshIcons();
      return;
    }

    feedGrid.innerHTML = profiles.map(p => {
      const isAlreadyFriend = this.friends.some(f => f.rizzNumber === p.rizzNumber);
      return `
        <div class="glass-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group">
          <!-- Photo Container -->
          <div class="relative aspect-[3/4] overflow-hidden bg-slate-900">
            <img src="${p.photos[0]}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

            <!-- Top Badges -->
            <div class="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span class="text-[11px] font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-rose-300 border border-white/10 font-bold">
                #${p.rizzNumber}
              </span>
              <span class="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Now
              </span>
            </div>

            <!-- Bottom Info Overlay -->
            <div class="absolute bottom-4 left-4 right-4 space-y-1">
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-bold text-white">${p.name}, ${p.age}</h3>
                ${p.verified ? '<i data-lucide="check-circle" class="w-4 h-4 text-cyan-400 fill-cyan-400/20"></i>' : ''}
              </div>
              <p class="text-xs text-rose-300 font-medium flex items-center gap-1.5">
                <i data-lucide="briefcase" class="w-3.5 h-3.5"></i>
                <span>${p.qualification}</span>
              </p>
              <p class="text-xs text-slate-300 flex items-center gap-1.5">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i>
                <span>${p.location}</span>
              </p>
            </div>
          </div>

          <!-- Bio & Tags -->
          <div class="p-5 space-y-4 flex-1 flex flex-col justify-between bg-white/[0.02]">
            <div class="space-y-3">
              <p class="text-xs text-slate-300 leading-relaxed italic">"${p.bio}"</p>
              <div class="flex flex-wrap gap-1.5">
                ${(p.hobbies || [p.hobby]).map(h => `<span class="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-slate-300 border border-white/10 font-medium">${h}</span>`).join('')}
              </div>
            </div>

            <!-- Action Buttons: Chat & Video Call & Add Friend -->
            <div class="pt-3 border-t border-white/10 grid grid-cols-3 gap-2">
              <button onclick="RizzApp.quickStartChat('${p.rizzNumber}')" class="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all" title="Send direct message">
                <i data-lucide="message-square" class="w-3.5 h-3.5 text-rose-400"></i>
                <span>Chat</span>
              </button>
              
              <button onclick="RizzApp.quickVideoCall('${p.rizzNumber}')" class="py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-rose-500/30 transition-all" title="Start video call">
                <i data-lucide="video" class="w-3.5 h-3.5"></i>
                <span>Call</span>
              </button>

              <button onclick="RizzApp.quickAddFriend('${p.rizzNumber}')" class="py-2.5 rounded-xl ${isAlreadyFriend ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/30'} text-xs font-bold flex items-center justify-center gap-1 transition-all" title="${isAlreadyFriend ? 'Friend Added' : 'Add Friend'}">
                <i data-lucide="${isAlreadyFriend ? 'check' : 'user-plus'}" class="w-3.5 h-3.5"></i>
                <span>${isAlreadyFriend ? 'Added' : 'Add'}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    this.refreshIcons();
  },

  filterFeed() {
    this.renderFeed();
  },

  // =========================================================================
  // OMEGLE-STYLE RANDOM GLOBAL VIDEO CALL
  // (Gender doesn't matter, connects people worldwide)
  // Controls: Skip, Chat, Add Friend, Call End
  // =========================================================================
  async startRandomVideoCall() {
    if (!this.user || !this.user.paid) {
      this.initiatePayment('lifetime', 59, 'Lifetime Pass');
      return;
    }

    SoundEffects.pop();
    const overlay = document.getElementById('videocall-overlay');
    overlay.classList.remove('hidden');

    // Initialize local camera
    await this.initUserWebcam();

    // Start looking for random stranger worldwide
    this.findNextStranger();
  },

  async initUserWebcam() {
    const videoEl = document.getElementById('self-webcam-video');
    const placeholder = document.getElementById('self-camera-placeholder');

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.localMediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true
        });
        videoEl.srcObject = this.localMediaStream;
        videoEl.classList.remove('hidden');
        placeholder.classList.add('hidden');
      } else {
        throw new Error("Camera not supported");
      }
    } catch (err) {
      console.warn("Webcam access error or permission denied:", err);
      videoEl.classList.add('hidden');
      placeholder.classList.remove('hidden');
    }
  },

  toggleCamera() {
    if (this.localMediaStream) {
      const videoTrack = this.localMediaStream.getVideoTracks()[0];
      if (videoTrack) {
        this.cameraEnabled = !this.cameraEnabled;
        videoTrack.enabled = this.cameraEnabled;
        const btn = document.getElementById('btn-toggle-cam');
        if (btn) {
          btn.innerHTML = `<i data-lucide="${this.cameraEnabled ? 'camera' : 'camera-off'}" class="w-5 h-5 ${this.cameraEnabled ? 'text-white' : 'text-rose-400'}"></i>`;
          this.refreshIcons();
        }
        this.showToast(`Camera ${this.cameraEnabled ? 'Turned On' : 'Turned Off'}`, "info");
      }
    }
  },

  findNextStranger() {
    // Show Searching State
    document.getElementById('radar-searching-state').classList.remove('hidden');
    document.getElementById('connected-stranger-view').classList.add('hidden');
    document.getElementById('call-partner-info').classList.add('hidden');
    document.getElementById('video-chat-messages').innerHTML = '';
    this.inCallChatMessages = [];

    // Reset Add Friend button state in call
    const addBtn = document.getElementById('call-add-friend-btn');
    const addText = document.getElementById('call-add-friend-text');
    addBtn.className = "flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/30 transition-all hover:scale-105";
    addText.innerText = "Add Friend";

    // Simulate worldwide matchmaking delay
    setTimeout(() => {
      // Pick random stranger from worldwide pool (gender doesn't matter)
      const randomIdx = Math.floor(Math.random() * RANDOM_STRANGERS.length);
      this.currentStranger = RANDOM_STRANGERS[randomIdx];

      SoundEffects.success();

      // Display Connected View
      document.getElementById('radar-searching-state').classList.add('hidden');
      const connectedView = document.getElementById('connected-stranger-view');
      connectedView.classList.remove('hidden');

      // Populate Stranger UI
      document.getElementById('stranger-name-tag').innerText = this.currentStranger.name;
      document.getElementById('stranger-country-tag').innerText = this.currentStranger.country;
      document.getElementById('stranger-rizz-tag').innerText = `#${this.currentStranger.rizzNumber}`;

      document.getElementById('call-partner-info').classList.remove('hidden');
      document.getElementById('call-partner-country').innerText = `${this.currentStranger.name} (${this.currentStranger.country})`;
      document.getElementById('call-partner-rizz').innerText = `#${this.currentStranger.rizzNumber}`;

      // Video display
      const strangerVid = document.getElementById('stranger-video-element');
      const strangerImg = document.getElementById('stranger-avatar-stream');

      strangerVid.classList.add('hidden');
      strangerImg.classList.remove('hidden');
      strangerImg.src = this.currentStranger.avatar;

      // Check if already friends
      if (this.friends.some(f => f.rizzNumber === this.currentStranger.rizzNumber)) {
        addBtn.className = "flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg transition-all";
        addText.innerText = "Already Friend ✓";
      }

      // Stranger sends initial greeting in in-call chat
      setTimeout(() => {
        this.receiveInCallMessage(this.currentStranger.name, this.currentStranger.greeting);
      }, 800);

      this.refreshIcons();
    }, 1200);
  },

  skipStranger() {
    SoundEffects.skip();
    this.findNextStranger();
  },

  addCurrentStrangerAsFriend() {
    if (!this.currentStranger) return;

    const exists = this.friends.some(f => f.rizzNumber === this.currentStranger.rizzNumber);
    if (exists) {
      this.showToast("This person is already in your friend list! 💖", "info");
      return;
    }

    const newFriend = {
      id: `stranger_${Date.now()}`,
      name: this.currentStranger.name,
      age: this.currentStranger.age,
      country: this.currentStranger.country,
      location: `${this.currentStranger.city}, ${this.currentStranger.country}`,
      rizzNumber: this.currentStranger.rizzNumber,
      avatar: this.currentStranger.avatar,
      online: true,
      messages: [
        { sender: 'them', text: `Met during random video call! Let's stay in touch! 🌍`, time: 'Just now' }
      ]
    };

    this.friends.unshift(newFriend);
    this.saveFriends();
    SoundEffects.success();

    const addBtn = document.getElementById('call-add-friend-btn');
    const addText = document.getElementById('call-add-friend-text');
    addBtn.className = "flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg transition-all";
    addText.innerText = "Friend Added! ✓";

    this.showToast(`Added ${this.currentStranger.name} (#${this.currentStranger.rizzNumber}) to Friends!`, "success");
    if (window.confetti) {
      window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }
  },

  toggleVideoChatDrawer() {
    const drawer = document.getElementById('video-chat-drawer');
    drawer.classList.toggle('hidden');
  },

  sendVideoCallMessage(event) {
    event.preventDefault();
    const input = document.getElementById('video-chat-input');
    const text = input.value.trim();
    if (!text) return;

    this.receiveInCallMessage('You', text, true);
    input.value = '';

    // Stranger replies after 1.2s
    if (this.currentStranger && this.currentStranger.responses) {
      setTimeout(() => {
        const reply = this.currentStranger.responses[Math.floor(Math.random() * this.currentStranger.responses.length)];
        this.receiveInCallMessage(this.currentStranger.name, reply, false);
      }, 1200);
    }
  },

  receiveInCallMessage(senderName, text, isMe = false) {
    const container = document.getElementById('video-chat-messages');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `p-2 rounded-xl text-xs ${isMe ? 'bg-rose-500/80 text-white ml-auto' : 'bg-white/10 text-slate-200'} max-w-[85%]`;
    bubble.innerHTML = `<strong>${senderName}:</strong> <span>${text}</span>`;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
    SoundEffects.pop();
  },

  endVideoCall() {
    SoundEffects.pop();
    const overlay = document.getElementById('videocall-overlay');
    overlay.classList.add('hidden');

    // Stop Webcam stream to release camera hardware
    if (this.localMediaStream) {
      this.localMediaStream.getTracks().forEach(track => track.stop());
      this.localMediaStream = null;
    }

    this.currentStranger = null;
    this.refreshIcons();
    this.renderFriendsList();
  },

  // =========================================================================
  // FRIENDS LIST & 1-ON-1 CHAT / VIDEO CALL
  // =========================================================================
  renderFriendsList() {
    const container = document.getElementById('friends-list-container');
    if (!container) return;

    if (this.friends.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center space-y-4">
          <div class="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
            <i data-lucide="user-x" class="w-8 h-8"></i>
          </div>
          <div class="space-y-1">
            <h4 class="text-lg font-bold text-slate-200">No friends added yet</h4>
            <p class="text-xs text-slate-400">Ask people for their Rizz Number or meet people on Random Video Call!</p>
          </div>
          <button onclick="RizzApp.openAddFriendModal()" class="px-5 py-2.5 rounded-xl btn-primary text-white text-xs font-bold">
            Add by Rizz Number
          </button>
        </div>
      `;
      this.refreshIcons();
      return;
    }

    container.innerHTML = this.friends.map(f => {
      const lastMsg = f.messages && f.messages.length > 0 ? f.messages[f.messages.length - 1].text : 'Connected via Rizz Number';
      return `
        <div class="glass-card p-5 rounded-3xl border border-white/10 flex flex-col justify-between space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="relative">
                <img src="${f.avatar}" alt="${f.name}" class="w-14 h-14 rounded-2xl object-cover border border-rose-500/40">
                <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ${f.online ? 'bg-emerald-400' : 'bg-slate-500'} border-2 border-[#0a0a14]"></span>
              </div>
              <div>
                <h4 class="font-bold text-white text-base">${f.name}</h4>
                <p class="text-xs text-rose-300 font-mono font-bold">#${f.rizzNumber}</p>
                <p class="text-[11px] text-slate-400 mt-0.5">${f.location || 'India'}</p>
              </div>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              Online
            </span>
          </div>

          <!-- Last message snippet -->
          <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 truncate">
            <span class="text-slate-500">💬</span> "${lastMsg}"
          </div>

          <!-- Actions: Chat and Video Call -->
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <button onclick="RizzApp.openChatModal('${f.rizzNumber}')" class="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all">
              <i data-lucide="message-circle" class="w-4 h-4 text-rose-400"></i>
              <span>Chat</span>
            </button>
            <button onclick="RizzApp.startFriendVideoCall('${f.rizzNumber}')" class="py-2.5 rounded-xl btn-primary text-white text-xs font-bold flex items-center justify-center gap-2 transition-all">
              <i data-lucide="video" class="w-4 h-4"></i>
              <span>Video Call</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    this.refreshIcons();
  },

  openChatModal(rizzNumber) {
    SoundEffects.pop();
    const friend = this.friends.find(f => f.rizzNumber === rizzNumber);
    if (!friend) return;

    this.activeChatFriend = friend;
    document.getElementById('chat-header-name').innerText = friend.name;
    document.getElementById('chat-header-rizz').innerText = `#${friend.rizzNumber}`;
    document.getElementById('chat-header-avatar').src = friend.avatar;

    this.renderChatMessages();

    const modal = document.getElementById('chat-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    this.refreshIcons();
  },

  closeChatModal() {
    const modal = document.getElementById('chat-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    this.activeChatFriend = null;
  },

  renderChatMessages() {
    if (!this.activeChatFriend) return;
    const container = document.getElementById('chat-messages-container');
    const msgs = this.activeChatFriend.messages || [];

    container.innerHTML = msgs.map(m => {
      const isMe = m.sender === 'me';
      return `
        <div class="flex flex-col ${isMe ? 'items-end' : 'items-start'}">
          <div class="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-br-none shadow-md shadow-rose-500/20' : 'bg-white/10 text-slate-100 rounded-bl-none'}">
            ${m.text}
          </div>
          <span class="text-[10px] text-slate-500 mt-1 px-1">${m.time || '10:30 AM'}</span>
        </div>
      `;
    }).join('');

    container.scrollTop = container.scrollHeight;
  },

  sendDirectMessage(event) {
    event.preventDefault();
    if (!this.activeChatFriend) return;

    const input = document.getElementById('chat-input-text');
    const text = input.value.trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.activeChatFriend.messages.push({ sender: 'me', text, time });
    input.value = '';
    SoundEffects.pop();
    this.renderChatMessages();
    this.saveFriends();

    // Auto simulated response from friend
    setTimeout(() => {
      const responses = [
        "Aww that's so sweet! ✨ How is your day going?",
        "Haha exactly what I was thinking! 😂",
        "Let's hop on a video call later tonight!",
        "Rizzsembled at the right time! ❤️"
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.activeChatFriend.messages.push({ sender: 'them', text: randomReply, time: replyTime });
      SoundEffects.playChime(600, 'sine', 0.2);
      this.renderChatMessages();
      this.saveFriends();
    }, 1000);
  },

  startFriendVideoCall(rizzNumber) {
    const friend = this.friends.find(f => f.rizzNumber === rizzNumber);
    if (!friend) return;
    this.closeChatModal();

    // Open video call overlay directly with this friend
    const overlay = document.getElementById('videocall-overlay');
    overlay.classList.remove('hidden');

    this.initUserWebcam();

    // Setup direct friend video stream
    document.getElementById('radar-searching-state').classList.add('hidden');
    const connectedView = document.getElementById('connected-stranger-view');
    connectedView.classList.remove('hidden');

    document.getElementById('stranger-name-tag').innerText = friend.name;
    document.getElementById('stranger-country-tag').innerText = "Direct Call 💖";
    document.getElementById('stranger-rizz-tag').innerText = `#${friend.rizzNumber}`;

    document.getElementById('call-partner-info').classList.remove('hidden');
    document.getElementById('call-partner-country').innerText = `${friend.name} (Direct Call)`;
    document.getElementById('call-partner-rizz').innerText = `#${friend.rizzNumber}`;

    const strangerVid = document.getElementById('stranger-video-element');
    const strangerImg = document.getElementById('stranger-avatar-stream');
    strangerVid.classList.add('hidden');
    strangerImg.classList.remove('hidden');
    strangerImg.src = friend.avatar;

    const addBtn = document.getElementById('call-add-friend-btn');
    const addText = document.getElementById('call-add-friend-text');
    addBtn.className = "flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg transition-all";
    addText.innerText = "Friend Added ✓";

    SoundEffects.success();
    this.showToast(`Connected with ${friend.name} on Video Call!`, "success");
    this.refreshIcons();
  },

  startDirectFriendVideoCall() {
    if (this.activeChatFriend) {
      this.startFriendVideoCall(this.activeChatFriend.rizzNumber);
    }
  },

  quickStartChat(rizzNumber) {
    let friend = this.friends.find(f => f.rizzNumber === rizzNumber);
    if (!friend) {
      this.quickAddFriend(rizzNumber, false);
      friend = this.friends.find(f => f.rizzNumber === rizzNumber);
    }
    this.openChatModal(rizzNumber);
  },

  quickVideoCall(rizzNumber) {
    let friend = this.friends.find(f => f.rizzNumber === rizzNumber);
    if (!friend) {
      this.quickAddFriend(rizzNumber, false);
    }
    this.startFriendVideoCall(rizzNumber);
  },

  quickAddFriend(rizzNumber, notify = true) {
    const exists = this.friends.some(f => f.rizzNumber === rizzNumber);
    if (exists) {
      if (notify) this.showToast("Already in your friends list! 💖", "info");
      return;
    }

    const mock = MOCK_PROFILES.find(p => p.rizzNumber === rizzNumber) || RANDOM_STRANGERS.find(s => s.rizzNumber === rizzNumber);
    if (!mock) return;

    const newFriend = {
      id: `mock_${Date.now()}`,
      name: mock.name,
      age: mock.age,
      qualification: mock.qualification || 'Explorer',
      hobby: mock.hobby || 'Meeting new friends',
      location: mock.location || mock.country || 'India',
      rizzNumber: mock.rizzNumber,
      avatar: (mock.photos && mock.photos[0]) || mock.avatar,
      online: true,
      messages: [
        { sender: 'them', text: `Hey! Thanks for adding my Rizz Number! ✨`, time: 'Just now' }
      ]
    };

    this.friends.unshift(newFriend);
    this.saveFriends();
    SoundEffects.success();
    if (notify) {
      this.showToast(`Added ${mock.name} (#${mock.rizzNumber}) to friends!`, "success");
    }
    this.renderFeed();
  },

  // =========================================================================
  // ADD FRIEND BY RIZZ NUMBER MODAL
  // =========================================================================
  openAddFriendModal() {
    if (!this.user || !this.user.paid) {
      this.showToast("Please choose a membership pass to start adding friends!", "info");
      this.initiatePayment('lifetime', 59, 'Lifetime Pass');
      return;
    }
    SoundEffects.pop();
    const modal = document.getElementById('add-friend-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('rizz-search-result').classList.add('hidden');
    document.getElementById('add-rizz-input').value = '';
    this.refreshIcons();
  },

  closeAddFriendModal() {
    const modal = document.getElementById('add-friend-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  },

  fillSearchRizz(number) {
    document.getElementById('add-rizz-input').value = number;
    this.searchRizzNumber();
  },

  searchRizzNumber() {
    let inputVal = document.getElementById('add-rizz-input').value.trim().toUpperCase();
    if (!inputVal) {
      this.showToast("Please enter a valid Rizz Number", "error");
      return;
    }
    if (!inputVal.startsWith('RIZZ-') && !inputVal.startsWith('#RIZZ-')) {
      inputVal = 'RIZZ-' + inputVal.replace(/[^0-9]/g, '');
    }
    const cleanNum = inputVal.replace('#', '');

    // Search in mock profiles and random strangers pool
    const found = MOCK_PROFILES.find(p => p.rizzNumber === cleanNum) || RANDOM_STRANGERS.find(s => s.rizzNumber === cleanNum);
    const resultBox = document.getElementById('rizz-search-result');

    if (found) {
      SoundEffects.pop();
      resultBox.classList.remove('hidden');
      const isFriend = this.friends.some(f => f.rizzNumber === cleanNum);
      const avatarUrl = (found.photos && found.photos[0]) || found.avatar;

      resultBox.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="${avatarUrl}" alt="${found.name}" class="w-12 h-12 rounded-2xl object-cover border border-rose-500">
            <div>
              <h4 class="font-bold text-white text-sm">${found.name}, ${found.age}</h4>
              <p class="text-xs text-rose-400 font-mono font-bold">#${found.rizzNumber}</p>
              <p class="text-[11px] text-slate-400">${found.location || found.country || 'India'}</p>
            </div>
          </div>
          <button onclick="RizzApp.quickAddFriend('${found.rizzNumber}'); RizzApp.closeAddFriendModal();" class="px-4 py-2 rounded-xl ${isFriend ? 'bg-emerald-500 text-white' : 'btn-primary text-white'} text-xs font-bold transition-all">
            ${isFriend ? 'Already Added ✓' : 'Add Friend +'}
          </button>
        </div>
      `;
    } else {
      resultBox.classList.remove('hidden');
      resultBox.innerHTML = `
        <div class="text-center py-2 text-xs text-rose-400 space-y-1">
          <p class="font-bold">No member found with #${cleanNum}</p>
          <p class="text-slate-400 text-[11px]">Check the Rizz number and try again.</p>
        </div>
      `;
    }
    this.refreshIcons();
  },

  // =========================================================================
  // SETTINGS & RIZZ NUMBER
  // =========================================================================
  renderSettings() {
    if (!this.user) return;
    document.getElementById('settings-rizz-number').innerText = `#${this.user.rizzNumber || 'RIZZ-000000'}`;
    document.getElementById('settings-name').value = this.user.name || '';
    document.getElementById('settings-age').value = this.user.age || 21;
    document.getElementById('settings-gender').value = this.user.gender || 'male';
    document.getElementById('settings-qualification').value = this.user.qualification || '';
    document.getElementById('settings-hobby').value = this.user.hobby || '';
    document.getElementById('settings-bio').value = this.user.bio || '';
    document.getElementById('settings-plan-status').innerText = `${this.user.plan || 'Lifetime Pass'} Active (₹${this.user.price || 59})`;
    this.refreshIcons();
  },

  copyRizzNumber() {
    if (!this.user || !this.user.rizzNumber) return;
    navigator.clipboard.writeText(`#${this.user.rizzNumber}`).then(() => {
      SoundEffects.pop();
      this.showToast(`Copied #${this.user.rizzNumber} to clipboard! Share it with friends.`, "success");
    }).catch(() => {
      this.showToast(`Your Rizz Number: #${this.user.rizzNumber}`, "info");
    });
  },

  saveSettingsProfile() {
    if (!this.user) return;
    const name = document.getElementById('settings-name').value.trim();
    const age = parseInt(document.getElementById('settings-age').value);
    const qualification = document.getElementById('settings-qualification').value.trim();
    const hobby = document.getElementById('settings-hobby').value.trim();
    const bio = document.getElementById('settings-bio').value.trim();

    if (isNaN(age) || age < 18 || age > 99) {
      this.showToast("Age must be between 18 and 99 years old.", "error");
      return;
    }

    this.user.name = name;
    this.user.age = age;
    this.user.qualification = qualification;
    this.user.hobby = hobby;
    this.user.bio = bio;

    this.saveUser();
    SoundEffects.success();
    this.showToast("Profile details updated successfully! ✨", "success");
  },

  resetApp() {
    if (confirm("Reset demo data and clear your Rizz profile? You can start over fresh.")) {
      localStorage.removeItem('rizzsembly_user');
      localStorage.removeItem('rizzsembly_friends');
      location.reload();
    }
  },

  // Toast Notification System
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-emerald-600/90 text-white' : (type === 'error' ? 'bg-rose-600/90 text-white' : 'bg-slate-800/90 text-white');

    toast.className = `pointer-events-auto px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 text-xs font-semibold flex items-center gap-2 transform transition-all duration-300 translate-y-4 opacity-0 ${bgClass}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  bindEvents() {
    // Parallax mouse move effect
    document.addEventListener('mousemove', (e) => {
      const orbs = document.querySelectorAll('.glow-orb');
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 20;
        orb.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px)`;
      });
    });
  }
};

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  RizzApp.init();
});
