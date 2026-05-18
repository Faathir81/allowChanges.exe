# 👾 allowChanges.exe — Universal Multi-Session Ticket Bot

[![allowChanges.exe](https://img.shields.io/badge/allowChanges.exe-Automations-blueviolet?style=for-the-badge)]()
[![Framework](https://img.shields.io/badge/Framework-Playwright-2e8b57?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)]()

A premium, tactical, **semi-automated (hybrid) ticket-war assistant** built with **Playwright (Node.js)**. Designed as a universal, high-concurrency waiting room bypasser to secure high-demand concert and event tickets (across major ticketing networks like **Queue-it, Tiket.com, Loket.com**, etc.) by utilizing isolated browser contexts, session-state baking, and dynamic DOM/URL radars.

This project is optimized specifically for a **Hybrid Handover Strategy**: allowing automation to handle the hardest parts of the "war" (concurrency, queue bypassing, session persistence, and pre-sale code injection) and transferring control to a human for checkout to avoid any machine-detection bans or payment gateway blocks.

---

## 🚀 Core Architecture & Features

- **Authentication State Baking (`auth.json`)**: Pre-authenticates your account during calm hours, extracting and saving active session cookies & local storage. During the zero-hour, it injects these tokens instantly into fresh sandboxed browsers, completely bypassing high-traffic login bottlenecks, MFA loops, and sudden OTP/CAPTCHA challenges.
- **Dimensional Multi-Session (Kage Bunshin Mode)**: Deploys 3-5 fully isolated browser contexts concurrently. Since modern digital waiting rooms (like Queue-it) randomize the placement pool, spinning up multiple "points of entry" heavily skews the randomized queue odds in your favor.
- **Lobby Click-Lock Pattern**: Automatically monitors the event landing page. The exact millisecond the "Join Waiting Room" or "Artist Presale" button becomes active/clickable, the bot clicks it in 0.01 seconds across all instances, locking exactly once per instance to avoid duplicate tabs or infinite-clicking loops.
- **Hybrid DOM & URL Radar**: Real-time background observer monitors the address bar and page elements (checking for `"Select"`, `"Pilih"`, `"Packages"`, or checkout headers) to catch successful queue clearances instantly.
- **Emergency Brake & Alarm Handover**: Immediately upon securing a queue bypass, the bot sounds a loud terminal audio cue (`\x07`), pulls the successful browser to the front, and halts/terminates other losing browser contexts to prevent double bookings.

---

## 📐 System Workflow

```text
[ PRE-WAR PHASE: Authentication State Baking ]
     Open login.js ──> Log in manually once ──> Extract cookies & tokens ──> Save auth.json

[ WAR ZERO-HOUR: Initialization ]
     Run bot.js ──> Load state (auth.json & config.json)
                         │
                         ├──> Instance Alpha   (Isolated Profile + Cookies) ──┐
                         ├──> Instance Beta    (Isolated Profile + Cookies) ──┼─> Enter Pre-Queue
                         └──> Instance Gamma   (Isolated Profile + Cookies) ──┘
                                                │
                                    [ Queue Opens / Randomizes ]
                                                │
                                                ▼
                                    Instant Lobby Button Click
                                                │
                                                ▼
                                    Monitor Real-time Queue
                                                │
                                      [ Queue Bypass Success ]
                                                │
                                                ▼
                                    Auto-Inject Presale Code
                                                │
                                                ▼
                                    Bring Winner Window to Front
                                                │
                                                ▼
                                  Force Halt Bot + Trigger Alarm
                                                │
                                                ▼
                                    Manual Checkout & Payment
```

---

## 🛠️ Prerequisites

Ensure your hardware environment has the following base dependencies:
- [Node.js](https://nodejs.org/) (Version 18 or higher)
- npm (Node Package Manager)

---

## 📦 Installation

1. Clone the repository into your local directory:
   ```bash
   git clone https://github.com/your-username/allowChanges.exe.git
   cd allowChanges.exe
   ```

2. Install the automated browser framework dependencies:
   ```bash
   npm install
   ```

3. Download the specific Chromium browser binaries required by Playwright:
   ```bash
   npx playwright install chromium
   ```

---

## ⚙️ Configuration (`config.json`)

Before starting the scripts, create a `config.json` file in the root directory to declare your session parameters:

```json
{
  "TARGET_URL": "https://example-ticketing-landingpage.com",
  "PRESALE_CODE": "YOUR_PRESALE_CODE_HERE",
  "TARGET_CATEGORY": "CAT 1",
  "TICKET_COUNT": 2,
  "MAX_SESSIONS": 3
}
```

### Parameters Guide:
- `TARGET_URL`: The entrypoint URL of the ticketing or event landing page where the queue selection or dates are located.
- `PRESALE_CODE`: The unique pre-sale access string required to unlock protected ticketing tiers.
- `TARGET_CATEGORY`: The designated ticket tier label (regex-ready; e.g., `/cat\s*1/i` will match "cat 1", "Cat 1", "CAT 1").
- `TICKET_COUNT`: Number of tickets to request.
- `MAX_SESSIONS`: Number of concurrent browser instances (recommended: 3 to avoid triggering IP-based DDoS firewalls).

---

## 🏃‍♂️ Operation Manual

### Step 1: Bake the Authentication Context (Pre-War)
Run the isolated login environment to authenticate your session state safely before the servers get overloaded.

```bash
node login.js
```
*A native browser window will execute. Log into the target ticketing platform manually, complete any security challenges or OTPs, and navigate to the home dashboard. Return to the terminal and press `ENTER` to write the verified session state tokens into `auth.json`.*

### Step 2: Initialize the Bypasser Loop (Zero-Hour)
Launch the multi-layered instances roughly 15-30 minutes prior to the general ticket release window to sit in the pre-queue.

```bash
node bot.js
```
*The script will spin up isolated, headed Chrome windows loaded with the active login cookies from Step 1. The moment the queue randomizer triggers and one of your contexts clears the queue, the bot instantly injects the pre-sale code, triggers a loud repeating alarm, pulls the winning window to the front, closes the losing tabs, and hands complete manual control over to you for choosing the tier and finalizing checkout.*

---

## ⚠️ Disclaimer

This project is created **strictly for educational, technical research, and archival purposes** to study high-concurrency browser automation, session persistence patterns, and web platform architecture performance under simulated high-load environments using Playwright. Automated purchasing or queue-bypassing may violate the Terms of Service of specific ticketing networks. The developer assumes absolutely no liability for account suspensions, transaction failures, or edge-case network drops. Use responsibly at your own risk.