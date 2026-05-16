# 👾 Allow Changes? — WeekndJakarta-TicketBot

[![Aether Editing](https://img.shields.io/badge/Aether-Editing-blueviolet?style=for-the-badge)]()
[![Target](https://img.shields.io/badge/Target-CAT%205-ff69b4?style=for-the-badge)]()
[![Framework](https://img.shields.io/badge/Framework-Playwright-2e8b57?style=for-the-badge)]()

A tactical, semi-automated ticket-war assistant built with **Playwright (Node.js)**. Designed to secure tickets for *The Weeknd: After Hours Til Dawn Tour Jakarta 2026* at Jakarta International Stadium (JIS) by inject-editing a flaw into the **Loket.com / Queue-it** infrastructure. 

Optimized specifically for a **Multi-Session & Semi-Automation (Handover)** strategy to bypass anti-bot systems seamlessly.

---

## 🚀 Core Vulnerability Fixes (Key Features)

- **Aether Login State (`auth.json`)**: Bakes and locks your authenticated session state (cookies & local storage) on Day-1 night. Completely bypasses high-traffic login bottlenecks, sudden MFA loops, and CAPTCHAs during the zero-hour.
- **Dimensional Multi-Session (Headed Mode)**: Deploys 3-5 fully isolated browser contexts simultaneously. Since Queue-it randomizes the waiting room pool, spinning up multiple "points of entry" heavily shifts the odds in your favor.
- **Voucher Validation Injection**: Auto-detects and instantly feeds the unique *Artist Presale* code or the 6-digit BCA card identifier into the gateway fields the millisecond the queue clears.
- **Regex-Hardened Tier Selector**: Uses a case-insensitive regular expression matcher (`/cat\s*5/i`) to safely lock onto the **CAT 5** tier, making it immune to any sudden label or structural re-formatting by the promoter.
- **Emergency Brake & Handover**: The bot terminates its loop and triggers an audio cue immediately after securing the tickets in the cart (*15-minute Booking Hold*), letting a human safely handle the payment gateway.

---

## 📐 System Workflow

```text
[ DAY-1 NIGHT: Data Baking ]
     Account + Verification ──> Run login.js ──> Save State to auth.json

[ WAR DAY: Zero Hour (09:45 AM WIB) ]
     Run bot.js ──> Core Load (auth.json & config.json)
                        │
                        ├──> Instance Alpha   (Isolated Profile) ──┐
                        ├──> Instance Beta    (Isolated Profile) ──┼─> Enter Queue-it Waiting Room
                        └──> Instance Gamma   (Isolated Profile) ──┘
                                               │
                                    [ Queue System Clears ]
                                               │
                                               ▼
                                  Auto-Inject Presale Voucher
                                               │
                                               ▼
                                   Targeting Tier: CAT 5
                                               │
                                               ▼
                                     Execute "Book Now"
                                               │
                                               ▼
                                  [ 15-MIN COUNTDOWN DETECTED ]
                                               │
                                               ▼
                                  Force Halt Bot + Trigger Alarm
                                               │
                                               ▼
                                   Manual Handover for Checkout
```

---

## 🛠️ Prerequisites

Ensure your hacking rig has the following base dependencies installed:
- [Node.js](https://nodejs.org/) (Version 18 or higher)
- npm (Node Package Manager)

---

## 📦 Installation

1. Clone the repository into your local directory:
   ```bash
   git clone [https://github.com/username/allow-changes.git](https://github.com/username/allow-changes.git)
   cd allow-changes
   ```

2. Install the necessary automated browser dependencies:
   ```bash
   npm install
   ```

3. Download the specific Chromium binaries required by Playwright:
   ```bash
   npx playwright install chromium
   ```

---

## ⚙️ Configuration (`config.json`)

Before starting the script, create a `config.json` file in the root directory to declare your session parameters:

```json
{
  "PRESALE_CODE": "YOUR_UNIQUE_ARTIST_OR_BCA_CODE",
  "TARGET_CATEGORY": "CAT 5",
  "TICKET_COUNT": 2,
  "MAX_SESSIONS": 3
}
```

### Parameters Guide:
- `PRESALE_CODE`: The specific presale access string required to unlock the categories.
- `TARGET_CATEGORY`: The designated tier label (Regex-ready; accepts variations like `cat 5`, `Cat 5`, or `CAT 5`).
- `TICKET_COUNT`: Number of tickets to fetch per session context (keep within the vendor limit).
- `MAX_SESSIONS`: Number of concurrent browser instances (recommended: 3 to avoid triggering IP-based DDoS filters).

---

## 🏃‍♂️ Operation Manual

### Step 1: Bake the Authentication Context (May 17th — Evening)
Run the isolated login environment to authenticate your session state safely before servers get overloaded.

```bash
node login.js
```
*A native browser window will execute. Log into the promoter platform manually, clear any necessary security checks or OTPs, and navigate to the dashboard. Return to the terminal and save to write the encrypted session tokens into `auth.json`.*

### Step 2: Initialize the Injection Loop (May 18th — 09:45 AM WIB)
Boot up the multi-layered instances roughly 15 minutes prior to the general ticket release window.

```bash
node bot.js
```
*The script will spin up isolated, headed Chrome windows utilizing the session state generated during Step 1. The moment an instance breaks through the virtual waiting room, it will instantly process the presale code, select CAT 5, append the ticket count, and lock down the reservation. Once the 15-minute countdown clock initializes, the bot sounds the alert and transfers access back to the hardware operator.*

---

## ⚠️ Disclaimer

This project is created **strictly for educational and technical research purposes** to analyze browser automation and web infrastructure performance under simulated high-concurrency loads using Playwright. Automated scripts may violate the Terms of Service of specific ticketing networks. The developer assumes absolutely no liability for account suspensions, transaction errors, or edge-case network drops. Use responsibly at your own risk.