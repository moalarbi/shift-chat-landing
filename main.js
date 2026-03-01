/* ===============================
   Shift Chat Landing (No DB)
   - i18n (ar/en) via JSON
   - WhatsApp CTA generator
   - Login modal (Admin/Agent)
   - Scroll reveal animations
   - Stats counter animation
   - Before/After tabs
   - Mobile menu
================================ */

const WHATSAPP_NUMBER = "966537311886";
const WA_DEFAULT_AR = "مرحباً، أرغب بالاشتراك في Shift Chat وحجز اجتماع.";
const WA_DEFAULT_EN = "Hello, I want to subscribe to Shift Chat and book a meeting.";

const el = (q, root=document) => root.querySelector(q);
const els = (q, root=document) => [...root.querySelectorAll(q)];

/* ====== i18n ====== */
let translations = {};
let currentLang = document.documentElement.dataset.lang || "ar";

async function loadLang(lang){
  try{
    const res = await fetch(`./locales/${lang}.json`, { cache: "no-store" });
    translations = await res.json();
    applyTranslations();
    setDir(lang);
  } catch(e){
    console.warn("Could not load language file:", lang, e);
  }
}

function t(key){
  return key.split(".").reduce((o,k)=> (o ? o[k] : null), translations) ?? null;
}

function applyTranslations(){
  els("[data-i18n]").forEach(node=>{
    const key = node.getAttribute("data-i18n");
    const val = t(key);
    if(val !== null) node.textContent = val;
  });
  const langLabel = el("#langLabel");
  if(langLabel) langLabel.textContent = currentLang === "ar" ? "EN" : "AR";
}

function setDir(lang){
  const html = document.documentElement;
  if(lang === "ar"){
    html.lang = "ar";
    html.dir = "rtl";
    html.dataset.lang = "ar";
    currentLang = "ar";
  } else {
    html.lang = "en";
    html.dir = "ltr";
    html.dataset.lang = "en";
    currentLang = "en";
  }
}

/* ====== WhatsApp Links ====== */
function waLink(text){
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

function setWhatsAppCTAs(){
  const isAr = currentLang === "ar";
  const top = el("#ctaWhatsAppTop");
  const bottom = el("#ctaWhatsAppBottom");
  const sticky = el("#ctaStickyWhatsApp");
  const trial = el("#ctaTrial");
  const msgDefault = isAr ? WA_DEFAULT_AR : WA_DEFAULT_EN;

  if(top) top.href = waLink(msgDefault);
  if(bottom) bottom.href = waLink(msgDefault);
  if(sticky) sticky.href = waLink(msgDefault);

  if(trial){
    const msg = isAr
      ? "مرحباً، لدي Meta Business جاهز وأرغب بتجربة أسبوع Demo لـ Shift Chat."
      : "Hello, I have Meta Business ready and want a 1-week demo trial for Shift Chat.";
    trial.href = waLink(msg);
  }

  els("[data-wa]").forEach(btn=>{
    const tag = btn.getAttribute("data-wa");
    let msg = msgDefault;
    if(tag === "pricing_starter"){
      msg = isAr
        ? "مرحباً، مهتم بباقة Starter (20 ريال شهريًا) + رسوم تأسيس 400. أريد حجز اجتماع."
        : "Hello, I'm interested in Starter (SAR 20/mo) + SAR 400 setup. I want to book a meeting.";
    }
    if(tag === "pricing_growth"){
      msg = isAr
        ? "مرحباً، مهتم بباقة Growth (100 ريال / 6 أشهر) + رسوم تأسيس 400. أريد حجز اجتماع."
        : "Hello, I'm interested in Growth (SAR 100 / 6 months) + SAR 400 setup. I want to book a meeting.";
    }
    if(tag === "pricing_pro_ai"){
      msg = isAr
        ? "مرحباً، مهتم بباقة Pro AI (150 ريال سنويًا) + رسوم تأسيس 400. أريد حجز اجتماع."
        : "Hello, I'm interested in Pro AI (SAR 150/year) + SAR 400 setup. I want to book a meeting.";
    }
    btn.href = waLink(msg);
  });
}

/* ====== Modal ====== */
function initModal(){
  const modal = el("#loginModal");
  const openers = ["#btnLogin", "#btnLogin2", "#btnLogin3", "#btnLoginSticky"]
    .map(sel => el(sel)).filter(Boolean);

  function open(){
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function close(){
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }

  openers.forEach(b=> b.addEventListener("click", open));
  modal.addEventListener("click", (e)=>{
    if(e.target && e.target.dataset && e.target.dataset.close === "true") close();
  });
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") close();
  });
}

/* ====== Scroll Reveal ====== */
function initReveal(){
  const items = els(".reveal");
  if(!items.length) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  items.forEach(i=> io.observe(i));
}

/* ====== Stats Counter ====== */
function initCounters(){
  const nums = els("[data-count]");
  if(!nums.length) return;

  const animate = (node)=>{
    const target = parseInt(node.dataset.count, 10);
    const duration = 1200;
    const start = performance.now();

    function frame(now){
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(eased * target);
      node.textContent = val.toLocaleString("ar-SA");
      if(progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  const statsSection = el("#stats");
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        nums.forEach(animate);
        io.disconnect();
      }
    });
  }, { threshold: 0.2 });

  if(statsSection) io.observe(statsSection);
}

/* ====== Before/After Tabs ====== */
function initBeforeAfter(){
  const tabs = els(".tab");
  const icon = el("#baIcon");
  const subtitle = el("#baSubtitle");
  const title = el("#baTitle");
  const list = el("#baList");

  const setState = (state)=>{
    tabs.forEach(t=> t.classList.toggle("tab--active", t.dataset.tab === state));

    if(state === "before"){
      if(icon) icon.textContent = "😵‍💫";
      if(subtitle) subtitle.textContent = currentLang === "ar" ? "فوضى وضياع" : "Chaos & Confusion";
      if(title) title.textContent = t("ba.beforeTitle") || "قبل شيفت شات";
      if(list) list.innerHTML = `
        <li>${t("ba.b1") || "محادثات متفرقة"}</li>
        <li>${t("ba.b2") || "لا يوجد توزيع أو صلاحيات"}</li>
        <li>${t("ba.b3") || "صعوبة المتابعة"}</li>
        <li>${t("ba.b4") || "ردود متأخرة"}</li>
      `;
    } else {
      if(icon) icon.textContent = "🚀";
      if(subtitle) subtitle.textContent = currentLang === "ar" ? "نظام ومبيعات" : "Organized & Efficient";
      if(title) title.textContent = t("ba.afterTitle") || "بعد شيفت شات";
      if(list) list.innerHTML = `
        <li>${t("ba.a1") || "توزيع محادثات تلقائي"}</li>
        <li>${t("ba.a2") || "صلاحيات Admin/Agent"}</li>
        <li>${t("ba.a3") || "تقارير أداء واضحة"}</li>
        <li>${t("ba.a4") || "AI يرد ويؤهل"}</li>
      `;
    }
  };

  tabs.forEach(tab=>{
    tab.addEventListener("click", ()=> setState(tab.dataset.tab));
  });

  setState("before");
}

/* ====== Mobile Menu ====== */
function initMobileMenu(){
  const burger = el("#hamburger");
  const nav = el("#mobileNav");
  if(!burger || !nav) return;

  burger.addEventListener("click", ()=>{
    nav.classList.toggle("is-open");
    nav.setAttribute("aria-hidden", nav.classList.contains("is-open") ? "false" : "true");
  });

  els(".mobileNav__link", nav).forEach(a=>{
    a.addEventListener("click", ()=> nav.classList.remove("is-open"));
  });
}

/* ====== Demo Placeholder ====== */
function initDemoPlaceholder(){
  const overlay = el("#videoOverlay");
  const btn = el("#btnPlayPlaceholder");
  const frame = el("#demoVideo");
  if(!overlay || !btn || !frame) return;

  btn.addEventListener("click", ()=>{
    if(frame.src && frame.src.trim() !== "" && !frame.src.endsWith(location.href)){
      overlay.style.display = "none";
    }
  });
}

/* ====== Language Toggle ====== */
function initLangToggle(){
  const btn = el("#btnLang");
  if(!btn) return;

  btn.addEventListener("click", async ()=>{
    const next = currentLang === "ar" ? "en" : "ar";
    await loadLang(next);
    setWhatsAppCTAs();
    initBeforeAfter();
  });
}

/* ====== Boot ====== */
(async function boot(){
  await loadLang(currentLang);
  setWhatsAppCTAs();
  initModal();
  initReveal();
  initCounters();
  initBeforeAfter();
  initMobileMenu();
  initDemoPlaceholder();
  initLangToggle();
})();
