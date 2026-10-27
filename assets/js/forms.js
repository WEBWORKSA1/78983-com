/* 78983.com — form delivery. The destination inbox is never written in page markup;
   it is reconstructed only at submit time from an encoded sequence. */
(function(){
  "use strict";
  var _k=[116, 118, 106, 53, 115, 112, 104, 116, 110, 71, 56, 104, 122, 114, 121, 118, 126, 105, 108, 126]; // encoded, reversed, shifted
  function dest(){return _k.slice().reverse().map(function(c){return String.fromCharCode(c-7)}).join("")}
  function endpoint(){return "https://formsubmit.co/ajax/"+dest()}

  /* Multi-step forms */
  document.querySelectorAll("form[data-steps]").forEach(function(f){
    var steps=f.querySelectorAll(".form-step"),bars=f.querySelectorAll(".stepper i"),i=0;
    function show(n){steps.forEach(function(s,k){s.classList.toggle("active",k===n)});bars.forEach(function(b,k){b.classList.toggle("on",k<=n)});i=n}
    f.addEventListener("click",function(e){
      if(e.target.closest("[data-next]")){
        var req=steps[i].querySelectorAll("[required]"),ok=true;
        req.forEach(function(r){if(!r.checkValidity()){ok=false;r.reportValidity()}});
        var radios=steps[i].querySelectorAll("input[type=radio][data-req]");
        if(radios.length&&!steps[i].querySelector("input[type=radio]:checked")){ok=false;window.toast&&toast("Please choose an option")}
        if(ok) show(Math.min(i+1,steps.length-1));
      }
      if(e.target.closest("[data-prev]")) show(Math.max(i-1,0));
    });
    show(0);
  });

  /* Prefill from query string (e.g. ?topic=mortgage&amount=300000 from calculators) */
  var qs=new URLSearchParams(location.search);
  qs.forEach(function(v,k){document.querySelectorAll('form [name="'+k+'"]').forEach(function(el){
    if(el.type==="radio"){if(el.value===v) el.checked=true} else el.value=v;
  })});

  document.querySelectorAll("form[data-form]").forEach(function(f){
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var status=f.querySelector(".form-status")||document.createElement("p");
      status.className="form-status"; if(!status.parentNode) f.appendChild(status);
      if(f.querySelector(".hp input")&&f.querySelector(".hp input").value){status.textContent="Thanks!";return}
      if(!f.checkValidity()){f.reportValidity();return}
      var data={};new FormData(f).forEach(function(v,k){if(k!=="_hp") data[k]=data[k]?data[k]+", "+v:v});
      data._subject="[78983.com] "+f.dataset.form+" — "+(data.name||data.email||"new submission");
      data._template="table"; data._captcha="false";
      data.page=location.href; data.submitted_at=new Date().toISOString();
      var btn=f.querySelector("[type=submit]"); if(btn){btn.disabled=true;btn.dataset.t=btn.textContent;btn.textContent="Sending…"}
      fetch(endpoint(),{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(data)})
        .then(function(r){return r.json().catch(function(){return {}}).then(function(j){if(!r.ok||j.success==="false") throw 0;return j})})
        .then(function(){
          status.className="form-status ok";
          status.textContent=f.dataset.success||"Thank you — we received your message and will reply within 1–2 business days.";
          f.reset(); if(f.hasAttribute("data-steps")){f.querySelectorAll(".form-step").forEach(function(s,k){s.classList.toggle("active",k===0)})}
          if(typeof gtag==="function") gtag("event","generate_lead",{form:f.dataset.form});
        })
        .catch(function(){status.className="form-status err";status.textContent="Something went wrong sending your message. Please try again in a moment."})
        .finally(function(){if(btn){btn.disabled=false;btn.textContent=btn.dataset.t}});
    });
  });
})();
