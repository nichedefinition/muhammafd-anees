/**
 * Node.js Web Scraper & Ad Blueprint Generator
 * Run this directly on your computer to bypass CORS restrictions!
 * 
 * How to run:
 * 1. Open PowerShell or command line
 * 2. Run: node run-scraper.js "https://tatcha.com"
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Get URL from command line arguments
let targetUrlInput = process.argv[2] || 'https://tatcha.com';

console.log(`\n🚀 Starting Scraper for: ${targetUrlInput}`);

// Helper to make HTTP/HTTPS GET requests
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    };
    client.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).href;
        console.log(`↪️ Redirected to: ${redirectUrl}`);
        return resolve(fetchPage(redirectUrl));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to load page: status code ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1].trim().replace(/\s+/g, ' ') : 'Scraped Brand';
}

function extractProducts(html, brandName = '') {
  const products = [];
  const seenNames = new Set();

  const addProduct = (name, price) => {
    const cleanName = name.replace(/\\"/g, '"').replace(/&amp;/g, '&').replace(/\\u0026/g, '&').trim();
    
    // Check if name matches brand or is a boilerplate navigation word
    const brandLower = brandName.toLowerCase();
    const isBrandName = cleanName.toLowerCase() === 'tatcha' || cleanName.toLowerCase() === brandLower || (brandLower.length > 0 && brandLower.includes(cleanName.toLowerCase()) && cleanName.length < 10);
    
    const isBoilerplate = ['home', 'shop', 'cart', 'checkout', 'all', 'new', 'collections', 'search', 'account', 'gift-card', 'bag', 'view', 'sign in'].some(term => cleanName.toLowerCase() === term || cleanName.toLowerCase().includes(term));
    
    if (cleanName && cleanName.length > 2 && !isBoilerplate && !isBrandName && !seenNames.has(cleanName.toLowerCase())) {
      seenNames.add(cleanName.toLowerCase());
      products.push({ name: cleanName, price: price || '$29.99' });
    }
  };

  // 1. Scan JSON-LD structured data (Product schemas)
  const jsonLdRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      const processItem = (item) => {
        if (!item) return;
        if (item['@type'] === 'Product' && item.name) {
          let price = '$29.99';
          if (item.offers) {
            const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            if (offers.price) {
              price = `${offers.priceCurrency === 'USD' ? '$' : (offers.priceCurrency || '')}${offers.price}`;
            }
          }
          addProduct(item.name, price);
        }
      };

      if (Array.isArray(data)) {
        data.forEach(processItem);
      } else if (data['@graph'] && Array.isArray(data['@graph'])) {
        data['@graph'].forEach(processItem);
      } else {
        processItem(data);
      }
    } catch (e) {}
  }

  // 2. Scan specific HTML attributes and class patterns used by Shopify / WooCommerce / Salesforce
  const attrRegexes = [
    /data-product-name="([^"]+)"/gi,
    /data-product-title="([^"]+)"/gi,
    /data-title="([^"]+)"/gi,
    /aria-label="Add ([^"]+) to (?:shopping bag|cart|basket)"/gi,
    /class="[^"]*(?:product-title|woocommerce-loop-product__title|grid-view-item__title|product-item__title|product-name)[^"]*"[^>]*>([^<]{3,80})</gi,
    /<a[^>]+class="[^"]*(?:product|shop-item|product-card)[^"]*"[^>]*>\s*<h[2-4][^>]*>([^<]+)<\/h/gi
  ];
  
  attrRegexes.forEach(regex => {
    let m;
    while ((m = regex.exec(html)) !== null) {
      const word = m[1].trim();
      if (word.includes('{') || word.includes('}') || word.includes('/') ||
          /\d{1,2}\s*[-\/]\s*\d/.test(word) || word.toLowerCase().includes('pst') ||
          word.toLowerCase().includes('release') || word.toLowerCase().includes('event')) continue;
      addProduct(word, '');
    }
  });

  // 3. Fallback: Parse WooCommerce or Shopify URL paths
  if (products.length === 0) {
    const linkRegex = /href="[^"]*\/product(?:s)?\/([^"\/]+)"/gi;
    const boilerplates = ['home', 'shop', 'cart', 'checkout', 'all', 'new', 'collections', 'search', 'account', 'gift-card'];
    while ((match = linkRegex.exec(html)) !== null) {
      const slug = match[1].toLowerCase().split('?')[0].replace(/\/$/, '');
      if (boilerplates.some(b => slug === b || slug.includes(b))) continue;
      
      // Skip numeric IDs
      if (/^\d+$/.test(slug)) continue;

      const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      if (name.length > 3 && !name.includes('.')) {
        addProduct(name, '');
      }
    }
  }

  return products;
}

function generateAds(brand, product, price) {
  const ads = [];
  const uvp = "Clean, luxury formulations backed by timeless rituals.";

  for (let i = 1; i <= 8; i++) {
    ads.push({
      platform: 'Google Search',
      title: `Ad #${i}`,
      content: `Headline 1: Shop ${product.slice(0, 20)}
Headline 2: Authentic Japanese Skincare
Headline 3: Official ${brand.slice(0, 15)} Shop
Description: Discover the award-winning ${product}. Purchase directly from ${brand} for exclusive sizes & gifts. Free shipping over limit.`
    });
  }

  const fbHooks = [
    "Discover the ritual behind radiant skin. Experience",
    "Meet the formula that transformed my skincare routine:",
    "Bring the Japanese spa home with the signature",
    "Struggling with dry, tired skin? Get glowing with",
    "Your skin deserves pure, clean ingredients. Treat it to",
    "The secret to a flawless canvas starts with",
    "Is this your new holy grail? Discover the real benefits of",
    "Uncompromising quality, botanical ingredients. Shop"
  ];
  for (let i = 1; i <= 8; i++) {
    ads.push({
      platform: 'Facebook Feed',
      title: `Ad #${i}`,
      content: `${fbHooks[i-1]} ${product}! \n\n✨ Shop the collection at ${brand}.\n👉 ${uvp}\n\nTap below to claim your complimentary trial size! 👇`
    });
  }

  for (let i = 1; i <= 8; i++) {
    ads.push({
      platform: 'Instagram Post/Reels',
      title: `Ad #${i}`,
      content: `Golden hour skin, bottled. ✨ Featuring the iconic ${product}.\n\nExperience pure botanical care at ${brand}.\n\n#tatchaskincare #jbeauty #glowingskin #cleanbeauty`
    });
  }

  for (let i = 1; i <= 8; i++) {
    ads.push({
      platform: 'LinkedIn Professional',
      title: `Ad #${i}`,
      content: `💼 Elevate your skincare rituals and daily presentation with ${product}.\n\nExplore how premium formulations from ${brand} combine classical wellness secrets with modern dermatological science.`
    });
  }

  for (let i = 1; i <= 8; i++) {
    ads.push({
      platform: 'Email Campaign',
      title: `Email #${i}`,
      content: `Subject: Elevate your skin with ${product} 🌟\n\nHi there,\n\nDiscover the difference with ${product} from ${brand}.\n\nShop the collection now!\n\nWarmly,\nThe ${brand} Team`
    });
  }

  return ads;
}

async function main() {
  try {
    let baseUrl = targetUrlInput;
    if (!baseUrl.startsWith('http')) baseUrl = 'https://' + baseUrl;
    
    let html = await fetchPage(baseUrl);
    console.log("✅ Main page fetched successfully.");

    let brandName = extractTitle(html);
    let products = extractProducts(html, brandName);

    // If 0 products found on homepage, fallback to shop/collection path
    if (products.length === 0) {
      console.log("⚠️ No products found on homepage. Retrying with category/collection page fallback...");
      const fallbacks = ['/shop/', '/collections/all', '/shop', '/collections/best-sellers', '/product-category/clothing/'];
      for (const pathExt of fallbacks) {
        try {
          const fallbackUrl = new URL(baseUrl).origin + pathExt;
          console.log(`🔍 Scanning fallback: ${fallbackUrl}`);
          const fbHtml = await fetchPage(fallbackUrl);
          const fbProducts = extractProducts(fbHtml, brandName);
          if (fbProducts.length > 0) {
            products = fbProducts;
            console.log(`✅ Success! Found products on fallback path: ${pathExt}`);
            break;
          }
        } catch (e) {}
      }
    }

    console.log(`🏷️ Brand Detected: ${brandName}`);
    console.log(`📦 Products Discovered: ${products.length}`);

    // Show all products so the user can pick
    if (products.length > 0) {
      console.log(`\n📋 Full Product List:`);
      products.forEach((p, i) => console.log(`   [${i}] ${p.name}  ${p.price}`));
      console.log('');
    }

    // Allow picking by index: node run-scraper.js "url" 3
    const pickIndex = parseInt(process.argv[3] || '0');
    let targetProduct = { name: 'Premium Skincare Cream', price: '$89.00' };
    if (products.length > 0) {
      const idx = (pickIndex >= 0 && pickIndex < products.length) ? pickIndex : 0;
      targetProduct = products[idx];
      console.log(`🎯 Targeting product [${idx}]: "${targetProduct.name}"`);
    } else {
      console.log(`⚠️ No products could be extracted. Generating template ads with default placeholder.`);
    }

    const ads = generateAds(brandName, targetProduct.name, targetProduct.price);
    
    let outputText = `==================================================\n`;
    outputText += `BRAND BLUEPRINT: ${brandName}\n`;
    outputText += `TARGET PRODUCT: ${targetProduct.name} (${targetProduct.price})\n`;
    outputText += `==================================================\n\n`;

    ads.forEach((ad) => {
      outputText += `--------------------------------------------------\n`;
      outputText += `[${ad.platform.toUpperCase()}] ${ad.title}\n`;
      outputText += `--------------------------------------------------\n`;
      outputText += `${ad.content}\n\n`;
    });

    const outputFilePath = path.join(__dirname, 'generated-ads-blueprint.txt');
    fs.writeFileSync(outputFilePath, outputText, 'utf8');

    // Also save JSON for the browser ad-generator UI
    const jsonData = {
      brand: brandName,
      url: baseUrl,
      scrapedAt: new Date().toISOString(),
      products: products
    };
    const jsonFilePath = path.join(__dirname, 'scraped-products.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');

    console.log(`\n🎉 Success! Generated 40 Ads Blueprint file:`);
    console.log(`👉 ${outputFilePath}`);
    console.log(`\n📂 JSON data saved for browser UI:`);
    console.log(`👉 ${jsonFilePath}`);
    console.log(`\n💡 Tip: Open ad-generator.html in your browser and click "Load Scraped Data" to use this data.\n`);

  } catch (error) {
    console.error(`\n❌ Scraper error: ${error.message}`);
  }
}

main();
