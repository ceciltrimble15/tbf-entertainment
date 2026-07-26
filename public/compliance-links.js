(() => {
  const addLinks = () => {
    const footer = document.querySelector('footer');
    if (!footer || footer.querySelector('[data-tbf-compliance-links]')) return false;

    const row = document.createElement('div');
    row.dataset.tbfComplianceLinks = 'true';
    row.setAttribute('aria-label', 'Legal and messaging links');
    row.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:14px;padding:0 20px 24px;font-family:Inter,Arial,sans-serif;font-size:12px;letter-spacing:.04em;';

    const links = [
      ['Privacy Policy', '/privacy'],
      ['Terms and Conditions', '/terms'],
      ['SMS Updates', '/sms-updates'],
      ['Contact', 'mailto:info@tbfentertainment.art'],
    ];

    links.forEach(([label, href]) => {
      const a = document.createElement('a');
      a.textContent = label;
      a.href = href;
      a.style.cssText = 'color:#a9a9a9;text-decoration:underline;text-underline-offset:3px;';
      a.addEventListener('mouseenter', () => { a.style.color = '#1e90ff'; });
      a.addEventListener('mouseleave', () => { a.style.color = '#a9a9a9'; });
      row.appendChild(a);
    });

    footer.appendChild(row);
    return true;
  };

  if (!addLinks()) {
    const observer = new MutationObserver(() => {
      if (addLinks()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
