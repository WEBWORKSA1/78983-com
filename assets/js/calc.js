/* 78983.com — calculator engine (no dependencies). Results are estimates for education only. */
(function(){
  "use strict";
  var BASE=(document.querySelector('meta[name="site-base"]')||{}).content||"./";
  var CUR={USD:"en-US",CAD:"en-CA",INR:"en-IN",EUR:"de-DE",GBP:"en-GB",AUD:"en-AU"};
  function getCur(){try{return localStorage.getItem("cur")||"USD"}catch(e){return "USD"}}
  function money(v,dp){var c=getCur();if(!isFinite(v))return "—";return new Intl.NumberFormat(CUR[c]||"en-US",{style:"currency",currency:c,maximumFractionDigits:dp===undefined?0:dp}).format(v)}
  function num(v,dp){if(!isFinite(v))return "—";return new Intl.NumberFormat("en-US",{maximumFractionDigits:dp===undefined?2:dp}).format(v)}
  function pct(v,dp){return isFinite(v)?num(v,dp===undefined?2:dp)+"%":"—"}
  function months(m){if(!isFinite(m))return "Never";var y=Math.floor(m/12),r=Math.round(m%12);return (y?y+" yr ":"")+(r?r+" mo":"")||"0 mo"}
  function pmt(r,n,p){return r===0?p/n:p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)}
  var C1="#0f9f6e",C2="#e6a400",C3="#3b5bfd";

  var DEFS={
    "compound-interest":{topic:"investing",inputs:[
      {id:"p",label:"Initial deposit",min:0,max:1000000,step:500,v:10000,money:1},
      {id:"m",label:"Monthly contribution",min:0,max:20000,step:50,v:500,money:1},
      {id:"r",label:"Annual return (%)",min:0,max:20,step:0.1,v:7},
      {id:"y",label:"Years",min:1,max:50,step:1,v:20},
      {id:"f",label:"Compounding",type:"select",options:[["12","Monthly"],["4","Quarterly"],["1","Yearly"],["365","Daily"]],v:"12"}],
      calc:function(x){var f=+x.f,i=x.r/100,bal=x.p,contrib=x.p,lab=[],b=[],c=[],rows=[];
        var mr=Math.pow(1+i/f,f/12)-1;
        for(var mo=1;mo<=x.y*12;mo++){bal=bal*(1+mr)+x.m;contrib+=x.m;if(mo%12===0){lab.push("Y"+mo/12);b.push(bal);c.push(contrib);rows.push([mo/12,money(contrib),money(bal-contrib),money(bal)])}}
        return {results:[["Future value",money(bal),1],["Total contributed",money(contrib)],["Interest earned",money(bal-contrib)],["Growth multiple",num(bal/Math.max(contrib,1),2)+"×"]],
          chart:{type:"line",labels:lab,series:[{name:"Balance",data:b,color:C1},{name:"Contributions",data:c,color:C2}]},
          table:{head:["Year","Contributed","Interest","Balance"],rows:rows}}}},

    "loan-emi":{topic:"loans",inputs:[
      {id:"a",label:"Loan amount",min:1000,max:5000000,step:1000,v:50000,money:1},
      {id:"r",label:"Interest rate (% per year)",min:0,max:36,step:0.05,v:9.5},
      {id:"y",label:"Tenure (years)",min:1,max:30,step:1,v:5}],
      calc:function(x){var r=x.r/1200,n=x.y*12,e=pmt(r,n,x.a),bal=x.a,lab=[],pp=[],ii=[],rows=[],yp=0,yi=0;
        for(var m=1;m<=n;m++){var it=bal*r,pr=e-it;bal-=pr;yp+=pr;yi+=it;if(m%12===0||m===n){lab.push("Y"+Math.ceil(m/12));pp.push(yp);ii.push(yi);rows.push([Math.ceil(m/12),money(yp),money(yi),money(Math.max(bal,0))]);yp=0;yi=0}}
        return {results:[["Monthly EMI",money(e,2),1],["Total interest",money(e*n-x.a)],["Total payable",money(e*n)],["Interest share",pct((e*n-x.a)/(e*n)*100,1)]],
          chart:{type:"bar",stacked:1,labels:lab,series:[{name:"Principal",data:pp,color:C1},{name:"Interest",data:ii,color:C2}]},
          table:{head:["Year","Principal paid","Interest paid","Balance"],rows:rows}}}},

    "mortgage":{topic:"mortgage",inputs:[
      {id:"h",label:"Home price",min:20000,max:5000000,step:5000,v:450000,money:1},
      {id:"d",label:"Down payment (%)",min:0,max:80,step:1,v:20},
      {id:"r",label:"Interest rate (%)",min:0,max:15,step:0.05,v:6.25},
      {id:"y",label:"Amortization (years)",min:5,max:35,step:1,v:25},
      {id:"t",label:"Property tax (% per year)",min:0,max:4,step:0.05,v:1},
      {id:"i",label:"Home insurance (per year)",min:0,max:10000,step:50,v:1500,money:1}],
      calc:function(x){var loan=x.h*(1-x.d/100),r=x.r/1200,n=x.y*12,pi=pmt(r,n,loan),tax=x.h*x.t/1200,ins=x.i/12,tot=pi+tax+ins,bal=loan,lab=[],bb=[],rows=[],yp=0,yi=0;
        for(var m=1;m<=n;m++){var it=bal*r,pr=pi-it;bal-=pr;yp+=pr;yi+=it;if(m%12===0){lab.push("Y"+m/12);bb.push(Math.max(bal,0));rows.push([m/12,money(yp),money(yi),money(Math.max(bal,0))]);yp=0;yi=0}}
        return {results:[["Monthly payment",money(tot,2),1],["Principal & interest",money(pi,2)],["Loan amount",money(loan)],["Total interest",money(pi*n-loan)],["Tax + insurance / mo",money(tax+ins,2)]],
          chart:{type:"line",labels:lab,series:[{name:"Remaining balance",data:bb,color:C3}]},
          table:{head:["Year","Principal","Interest","Balance"],rows:rows}}}},

    "retirement":{topic:"retirement",inputs:[
      {id:"a",label:"Current age",min:18,max:75,step:1,v:32},
      {id:"ra",label:"Retirement age",min:40,max:80,step:1,v:62},
      {id:"s",label:"Current savings",min:0,max:5000000,step:1000,v:40000,money:1},
      {id:"m",label:"Monthly contribution",min:0,max:20000,step:50,v:800,money:1},
      {id:"r",label:"Expected return (%)",min:0,max:12,step:0.1,v:6.5},
      {id:"inf",label:"Inflation (%)",min:0,max:10,step:0.1,v:2.5},
      {id:"w",label:"Withdrawal rate (%)",min:2,max:7,step:0.1,v:4}],
      calc:function(x){var yrs=Math.max(x.ra-x.a,0),mr=Math.pow(1+x.r/100,1/12)-1,b=x.s,lab=[],nom=[],real=[];
        for(var mo=1;mo<=yrs*12;mo++){b=b*(1+mr)+x.m;if(mo%12===0){lab.push(x.a+mo/12);nom.push(b);real.push(b/Math.pow(1+x.inf/100,mo/12))}}
        var rb=b/Math.pow(1+x.inf/100,yrs);
        return {results:[["Nest egg at "+x.ra,money(b),1],["In today's money",money(rb)],["Sustainable income / mo (today's $)",money(rb*x.w/1200)],["Years of saving",yrs]],
          chart:{type:"line",labels:lab,series:[{name:"Nominal",data:nom,color:C1},{name:"Inflation-adjusted",data:real,color:C2}]}}}},

    "savings-goal":{topic:"savings",inputs:[
      {id:"g",label:"Savings goal",min:500,max:2000000,step:500,v:30000,money:1},
      {id:"c",label:"Already saved",min:0,max:1000000,step:500,v:2000,money:1},
      {id:"y",label:"Years to goal",min:0.5,max:40,step:0.5,v:3},
      {id:"r",label:"Annual return (%)",min:0,max:12,step:0.1,v:4}],
      calc:function(x){var n=Math.round(x.y*12),r=x.r/1200,fvC=x.c*Math.pow(1+r,n),need=Math.max(x.g-fvC,0),m=r===0?need/n:need*r/(Math.pow(1+r,n)-1),b=x.c,lab=[],d=[],gl=[];
        for(var i=1;i<=n;i++){b=b*(1+r)+m;if(i%Math.max(1,Math.round(n/24))===0||i===n){lab.push("M"+i);d.push(b);gl.push(x.g)}}
        return {results:[["Save per month",money(m,2),1],["Save per week",money(m*12/52,2)],["Total you deposit",money(m*n+x.c)],["Growth earned",money(x.g-m*n-x.c)]],
          chart:{type:"line",labels:lab,series:[{name:"Projected balance",data:d,color:C1},{name:"Goal",data:gl,color:C2}]}}}},

    "inflation":{topic:"investing",inputs:[
      {id:"a",label:"Amount today",min:1,max:1000000,step:10,v:1000,money:1},
      {id:"r",label:"Average inflation (%)",min:0,max:20,step:0.1,v:3},
      {id:"y",label:"Years",min:1,max:50,step:1,v:15}],
      calc:function(x){var lab=[],f=[],p=[];for(var i=1;i<=x.y;i++){lab.push("Y"+i);f.push(x.a*Math.pow(1+x.r/100,i));p.push(x.a/Math.pow(1+x.r/100,i))}
        var fut=x.a*Math.pow(1+x.r/100,x.y),pp=x.a/Math.pow(1+x.r/100,x.y);
        return {results:[["Future cost of the same basket",money(fut),1],["Purchasing power of today's amount",money(pp)],["Value lost",pct((1-pp/x.a)*100,1)],["Years for prices to double",num(Math.log(2)/Math.log(1+x.r/100),1)]],
          chart:{type:"line",labels:lab,series:[{name:"Future cost",data:f,color:C2},{name:"Purchasing power",data:p,color:C1}]}}}},

    "roi":{topic:"investing",inputs:[
      {id:"i",label:"Amount invested",min:1,max:10000000,step:100,v:20000,money:1},
      {id:"f",label:"Final value",min:0,max:20000000,step:100,v:34500,money:1},
      {id:"y",label:"Holding period (years)",min:0.1,max:50,step:0.1,v:4}],
      calc:function(x){var g=x.f-x.i,roi=g/x.i*100,cagr=(Math.pow(x.f/x.i,1/x.y)-1)*100;
        return {results:[["Total ROI",pct(roi,2),1],["Annualized (CAGR)",pct(cagr,2)],["Net gain",money(g)],["Multiple",num(x.f/x.i,2)+"×"]],
          chart:{type:"bar",labels:["Invested","Final value"],series:[{name:"Value",data:[x.i,x.f],color:C1}]}}}},

    "debt-payoff":{topic:"debt",inputs:[
      {id:"b",label:"Debt balance",min:100,max:500000,step:100,v:8500,money:1},
      {id:"r",label:"APR (%)",min:0,max:40,step:0.1,v:21.9},
      {id:"p",label:"Monthly payment",min:10,max:20000,step:10,v:300,money:1},
      {id:"e",label:"Extra payment per month",min:0,max:5000,step:10,v:100,money:1}],
      calc:function(x){function run(pay){var b=x.b,r=x.r/1200,m=0,int=0,s=[];if(pay<=b*r)return {m:Infinity,i:Infinity,s:[]};while(b>0.005&&m<1200){var it=b*r;int+=it;b=b+it-pay;m++;if(m%3===0||b<=0)s.push(Math.max(b,0))}return {m:m,i:int,s:s}}
        var a=run(x.p),c=run(x.p+x.e),len=Math.max(a.s.length,c.s.length),lab=[];for(var k=0;k<len;k++)lab.push("Q"+(k+1));
        return {results:[["Debt-free in",months(a.m),1],["Interest paid",money(a.i)],["With extra payment",months(c.m)],["Interest saved",isFinite(a.i)?money(a.i-c.i):"—"]],
          note:!isFinite(a.m)?"Your payment does not cover the monthly interest — the balance will never shrink. Increase the payment.":"",
          chart:{type:"line",labels:lab,series:[{name:"Current plan",data:a.s,color:C2},{name:"With extra",data:c.s,color:C1}]}}}},

    "startup-runway":{topic:"business",inputs:[
      {id:"c",label:"Cash in bank",min:0,max:20000000,step:1000,v:250000,money:1},
      {id:"rev",label:"Monthly revenue",min:0,max:2000000,step:500,v:12000,money:1},
      {id:"g",label:"Revenue growth (% / month)",min:-20,max:50,step:0.5,v:8},
      {id:"ex",label:"Monthly expenses",min:0,max:2000000,step:500,v:38000,money:1},
      {id:"eg",label:"Expense growth (% / month)",min:-10,max:20,step:0.5,v:2}],
      calc:function(x){var c=x.c,r=x.rev,e=x.ex,m=0,lab=[],cash=[],burn=[],be=null;
        while(c>0&&m<60){m++;c+=r-e;if(be===null&&r>=e)be=m;lab.push("M"+m);cash.push(Math.max(c,0));burn.push(e-r);r*=1+x.g/100;e*=1+x.eg/100}
        var out=c>0?"60+ months":months(m);
        return {results:[["Runway",out,1],["Current net burn / mo",money(x.ex-x.rev)],["Break-even month",be?("Month "+be):"Not within runway"],["Simple runway (flat)",x.ex>x.rev?months(x.c/(x.ex-x.rev)):"Profitable"]],
          chart:{type:"line",labels:lab,series:[{name:"Cash balance",data:cash,color:C1},{name:"Net burn",data:burn,color:C2}]}}}},

    "ai-cost":{topic:"ai",inputs:[
      {id:"q",label:"Requests per day",min:1,max:1000000,step:10,v:2000},
      {id:"it",label:"Input tokens per request",min:10,max:200000,step:10,v:1200},
      {id:"ot",label:"Output tokens per request",min:10,max:32000,step:10,v:400},
      {id:"pi",label:"Price per 1M input tokens",min:0,max:100,step:0.01,v:3,money:1,dp:2},
      {id:"po",label:"Price per 1M output tokens",min:0,max:200,step:0.01,v:15,money:1,dp:2},
      {id:"cache",label:"Share of input served from cache (%)",min:0,max:95,step:1,v:30},
      {id:"cd",label:"Cache discount (%)",min:0,max:100,step:1,v:90}],
      calc:function(x){var inC=x.it*x.pi/1e6*(1-(x.cache/100)*(x.cd/100)),outC=x.ot*x.po/1e6,per=inC+outC,day=per*x.q;
        return {results:[["Monthly cost (30 days)",money(day*30,2),1],["Cost per request",money(per,5)],["Cost per 1,000 requests",money(per*1000,2)],["Output share of cost",pct(outC/per*100,1)]],
          chart:{type:"bar",stacked:1,labels:["Per 1,000 requests"],series:[{name:"Input",data:[inC*1000],color:C1},{name:"Output",data:[outC*1000],color:C2}]}}}},

    "freelance-rate":{topic:"business",inputs:[
      {id:"inc",label:"Target take-home income / year",min:10000,max:1000000,step:1000,v:90000,money:1},
      {id:"exp",label:"Business expenses / year",min:0,max:300000,step:500,v:9000,money:1},
      {id:"tax",label:"Effective tax rate (%)",min:0,max:60,step:1,v:28},
      {id:"h",label:"Billable hours / week",min:5,max:60,step:1,v:25},
      {id:"w",label:"Weeks off / year",min:0,max:20,step:1,v:6}],
      calc:function(x){var gross=(x.inc/(1-x.tax/100))+x.exp,hrs=x.h*(52-x.w),rate=gross/hrs;
        return {results:[["Minimum hourly rate",money(rate,2),1],["Day rate (8h)",money(rate*8)],["Gross revenue needed",money(gross)],["Billable hours / year",num(hrs,0)]],
          chart:{type:"bar",stacked:1,labels:["Revenue breakdown"],series:[{name:"Take-home",data:[x.inc],color:C1},{name:"Tax",data:[gross-x.exp-x.inc],color:C2},{name:"Expenses",data:[x.exp],color:C3}]}}}},

    "percentage":{topic:"general",inputs:[
      {id:"mode",label:"Calculation",type:"select",options:[["of","What is A% of B?"],["is","A is what % of B?"],["chg","% change from A to B"]],v:"chg"},
      {id:"a",label:"A",min:-1000000,max:1000000,step:0.01,v:80,free:1},
      {id:"b",label:"B",min:-1000000,max:1000000,step:0.01,v:98,free:1}],
      calc:function(x){var r,l;if(x.mode==="of"){r=x.a/100*x.b;l=num(x.a)+"% of "+num(x.b)}else if(x.mode==="is"){r=x.a/x.b*100;l=num(x.a)+" is this % of "+num(x.b)}else{r=(x.b-x.a)/Math.abs(x.a)*100;l="Change from "+num(x.a)+" to "+num(x.b)}
        return {results:[[l,x.mode==="of"?num(r,4):pct(r,3),1],["Difference (B − A)",num(x.b-x.a,4)],["Ratio B / A",num(x.b/x.a,4)]]}}}
  };

  /* --- Tiny canvas chart --- */
  function draw(cv,ch){
    var dpr=window.devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight;cv.width=w*dpr;cv.height=h*dpr;
    var g=cv.getContext("2d");g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,w,h);
    var css=getComputedStyle(document.documentElement),ink=css.getPropertyValue("--muted").trim()||"#888",line=css.getPropertyValue("--line").trim()||"#ddd";
    var L=64,R=12,T=30,B=28,pw=w-L-R,ph=h-T-B,n=ch.labels.length;if(!n)return;
    var max=0,min=0;
    if(ch.stacked){for(var i=0;i<n;i++){var s=0;ch.series.forEach(function(se){s+=se.data[i]||0});max=Math.max(max,s)}}
    else ch.series.forEach(function(se){se.data.forEach(function(v){max=Math.max(max,v);min=Math.min(min,v)})});
    if(max===min)max=min+1;var span=max-min;
    function Y(v){return T+ph-(v-min)/span*ph}
    g.font="11px Inter,system-ui,sans-serif";g.fillStyle=ink;g.strokeStyle=line;g.lineWidth=1;
    for(var k=0;k<=4;k++){var v=min+span*k/4,y=Y(v);g.beginPath();g.moveTo(L,y);g.lineTo(w-R,y);g.stroke();g.textAlign="right";g.fillText(short(v),L-8,y+4)}
    var step=Math.ceil(n/8);g.textAlign="center";
    ch.labels.forEach(function(lb,i){if(i%step===0||i===n-1){var x=ch.type==="bar"?L+pw*(i+.5)/n:L+(n===1?pw/2:pw*i/(n-1));g.fillText(lb,x,h-8)}});
    if(ch.type==="bar"){var bw=pw/n*.6,sc=ch.stacked?1:ch.series.length;
      for(var i2=0;i2<n;i2++){var base=0;ch.series.forEach(function(se,si){var v=se.data[i2]||0,x=L+pw*i2/n+pw/n*.2;g.fillStyle=se.color;
        if(ch.stacked){g.fillRect(x,Y(base+v),bw,Y(base)-Y(base+v));base+=v}else{var ww=bw/sc;g.fillRect(x+ww*si,Y(Math.max(v,0)),ww-2,Math.abs(Y(v)-Y(0)))}})}}
    else ch.series.forEach(function(se){g.strokeStyle=se.color;g.lineWidth=2.5;g.beginPath();se.data.forEach(function(v,i){var x=L+(n===1?pw/2:pw*i/(n-1));i?g.lineTo(x,Y(v)):g.moveTo(x,Y(v))});g.stroke()});
    var lx=L;ch.series.forEach(function(se){g.fillStyle=se.color;g.fillRect(lx,8,12,12);g.fillStyle=ink;g.textAlign="left";g.fillText(se.name,lx+16,18);lx+=g.measureText(se.name).width+36});
  }
  function short(v){var a=Math.abs(v);return a>=1e9?(v/1e9).toFixed(1)+"B":a>=1e6?(v/1e6).toFixed(1)+"M":a>=1e3?(v/1e3).toFixed(1)+"k":(Math.round(v*100)/100)+""}

  /* --- Mount --- */
  document.querySelectorAll("[data-calc]").forEach(function(host){
    var key=host.dataset.calc,D=DEFS[key];if(!D)return;
    var qs=new URLSearchParams(location.search);
    var form='<div class="panel"><div class="field"><label for="cur">Currency</label><select id="cur">'+Object.keys(CUR).map(function(c){return '<option'+(c===getCur()?" selected":"")+'>'+c+'</option>'}).join("")+'</select></div>';
    D.inputs.forEach(function(f){
      var v=qs.has(f.id)?qs.get(f.id):f.v;
      if(f.type==="select"){form+='<div class="field"><label for="i-'+f.id+'">'+f.label+'</label><select id="i-'+f.id+'" data-k="'+f.id+'">'+f.options.map(function(o){return '<option value="'+o[0]+'"'+(o[0]==v?" selected":"")+'>'+o[1]+'</option>'}).join("")+'</select></div>'}
      else form+='<div class="field"><label for="i-'+f.id+'">'+f.label+'</label><input type="number" inputmode="decimal" id="i-'+f.id+'" data-k="'+f.id+'" value="'+v+'" step="'+f.step+'"'+(f.free?"":' min="'+f.min+'"')+'>'+(f.free?"":'<input type="range" aria-label="'+f.label+' slider" data-r="'+f.id+'" min="'+f.min+'" max="'+f.max+'" step="'+f.step+'" value="'+v+'">')+'</div>';
    });
    form+='<button class="btn btn-ghost btn-sm" type="button" data-reset>Reset to defaults</button></div>';
    host.innerHTML='<div class="calc">'+form+'<div class="panel" aria-live="polite"><div class="results"></div><p class="calc-note" style="color:var(--danger);font-weight:600"></p><div class="chart-box"><canvas role="img" aria-label="Chart of results"></canvas></div><div class="tbl"></div>'+
      '<div class="calc-actions"><button class="btn btn-ghost btn-sm" type="button" data-share>Share these results</button><button class="btn btn-ghost btn-sm" type="button" data-csv>Download CSV</button><button class="btn btn-ghost btn-sm" type="button" onclick="window.print()">Print</button>'+
      '<a class="btn btn-primary btn-sm" data-pro href="'+BASE+'get-matched.html?topic='+D.topic+'">Get a free expert review →</a></div></div></div>';
    var last;
    function vals(){var o={};host.querySelectorAll("[data-k]").forEach(function(el){o[el.dataset.k]=el.tagName==="SELECT"?el.value:parseFloat(el.value)||0});return o}
    function run(){
      var x=vals(),r=D.calc(x);last=r;
      host.querySelector(".results").innerHTML=r.results.map(function(a){return '<div class="result'+(a[2]?" primary":"")+'"><span>'+a[0]+'</span><b>'+a[1]+'</b></div>'}).join("");
      host.querySelector(".calc-note").textContent=r.note||"";
      var box=host.querySelector(".chart-box");box.style.display=r.chart?"":"none";if(r.chart)draw(box.querySelector("canvas"),r.chart);
      host.querySelector(".tbl").innerHTML=r.table?'<details><summary>Show '+r.table.head[0].toLowerCase()+'-by-'+r.table.head[0].toLowerCase()+' schedule</summary><div class="table-wrap"><table><thead><tr>'+r.table.head.map(function(h){return "<th>"+h+"</th>"}).join("")+'</tr></thead><tbody>'+r.table.rows.map(function(rw){return "<tr>"+rw.map(function(c){return "<td>"+c+"</td>"}).join("")+"</tr>"}).join("")+'</tbody></table></div></details>':"";
      var p=new URLSearchParams();Object.keys(x).forEach(function(k){p.set(k,x[k])});history.replaceState(null,"","?"+p.toString());
      var pro=host.querySelector("[data-pro]");pro.href=BASE+"get-matched.html?topic="+D.topic+"&source="+key;
    }
    host.addEventListener("input",function(e){
      var t=e.target;if(t.dataset.r){host.querySelector('[data-k="'+t.dataset.r+'"]').value=t.value}
      if(t.dataset.k&&t.type==="number"){var s=host.querySelector('[data-r="'+t.dataset.k+'"]');if(s)s.value=t.value}
      if(t.id==="cur"){try{localStorage.setItem("cur",t.value)}catch(_){}}
      run();
    });
    host.addEventListener("change",function(e){if(e.target.id==="cur"||e.target.tagName==="SELECT")run()});
    host.addEventListener("click",function(e){
      if(e.target.closest("[data-reset]")){D.inputs.forEach(function(f){var el=host.querySelector('[data-k="'+f.id+'"]');el.value=f.v;var s=host.querySelector('[data-r="'+f.id+'"]');if(s)s.value=f.v});run()}
      if(e.target.closest("[data-csv]")&&last){var lines=[["Metric","Value"]].concat(last.results.map(function(a){return [a[0],a[1]]}));if(last.table){lines.push([]);lines.push(last.table.head);lines=lines.concat(last.table.rows)}
        var csv=lines.map(function(r){return r.map(function(c){return '"'+String(c).replace(/"/g,'""')+'"'}).join(",")}).join("\n");
        var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="78983-"+key+".csv";a.click()}
    });
    var rt;addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(run,150)});
    run();
  });
})();
