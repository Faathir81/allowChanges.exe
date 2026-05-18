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
      // STRATEGI HYBRID (SEMI-AUTO QUEUE BYPASSER)
      // -------------------------------------------------------------
      
      console.log(`[${name}] URL Monitor Started. Menunggu antrean Queue-it selesai...`.yellow);

      // Loop untuk memantau perubahan URL secara real-time
      while (true) {
        await page.waitForTimeout(1000); // Cek setiap detik
        
        // Hentikan jika window lain sudah menang duluan
        if (isSecured) return; 

        const currentUrl = page.url();
        
        // Kriteria Tembus Antrean:
        // 1. URL mengarah ke tiket.com atau halaman booking/packages khusus, DAN bukan antrean queue-it
        const isBookingUrl = (currentUrl.includes('tiket.com') || currentUrl.includes('/booking') || currentUrl.includes('/packages') || currentUrl.includes('/complete')) 
                             && !currentUrl.includes('queue-it.net') 
                             && !currentUrl.includes('waitingroom');
        
        // 2. ATAU ada elemen visual pemesanan yang aktif di layar (seperti tombol Select, info paket, atau detail pemesanan)
        let isBookingDOM = false;
        try {
          // Mencari tombol "Select", "Pilih", atau tulisan "Packages" / "Complete Your Booking" / "Detail Pemesan" di layar
          const bookingIndicator = page.locator('button:has-text("Select"), button:has-text("Pilih"), h1:has-text("Packages"), h2:has-text("Packages"), h1:has-text("Complete"), h2:has-text("Complete"), h3:has-text("Complete")').first();
          if (await bookingIndicator.isVisible({ timeout: 100 })) {
            isBookingDOM = true;
          }
        } catch (e) {
          // Abaikan error pengecekan DOM agar loop tetap berjalan lancar
        }

        if (isBookingUrl || isBookingDOM) {
           console.log(`\n🚀 [${name}] ANTREAN TEMBUS! Masuk ke halaman tiket!`.green.bold);
           break; // Keluar dari loop pemantauan antrean
        }

        // 3. AUTO-CLICK GERBANG ANTREAN (Jika tombol "Artist Presale" aktif di landing page)
        try {
          // Mencari tombol/link "Artist Presale" di landing page
          const artistPresaleBtn = page.locator('a:has-text("Artist Presale"), button:has-text("Artist Presale"), div[role="button"]:has-text("Artist Presale")').first();
          if (await artistPresaleBtn.isVisible({ timeout: 100 })) {
             const isDisabled = await artistPresaleBtn.getAttribute('disabled');
             const hasDisabledClass = (await artistPresaleBtn.getAttribute('class') || '').toLowerCase().includes('disabled');
             
             if (!isDisabled && !hasDisabledClass) {
                await artistPresaleBtn.click({ force: true });
                console.log(`[${name}] ⚡ Tombol "Artist Presale" AKTIF! Berhasil diklik otomatis!`.green.bold);
             }
          }
        } catch (e) {
          // Abaikan jika gagal klik atau tombol belum aktif
        }
      }

      if (isSecured) return; // Double check

      isSecured = true; // Mengunci state agar window lain berhenti
      console.log(`\n🚨 [${name}] JENDELA INI MEMENANGKAN ANTREAN! 🚨`.green.bold);
      
      // Bawa window ke depan
      await page.bringToFront();

      // MENCARI & INJEK VOUCHER (Opsional, dibungkus try-catch agar tidak crash)
      try {
        console.log(`[${name}] Mencoba auto-inject kode presale: ${presaleCode}...`.cyan);
        // Mencari field input yang mengandung kata kode/code/voucher secara umum
        const voucherInput = page.locator('input[placeholder*="kode"], input[placeholder*="Code"], input[name*="code"], input[id*="voucher"]').first();
        
        if (await voucherInput.isVisible({ timeout: 5000 })) {
          await voucherInput.fill(presaleCode);
          console.log(`[${name}] ✅ Kode Presale berhasil diisi!`.green);
        } else {
          console.log(`[${name}] ⚠️ Kotak kode presale tidak ditemukan otomatis, silakan cek manual.`.yellow);
        }
      } catch (err) {
        // Abaikan error injeksi, karena target utama adalah handover yang mulus
      }

      // HANDOVER & EMERGENCY BRAKE (Phase 5)
      triggerAlarm();
      console.log('======================================================'.magenta.bold);
      console.log(`🎟️  AMBIL ALIH SEKARANG DI JENDELA [${name}]!`.white.bold);
      console.log(`👉  Pilih Kategori: ${targetCategory}`.yellow);
      console.log(`👉  Pilih Jumlah  : ${ticketCount} Tiket`.yellow);
      console.log('   Jendela lain otomatis ditutup untuk cegah double booking.');
      console.log('======================================================\n'.magenta.bold);

      // Tutup window lain yang kalah cepat
      for (const ctx of contexts) {
        if (ctx !== page.context()) {
          await ctx.close();
        }
      }

      return; // Berhenti memproses script, biarkan manusia yang mengambil alih layar

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
