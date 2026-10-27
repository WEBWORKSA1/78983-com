/* 78983.com — Number Explorer: mathematical facts + cultural notes for any whole number */
(function(){
  "use strict";
  var host=document.getElementById("explorer");if(!host)return;
  var CULT={
    "0":"Zero — completeness and potential; in many traditions a symbol of the infinite.",
    "1":"One — beginnings and leadership; in Chinese, 一 (yī) represents unity.",
    "2":"Two — pairs and harmony; 'good things come in pairs' is a common Chinese saying.",
    "3":"Three — in Cantonese, 三 (saam) sounds like 生 (saang), 'life/growth'.",
    "4":"Four — avoided in parts of East Asia because 四 (sì) sounds like the word for 'death'.",
    "5":"Five — the five elements (wood, fire, earth, metal, water) in Chinese philosophy.",
    "6":"Six — 六 (liù) sounds like 溜 'smooth'; 66 suggests things going smoothly.",
    "7":"Seven — widely seen as lucky in Western culture (seven days, seven wonders).",
    "8":"Eight — 八 (bā) sounds like 發 (fā), 'prosper'; the most sought-after digit in Chinese commerce.",
    "9":"Nine — 九 (jiǔ) sounds like 久, 'long-lasting'; historically associated with the emperor."
  };
  var ROM=[[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  function roman(n){if(n<1||n>3999)return "n/a (1–3999)";var s="";ROM.forEach(function(r){while(n>=r[0]){s+=r[1];n-=r[0]}});return s}
  function factors(n){var f=[],m=n;for(var p=2;p*p<=m;p++){while(m%p===0){f.push(p);m/=p}}if(m>1)f.push(m);return f}
  function divisors(n){var d=[];for(var i=1;i*i<=n;i++){if(n%i===0){d.push(i);if(i!==n/i)d.push(n/i)}}return d.sort(function(a,b){return a-b})}
  function words(n){var a=["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],t=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
    function h(x){var s="";if(x>=100){s+=a[Math.floor(x/100)]+" hundred";x%=100;if(x)s+=" "}if(x>=20){s+=t[Math.floor(x/10)];if(x%10)s+="-"+a[x%10]}else if(x)s+=a[x];return s}
    if(n===0)return "zero";var u=[[1e9,"billion"],[1e6,"million"],[1e3,"thousand"]],s="";u.forEach(function(q){if(n>=q[0]){s+=h(Math.floor(n/q[0]))+" "+q[1]+" ";n%=q[0]}});return (s+h(n)).trim()}
  function render(raw){
    var n=parseInt(String(raw).replace(/\D/g,""),10);if(!isFinite(n)||n<0||n>999999999999){host.querySelector(".out").innerHTML='<p>Enter a whole number from 0 to 999,999,999,999.</p>';return}
    var s=String(n),ds=s.split(""),sum=ds.reduce(function(a,b){return a+ +b},0),root=n===0?0:1+(n-1)%9,f=n>1&&n<1e12?factors(n):[],prime=f.length===1,
      dv=n>0&&n<=1e9?divisors(n):null,pal=s===ds.slice().reverse().join(""),asc=ds.every(function(d,i){return i===0||+d===+ds[i-1]+1});
    var counts={};ds.forEach(function(d){counts[d]=(counts[d]||0)+1});
    var dig=ds.map(function(d){return '<div class="digit" title="'+CULT[d]+'">'+d+'</div>'}).join("");
    var cult=Object.keys(counts).sort().map(function(d){return '<li><b>'+d+(counts[d]>1?" ×"+counts[d]:"")+':</b> '+CULT[d]+'</li>'}).join("");
    host.querySelector(".out").innerHTML=
      '<div class="big-number">'+n.toLocaleString("en-US")+'</div><div class="digits">'+dig+'</div>'+
      '<div class="kv">'+
      '<div><span>In words</span><b>'+words(n)+'</b></div>'+
      '<div><span>Prime?</span><b>'+(n<2?"No":prime?"Yes — prime":"No")+'</b></div>'+
      '<div><span>Prime factorization</span><b>'+(f.length?f.join(" × "):"—")+'</b></div>'+
      '<div><span>Number of divisors</span><b>'+(dv?dv.length:"(too large)")+'</b></div>'+
      '<div><span>Digit sum / digital root</span><b>'+sum+' / '+root+'</b></div>'+
      '<div><span>Even or odd</span><b>'+(n%2?"Odd":"Even")+'</b></div>'+
      '<div><span>Binary</span><b>'+n.toString(2)+'</b></div>'+
      '<div><span>Hexadecimal</span><b>'+n.toString(16).toUpperCase()+'</b></div>'+
      '<div><span>Octal</span><b>'+n.toString(8)+'</b></div>'+
      '<div><span>Roman numeral</span><b>'+roman(n)+'</b></div>'+
      '<div><span>Square / square root</span><b>'+(n<1e7?(n*n).toLocaleString("en-US"):"large")+' / '+Math.sqrt(n).toFixed(4)+'</b></div>'+
      '<div><span>Patterns</span><b>'+[pal?"Palindrome":"",asc&&s.length>2?"Ascending run":"",Object.keys(counts).length===1&&s.length>1?"Repdigit":""].filter(Boolean).join(", ")+(pal||asc||Object.keys(counts).length===1?"":"None notable")+'</b></div>'+
      '</div>'+(dv&&dv.length<=48?'<p style="margin-top:14px"><b>Divisors:</b> '+dv.join(", ")+'</p>':"")+
      '<h3 style="margin-top:22px">Cultural notes on these digits</h3><ul>'+cult+'</ul>'+
      '<p class="callout">Cultural associations are shared as folklore and linguistics for interest only. Numbers do not predict outcomes — make financial decisions with real data.</p>';
    try{history.replaceState(null,"","?n="+n)}catch(e){}
  }
  var input=host.querySelector("input");
  host.querySelector("form").addEventListener("submit",function(e){e.preventDefault();render(input.value)});
  host.addEventListener("click",function(e){var b=e.target.closest("[data-n]");if(b){input.value=b.dataset.n;render(b.dataset.n)}});
  var q=new URLSearchParams(location.search).get("n");input.value=q||"78983";render(input.value);
})();
