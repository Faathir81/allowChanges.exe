require('dotenv').config();
const { chromium } = require('playwright');
const fs = require('fs');
const colors = require('colors');

(async () => {
  console.log('--- Phase 3 & 4: Multi-Session Ticket Bot ---'.cyan);

  // Check for config and auth
  if (!fs.existsSync('./config.json')) {
    console.error('❌ config.json not found!'.red);
    process.exit(1);
  }
  if (!fs.existsSync('./auth.json')) {
    console.error('❌ auth.json not found! Please run login.js first.'.red);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
  const targetUrl = config.TARGET_URL;
  const targetCategory = config.TARGET_CATEGORY;
  const presaleCode = config.PRESALE_CODE;
  const ticketCount = config.TICKET_COUNT;
  const maxSessions = config.MAX_SESSIONS || 3;

  console.log(`Target Category: ${targetCategory}`.blue);
  console.log(`Ticket Count: ${ticketCount}`.blue);
  console.log(`Starting ${maxSessions} concurrent instances...`.yellow);

  const browser = await chromium.launch({ headless: false }); // Headed mode for monitoring
  const contexts = [];
  const pages = [];
  let isSecured = false; // Emergency Brake flag

  // 1. Spawning Multi-Session Instances
  for (let i = 0; i < maxSessions; i++) {
    const instanceName = `Instance-${i + 1}`;
    console.log(`[${instanceName}] Spawning...`.gray);
    
    // Load pre-baked state for each context
    const context = await browser.newContext({ storageState: 'auth.json' });
    contexts.push(context);
    
    const page = await context.newPage();
    pages.push({ page, name: instanceName });
  }

  console.log('\n🚀 All instances spawned! Initiating attack sequence...\n'.green);

  // 2. War Logic Loop (Run concurrently for all instances)
  const attackPromises = pages.map(async ({ page, name }) => {
    try {
      await page.goto(targetUrl);
      console.log(`[${name}] Reached Target URL. Waiting for Queue/Booking...`.gray);

      // -------------------------------------------------------------
      // CORE VULNERABILITY INJECTION & SELECTOR (Phase 4)
      // -------------------------------------------------------------
      
      // A. Mocking: Wait for specific Queue-it elements or the booking button
      // await page.waitForSelector('.queue-it-cleared', { timeout: 0 }); // Wait indefinitely
      
      // B. Inject Voucher if needed
      // const voucherInput = page.locator('#voucher-code-input');
      // if (await voucherInput.isVisible()) {
      //   await voucherInput.fill(presaleCode);
      //   await page.locator('#apply-voucher-btn').click();
      //   console.log(`[${name}] Voucher Injected!`.cyan);
      // }

      // C. Regex Tier Selector
      const regexStr = targetCategory.replace(/\s+/g, '\\s*'); // Ex: "CAT 5" -> "CAT\s*5"
      const regexPattern = new RegExp(regexStr, 'i');
      
      console.log(`[${name}] Scanning for Tier: ${regexPattern}`.yellow);
      
      // D. MOCK WAITING & CLICKING:
      // const targetRow = page.locator('.ticket-row', { hasText: regexPattern });
      // await targetRow.locator('.increment-btn').click({ clickCount: ticketCount });
      // await page.locator('#book-now-btn').click();

      // E. Monitor for Success / 15 Minute Hold
      // await page.waitForSelector('.payment-countdown-timer', { timeout: 0 });

      // -------------------------------------------------------------
      // SIMULATING A RANDOM SUCCESS FOR DEMO PURPOSES
      // (TODO: Replace this block with actual DOM monitoring logic)
      // -------------------------------------------------------------
      const randomWait = Math.floor(Math.random() * 5000) + 2000;
      await page.waitForTimeout(randomWait);
      
      if (isSecured) return; // Emergency brake check

      console.log(`\n🚨 [${name}] TICKETS SECURED IN CART! 🚨`.green.bold);
      isSecured = true;

      // 3. Handover & Emergency Brake (Phase 5)
      triggerAlarm();
      console.log('======================================================'.green);
      console.log(`🎟️  Proceed to payment in [${name}] window!`.white.bold);
      console.log('   Other instances will be halted to avoid double booking.');
      console.log('======================================================\n'.green);

      // Keep this context open, close others
      for (const ctx of contexts) {
        if (ctx !== page.context()) {
          await ctx.close();
        }
      }

    } catch (e) {
      if (!isSecured) {
         console.log(`[${name}] Error or Timeout: ${e.message}`.red);
      }
    }
  });

  await Promise.all(attackPromises);
})();

function triggerAlarm() {
  // Beep sequence
  process.stdout.write('\x07');
  setTimeout(() => process.stdout.write('\x07'), 500);
  setTimeout(() => process.stdout.write('\x07'), 1000);
}
