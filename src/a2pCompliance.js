const SMS_DISCLOSURE = 'By checking this box, I agree to receive recurring informational and promotional text messages from TBF Entertainment at the mobile number provided, including book releases, events, purchase information, company news, and promotional updates. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe or HELP for assistance. Consent is not a condition of purchase.';

const LEGAL_PAGES = {
  '/privacy': {
    title: 'Privacy Policy',
    updated: 'Effective July 26, 2026',
    sections: [
      ['Information We Collect', 'TBF Entertainment may collect information you submit through this website, including your name, email address, mobile phone number, inquiry details, communication preferences, and technical information needed to operate and protect the website.'],
      ['How We Use Information', 'We use information to answer inquiries, provide requested services, send book-release and event updates when permission is given, maintain business records, improve the website, prevent abuse, and comply with legal obligations.'],
      ['Mobile Information and SMS Consent', 'Mobile information will not be shared with third parties or affiliates for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties, except service providers necessary to deliver and support the messaging service.'],
      ['Service Providers', 'TBF Entertainment may use service providers for hosting, forms, email delivery, text-message delivery, analytics, security, and record storage. They may process information only as needed to provide those services.'],
      ['Your Choices', 'You may reply STOP to stop text messages, use an unsubscribe link in an email, or contact us to request access, correction, or deletion of information, subject to legal and recordkeeping requirements.'],
      ['Security and Retention', 'We use reasonable administrative and technical safeguards. No internet system is completely secure. Information is retained only as long as reasonably necessary for the purposes described here.'],
      ['Policy Updates', 'We may update this policy. The effective date above will be revised when material changes are made.'],
    ],
  },
  '/terms': {
    title: 'Terms & Conditions',
    updated: 'Effective July 26, 2026',
    sections: [
      ['Website Use', 'This website is provided for lawful personal and business use. Do not misuse the site, interfere with its operation, submit false information, or attempt unauthorized access.'],
      ['Intellectual Property', 'TBF Entertainment names, logos, artwork, book materials, photographs, videos, copy, and other original content are protected by applicable intellectual-property laws. No rights are granted except the limited right to view and use the website normally.'],
      ['Products and Availability', 'Book formats, prices, release dates, inventory, and retailer availability may change. External retailer purchases are governed by the retailer’s own terms, fulfillment, refund, and privacy practices.'],
      ['Submissions and Communications', 'Information submitted through forms must be accurate and lawful. Submission of a manuscript, inquiry, or creative material does not create an agency, publishing, employment, partnership, or confidentiality relationship unless a separate written agreement is signed.'],
      ['Disclaimer and Liability', 'The website is provided on an as-available basis. To the fullest extent allowed by law, TBF Entertainment is not liable for indirect, incidental, or consequential losses arising from website use or third-party services.'],
      ['Changes', 'We may modify, suspend, or discontinue website features and may update these terms by posting a revised version.'],
    ],
  },
  '/sms-terms': {
    title: 'SMS Terms',
    updated: 'Effective July 26, 2026',
    sections: [
      ['Program', 'TBF Entertainment may send recurring text messages from (513) 866-3832 concerning book releases, events, purchase or order information, publishing updates, company news, and promotional offers.'],
      ['Consent and Frequency', 'Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. You must provide a valid mobile number and notify us if your number changes.'],
      ['Opt Out and Help', 'Reply STOP to unsubscribe. Reply HELP for assistance. You may also contact info@tbfentertainment.art or call (513) 866-3832.'],
      ['Delivery', 'Wireless carriers are not liable for delayed or undelivered messages. Delivery depends on your carrier, device, and network availability.'],
      ['Privacy', 'Mobile information and text-message consent records are handled under our Privacy Policy and are not sold or shared with third parties for their marketing purposes.'],
    ],
  },
};

function legalStyles() {
  return `
    body{margin:0;background:#080808;color:#f4f4f4;font-family:Inter,Arial,sans-serif}.legal-shell{min-height:100vh;background:radial-gradient(circle at 80% 10%,rgba(30,144,255,.12),transparent 35%),#080808}.legal-nav,.legal-footer{padding:20px clamp(20px,5vw,72px);border-color:#242424;border-style:solid}.legal-nav{border-width:0 0 1px;display:flex;align-items:center;justify-content:space-between;gap:20px}.legal-nav img{height:54px;width:auto}.legal-nav a,.legal-footer a{color:#8fc8ff;text-decoration:none}.legal-main{max-width:920px;margin:auto;padding:72px 24px 90px}.legal-kicker{color:#1e90ff;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:700}.legal-main h1{font-size:clamp(42px,7vw,72px);text-transform:uppercase;margin:14px 0}.legal-date{color:#aaa;margin-bottom:48px}.legal-section{padding:28px 0;border-top:1px solid #242424}.legal-section h2{font-size:22px;text-transform:uppercase;margin:0 0 12px}.legal-section p{color:#c9c9c9;line-height:1.75;margin:0}.legal-contact{margin-top:42px;padding:24px;border:1px solid rgba(30,144,255,.4);background:rgba(30,144,255,.06)}.legal-footer{border-width:1px 0 0;display:flex;flex-wrap:wrap;gap:18px;justify-content:center;color:#999;font-size:13px}@media(max-width:600px){.legal-nav{align-items:flex-start;flex-direction:column}.legal-main{padding-top:48px}}
  `;
}

export function renderLegalPageIfNeeded() {
  const page = LEGAL_PAGES[window.location.pathname];
  if (!page) return false;
  document.title = `${page.title} | TBF Entertainment`;
  const root = document.getElementById('root');
  root.innerHTML = `<style>${legalStyles()}</style><div class="legal-shell"><nav class="legal-nav"><a href="/"><img src="/logo.png" alt="TBF Entertainment"></a><a href="/">Return to TBF Entertainment</a></nav><main class="legal-main"><div class="legal-kicker">TBF Entertainment</div><h1>${page.title}</h1><div class="legal-date">${page.updated}</div>${page.sections.map(([h,p])=>`<section class="legal-section"><h2>${h}</h2><p>${p}</p></section>`).join('')}<div class="legal-contact"><strong>TBF Entertainment</strong><br>Email: <a href="mailto:info@tbfentertainment.art">info@tbfentertainment.art</a><br>Phone: <a href="tel:+15138663832">(513) 866-3832</a><br>Website: tbfentertainment.art</div></main><footer class="legal-footer"><a href="/privacy">Privacy Policy</a><a href="/terms">Terms & Conditions</a><a href="/sms-terms">SMS Terms</a><a href="/connect">Contact</a><span>© TBF Entertainment</span></footer></div>`;
  return true;
}

export function installA2PCompliance() {
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    if (String(input).includes('/api/submit') && typeof init.body === 'string') {
      try {
        const body = JSON.parse(init.body);
        const state = window.__tbfSmsConsent || {};
        if (state.phone || state.smsConsent) {
          Object.assign(body, {
            phone: state.phone || '',
            smsConsent: Boolean(state.smsConsent),
            smsConsentText: SMS_DISCLOSURE,
            consentTimestamp: state.smsConsent ? new Date().toISOString() : '',
            pageUrl: window.location.href,
            userAgent: navigator.userAgent,
          });
          init = { ...init, body: JSON.stringify(body) };
        }
      } catch { /* leave non-JSON requests unchanged */ }
    }
    return originalFetch(input, init);
  };

  const enhance = () => {
    const footer = document.querySelector('footer');
    if (footer && !footer.querySelector('[data-a2p-footer]')) {
      const block = document.createElement('div');
      block.dataset.a2pFooter = 'true';
      block.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:16px;padding:18px 24px;border-top:1px solid #1a1a1a;font:12px Inter,Arial,sans-serif;color:#888';
      block.innerHTML = '<a href="/privacy" style="color:#aaa">Privacy Policy</a><a href="/terms" style="color:#aaa">Terms & Conditions</a><a href="/sms-terms" style="color:#aaa">SMS Terms</a><a href="/connect" style="color:#aaa">Contact</a><a href="tel:+15138663832" style="color:#aaa">(513) 866-3832</a>';
      footer.appendChild(block);
    }

    document.querySelectorAll('form').forEach((form) => {
      if (!form.querySelector('textarea') || form.querySelector('[data-a2p-sms]')) return;
      const wrap = document.createElement('div');
      wrap.dataset.a2pSms = 'true';
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:12px;padding:18px;border:1px solid rgba(30,144,255,.35);background:rgba(30,144,255,.05)';
      wrap.innerHTML = `<label style="display:block"><span style="display:block;margin-bottom:8px;font-size:11px;text-transform:uppercase;letter-spacing:.16em;color:#aaa">Mobile Phone Number</span><input data-a2p-phone type="tel" autocomplete="tel" inputmode="tel" placeholder="(513) 555-1234" style="width:100%;box-sizing:border-box;padding:14px 16px;border:1px solid #2b2b2b;background:#0a0a0a;color:#fff"></label><label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer"><input data-a2p-check type="checkbox" style="margin-top:4px"><span style="font-size:12px;line-height:1.6;color:#b9b9b9">${SMS_DISCLOSURE} <a href="/privacy" style="color:#1e90ff">Privacy Policy</a> · <a href="/terms" style="color:#1e90ff">Terms & Conditions</a> · <a href="/sms-terms" style="color:#1e90ff">SMS Terms</a></span></label>`;
      const submit = form.querySelector('button[type="submit"]');
      form.insertBefore(wrap, submit || null);
      const phone = wrap.querySelector('[data-a2p-phone]');
      const check = wrap.querySelector('[data-a2p-check]');
      const sync = () => {
        phone.required = check.checked;
        window.__tbfSmsConsent = { phone: phone.value.trim(), smsConsent: check.checked };
      };
      phone.addEventListener('input', sync);
      check.addEventListener('change', sync);
      sync();
    });
  };

  new MutationObserver(enhance).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('load', enhance);
  setTimeout(enhance, 0);
}
