(function(){
  const KEY='indomark_settings_theme';
  const ACCOUNT_STATUS_KEY='indomark_account_status_v1';
  const GLOBAL_CSS='../css/global-theme.css?v=12';
  const BRAND_CSS='../css/brand-option-08.css?v=20';
  const FAVICON='../assets/indomark-favicon.svg?v=9';
  const ALLOWED_WHEN_INACTIVE=new Set(['profile.html','login.html','signup.html','index.html','']);
  function getStoredTheme(){const current=localStorage.getItem(KEY);return current==='light'?'light':'dark'}
  function ensureGlobalCss(){if(document.querySelector('link[data-indomark-theme]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href=GLOBAL_CSS;link.dataset.indomarkTheme='true';document.head.appendChild(link)}
  function ensureBrandCss(){if(document.querySelector('link[data-indomark-brand]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href=BRAND_CSS;link.dataset.indomarkBrand='true';document.head.appendChild(link)}
  function ensureBrandIcon(){const head=document.head;if(!head)return;let icon=head.querySelector('link[data-indomark-favicon]');if(!icon){icon=document.createElement('link');icon.rel='icon';icon.type='image/svg+xml';icon.dataset.indomarkFavicon='true';head.appendChild(icon)}icon.href=FAVICON;let shortcut=head.querySelector('link[data-indomark-shortcut-icon]');if(!shortcut){shortcut=document.createElement('link');shortcut.rel='shortcut icon';shortcut.type='image/svg+xml';shortcut.dataset.indomarkShortcutIcon='true';head.appendChild(shortcut)}shortcut.href=FAVICON;let apple=head.querySelector('link[data-indomark-apple-icon]');if(!apple){apple=document.createElement('link');apple.rel='apple-touch-icon';apple.dataset.indomarkAppleIcon='true';head.appendChild(apple)}apple.href=FAVICON}
  function normalizeBrandText(){
    const replaceInNode=node=>{
      if(node.nodeType===Node.TEXT_NODE){if(node.nodeValue&&node.nodeValue.includes('Indomark'))node.nodeValue=node.nodeValue.replace(/Indomark/g,'Indomark');return}
      if(node.nodeType===Node.ELEMENT_NODE&&node.tagName==='SCRIPT')return;
      node.childNodes&&Array.from(node.childNodes).forEach(replaceInNode);
    };
    if(document.body)replaceInNode(document.body);
    if(document.title)document.title=document.title.replace(/Indomark/g,'Indomark');
  }
  function applyTheme(theme){const next=theme==='light'?'light':'dark';ensureGlobalCss();ensureBrandCss();ensureBrandIcon();normalizeBrandText();const root=document.documentElement;root.dataset.theme=next;root.style.colorScheme=next;localStorage.setItem(KEY,next)}
  function getAccountStatus(){return localStorage.getItem(ACCOUNT_STATUS_KEY)==='inactive'?'inactive':'active'}
  function currentPage(){return(location.pathname.split('/').pop()||'').toLowerCase()}
  function isAllowedPage(){return ALLOWED_WHEN_INACTIVE.has(currentPage())}
  function installInactiveStyles(){if(document.getElementById('accountInactiveStyles'))return;const style=document.createElement('style');style.id='accountInactiveStyles';style.textContent=`#accountInactiveOverlay{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:20px;background:rgba(4,7,17,.82);backdrop-filter:blur(7px);font-family:Inter,Arial,Helvetica,sans-serif}#accountInactiveOverlay .account-inactive-box{width:min(420px,100%);padding:24px;border:1px solid var(--line,#273246);border-radius:20px;background:var(--panel,#0b1220);color:var(--text,#fff);text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.45)}#accountInactiveOverlay h2{margin:0;font-size:20px}#accountInactiveOverlay p{margin:9px 0 16px;color:var(--muted,#aeb9c8);font-size:12px;line-height:1.5}#accountInactiveOverlay .account-inactive-link{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 16px;border-radius:10px;background:#5f35e8;color:#fff;text-decoration:none;font-size:11px;font-weight:900}`;document.head.appendChild(style)}
  function removeInactiveLock(){document.documentElement.classList.remove('account-inactive');document.getElementById('accountInactiveOverlay')?.remove()}
  function lockInactivePage(){if(isAllowedPage()){removeInactiveLock();return}installInactiveStyles();document.documentElement.classList.add('account-inactive');if(document.getElementById('accountInactiveOverlay'))return;const overlay=document.createElement('div');overlay.id='accountInactiveOverlay';overlay.setAttribute('role','alertdialog');overlay.setAttribute('aria-modal','true');overlay.innerHTML='<div class="account-inactive-box"><h2>Account inactive</h2><p>Your account is currently inactive. App features are unavailable until you activate your account again.</p><a href="profile.html" class="account-inactive-link">Go to Profile</a></div>';const mount=()=>{if(!document.body)return false;document.body.appendChild(overlay);return true};if(!mount())document.addEventListener('DOMContentLoaded',mount,{once:true})}
  function updateAccountStatus(status){const next=status==='inactive'?'inactive':'active';localStorage.setItem(ACCOUNT_STATUS_KEY,next);if(next==='inactive')lockInactivePage();else removeInactiveLock();window.dispatchEvent(new CustomEvent('indomark-account-status-change',{detail:{status:next}}));return next}
  applyTheme(getStoredTheme());
  window.IndomarkSettings={getTheme:getStoredTheme,setTheme:theme=>{const next=theme==='light'?'light':'dark';applyTheme(next);return next},applyTheme,getAccountStatus,setAccountStatus:updateAccountStatus,isAccountActive:()=>getAccountStatus()==='active'};
  const check=()=>{applyTheme(getStoredTheme());if(getAccountStatus()==='inactive')lockInactivePage();else removeInactiveLock()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',check,{once:true});else check();window.addEventListener('storage',event=>{if(event.key===ACCOUNT_STATUS_KEY||event.key===KEY)check()});
})();
