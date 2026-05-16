require('dotenv').config();
const { chromium } = require('playwright');
const fs = require('fs');
const colors = require('colors');

(async () => {
  console.log('--- Phase 2: Authentication & "Data Baking" ---'.cyan);
  console.log('Launching browser for manual login...'.yellow);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Load config to get target URL (fallback if needed)
  let targetUrl = 'https://www.loket.com';
  if (fs.existsSync('./config.json')) {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    targetUrl = config.TARGET_URL || targetUrl;
  }

  console.log(`Navigating to: ${targetUrl}`.gray);
  await page.goto(targetUrl);
  
  console.log('\n======================================================'.green);
  console.log('🟢 BROWSER OPENED!'.green);
  console.log('Please log into your Loket.com account manually.');
  console.log('Solve any CAPTCHA or OTP needed.');
  console.log('Once you are fully logged in and on the dashboard/home,');
  console.log('come back to this terminal and press ENTER to save the session.');
  console.log('======================================================\n'.green);

  // Wait for user input to continue
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  await new Promise(resolve => process.stdin.once('data', resolve));
  process.stdin.pause();

  console.log('\nBaking session state...'.yellow);
  
  // Save storage state into auth.json
  await context.storageState({ path: 'auth.json' });
  
  console.log('✅ Session state successfully saved to auth.json!'.green);
  console.log('You can now run bot.js when the ticket war starts.'.cyan);
  
  await browser.close();
  process.exit(0);
})();
