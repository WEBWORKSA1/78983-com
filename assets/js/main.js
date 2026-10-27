/* 78983.com — shared site behaviour */
(function(){
  "use strict";
  var root=document.documentElement;
  var BASE=(document.querySelector('meta[name="site-base"]')||{}).content||"./";

  /* Theme */
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
  var saved=store("theme"); if(saved) root.setAttribute("data-theme",saved);
  document.addEventListener("click",function(e){
    var t=e.target.closest("[data-theme-toggle]"); if(!t) return;
    var dark=root.getAttribute("data-theme")==="dark"||(!root.getAttribute("data-theme")&&matchMedia("(prefers-color-scheme:dark)").matches);
    var next=dark?"light":"dark"; root.setAttribute("data-theme",next); store("theme",next);
  });

  /* Mobile menu */
  var burger=document.querySelector(".burger"),menu=document.querySelector(".menu");
  if(burger&&menu){burger.addEventListener("click",function(){var o=menu.classList.toggle("open");burger.setAttribute("aria-expanded",o)})}

  /* Site search */
  var PAGES=[
    ["Compound Interest Calculator","calculators/compound-interest.html","savings growth investing"],
    ["Loan & EMI Calculator","calculators/loan-emi.html","emi personal loan car loan installment"],
    ["Mortgage Calculator","calculators/mortgage.html","home loan amortization house"],
    ["Retirement Calculator","calculators/retirement.html","pension nest egg fire"],
    ["Savings Goal Calculator","calculators/savings-goal.html","save target monthly"],
    ["Inflation Calculator","calculators/inflation.html","purchasing power prices cpi"],
    ["ROI Calculator","calculators/roi.html","return on investment cagr profit"],
    ["Debt Payoff Calculator","calculators/debt-payoff.html","credit card snowball avalanche"],
    ["Startup Runway Calculator","calculators/startup-runway.html","burn rate cash months business"],
    ["AI API Cost Estimator","calculators/ai-cost.html","tokens llm chatbot pricing gpt claude"],
    ["Freelance Rate Calculator","calculators/freelance-rate.html","hourly rate consultant pricing"],
    ["Percentage Calculator","calculators/percentage.html","percent change increase decrease"],
    ["Number Explorer","number-explorer.html","number facts prime binary roman lucky digits"],
    ["All Calculators","calculators/index.html","tools list"],
    ["Learn: Guides & Videos","learn.html","education videos guides"],
    ["Get Matched with a Pro","get-matched.html","advisor lead quote help"],
    ["Support 78983","support.html","donate donation sponsor"],
    ["Contests & Prizes","contests.html","challenge prize win"],
    ["Careers & Talent","careers.html","jobs hiring writers developers"],
    ["Advertise & Partner","advertise.html","sponsorship advertising partnership"],
    ["About","about.html","mission team"],["Contact","contact.html","message email"],
    ["Privacy Policy","privacy.html","cookies data"],["Terms of Use","terms.html","legal"],
    ["Disclaimer & Trademark Notice","disclaimer.html","copyright trademark"]
  ];
  document.querySelectorAll("[data-search]").forEach(function(box){
    var input=box.querySelector("input"),out=box.querySelector(".search-results");
    function render(){
      var q=input.value.trim().toLowerCase(); if(!q){out.style.display="none";return}
      var hits=PAGES.filter(function(p){return (p[0]+" "+p[2]).toLowerCase().indexOf(q)>-1}).slice(0,8);
      out.innerHTML=hits.length?hits.map(function(p){return '<a href="'+BASE+p[1]+'">'+p[0]+'</a>'}).join(""):'<a href="'+BASE+'calculators/index.html">No match — browse all calculators</a>';
      out.style.display="block";
    }
    input.addEventListener("input",render);
    input.addEventListener("keydown",function(e){if(e.key==="Enter"){var a=out.querySelector("a");if(a)location.href=a.href}if(e.key==="Escape"){out.style.display="none"}});
    document.addEventListener("click",function(e){if(!box.contains(e.target))out.style.display="none"});
  });

  /* Calculator filter chips */
  document.querySelectorAll("[data-filter-group]").forEach(function(group){
    var cards=document.querySelectorAll("[data-cat]");
    group.addEventListener("click",function(e){
      var c=e.target.closest(".chip"); if(!c) return;
      group.querySelectorAll(".chip").forEach(function(x){x.setAttribute("aria-pressed","false")});
      c.setAttribute("aria-pressed","true");
      var f=c.dataset.f; cards.forEach(function(card){card.style.display=(f==="all"||card.dataset.cat.indexOf(f)>-1)?"":"none"});
    });
  });

  /* Lite YouTube embeds (privacy-enhanced, loads only on click) */
  document.querySelectorAll(".video[data-yt]").forEach(function(v){
    var id=v.dataset.yt;
    v.innerHTML='<img loading="lazy" alt="'+(v.dataset.title||"Video")+'" src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg"><div class="play"><span aria-hidden="true">▶</span></div>';
    v.setAttribute("role","button");v.setAttribute("tabindex","0");v.setAttribute("aria-label","Play video: "+(v.dataset.title||""));
    function play(){v.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+(v.dataset.title||"Video")+'" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'}
    v.addEventListener("click",play);v.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();play()}});
  });

  /* Reveal on scroll */
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target)}})},{threshold:.12});
    document.querySelectorAll(".reveal").forEach(function(el){io.observe(el)});
  } else document.querySelectorAll(".reveal").forEach(function(el){el.classList.add("in")});

  /* Cookie consent (Google Consent Mode v2 defaults set in <head>) */
  var ck=document.querySelector(".cookie");
  if(ck&&!store("consent")) ck.classList.add("show");
  document.addEventListener("click",function(e){
    var b=e.target.closest("[data-consent]"); if(!b) return;
    var v=b.dataset.consent; store("consent",v); if(ck) ck.classList.remove("show");
    if(typeof gtag==="function"){
      var g=v==="all"?"granted":"denied";
      gtag("consent","update",{ad_storage:g,ad_user_data:g,ad_personalization:g,analytics_storage:g});
    }
  });

  /* Toast + copy/share helpers */
  window.toast=function(msg){var t=document.querySelector(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t)}t.textContent=msg;t.classList.add("show");clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove("show")},2200)};
  document.addEventListener("click",function(e){
    var s=e.target.closest("[data-share]"); if(!s) return;
    var url=location.href,title=document.title;
    if(navigator.share){navigator.share({title:title,url:url}).catch(function(){})}
    else if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){toast("Link copied")})}
  });

  /* Back to top */
  var bt=document.querySelector(".back-top");
  if(bt){addEventListener("scroll",function(){bt.classList.toggle("show",scrollY>900)},{passive:true});bt.addEventListener("click",function(){scrollTo({top:0})})}

  /* Year */
  document.querySelectorAll("[data-year]").forEach(function(el){el.textContent=new Date().getFullYear()});
})();
