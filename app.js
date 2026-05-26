/**
 * Food Flower Market - Core JavaScript & Interactive Engine
 * Handles Local Storage, Email Simulator, Custom Modals, and Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initPremiumScroll();
  initLocalStorageData();
  injectEmailSimulator();
  renderRemindersView();
  syncInteractiveWidgets();
});

// 1. Premium Scroll Transitions & Loading Effects
function initPremiumScroll() {
  const header = document.querySelector('.header');
  
  // Add scrolled class to header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
      header.style.backgroundColor = 'rgba(11, 26, 48, 0.95)';
      header.style.backdropFilter = 'blur(10px)';
      header.style.padding = '0.5rem 0';
      header.style.boxShadow = '0 10px 30px rgba(11, 26, 48, 0.15)';
    } else {
      header.classList.remove('header-scrolled');
      header.style.backgroundColor = 'var(--primary-color)';
      header.style.backdropFilter = 'none';
      header.style.padding = '0';
      header.style.boxShadow = 'var(--shadow-sm)';
    }
  });

  // Page Load Fade-in
  document.body.classList.add('loaded');
}

// 2. Local Storage Reminders & Subscriptions Framework
const DEFAULT_REMINDERS = [
  { id: '1', date: 'June 1, 2026', recipient: 'Mother', occasion: 'Birthday', gift: 'The Seasonal Oasis Box', advance: '7 Days Before', email: 'musaaxelman@gmail.com', message: 'Happy Birthday Mom! Enjoy these fresh mangoes and lilies.' },
  { id: '2', date: 'June 12, 2026', recipient: 'Eleanor', occasion: 'Anniversary', gift: 'The Royal Treat & Flora Box', advance: '7 Days Before', email: 'musaaxelman@gmail.com', message: 'Happy Anniversary darling! Eight wonderful years together.' },
  { id: '3', date: 'June 23, 2026', recipient: 'Marcus', occasion: 'Corporate', gift: 'The Golden Imperial Box', advance: '7 Days Before', email: 'musaaxelman@gmail.com', message: 'Thank you for your ongoing partnership. Enjoy the mangosteens!' }
];

function initLocalStorageData() {
  if (!localStorage.getItem('fFM_reminders')) {
    localStorage.setItem('fFM_reminders', JSON.stringify(DEFAULT_REMINDERS));
  }
  if (!localStorage.getItem('fFM_subscriptions')) {
    localStorage.setItem('fFM_subscriptions', JSON.stringify([]));
  }
  if (!localStorage.getItem('fFM_email_logs')) {
    const initialLogs = [
      {
        id: 'welcome',
        to: 'customer@foodflowermarket.co.uk',
        subject: 'Welcome to Food Flower Market Connoisseur Club',
        type: 'System Alert',
        timestamp: new Date().toLocaleTimeString(),
        body: 'Thank you for exploring our premium fruit delivery services. Your gateway to year-round healthy gift baskets and automated reminders is now active.'
      }
    ];
    localStorage.setItem('fFM_email_logs', JSON.stringify(initialLogs));
  }
}

// 3. Email Simulator Widget Injection
function injectEmailSimulator() {
  // Check if widget already exists
  if (document.getElementById('email-simulator-widget')) return;

  const widgetHTML = `
    <!-- Floating Button -->
    <button id="email-simulator-toggle" class="email-sim-btn" aria-label="Toggle Notification Log">
      <i class="fa-solid fa-envelope-open-text"></i>
      <span class="email-sim-badge" id="email-sim-badge-count">1</span>
    </button>

    <!-- Slide up Panel -->
    <div id="email-simulator-panel" class="email-sim-panel">
      <div class="email-sim-header">
        <h4><i class="fa-solid fa-bell"></i> Live Gifting Alerts & Emails Log</h4>
        <button id="email-simulator-close" aria-label="Close Log"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="email-sim-body" id="email-sim-logs-container">
        <!-- Rendered logs go here -->
      </div>
      <div class="email-sim-footer">
        <span style="font-size: 0.75rem; opacity: 0.7;">Mockup Notification Center • Saves to localStorage</span>
        <button onclick="clearEmailLogs()" class="btn-clear-logs">Clear Logs</button>
      </div>
    </div>
  `;
  // -musa-

  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'email-simulator-widget';
  widgetContainer.innerHTML = widgetHTML;
  document.body.appendChild(widgetContainer);

  // Setup event listeners
  const toggleBtn = document.getElementById('email-simulator-toggle');
  const closeBtn = document.getElementById('email-simulator-close');
  const panel = document.getElementById('email-simulator-panel');

  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('active');
    updateEmailLogsUI();
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('active');
  });

  updateEmailLogsUI();
}

function updateEmailLogsUI() {
  const container = document.getElementById('email-sim-logs-container');
  const badge = document.getElementById('email-sim-badge-count');
  const logs = JSON.parse(localStorage.getItem('fFM_email_logs') || '[]');

  badge.textContent = logs.length;
  if (logs.length === 0) {
    container.innerHTML = `<div class="email-log-empty">No simulated emails triggered yet. Try ordering a box or scheduling a reminder!</div>`;
    return;
  }

  container.innerHTML = logs.map(log => `
    <div class="email-log-card animate-fade-in">
      <div class="email-log-meta">
        <span class="log-tag">${log.type}</span>
        <span class="log-time">${log.timestamp}</span>
      </div>
      <div class="email-log-field"><strong>To:</strong> ${log.to}</div>
      <div class="email-log-field"><strong>Subject:</strong> ${log.subject}</div>
      <div class="email-log-body">${log.body}</div>
    </div>
  `).reverse().join('');
}

function addEmailLog(to, subject, type, body) {
  const logs = JSON.parse(localStorage.getItem('fFM_email_logs') || '[]');
  const newLog = {
    id: Date.now().toString(),
    to: to,
    subject: subject,
    type: type,
    timestamp: new Date().toLocaleTimeString(),
    body: body
  };
  logs.push(newLog);
  localStorage.setItem('fFM_email_logs', JSON.stringify(logs));
  updateEmailLogsUI();
  
  // Visual pulse trigger on the floating button
  const toggleBtn = document.getElementById('email-simulator-toggle');
  toggleBtn.classList.add('pulse');
  setTimeout(() => toggleBtn.classList.remove('pulse'), 1000);
}

function clearEmailLogs() {
  localStorage.setItem('fFM_email_logs', JSON.stringify([]));
  updateEmailLogsUI();
}

// 4. Render Reminders View & Color Calendar Grid
function renderRemindersView() {
  const list = document.getElementById('saved-reminders-list');
  if (!list) return; // Exit if not on Calendar page

  const reminders = JSON.parse(localStorage.getItem('fFM_reminders') || '[]');
  
  // Render list
  list.innerHTML = reminders.map(rem => `
    <li class="animate-fade-in" style="margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; background: var(--white); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
      <div>
        <i class="fa-solid fa-calendar-check" style="color: var(--accent-gold); margin-right: 0.5rem;"></i>
        <strong>${rem.date.split(',')[0]}:</strong> ${rem.recipient}'s ${rem.occasion} - <span style="color: var(--accent-green); font-weight: 600;">${rem.gift}</span>
      </div>
      <button onclick="deleteReminder('${rem.id}')" style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 0.9rem;" title="Delete Reminder"><i class="fa-solid fa-trash-can"></i></button>
    </li>
  `).join('');

  colorCalendarGrid(reminders);
}

function colorCalendarGrid(reminders) {
  // Colors large calendar cells on calendar.html
  const cells = document.querySelectorAll('.calendar-large-day');
  if (cells.length === 0) return;

  // Clear existing tags except pre-placed ones if cells clicked
  cells.forEach((cell, idx) => {
    const numSpan = cell.querySelector('.day-number');
    if (!numSpan) return;
    const day = numSpan.textContent;

    // Find reminder matching this day
    const matchingRem = reminders.find(r => r.date.includes(`June ${day},`));
    
    // Remove existing event tag first
    const existingTag = cell.querySelector('.day-event-tag');
    if (existingTag) cell.removeChild(existingTag);

    if (matchingRem) {
      const tag = document.createElement('span');
      tag.className = 'day-event-tag';
      if (matchingRem.occasion === 'Anniversary') tag.classList.add('gold');
      tag.textContent = matchingRem.recipient + "'s " + matchingRem.occasion;
      cell.appendChild(tag);
    }
  });

  // Sync mini calendar in homepage preview if active
  const homeDates = document.querySelectorAll('.calendar-widget .cal-date');
  if (homeDates.length > 0) {
    homeDates.forEach(date => {
      if (date.classList.contains('empty')) return;
      const day = date.textContent;
      const matchingRem = reminders.find(r => r.date.includes(`June ${day},`));
      
      date.className = 'cal-date'; // Reset
      if (matchingRem) {
        date.classList.add('event');
        if (day === '1') date.classList.add('active'); // active preview day
        date.title = `${matchingRem.recipient}'s ${matchingRem.occasion}`;
      }
    });
  }
}

// 5. Delete Gifting Reminder
window.deleteReminder = function(id) {
  let reminders = JSON.parse(localStorage.getItem('fFM_reminders') || '[]');
  const rem = reminders.find(r => r.id === id);
  reminders = reminders.filter(r => r.id !== id);
  localStorage.setItem('fFM_reminders', JSON.stringify(reminders));
  
  if (rem) {
    addEmailLog(
      rem.email || 'customer@foodflowermarket.co.uk',
      `Reminder Cancelled: ${rem.recipient}'s ${rem.occasion}`,
      'System Alert',
      `You have cancelled the automatic ${rem.gift} delivery scheduled for ${rem.recipient} on ${rem.date}. All pending payments for this date are voided.`
    );
  }
  
  renderRemindersView();
};

// 6. Save Gifting Reminder Form Submission
window.saveReminderEvent = function(e) {
  e.preventDefault();
  const recipient = document.getElementById('reminder-recipient').value;
  const date = document.getElementById('reminder-date').value;
  const occasion = document.getElementById('reminder-occasion').value;
  const giftSelect = document.getElementById('reminder-gift');
  const gift = giftSelect.options[giftSelect.selectedIndex].text.split(' (£')[0];
  const advance = document.getElementById('reminder-advance').value;
  const message = document.getElementById('reminder-message').value;

  const reminders = JSON.parse(localStorage.getItem('fFM_reminders') || '[]');
  const newRem = {
    id: Date.now().toString(),
    date: date,
    recipient: recipient,
    occasion: occasion,
    gift: gift,
    advance: advance,
    email: 'musaaxelman@gmail.com', // Mock account
    message: message
  };

  reminders.push(newRem);
  localStorage.setItem('fFM_reminders', JSON.stringify(reminders));

  // Trigger simulated emails
  addEmailLog(
    'musaaxelman@gmail.com',
    `Gifting Reminder Saved: ${recipient}'s ${occasion}`,
    'System Alert',
    `Confirmation: Gifting reminder has been set for ${recipient} on ${date}. We will email you ${advance} with options to update or cancel.`
  );

  // If a message was added, log card handwriting
  if (message.trim()) {
    addEmailLog(
      'design-desk@foodflowermarket.co.uk',
      `Calligraphy Work Order - Event Date: ${date.split(',')[0]}`,
      'Staff Order',
      `Recipient: ${recipient}. Handwritten Message: "${message}". Please assign to floristry packaging division.`
    );
  }

  alert(`Success! Gifting reminder scheduled for ${recipient} on ${date}.`);
  document.getElementById('reminder-main-form').reset();
  document.getElementById('reminder-date').value = 'June 1, 2026';
  
  renderRemindersView();
};

// 7. Click Gifting Calendar grid selector helper
window.selectCalendarDate = function(dayNum, existingEventName = '') {
  const allDays = document.querySelectorAll('.calendar-large-day');
  allDays.forEach(day => {
    day.style.borderColor = 'var(--border-color)';
    day.style.backgroundColor = '';
  });
  
  const selectedIndex = dayNum - 1;
  if (allDays[selectedIndex]) {
    allDays[selectedIndex].style.borderColor = 'var(--accent-gold)';
    allDays[selectedIndex].style.backgroundColor = 'var(--accent-green-light)';
  }
  
  const dateInput = document.getElementById('reminder-date');
  if (dateInput) {
    dateInput.value = 'June ' + dayNum + ', 2026';
  }
  
  const recipientInput = document.getElementById('reminder-recipient');
  const occasionSelect = document.getElementById('reminder-occasion');
  
  if (recipientInput && occasionSelect) {
    if (existingEventName) {
      recipientInput.value = existingEventName.split("'")[0] || 'My Recipient';
      if (existingEventName.toLowerCase().includes('birthday')) {
        occasionSelect.value = 'Birthday';
      } else if (existingEventName.toLowerCase().includes('anniversary')) {
        occasionSelect.value = 'Anniversary';
      } else {
        occasionSelect.value = 'Corporate';
      }
    } else {
      recipientInput.value = '';
      occasionSelect.value = 'Birthday';
    }
    suggestGiftBox();
    recipientInput.focus();
  }
};

window.suggestGiftBox = function() {
  const occasionVal = document.getElementById('reminder-occasion');
  const giftSelect = document.getElementById('reminder-gift');
  if (!occasionVal || !giftSelect) return;

  const occasion = occasionVal.value;
  if (occasion === 'Anniversary') {
    giftSelect.value = 'Royal';
  } else if (occasion === 'Corporate' || occasion === 'Holiday') {
    giftSelect.value = 'Imperial';
  } else {
    giftSelect.value = 'Oasis';
  }
};

// 8. Subscription Checkout Modal Manager
window.openCheckout = function(name, price) {
  const modal = document.getElementById('checkout-modal');
  const modalBoxName = document.getElementById('modal-box-name');
  const modalBoxPrice = document.getElementById('modal-box-price');
  
  if (modal && modalBoxName && modalBoxPrice) {
    modalBoxName.textContent = name;
    modalBoxPrice.textContent = price;
    modal.style.display = 'flex';
  }
};

window.closeCheckoutModal = function() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.style.display = 'none';
};

// Handle checkout modal submission
window.submitCheckout = function(e) {
  e.preventDefault();
  const name = document.getElementById('modal-box-name').textContent;
  const price = document.getElementById('modal-box-price').textContent;
  const frequency = document.getElementById('modal-delivery-frequency').value;
  const recipient = document.getElementById('modal-recipient-name').value;
  const address = document.getElementById('modal-delivery-address').value;
  
  const subs = JSON.parse(localStorage.getItem('fFM_subscriptions') || '[]');
  const newSub = {
    id: Date.now().toString(),
    boxName: name,
    price: price,
    frequency: frequency,
    recipient: recipient,
    address: address,
    status: 'Active'
  };
  subs.push(newSub);
  localStorage.setItem('fFM_subscriptions', JSON.stringify(subs));

  // Trigger emails
  addEmailLog(
    'musaaxelman@gmail.com',
    `Welcome to Food Flower Market! Subscription Confirmed`,
    'Subscription Active',
    `Receipt & Welcome: Your subscription for ${name} (${frequency} at ${price}) has been activated successfully. Delivery Address: ${address}. First box scheduled to arrive on the nearest Friday.`
  );

  addEmailLog(
    'fulfillment-hub@foodflowermarket.co.uk',
    `Packing Work Order: New Subscription Setup`,
    'Fulfillment Order',
    `Assemble: New order for ${name}. Frequency: ${frequency}. Ship to Recipient: ${recipient} at Address: ${address}. Handwrite welcome gift card.`
  );

  alert(`Congratulations! Your subscription for ${name} has been activated successfully.`);
  closeCheckoutModal();
  syncInteractiveWidgets();
};

// Helper for newsletter alert integration
window.submitNewsletter = function(emailVal) {
  addEmailLog(
    emailVal,
    `Joined Food Flower Market Newsletter`,
    'Promotion',
    `Thank you for joining our Connoisseur Club mailing list! You will receive pre-sale updates on seasonal crop entries (mangoes, mangosteen, and granadillas) and flower design catalog updates.`
  );
};

// Sync elements in layout (like active subscription dashboard or header indicators)
function syncInteractiveWidgets() {
  // Render active subscriptions container if present on home or sub page
  const subs = JSON.parse(localStorage.getItem('fFM_subscriptions') || '[]');
  const dashboard = document.getElementById('active-subscriptions-dashboard');
  if (!dashboard) return;

  if (subs.length === 0) {
    dashboard.innerHTML = `
      <div style="text-align: center; padding: 2rem; border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
        <p style="margin-bottom: 1rem; font-size: 0.95rem;">You do not have any active subscriptions yet.</p>
        <a href="subscription.html" class="btn btn-primary" style="padding: 0.6rem 1.5rem; font-size: 0.8rem;">Browse Plans</a>
      </div>
    `;
    return;
  }

  dashboard.innerHTML = `
    <h4 style="margin-bottom: 1.5rem; font-family: var(--font-body); font-size: 1.1rem; color: var(--primary-color);">Your Active Gifting Subscriptions:</h4>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${subs.map(sub => `
        <div style="background: var(--white); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--accent-gold); display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-sm);">
          <div>
            <h5 style="font-family: var(--font-body); font-size: 0.95rem; font-weight: 700; margin-bottom: 0.25rem; color: var(--primary-color);">${sub.boxName}</h5>
            <p style="margin: 0; font-size: 0.8rem; color: var(--text-muted);">
              Recipient: <strong>${sub.recipient}</strong> • Address: <strong>${sub.address}</strong>
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--accent-green);">${sub.price}</div>
            <span style="font-size: 0.75rem; background: var(--accent-green-light); color: var(--accent-green); padding: 0.15rem 0.5rem; border-radius: 4px; font-weight: 600;">${sub.status} • ${sub.frequency.split(' ')[0]}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
