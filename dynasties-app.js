/* ============================================================
   DYNASTIES — game engine (vanilla JS, data-driven)
   Bilingual EN / RU. Authored outcome text from
   window.DYNASTIES_TICKS_EN / _RU is shown verbatim.
   ============================================================ */
(function(){
"use strict";

/* ---- back-compat: legacy data file sets window.DYNASTIES_TICKS ---- */
if(!window.DYNASTIES_TICKS_EN && window.DYNASTIES_TICKS){
  window.DYNASTIES_TICKS_EN = window.DYNASTIES_TICKS;
}

var DATA = {
  en: window.DYNASTIES_TICKS_EN || [],
  ru: window.DYNASTIES_TICKS_RU || []
};
var STRIPE = "https://buy.stripe.com/REPLACE_WITH_YOUR_STRIPE_PAYMENT_LINK";
var app = document.getElementById("app");
var footerInner = document.getElementById("footerInner");
var htmlRoot = document.getElementById("htmlRoot");

/* ============================================================
   i18n
   ============================================================ */
var LANG_KEY = "dynasties.lang";
function detectLang(){
  try {
    var saved = localStorage.getItem(LANG_KEY);
    if(saved === "en" || saved === "ru") return saved;
  } catch(_){}
  var navLang = (navigator.language || navigator.userLanguage || "").toLowerCase();
  if(navLang.indexOf("ru") === 0) return "ru";
  if(/^(be|kk|ky|uz)/.test(navLang)) return "ru";
  return "en";
}
function setLang(lang){
  if(lang !== "en" && lang !== "ru") return;
  try { localStorage.setItem(LANG_KEY, lang); } catch(_){}
  currentLang = lang;
  if(htmlRoot) htmlRoot.setAttribute("lang", lang);
  document.title = t("title_doc");
}
var currentLang = detectLang();
if(htmlRoot) htmlRoot.setAttribute("lang", currentLang);

function getTicks(){
  var d = DATA[currentLang];
  if(d && d.length) return d;
  return DATA.en;
}

/* ----------------- UI strings ----------------- */
var STRINGS = {
  en: {
    title_doc: "Dynasties — Florence to the United States, 1400–2000",
    title_kicker: "A turn-based history · 1400 – 2000 · 24 generations",
    title_main: "Dynasties",
    title_lede_html: "Guide one family across <em>six hundred years</em>. Twenty-five years to a turn, five decisions a generation — each wired to the nine levels of the era’s division of labour. Thrive while embedded in a rising order; <em>jump</em> to the next centre before the old one dies.",
    title_route_html: "Florence <b>1400</b> &nbsp;→&nbsp; Antwerp <b>1500</b> &nbsp;→&nbsp; Amsterdam <b>1575</b> &nbsp;→&nbsp; London <b>1700</b> &nbsp;→&nbsp; the United States <b>1850</b> &nbsp;→&nbsp; <b>?</b>",
    title_house_label: "Name your house",
    title_house_placeholder: "House Aldobrandi",
    title_house_default: "House Aldobrandi",
    title_begin_btn: "Found the dynasty — Florence, 1400",
    title_rule1_h: "The Board",
    title_rule1_p: "Nine levels of the division-of-labour system, each rising ↑, stable →, or obsolescing ↓. Read the arrows.",
    title_rule2_h: "The Risk",
    title_rule2_p: "Every option shows Risk & Reward — but genuine tail risk stays hidden. A family cannot see the future.",
    title_rule3_h: "The Jump",
    title_rule3_p: "When a centre dies, relocation re-opens. The alignment that paid for generations can turn fatal overnight.",
    title_fineprint: "The authored history runs to the year 2000. The future — the 3rd Industrial Revolution — is not yet written.",

    mast_dynasties_html: "Dynas<span class=\"swash\">ties</span>",
    mast_ir_word: "IR",
    mast_gen_prefix: "Generation",

    tl_band_centers: { "−1":"Florence", "0":"Low Countries", "1":"Great Britain", "2":"United States", "3":"? ? ?" },
    tl_band_subs:    { "−1":"City-States", "0":"Antwerp · Amsterdam", "1":"London", "2":"New York · Detroit", "3":"unwritten" },
    tl_ir_word: "IR",

    board_section_pre: "The Board · nine levels of the division of labour · ",
    board_section_c: ", c.",

    family_crest_prefix: "The House · Generation ",
    family_inherited_label: "Inherited from the previous generation",
    family_seed_label_prefix: "The family seed · ",
    family_seed_text: "A rising merchant household of the popolo grasso. Capital in florins, unaligned, no enemies — and no idea what is coming.",
    family_inherited_text: function(args){
      return "A " + args.tier + (args.setback ? ", diminished" : "") +
        " house — seated by way of “" + args.live + "”, schooled in “" + args.study + "”, " +
        "its trade in “" + args.business + "”, aligned to “" + args.back + "”, its capital held as “" + args.store + "”.";
    },
    family_stat_capital: "Capital",
    family_stat_stratum: "Stratum · L7",
    family_stat_seat: "Seat",
    family_stat_business: "Business",
    family_stat_education: "Education",
    family_stat_standing: "Standing",
    family_stat_store: "Capital held as",
    family_held_in_prefix: "held in ",

    currency: { "−1":"florins", "0":"guilders", "1":"pounds sterling", "2":"dollars" },
    tier:   { Vast:"Vast", Great:"Great", Wealthy:"Wealthy", Comfortable:"Comfortable", Modest:"Modest", Diminished:"Diminished" },
    tier_lower: { Vast:"vast", Great:"great", Wealthy:"wealthy", Comfortable:"comfortable", Modest:"modest", Diminished:"diminished" },
    stratum_prefix: { Vast:"Princely", Great:"Patrician", Wealthy:"Prominent", Comfortable:"Established", Modest:"Lesser", Diminished:"Declining" },
    stratum_base: { "−1":"merchant-banking house", "0":"merchant house", "1":"moneyed & industrial house", "2":"industrial-financial house" },
    weaker_branch: " (a weaker branch now holds the line)",

    dec_section: "The Five Generational Decisions · choose one of each",
    risk_label: "Risk",
    rew_label: "Rew",
    opt_chosen: "✦ Chosen for this generation",

    forecast_hd: "Forecast",
    forecast_count_fn: function(n){ return n + " of 5 decisions made"; },
    forecast_awaiting: "Awaiting your decision…",
    forecast_fallback_fn: function(o){ return "Chosen: " + o.name + " — risk " + o.risk + ", reward " + o.reward + "."; },
    live_note: "A family cannot see the future. The Risk / Reward you see is real — but some paths carry a hidden reckoning the indicators never show.",
    live_btn: "Live this generation",
    live_yrs: "+ 25 years",

    oc_gen_lived_fn: function(n, span){ return "Generation " + n + " lived · " + span; },
    oc_span_sub: "The years pass. The authored history unfolds — verbatim.",
    oc_why_label: "Why",
    fail_go_word: "Dynasty broken",
    fail_sb_word: "Setback",
    oc_see_reckoning: "See the reckoning →",
    oc_summary_settle_fn: function(tier){ return "The board turns; the family’s fortunes settle to <b>" + tier + "</b>. "; },
    oc_summary_setback_fn: function(typesHtml){ return "A setback strikes — " + typesHtml + ". Capital bleeds and a weaker hand passes to the next generation."; },
    oc_summary_intact: "The house comes through intact.",
    oc_summary_jump: " The family has <b>jumped</b> — pulling up its roots for the rising centre.",
    oc_live_next: "Live the next generation →",
    oc_advance_to_prefix: "advance to ",

    go_kicker_prefix: "Dynasty broken · ",
    go_title: "The Line Ends",
    go_dynasty_at_fall: "The dynasty, at its fall",
    go_stat_house: "House",
    go_stat_fell_in: "Fell in",
    go_stat_fell_in_fn: function(loc, year, gen){ return loc + ", c." + year + " — Generation " + gen + " of 24"; },
    go_stat_survived: "Survived",
    go_stat_survived_fn: function(years, gens){ return years + " years across " + gens + " generations"; },
    go_stat_undone: "Undone by",
    go_stat_undone_fn: function(dt, opt){ return dt + " — “" + opt + "”"; },
    go_stat_cause: "The cause",
    go_donate_line: "Enjoyed imagining this dynasty? The history is real; the rest is an experiment. <b>Help fund more scenarios.</b>",
    go_donate_btn: "Fund imaginative scenarios →",
    go_restart: "Begin a new dynasty",

    end_kicker: "The end of the written history · the year 2000",
    end_title: "Six Centuries",
    end_analog: "Your house has survived all twenty-four authored generations — from a Florentine counting-house to the apogee of the American century. <em>It endured.</em>",
    end_journey_pre: "It lived through five industrial revolutions and crossed the centres of the world economy: <b>Florence → Antwerp → Amsterdam → London → the United States</b>. Its relocations, made and refused: ",
    end_jumped: "jumped",
    end_stayed: "stayed",
    end_close_card_suffix: " · at the close of Tick 24",
    end_stat_capital: "Capital",
    end_stat_capital_v_fn: function(tier){ return tier + " — held in dollars"; },
    end_stat_stratum: "Stratum · L7",
    end_stat_final_seat: "Final seat",
    end_stat_final_standing: "Final standing",
    end_stat_final_business: "Final business",
    end_reveal_html: "The history runs out here. The future — the <span class=\"q\">3rd Industrial Revolution</span>, the 2000–2150 centre marked only “? ? ?” — is not yet written. The next generations do not exist yet.",
    end_donate_line: "The next chapters of history aren’t written yet. <b>Fund the imaginative scenarios that will write them</b> — the 3rd Industrial Revolution, and the centuries to come.",
    end_donate_btn: "Donate for imaginative scenarios →",

    foot_credit: "Concepts & ideas: Petr Shchedrovitskiy →",
    foot_disclaimer: "Vibe-coded — assembled by conversational prompting, not hand-engineered. The history is real and sourced; the game itself is an experiment.",
    foot_donate: "Fund more imaginative scenarios →",

    no_data: "Data failed to load."
  },
  ru: {
    title_doc: "Династии — От Флоренции до Соединённых Штатов, 1400–2000",
    title_kicker: "Пошаговая история · 1400 – 2000 · 24 поколения",
    title_main: "Династии",
    title_lede_html: "Проведите одну семью сквозь <em>шесть столетий</em>. Двадцать пять лет на ход, пять решений на поколение — каждое привязано к девяти уровням разделения труда своей эпохи. Процветайте, встроившись в восходящий порядок; <em>прыгайте</em> к следующему центру, пока старый не умрёт.",
    title_route_html: "Флоренция <b>1400</b> &nbsp;→&nbsp; Антверпен <b>1500</b> &nbsp;→&nbsp; Амстердам <b>1575</b> &nbsp;→&nbsp; Лондон <b>1700</b> &nbsp;→&nbsp; Соединённые Штаты <b>1850</b> &nbsp;→&nbsp; <b>?</b>",
    title_house_label: "Назовите свой дом",
    title_house_placeholder: "Дом Альдобранди",
    title_house_default: "Дом Альдобранди",
    title_begin_btn: "Основать династию — Флоренция, 1400",
    title_rule1_h: "Доска",
    title_rule1_p: "Девять уровней системы разделения труда — каждый растёт ↑, стабилен → или устаревает ↓. Читайте стрелки.",
    title_rule2_h: "Риск",
    title_rule2_p: "Каждый вариант показывает Риск и Награду — но настоящий хвостовый риск остаётся скрыт. Семья не видит будущего.",
    title_rule3_h: "Прыжок",
    title_rule3_p: "Когда центр умирает, снова открывается переезд. Союз, кормивший поколениями, может стать смертельным за одну ночь.",
    title_fineprint: "Записанная история доходит до 2000 года. Будущее — 3-я Промышленная Революция — ещё не написано.",

    mast_dynasties_html: "Динас<span class=\"swash\">тии</span>",
    mast_ir_word: "ПР",
    mast_gen_prefix: "Поколение",

    tl_band_centers: { "−1":"Флоренция", "0":"Низкие земли", "1":"Великобритания", "2":"Соединённые Штаты", "3":"? ? ?" },
    tl_band_subs:    { "−1":"Города-государства", "0":"Антверпен · Амстердам", "1":"Лондон", "2":"Нью-Йорк · Детройт", "3":"не написано" },
    tl_ir_word: "ПР",

    board_section_pre: "Доска · девять уровней разделения труда · ",
    board_section_c: ", ок. ",

    family_crest_prefix: "Дом · Поколение ",
    family_inherited_label: "Унаследовано от предыдущего поколения",
    family_seed_label_prefix: "Семя семьи · ",
    family_seed_text: "Восходящее купеческое хозяйство popolo grasso. Капитал во флоринах, без союзов, без врагов — и без понятия о том, что грядёт.",
    family_inherited_text: function(args){
      return args.tierCap + (args.setback ? ", подкошенный" : "") +
        " дом — осевший через «" + args.live + "», обученный в «" + args.study + "», " +
        "ведущий дело в «" + args.business + "», связанный с «" + args.back + "», хранящий капитал в «" + args.store + "».";
    },
    family_stat_capital: "Капитал",
    family_stat_stratum: "Слой · У7",
    family_stat_seat: "Местопребывание",
    family_stat_business: "Дело",
    family_stat_education: "Образование",
    family_stat_standing: "Положение",
    family_stat_store: "Капитал в",
    family_held_in_prefix: "хранится в ",

    currency: { "−1":"флоринах", "0":"гульденах", "1":"фунтах стерлингов", "2":"долларах" },
    tier:        { Vast:"Огромный", Great:"Великий", Wealthy:"Богатый", Comfortable:"Состоятельный", Modest:"Скромный", Diminished:"Угасший" },
    tier_lower:  { Vast:"огромный", Great:"великий", Wealthy:"богатый", Comfortable:"состоятельный", Modest:"скромный", Diminished:"угасший" },
    stratum_prefix: { Vast:"Княжеский", Great:"Патрицианский", Wealthy:"Видный", Comfortable:"Утверждённый", Modest:"Малый", Diminished:"Угасающий" },
    stratum_base: { "−1":"купеческо-банкирский дом", "0":"купеческий дом", "1":"денежно-промышленный дом", "2":"промышленно-финансовый дом" },
    weaker_branch: " (линию теперь держит более слабая ветвь)",

    dec_section: "Пять решений поколения · выберите по одному",
    risk_label: "Риск",
    rew_label: "Нагр",
    opt_chosen: "✦ Выбрано для этого поколения",

    forecast_hd: "Прогноз",
    forecast_count_fn: function(n){ return "Принято решений: " + n + " из 5"; },
    forecast_awaiting: "Ожидается ваше решение…",
    forecast_fallback_fn: function(o){ return "Выбор: " + o.name + " — риск " + tRisk(o.risk) + ", награда " + tRisk(o.reward) + "."; },
    live_note: "Семья не видит будущего. Риск / Награда, которые вы видите, — настоящие, но некоторые пути несут скрытую расплату, которую индикаторы не покажут.",
    live_btn: "Прожить это поколение",
    live_yrs: "+ 25 лет",

    oc_gen_lived_fn: function(n, span){ return "Прожито поколение " + n + " · " + span; },
    oc_span_sub: "Годы идут. Записанная история разворачивается — дословно.",
    oc_why_label: "Почему",
    fail_go_word: "Династия сломлена",
    fail_sb_word: "Удар",
    oc_see_reckoning: "Увидеть расплату →",
    oc_summary_settle_fn: function(tier){ return "Доска поворачивается; судьбы семьи оседают на отметке <b>" + tier + "</b>. "; },
    oc_summary_setback_fn: function(typesHtml){ return "Удар приходит — " + typesHtml + ". Капитал кровоточит, и более слабая рука переходит к следующему поколению."; },
    oc_summary_intact: "Дом выходит из эпохи невредимым.",
    oc_summary_jump: " Семья <b>прыгнула</b> — выкорчевав корни ради восходящего центра.",
    oc_live_next: "Прожить следующее поколение →",
    oc_advance_to_prefix: "перейти к ",

    go_kicker_prefix: "Династия сломлена · ",
    go_title: "Линия Оборвана",
    go_dynasty_at_fall: "Династия на момент падения",
    go_stat_house: "Дом",
    go_stat_fell_in: "Пал в",
    go_stat_fell_in_fn: function(loc, year, gen){ return loc + ", ок. " + year + " — Поколение " + gen + " из 24"; },
    go_stat_survived: "Прожил",
    go_stat_survived_fn: function(years, gens){ return years + " лет, " + gens + " поколений"; },
    go_stat_undone: "Сломлен",
    go_stat_undone_fn: function(dt, opt){ return dt + " — «" + opt + "»"; },
    go_stat_cause: "Причина",
    go_donate_line: "Понравилось представлять эту династию? История — настоящая; остальное — эксперимент. <b>Помогите профинансировать новые сценарии.</b>",
    go_donate_btn: "Поддержать новые сценарии →",
    go_restart: "Начать новую династию",

    end_kicker: "Конец записанной истории · 2000 год",
    end_title: "Шесть Столетий",
    end_analog: "Ваш дом пережил все двадцать четыре записанных поколения — от флорентийской конторы до вершины американского века. <em>Он выстоял.</em>",
    end_journey_pre: "Он прожил пять промышленных революций и пересёк центры мировой экономики: <b>Флоренция → Антверпен → Амстердам → Лондон → Соединённые Штаты</b>. Его переезды, совершённые и отвергнутые: ",
    end_jumped: "прыгнул",
    end_stayed: "остался",
    end_close_card_suffix: " · на конец 24-го хода",
    end_stat_capital: "Капитал",
    end_stat_capital_v_fn: function(tier){ return tier + " — в долларах"; },
    end_stat_stratum: "Слой · У7",
    end_stat_final_seat: "Последнее местопребывание",
    end_stat_final_standing: "Последнее положение",
    end_stat_final_business: "Последнее дело",
    end_reveal_html: "История заканчивается здесь. Будущее — <span class=\"q\">3-я Промышленная Революция</span>, центр 2000–2150 годов, помеченный лишь «? ? ?» — ещё не написано. Следующих поколений пока не существует.",
    end_donate_line: "Следующие главы истории ещё не написаны. <b>Поддержите воображаемые сценарии, которые их напишут</b> — 3-ю промышленную революцию и столетия, что грядут.",
    end_donate_btn: "Поддержать воображаемые сценарии →",

    foot_credit: "Концепции и идеи: Пётр Щедровицкий →",
    foot_disclaimer: "Vibe-coded — собрано разговорными подсказками, а не написано вручную. История — настоящая и с источниками; сама игра — эксперимент.",
    foot_donate: "Поддержать новые сценарии →",

    no_data: "Не удалось загрузить данные."
  }
};

function t(key){ return STRINGS[currentLang][key] !== undefined ? STRINGS[currentLang][key] : STRINGS.en[key]; }
function tDict(key, k){ var d = t(key); return d[k] !== undefined ? d[k] : ((STRINGS.en[key] && STRINGS.en[key][k]) || k); }
var RISK_DICT = { en:{low:"low",medium:"medium",high:"high"}, ru:{low:"низкий",medium:"средний",high:"высокий"} };
function tRisk(level){ return (RISK_DICT[currentLang] || RISK_DICT.en)[level] || level; }

/* ---- timeline constants (kept in code; band labels translated) ---- */
var TL_FROM = 1400, TL_TO = 2150, TL_SPAN = TL_TO - TL_FROM;
var IR_BANDS = [
  { ir:"−1", from:1400, to:1500 },
  { ir:"0",      from:1500, to:1700 },
  { ir:"1",      from:1700, to:1850 },
  { ir:"2",      from:1850, to:2000 },
  { ir:"3",      from:2000, to:2150 }
];

/* ---- game state ---- */
var S = null;
function freshState(houseName){
  return {
    house: houseName || t("title_house_default"),
    tickIdx: 0,
    capital: 52,
    setbackLast: false,
    selections: {},
    history: [],
    jumps: [],
    lastChoices: null,
    alive: true
  };
}

/* ---- helpers ---- */
function el(html){ var d=document.createElement("div"); d.innerHTML=html.trim(); return d.firstChild; }
function esc(s){ return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function trendClass(t){ if(t.indexOf("↑")>=0) return "up"; if(t.indexOf("↓")>=0) return "down"; if(t==="—") return "dash"; return "flat"; }
function pct(y){ return Math.max(0,Math.min(100,(y-TL_FROM)/TL_SPAN*100)); }
function tierKey(c){
  if(c>=88) return "Vast";
  if(c>=74) return "Great";
  if(c>=60) return "Wealthy";
  if(c>=44) return "Comfortable";
  if(c>=28) return "Modest";
  return "Diminished";
}
function tierName(c){ return tDict("tier", tierKey(c)); }
function tierLower(c){ return tDict("tier_lower", tierKey(c)); }
function stratumLabel(c, ir, setback){
  var prefix = tDict("stratum_prefix", tierKey(c));
  var base = tDict("stratum_base", ir) || tDict("stratum_base", "0");
  var s = prefix + " " + base;
  return setback ? s + t("weaker_branch") : s;
}
function rewardTarget(r){ return r==="high"?82 : r==="medium"?56 : 30; }
function isJumpOpt(name){ return /^jump|^прыжок|^прыгн/i.test((name||"").trim()); }

/* ---- language switcher ---- */
function langSwitchHTML(){
  return '<div class="lang-switch" role="group" aria-label="Language">'+
    '<button type="button" data-lang="en" class="'+(currentLang==="en"?"on":"")+'" aria-pressed="'+(currentLang==="en")+'">EN</button>'+
    '<span class="sep">|</span>'+
    '<button type="button" data-lang="ru" class="'+(currentLang==="ru"?"on":"")+'" aria-pressed="'+(currentLang==="ru")+'">RU</button>'+
  '</div>';
}
function wireLangSwitches(root){
  if(!root) root = document;
  root.querySelectorAll(".lang-switch button[data-lang]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var lang = btn.getAttribute("data-lang");
      if(lang === currentLang) return;
      setLang(lang);
      rerenderCurrent();
    });
  });
}

/* ---- footer ---- */
function renderFooter(){
  if(!footerInner) return;
  footerInner.innerHTML =
    '<span class="foot-credit"><a href="https://shchedrovitskiy.com/" target="_blank" rel="noopener noreferrer">'+esc(t("foot_credit"))+'</a></span>'+
    '<span class="foot-disclaimer">'+esc(t("foot_disclaimer"))+'</span>'+
    '<span class="foot-donate"><a href="'+STRIPE+'" target="_blank" rel="noopener noreferrer">'+esc(t("foot_donate"))+'</a></span>'+
    '<span class="foot-lang">'+langSwitchHTML()+'</span>';
  wireLangSwitches(footerInner);
}

/* ---- screen state for re-render on lang switch ---- */
var currentScreen = "title";
var lastOutcomeArgs = null;
var lastGameOverArgs = null;
function rerenderCurrent(){
  if(currentScreen === "title") renderTitle();
  else if(currentScreen === "tick") renderTick();
  else if(currentScreen === "outcome" && lastOutcomeArgs) {
    var ticks = getTicks();
    var prev = lastOutcomeArgs;
    // remap tick to current lang
    var tick = ticks[S.tickIdx] || prev[0];
    // remap chosen options to current lang preserving selections
    var chosen = tick.decisions.map(function(d){
      return { d:d, o:d.options[S.selections[d.num] !== undefined ? S.selections[d.num] : 0] };
    });
    // re-derive gameOver / setbacks from re-resolved options
    var gameOver = null, setbacks = [];
    chosen.forEach(function(c){
      if(c.o.failure){
        if(c.o.failure.severity==="game-over" && !gameOver) gameOver = c;
        else if(c.o.failure.severity==="setback") setbacks.push(c);
      }
    });
    renderOutcome(tick, chosen, gameOver, setbacks, prev[4], prev[5], prev[6]);
  }
  else if(currentScreen === "gameover" && lastGameOverArgs){
    var t2 = getTicks();
    var prev2 = lastGameOverArgs;
    var tick2 = t2[S.tickIdx] || prev2[0];
    // re-find equivalent failing option in current language by decision num
    var goPrev = prev2[1];
    var goDec = tick2.decisions.find(function(d){ return d.num === goPrev.d.num; }) || goPrev.d;
    var optIdx = S.selections[goDec.num];
    var goOpt = (optIdx !== undefined && goDec.options[optIdx]) ? goDec.options[optIdx] : goPrev.o;
    renderGameOver(tick2, { d: goDec, o: goOpt });
  }
  else if(currentScreen === "end") renderEnd();
  else renderTitle();
}

/* ============================================================
   TITLE SCREEN
   ============================================================ */
function renderTitle(){
  currentScreen = "title";
  S = freshState();
  app.innerHTML = "";
  document.title = t("title_doc");
  var wrap = el('<div class="shell"></div>');
  wrap.appendChild(el(
    '<div class="title-screen fade-in">'+
      '<div class="title-lang">'+langSwitchHTML()+'</div>'+
      '<div class="ts-kicker">'+esc(t("title_kicker"))+'</div>'+
      '<h1 class="ts-title">'+esc(t("title_main"))+'</h1>'+
      '<div class="ts-rule"></div>'+
      '<p class="ts-lede">'+t("title_lede_html")+'</p>'+
      '<div class="ts-route">'+t("title_route_html")+'</div>'+
      '<div class="ts-form">'+
        '<div>'+
          '<div class="house-label">'+esc(t("title_house_label"))+'</div>'+
          '<div class="house-input-wrap"><input class="house-input" id="houseInput" maxlength="38" placeholder="'+esc(t("title_house_placeholder"))+'" /></div>'+
        '</div>'+
        '<button class="btn btn-primary" id="beginBtn">'+esc(t("title_begin_btn"))+'</button>'+
      '</div>'+
      '<div class="ts-rules">'+
        '<div class="ts-rule-card"><h4>'+esc(t("title_rule1_h"))+'</h4><p>'+esc(t("title_rule1_p"))+'</p></div>'+
        '<div class="ts-rule-card"><h4>'+esc(t("title_rule2_h"))+'</h4><p>'+esc(t("title_rule2_p"))+'</p></div>'+
        '<div class="ts-rule-card"><h4>'+esc(t("title_rule3_h"))+'</h4><p>'+esc(t("title_rule3_p"))+'</p></div>'+
      '</div>'+
      '<p class="ts-fineprint">'+esc(t("title_fineprint"))+'</p>'+
    '</div>'
  ));
  app.appendChild(wrap);
  wireLangSwitches(wrap);
  var input = document.getElementById("houseInput");
  document.getElementById("beginBtn").addEventListener("click", function(){
    var name = (input.value||"").trim() || t("title_house_default");
    S.house = name;
    renderTick();
  });
  input.addEventListener("keydown", function(e){ if(e.key==="Enter") document.getElementById("beginBtn").click(); });
  renderFooter();
}

/* ============================================================
   TIMELINE
   ============================================================ */
function timelineHTML(tick){
  var bands = IR_BANDS.map(function(b){
    var cls = "tl-band";
    if(b.ir === tick.ir){ cls += " current"; }
    else {
      var curBand = IR_BANDS.find(function(x){return x.ir===tick.ir;});
      if(curBand && b.from < curBand.from) cls += " past";
      else cls += " future";
    }
    var width = (b.to-b.from)/TL_SPAN*100;
    var stages = "";
    for(var k=1;k<3;k++){ stages += '<div class="tl-stage" style="left:'+(k/3*100)+'%"></div>'; }
    return '<div class="'+cls+'" style="width:'+width+'%">'+stages+
      '<div class="tl-ir">'+b.ir+' '+t("tl_ir_word")+'</div>'+
      '<div class="tl-center">'+esc(tDict("tl_band_centers", b.ir))+'</div>'+
      '<div class="tl-sub">'+esc(tDict("tl_band_subs", b.ir))+'</div>'+
    '</div>';
  }).join("");
  var spanEnd = tick.year + 25;
  var spanHTML = '<div class="tl-span" style="left:'+pct(tick.year)+'%;width:'+(pct(spanEnd)-pct(tick.year))+'%"></div>';
  var markerHTML = '<div class="tl-marker" style="left:'+pct(tick.year)+'%"></div>';
  return '<div class="timeline">'+
    '<div class="tl-track">'+spanHTML+bands+markerHTML+'</div>'+
    '<div class="tl-years"><span>1400</span><span>1550</span><span>1700</span><span>1850</span><span>2000</span><span>2150</span></div>'+
  '</div>';
}

function mastheadHTML(tick){
  return '<div class="masthead">'+
    '<div>'+
      '<div class="mast-title">'+t("mast_dynasties_html")+'</div>'+
      '<div class="mast-sub">'+esc(tick.ir)+' '+esc(t("mast_ir_word"))+' · '+esc(tick.location)+' · '+esc(tick.stage)+'</div>'+
    '</div>'+
    '<div class="mast-lang">'+
      langSwitchHTML()+
      '<div class="mast-counter"><b>'+tick.year+'</b>'+esc(t("mast_gen_prefix"))+' '+tick.gen+' · '+esc(tick.span)+'</div>'+
    '</div>'+
  '</div>';
}

/* ============================================================
   FAMILY PANEL
   ============================================================ */
function familyHTML(tick){
  var ir = tick.ir;
  var cur = tDict("currency", ir) || "";

  var inherited;
  if(tick.gen > 1 && S.lastChoices){
    var lc = S.lastChoices;
    inherited =
      '<div class="inherited">'+
        '<div class="ih-label">'+esc(t("family_inherited_label"))+'</div>'+
        '<div class="ih-text">'+esc(t("family_inherited_text")({
          tier: tierLower(S.capital),
          tierCap: tierName(S.capital),
          setback: S.setbackLast,
          live: lc.live, study: lc.study, business: lc.business, back: lc.back, store: lc.store
        }))+'</div>'+
      '</div>';
  } else {
    inherited =
      '<div class="inherited">'+
        '<div class="ih-label">'+esc(t("family_seed_label_prefix"))+tick.year+'</div>'+
        '<div class="ih-text">'+esc(t("family_seed_text"))+'</div>'+
      '</div>';
  }

  var lc2 = S.lastChoices;
  var statRows =
    '<div class="stat"><span class="k">'+esc(t("family_stat_capital"))+'</span><span class="v cap">'+esc(tierName(S.capital))+'<span class="sub">'+esc(t("family_held_in_prefix"))+esc(cur)+'</span></span></div>'+
    '<div class="stat"><span class="k">'+esc(t("family_stat_stratum"))+'</span><span class="v">'+esc(stratumLabel(S.capital, ir, S.setbackLast))+'</span></div>'+
    '<div class="stat"><span class="k">'+esc(t("family_stat_seat"))+'</span><span class="v">'+(lc2?esc(lc2.live):"—")+'</span></div>'+
    '<div class="stat"><span class="k">'+esc(t("family_stat_business"))+'</span><span class="v">'+(lc2?esc(lc2.business):"—")+'</span></div>'+
    '<div class="stat"><span class="k">'+esc(t("family_stat_education"))+'</span><span class="v">'+(lc2?esc(lc2.study):"—")+'</span></div>'+
    '<div class="stat"><span class="k">'+esc(t("family_stat_standing"))+'</span><span class="v">'+(lc2?esc(lc2.back):"—")+'</span></div>'+
    '<div class="stat"><span class="k">'+esc(t("family_stat_store"))+'</span><span class="v">'+(lc2?esc(lc2.store):"—")+'</span></div>';

  return '<div class="family">'+
    '<div class="family-hd">'+
      '<div class="family-crest">'+esc(t("family_crest_prefix"))+tick.gen+'</div>'+
      '<div class="family-name">'+esc(S.house)+'</div>'+
    '</div>'+
    inherited+
    '<div class="stats">'+statRows+'</div>'+
  '</div>';
}

/* ============================================================
   BOARD
   ============================================================ */
function boardHTML(tick){
  var rows = tick.board.map(function(r){
    return '<div class="board-row'+(r.n===7?" lv7":"")+'">'+
      '<div class="bn">'+r.n+'</div>'+
      '<div><div class="bl-name">'+esc(r.level)+'</div><div class="bl-state">'+esc(r.state)+'</div></div>'+
      '<div class="trend '+trendClass(r.trend)+'">'+r.trend+'</div>'+
    '</div>';
  }).join("");
  return '<div class="board">'+
    '<div class="sec-label">'+esc(t("board_section_pre"))+esc(tick.location)+esc(t("board_section_c"))+tick.year+'</div>'+
    rows+
  '</div>';
}

/* ============================================================
   DECISION CARDS
   ============================================================ */
function decisionsHTML(tick){
  var cards = tick.decisions.map(function(d){
    var opts = d.options.map(function(o, oi){
      var jump = isJumpOpt(o.name) ? " jump" : "";
      return '<div class="opt'+jump+'" data-dec="'+d.num+'" data-opt="'+oi+'">'+
        '<div class="opt-top">'+
          '<div class="opt-name">'+esc(o.name)+'</div>'+
          '<div class="rr">'+
            '<span class="chip '+o.risk+'"><span class="dot"></span>'+esc(t("risk_label"))+' '+esc(tRisk(o.risk))+'</span>'+
            '<span class="chip '+o.reward+'"><span class="dot"></span>'+esc(t("rew_label"))+' '+esc(tRisk(o.reward))+'</span>'+
          '</div>'+
        '</div>'+
        '<div class="opt-sel-mark">'+esc(t("opt_chosen"))+'</div>'+
      '</div>';
    }).join("");
    return '<div class="dcard">'+
      '<div class="dcard-hd"><span class="dt"><span class="num">'+d.num+'</span>'+esc(d.title)+'</span><span class="dl">'+esc(d.levelsLabel)+'</span></div>'+
      '<div class="opts">'+opts+'</div>'+
    '</div>';
  }).join("");
  return '<div class="decisions-wrap">'+
    '<div class="sec-label">'+esc(t("dec_section"))+'</div>'+
    '<div class="dec-grid">'+cards+'</div>'+
  '</div>';
}

/* ============================================================
   FORECAST + LIVE
   ============================================================ */
function forecastHTML(tick){
  var rows = tick.decisions.map(function(d){
    var selIdx = S.selections[d.num];
    var v, cls="";
    if(selIdx === undefined){ v = t("forecast_awaiting"); cls=" empty"; }
    else {
      var o = d.options[selIdx];
      v = o.forecast && o.forecast.length ? o.forecast : t("forecast_fallback_fn")(o);
    }
    return '<div class="fc-row"><span class="fc-t">'+esc(d.title)+'</span><span class="fc-v'+cls+'">'+esc(v)+'</span></div>';
  }).join("");
  var count = Object.keys(S.selections).length;
  var ready = count === 5;
  return '<div class="forecast">'+
    '<div class="forecast-hd"><span class="fh">'+esc(t("forecast_hd"))+'</span><span class="fcount" id="fcount">'+esc(t("forecast_count_fn")(count))+'</span></div>'+
    '<div class="forecast-body" id="forecastBody">'+rows+'</div>'+
    '<div class="live-bar">'+
      '<div class="live-note">'+esc(t("live_note"))+'</div>'+
      '<button class="btn btn-primary" id="liveBtn"'+(ready?"":" disabled")+'>'+esc(t("live_btn"))+'<span class="yrs">'+esc(t("live_yrs"))+'</span></button>'+
    '</div>'+
  '</div>';
}

/* ============================================================
   RENDER A TICK
   ============================================================ */
function renderTick(){
  currentScreen = "tick";
  var ticks = getTicks();
  var tick = ticks[S.tickIdx];
  S.selections = {};
  app.innerHTML = "";
  var wrap = el('<div class="shell fade-in"></div>');
  wrap.innerHTML =
    mastheadHTML(tick) +
    timelineHTML(tick) +
    '<div class="play-grid">'+
      '<div>'+ boardHTML(tick) +'</div>'+
      '<div>'+ familyHTML(tick) +'</div>'+
    '</div>' +
    decisionsHTML(tick) +
    forecastHTML(tick);
  app.appendChild(wrap);
  window.scrollTo(0,0);
  wireLangSwitches(wrap);

  wrap.querySelectorAll(".opt").forEach(function(node){
    node.addEventListener("click", function(){
      var dec = +node.getAttribute("data-dec");
      var opt = +node.getAttribute("data-opt");
      S.selections[dec] = opt;
      var card = node.closest(".opts");
      card.querySelectorAll(".opt").forEach(function(n){ n.classList.remove("sel"); });
      node.classList.add("sel");
      refreshForecast(tick);
    });
  });
  document.getElementById("liveBtn").addEventListener("click", function(){
    if(Object.keys(S.selections).length===5) liveGeneration();
  });
  renderFooter();
}

function refreshForecast(tick){
  var body = document.getElementById("forecastBody");
  body.innerHTML = tick.decisions.map(function(d){
    var selIdx = S.selections[d.num];
    var v, cls="";
    if(selIdx === undefined){ v = t("forecast_awaiting"); cls=" empty"; }
    else {
      var o = d.options[selIdx];
      v = o.forecast && o.forecast.length ? o.forecast : t("forecast_fallback_fn")(o);
    }
    return '<div class="fc-row"><span class="fc-t">'+esc(d.title)+'</span><span class="fc-v'+cls+'">'+esc(v)+'</span></div>';
  }).join("");
  var count = Object.keys(S.selections).length;
  document.getElementById("fcount").textContent = t("forecast_count_fn")(count);
  document.getElementById("liveBtn").disabled = count !== 5;
}

/* ============================================================
   LIVE THE GENERATION
   ============================================================ */
function liveGeneration(){
  var ticks = getTicks();
  var tick = ticks[S.tickIdx];
  var chosen = tick.decisions.map(function(d){
    return { d:d, o:d.options[S.selections[d.num]] };
  });

  var gameOver = null;
  var setbacks = [];
  chosen.forEach(function(c){
    if(c.o.failure){
      if(c.o.failure.severity==="game-over" && !gameOver) gameOver = c;
      else if(c.o.failure.severity==="setback") setbacks.push(c);
    }
  });

  var avgTarget = chosen.reduce(function(a,c){return a+rewardTarget(c.o.reward);},0)/5;
  var newCap = Math.round(S.capital*0.55 + avgTarget*0.45);
  newCap -= setbacks.length * 13;
  newCap = Math.max(8, Math.min(96, newCap));

  var lastChoices = {
    live: chosen[0].o.name, study: chosen[1].o.name, business: chosen[2].o.name,
    back: chosen[3].o.name, store: chosen[4].o.name
  };

  var jumpThisTick = isJumpOpt(chosen[0].o.name);
  var hasJumpOption = tick.decisions[0].options.some(function(o){return isJumpOpt(o.name);});
  if(hasJumpOption){
    S.jumps.push({ tick: tick.n, year: tick.year, from: tick.location, took: jumpThisTick, label: chosen[0].o.name });
  }

  renderOutcome(tick, chosen, gameOver, setbacks, newCap, lastChoices, jumpThisTick);
}

function failBadge(f){
  if(!f) return "";
  var cls = f.severity==="game-over" ? "go" : "sb";
  var word = f.severity==="game-over" ? t("fail_go_word") : t("fail_sb_word");
  return '<span class="fail-badge '+cls+'">'+esc(word)+' · '+esc(f.type)+'</span>';
}

function renderOutcome(tick, chosen, gameOver, setbacks, newCap, lastChoices, jumpThisTick){
  currentScreen = "outcome";
  lastOutcomeArgs = [tick, chosen, gameOver, setbacks, newCap, lastChoices, jumpThisTick];
  app.innerHTML = "";
  var wrap = el('<div class="shell"></div>');

  var items = chosen.map(function(c){
    var f = c.o.failure;
    var cls = f ? (f.severity==="game-over"?" fail-go":" fail-sb") : "";
    var failMsg = f ? '<div class="oc-fail-msg">'+esc(f.message)+'</div>' : "";
    return '<div class="oc-item'+cls+'">'+
      '<div class="oc-dt">'+c.d.num+' · '+esc(c.d.title)+'</div>'+
      '<div class="oc-choice">'+esc(c.o.name)+failBadge(f)+'</div>'+
      '<div class="oc-text">'+esc(c.o.outcome)+'</div>'+
      '<div class="oc-why"><b>'+esc(t("oc_why_label"))+'</b>'+esc(c.o.why)+'</div>'+
      failMsg+
    '</div>';
  }).join("");

  var headHTML =
    mastheadHTML(tick) +
    timelineHTML(tick) +
    '<div class="oc-head" style="margin-top:18px">'+
      '<div class="oc-gen">'+esc(t("oc_gen_lived_fn")(tick.gen, tick.span))+'</div>'+
      '<div class="oc-title">'+esc(tick.location)+', '+tick.year+'</div>'+
      '<div class="oc-span">'+esc(t("oc_span_sub"))+'</div>'+
    '</div>';

  var tail;
  if(gameOver){
    tail = '<div class="oc-advance"><button class="btn btn-primary" id="toGameOver">'+esc(t("oc_see_reckoning"))+'</button></div>';
  } else {
    var movedTier = tierName(newCap);
    var setNote;
    if(setbacks.length){
      var typesHtml = setbacks.map(function(s){return '<b>'+esc(s.o.failure.type)+'</b>';}).join(", ");
      setNote = t("oc_summary_setback_fn")(typesHtml);
    } else {
      setNote = t("oc_summary_intact");
    }
    var jumpNote = jumpThisTick ? t("oc_summary_jump") : '';
    tail =
      '<div class="oc-summary">'+t("oc_summary_settle_fn")(movedTier)+setNote+jumpNote+'</div>'+
      '<div class="oc-advance"><button class="btn btn-primary" id="advanceBtn">'+esc(t("oc_live_next"))+'<span class="yrs">'+esc(t("oc_advance_to_prefix"))+(tick.year+25)+'</span></button></div>';
  }

  wrap.innerHTML = headHTML + '<div class="outcome-screen"><div class="oc-list">'+items+'</div>'+tail+'</div>';
  app.appendChild(wrap);
  window.scrollTo(0,0);
  wireLangSwitches(wrap);

  if(gameOver){
    document.getElementById("toGameOver").addEventListener("click", function(){
      renderGameOver(tick, gameOver);
    });
  } else {
    document.getElementById("advanceBtn").addEventListener("click", function(){
      S.capital = newCap;
      S.setbackLast = setbacks.length>0;
      S.lastChoices = lastChoices;
      S.history.push({ tick: tick.n, year: tick.year, location: tick.location, choices: lastChoices, tier: tierName(newCap), setback: setbacks.length>0 });
      var ticks = getTicks();
      if(S.tickIdx >= ticks.length-1){
        renderEnd();
      } else {
        S.tickIdx++;
        renderTick();
      }
    });
  }
  renderFooter();
}

/* ============================================================
   GAME OVER
   ============================================================ */
function renderGameOver(tick, go){
  currentScreen = "gameover";
  lastGameOverArgs = [tick, go];
  app.innerHTML = "";
  var f = go.o.failure;
  var genReached = tick.gen;
  var yearsLived = (tick.year) - 1400;
  var wrap = el('<div class="shell"></div>');
  wrap.innerHTML =
    '<div class="endscreen broken fade-in">'+
      '<div class="end-inner">'+
        langSwitchHTML()+
        '<div class="end-kicker">'+esc(t("go_kicker_prefix"))+esc(f.type)+'</div>'+
        '<h1 class="end-title">'+esc(t("go_title"))+'</h1>'+
        '<div class="end-rule"></div>'+
        '<p class="end-analog">'+esc(f.message)+'</p>'+
        '<div class="end-card">'+
          '<h4>'+esc(t("go_dynasty_at_fall"))+'</h4>'+
          '<div class="end-stat"><span class="k">'+esc(t("go_stat_house"))+'</span><span class="v">'+esc(S.house)+'</span></div>'+
          '<div class="end-stat"><span class="k">'+esc(t("go_stat_fell_in"))+'</span><span class="v">'+esc(t("go_stat_fell_in_fn")(tick.location, tick.year, genReached))+'</span></div>'+
          '<div class="end-stat"><span class="k">'+esc(t("go_stat_survived"))+'</span><span class="v">'+esc(t("go_stat_survived_fn")(yearsLived, (genReached-1)))+'</span></div>'+
          '<div class="end-stat"><span class="k">'+esc(t("go_stat_undone"))+'</span><span class="v">'+esc(t("go_stat_undone_fn")(go.d.title, go.o.name))+'</span></div>'+
          '<div class="end-stat"><span class="k">'+esc(t("go_stat_cause"))+'</span><span class="v">'+esc(go.o.why)+'</span></div>'+
        '</div>'+
        '<div class="donate-block">'+
          '<div class="db-line">'+t("go_donate_line")+'</div>'+
          '<div class="end-actions">'+
            '<a class="btn-donate" href="'+STRIPE+'" target="_blank" rel="noopener noreferrer">'+esc(t("go_donate_btn"))+'</a>'+
            '<button class="btn-restart" id="restartBtn">'+esc(t("go_restart"))+'</button>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>';
  app.appendChild(wrap);
  window.scrollTo(0,0);
  wireLangSwitches(wrap);
  document.getElementById("restartBtn").addEventListener("click", renderTitle);
  renderFooter();
}

/* ============================================================
   END / DONATE
   ============================================================ */
function renderEnd(){
  currentScreen = "end";
  app.innerHTML = "";
  var wrap = el('<div class="shell"></div>');

  var jumpLines = S.jumps.map(function(j){
    return j.took
      ? '<b>'+esc(j.from)+' '+j.year+'</b> — '+esc(t("end_jumped"))
      : esc(j.from)+' '+j.year+' — '+esc(t("end_stayed"));
  }).join(" · ");

  var tier = tierName(S.capital);
  var lc = S.lastChoices || {};
  var stratum = stratumLabel(S.capital, "2", S.setbackLast);

  wrap.innerHTML =
    '<div class="endscreen end fade-in">'+
      '<div class="end-inner">'+
        langSwitchHTML()+
        '<div class="end-kicker gold">'+esc(t("end_kicker"))+'</div>'+
        '<h1 class="end-title">'+esc(t("end_title"))+'</h1>'+
        '<div class="end-rule"></div>'+
        '<p class="end-analog">'+t("end_analog")+'</p>'+
        '<div class="end-journey">'+
          t("end_journey_pre")+jumpLines+'.'+
        '</div>'+
        '<div class="end-card">'+
          '<h4>'+esc(S.house)+esc(t("end_close_card_suffix"))+'</h4>'+
          '<div class="end-stat"><span class="k">'+esc(t("end_stat_capital"))+'</span><span class="v">'+esc(t("end_stat_capital_v_fn")(tier))+'</span></div>'+
          '<div class="end-stat"><span class="k">'+esc(t("end_stat_stratum"))+'</span><span class="v">'+esc(stratum)+'</span></div>'+
          '<div class="end-stat"><span class="k">'+esc(t("end_stat_final_seat"))+'</span><span class="v">'+esc(lc.live||"—")+'</span></div>'+
          '<div class="end-stat"><span class="k">'+esc(t("end_stat_final_standing"))+'</span><span class="v">'+esc(lc.back||"—")+'</span></div>'+
          '<div class="end-stat"><span class="k">'+esc(t("end_stat_final_business"))+'</span><span class="v">'+esc(lc.business||"—")+'</span></div>'+
        '</div>'+
        '<div class="end-reveal">'+t("end_reveal_html")+'</div>'+
        '<div class="donate-block">'+
          '<div class="db-line">'+t("end_donate_line")+'</div>'+
          '<div class="end-actions">'+
            '<a class="btn-donate" href="'+STRIPE+'" target="_blank" rel="noopener noreferrer">'+esc(t("end_donate_btn"))+'</a>'+
            '<button class="btn-restart" id="restartBtn">'+esc(t("go_restart"))+'</button>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>';
  app.appendChild(wrap);
  window.scrollTo(0,0);
  wireLangSwitches(wrap);
  document.getElementById("restartBtn").addEventListener("click", renderTitle);
  renderFooter();
}

/* ---- boot ---- */
document.title = t("title_doc");
if(!DATA.en.length && !DATA.ru.length){
  app.innerHTML = '<div class="shell" style="padding:60px 20px;text-align:center;font-family:var(--font-serif)">'+esc(t("no_data"))+'</div>';
  renderFooter();
} else {
  renderTitle();
}

})();
