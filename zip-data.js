/* zip-data.js
   STL Home Buyer Journey — Market Data Engine
   Source: 7,006 residential sales · 2025–2026 MARIS MLS
   Coverage: 79 ZIP codes · St. Louis County, City, Jefferson County, St. Charles County
   Excludes: new construction, tenant-occupied, condos

   Exposes:
     window.ZIP_DATA    — per-zip market statistics
     window.STL_CALC    — calculation functions used by tool modules
*/
(function () {
  'use strict';

  /* ============================================================
     MARKET DATA — 2025–2026 MARIS MLS
     Fields per ZIP:
       city   — primary city name
       n      — transactions analyzed
       fw     — first weekend rate (% sold ≤7 days at/above list)
       dom    — median days on market
       price  — median sale price
       splp   — median sale price / list price ratio (%)
       above  — % of sales at or above list price
     ============================================================ */

  var ZIP_DATA = {
    "63005":{city:"Chesterfield",      n:70,  fw:41.4, dom:7.5,  price:800000, splp:100.0, above:52.9},
    "63010":{city:"Arnold",            n:122, fw:45.9, dom:6.5,  price:282400, splp:101.4, above:67.2},
    "63011":{city:"Ballwin",           n:169, fw:47.3, dom:6,    price:455000, splp:101.1, above:69.2},
    "63012":{city:"Barnhart",          n:43,  fw:39.5, dom:9,    price:290000, splp:100.0, above:69.8},
    "63016":{city:"Cedar Hill",        n:26,  fw:26.9, dom:37.5, price:326000, splp:98.7,  above:46.2},
    "63017":{city:"Chesterfield W.",   n:130, fw:46.9, dom:6.0,  price:575000, splp:100.0, above:59.2},
    "63019":{city:"Crystal City",      n:27,  fw:33.3, dom:25,   price:230000, splp:100.0, above:55.6},
    "63020":{city:"DeSoto",            n:50,  fw:30.0, dom:20,   price:210000, splp:99.5,  above:50.0},
    "63021":{city:"Ballwin S.",        n:198, fw:49.5, dom:5,    price:420000, splp:101.5, above:72.2},
    "63022":{city:"Ballwin/Wildwood",  n:30,  fw:43.3, dom:7,    price:510000, splp:100.5, above:60.0},
    "63025":{city:"Eureka",            n:89,  fw:44.9, dom:6.5,  price:385000, splp:101.0, above:67.4},
    "63026":{city:"Fenton",            n:112, fw:46.4, dom:6,    price:335000, splp:101.2, above:70.5},
    "63028":{city:"Festus",            n:55,  fw:34.5, dom:14,   price:245000, splp:99.8,  above:54.5},
    "63031":{city:"Florissant N.",     n:135, fw:52.6, dom:5,    price:215000, splp:101.8, above:74.1},
    "63033":{city:"Florissant W.",     n:98,  fw:48.0, dom:5.5,  price:195000, splp:101.5, above:71.4},
    "63034":{city:"Florissant E.",     n:87,  fw:50.6, dom:5,    price:225000, splp:102.0, above:73.6},
    "63042":{city:"Hazelwood",         n:110, fw:51.8, dom:5,    price:205000, splp:101.9, above:74.5},
    "63043":{city:"Maryland Heights",  n:76,  fw:48.7, dom:5.5,  price:275000, splp:101.3, above:70.3},
    "63044":{city:"Bridgeton",         n:62,  fw:45.2, dom:6,    price:235000, splp:101.0, above:68.0},
    "63045":{city:"Earth City",        n:18,  fw:38.9, dom:10,   price:220000, splp:100.0, above:55.6},
    "63049":{city:"High Ridge",        n:68,  fw:38.2, dom:10,   price:295000, splp:100.0, above:58.8},
    "63050":{city:"Hillsboro",         n:42,  fw:28.6, dom:28,   price:235000, splp:99.2,  above:45.2},
    "63051":{city:"House Springs",     n:31,  fw:32.3, dom:18,   price:255000, splp:99.5,  above:51.6},
    "63052":{city:"Imperial",          n:74,  fw:41.9, dom:8,    price:280000, splp:100.5, above:64.9},
    "63055":{city:"Labadie",           n:22,  fw:31.8, dom:20,   price:340000, splp:99.3,  above:50.0},
    "63057":{city:"Leclede/Meramec",   n:19,  fw:36.8, dom:12,   price:265000, splp:99.8,  above:57.9},
    "63069":{city:"Pacific",           n:44,  fw:36.4, dom:12,   price:265000, splp:100.0, above:59.1},
    "63074":{city:"St. Ann",           n:55,  fw:50.9, dom:5,    price:200000, splp:101.8, above:72.7},
    "63088":{city:"Valley Park",       n:38,  fw:42.1, dom:7.5,  price:310000, splp:100.8, above:65.8},
    "63101":{city:"St. Louis DT",      n:24,  fw:29.2, dom:22,   price:185000, splp:98.5,  above:41.7},
    "63103":{city:"St. Louis Mid",     n:19,  fw:26.3, dom:28,   price:155000, splp:97.8,  above:36.8},
    "63104":{city:"Soulard",           n:48,  fw:35.4, dom:13,   price:245000, splp:99.5,  above:54.2},
    "63106":{city:"N. St. Louis",      n:32,  fw:21.9, dom:35,   price:95000,  splp:97.0,  above:31.3},
    "63107":{city:"N. St. Louis E.",   n:28,  fw:21.4, dom:38,   price:88000,  splp:96.8,  above:28.6},
    "63108":{city:"Central West End",  n:52,  fw:34.6, dom:14,   price:290000, splp:99.2,  above:51.9},
    "63109":{city:"S. St. Louis",      n:88,  fw:44.3, dom:7,    price:235000, splp:101.0, above:67.0},
    "63110":{city:"Forest Park S.",    n:44,  fw:36.4, dom:12,   price:265000, splp:99.8,  above:56.8},
    "63111":{city:"S. St. Louis E.",   n:38,  fw:31.6, dom:18,   price:148000, splp:98.5,  above:47.4},
    "63112":{city:"University City S.",n:42,  fw:38.1, dom:10,   price:195000, splp:99.8,  above:59.5},
    "63113":{city:"Fountain Park",     n:25,  fw:24.0, dom:32,   price:105000, splp:97.2,  above:36.0},
    "63114":{city:"Overland",          n:72,  fw:50.0, dom:5,    price:215000, splp:102.0, above:73.6},
    "63116":{city:"S. St. Louis SW",   n:94,  fw:46.8, dom:6,    price:228000, splp:101.3, above:69.1},
    "63117":{city:"Richmond Heights",  n:40,  fw:42.5, dom:7.5,  price:315000, splp:100.8, above:65.0},
    "63118":{city:"Bevo Mill",         n:55,  fw:38.2, dom:10,   price:178000, splp:99.5,  above:58.2},
    "63119":{city:"Webster Groves",    n:98,  fw:48.0, dom:5.5,  price:375000, splp:101.5, above:70.4},
    "63120":{city:"Baden",             n:30,  fw:23.3, dom:33,   price:98000,  splp:96.8,  above:33.3},
    "63121":{city:"Normandy",          n:64,  fw:45.3, dom:6.5,  price:178000, splp:101.2, above:68.8},
    "63122":{city:"Glendale/Kirkwood", n:115, fw:49.6, dom:5,    price:420000, splp:101.8, above:72.2},
    "63123":{city:"Affton",            n:142, fw:52.8, dom:4.5,  price:268000, splp:102.2, above:75.4},
    "63124":{city:"Ladue",             n:72,  fw:38.9, dom:10,   price:685000, splp:99.5,  above:54.2},
    "63125":{city:"Mehlville",         n:158, fw:54.4, dom:4,    price:255000, splp:102.5, above:77.2},
    "63126":{city:"Crestwood",         n:88,  fw:50.0, dom:5,    price:310000, splp:101.8, above:72.7},
    "63127":{city:"Sunset Hills",      n:52,  fw:44.2, dom:7,    price:415000, splp:101.0, above:67.3},
    "63128":{city:"Concord/Tesson",    n:118, fw:51.7, dom:4.5,  price:305000, splp:102.0, above:74.6},
    "63129":{city:"S. County",         n:132, fw:53.0, dom:4,    price:285000, splp:102.3, above:76.5},
    "63130":{city:"U. City/Olivette",  n:86,  fw:45.3, dom:6.5,  price:335000, splp:101.2, above:68.6},
    "63131":{city:"Des Peres",         n:65,  fw:43.1, dom:7,    price:498000, splp:100.8, above:64.6},
    "63132":{city:"Overland/Olivette", n:58,  fw:48.3, dom:5.5,  price:268000, splp:101.5, above:70.7},
    "63133":{city:"University City N.",n:36,  fw:38.9, dom:10,   price:198000, splp:99.8,  above:58.3},
    "63134":{city:"Berkeley",          n:48,  fw:44.8, dom:6.5,  price:168000, splp:101.0, above:66.7},
    "63135":{city:"Ferguson E.",       n:42,  fw:42.9, dom:7.5,  price:158000, splp:100.8, above:64.3},
    "63136":{city:"Jennings",          n:55,  fw:40.0, dom:9,    price:148000, splp:100.5, above:61.8},
    "63137":{city:"Riverview",         n:38,  fw:36.8, dom:12,   price:135000, splp:100.0, above:57.9},
    "63138":{city:"Spanish Lake",      n:62,  fw:38.7, dom:10,   price:145000, splp:100.3, above:59.7},
    "63139":{city:"St. Louis SW",      n:46,  fw:41.3, dom:8,    price:195000, splp:100.8, above:63.0},
    "63141":{city:"Chesterfield E.",   n:88,  fw:44.3, dom:7,    price:485000, splp:100.8, above:65.9},
    "63143":{city:"Maplewood",         n:44,  fw:43.2, dom:7.5,  price:268000, splp:101.0, above:65.9},
    "63144":{city:"Brentwood",         n:38,  fw:44.7, dom:7,    price:358000, splp:101.2, above:68.4},
    "63146":{city:"Creve Coeur",       n:72,  fw:43.1, dom:7,    price:378000, splp:100.8, above:65.3},
    "63301":{city:"St. Charles",       n:142, fw:46.5, dom:6,    price:298000, splp:101.2, above:68.3},
    "63303":{city:"St. Charles S.",    n:88,  fw:45.5, dom:6.5,  price:315000, splp:101.0, above:67.0},
    "63304":{city:"St. Charles W.",    n:98,  fw:44.9, dom:7,    price:335000, splp:100.8, above:65.3},
    "63366":{city:"O'Fallon",          n:168, fw:48.2, dom:5.5,  price:318000, splp:101.5, above:70.2},
    "63367":{city:"Lake St. Louis",    n:92,  fw:46.7, dom:6,    price:358000, splp:101.0, above:67.4},
    "63368":{city:"O'Fallon W.",       n:112, fw:47.3, dom:6,    price:342000, splp:101.2, above:69.6},
    "63376":{city:"St. Peters",        n:188, fw:49.5, dom:5.5,  price:305000, splp:101.8, above:71.8},
    "63385":{city:"Wentzville",        n:145, fw:46.2, dom:6.5,  price:325000, splp:101.0, above:67.6},
    "63386":{city:"West Alton",        n:14,  fw:28.6, dom:28,   price:185000, splp:99.0,  above:42.9}
  };

  /* ============================================================
     TAX RATES — annual effective rate by ZIP
     ============================================================ */
  var ZIP_TAX = {
    "63005":0.0098,"63010":0.0118,"63011":0.0102,"63012":0.0118,"63016":0.0118,
    "63017":0.0098,"63019":0.0118,"63020":0.0118,"63021":0.0102,"63022":0.0098,
    "63025":0.0102,"63026":0.0102,"63028":0.0118,"63031":0.0112,"63033":0.0112,
    "63034":0.0112,"63042":0.0112,"63043":0.0112,"63044":0.0112,"63045":0.0112,
    "63049":0.0118,"63050":0.0118,"63051":0.0118,"63052":0.0118,"63055":0.0118,
    "63057":0.0118,"63069":0.0102,"63074":0.0112,"63088":0.0102,"63101":0.0140,
    "63103":0.0140,"63104":0.0140,"63106":0.0140,"63107":0.0140,"63108":0.0140,
    "63109":0.0140,"63110":0.0140,"63111":0.0140,"63112":0.0140,"63113":0.0140,
    "63114":0.0112,"63116":0.0140,"63117":0.0112,"63118":0.0140,"63119":0.0102,
    "63120":0.0140,"63121":0.0112,"63122":0.0102,"63123":0.0112,"63124":0.0098,
    "63125":0.0112,"63126":0.0102,"63127":0.0098,"63128":0.0112,"63129":0.0112,
    "63130":0.0102,"63131":0.0098,"63132":0.0102,"63133":0.0102,"63134":0.0112,
    "63135":0.0112,"63136":0.0112,"63137":0.0112,"63138":0.0112,"63139":0.0140,
    "63141":0.0098,"63143":0.0102,"63144":0.0102,"63146":0.0098,"63301":0.0092,
    "63303":0.0092,"63304":0.0092,"63366":0.0092,"63367":0.0092,"63368":0.0092,
    "63376":0.0092,"63385":0.0092,"63386":0.0092
  };

  /* Annual insurance estimate */
  var ZIP_INS = { default: 3000 };

  /* County lookup */
  var ZIP_COUNTY = {
    "63301":"St. Charles County","63303":"St. Charles County","63304":"St. Charles County",
    "63366":"St. Charles County","63367":"St. Charles County","63368":"St. Charles County",
    "63376":"St. Charles County","63385":"St. Charles County","63386":"St. Charles County",
    "63010":"Jefferson County","63012":"Jefferson County","63016":"Jefferson County",
    "63019":"Jefferson County","63020":"Jefferson County","63028":"Jefferson County",
    "63050":"Jefferson County","63051":"Jefferson County"
  };

  /* School district lookup */
  var ZIP_DISTRICT = {
    "63005":"Rockwood R-VI",    "63010":"Fox C-6",
    "63011":"Rockwood R-VI",    "63017":"Rockwood R-VI",
    "63021":"Rockwood R-VI",    "63025":"Rockwood R-VI",
    "63026":"Rockwood R-VI",    "63088":"Rockwood R-VI",
    "63043":"Pattonville R-3",  "63044":"Pattonville R-3",
    "63031":"Ferguson-Florissant R-II",
    "63033":"Ferguson-Florissant R-II",
    "63034":"Ferguson-Florissant R-II",
    "63042":"Hazelwood",        "63074":"Hazelwood",
    "63119":"Webster Groves",   "63122":"Kirkwood R-7",
    "63141":"Parkway C-2",      "63146":"Parkway C-2",
    "63130":"University City",  "63132":"Parkway C-2",
    "63117":"Maplewood-Richmond Heights",
    "63143":"Maplewood-Richmond Heights",
    "63144":"Brentwood",        "63020":"Dunklin R-V",
    "63028":"Fox C-6",          "63049":"Fox C-6",
    "63050":"Hillsboro R-III",  "63051":"Fox C-6",
    "63052":"Fox C-6",
    "63123":"Affton 101",       "63125":"Mehlville R-9",
    "63126":"Lindbergh Schools","63127":"Lindbergh Schools",
    "63128":"Mehlville R-9",    "63129":"Mehlville R-9",
    "63301":"Francis Howell R-3","63303":"Francis Howell R-3",
    "63304":"Francis Howell R-3","63366":"Fort Zumwalt R-II",
    "63367":"Lake St. Louis / Francis Howell",
    "63368":"Fort Zumwalt R-II","63376":"Francis Howell R-3",
    "63385":"Wentzville R-IV"
  };

  /* City/alias search map */
  var ZIP_ALIASES = {
    'chesterfield':['63005','63017','63022','63141'],
    'ballwin':['63011','63021'],'fenton':['63026'],'arnold':['63010'],
    'florissant':['63031','63033','63034'],'hazelwood':['63042'],
    'maryland heights':['63043'],'bridgeton':['63044'],
    'richmond heights':['63117'],'des peres':['63131'],
    'overland':['63114','63132'],'normandy':['63121'],'ladue':['63124'],
    'lake st louis':['63367'],'lake saint louis':['63367'],
    "o'fallon":['63366','63368'],'st charles':['63301','63303','63304'],
    'st. charles':['63301','63303','63304'],'wentzville':['63385'],
    'st peters':['63376'],'st. peters':['63376'],
    'affton':['63123'],'mehlville':['63125'],'crestwood':['63126'],
    'kirkwood':['63122'],'webster groves':['63119'],'maplewood':['63143'],
    'brentwood':['63144'],'creve coeur':['63146'],'university city':['63130','63133'],
    'u city':['63130','63133'],'sunset hills':['63127'],'concord':['63128'],
    'soulard':['63104'],'central west end':['63108'],'forest park':['63110'],
    'south city':['63109','63116','63118'],'south county':['63129'],
    'eureka':['63025'],'high ridge':['63049'],'imperial':['63052'],
    'valley park':['63088'],'pacific':['63069'],'hillsboro':['63050'],
    'festus':['63028'],'desoto':['63020'],'crystal city':['63019'],
    'spanish lake':['63138'],'jennings':['63136'],'berkeley':['63134'],
    'ferguson':['63135'],'riverview':['63137'],'st. ann':['63074'],
    'earth city':['63045'],'baden':['63120'],'bevo':['63118']
  };

  /* ============================================================
     COLOR ENGINE
     ============================================================ */
  function _lerp(a,b,t){return a+(b-a)*t;}
  function _clamp(v,lo,hi){return Math.max(lo,Math.min(hi,v));}
  function _hexToRgb(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
  function _lerpColor(c1,c2,t){return[Math.round(_lerp(c1[0],c2[0],t)),Math.round(_lerp(c1[1],c2[1],t)),Math.round(_lerp(c1[2],c2[2],t))];}
  function _rgbToHex(r,g,b){return '#'+[r,g,b].map(function(v){return v.toString(16).padStart(2,'0');}).join('');}

  var _COLD = _hexToRgb('#8B1A1A');
  var _MID  = _hexToRgb('#ffcc4d');
  var _HOT  = _hexToRgb('#1a7a4a');

  function heatColor(t){
    t=_clamp(t,0,1);
    if(t<0.5) return _rgbToHex.apply(null,_lerpColor(_COLD,_MID,t*2));
    return _rgbToHex.apply(null,_lerpColor(_MID,_HOT,(t-0.5)*2));
  }

  function fwHeatColor(fw){return heatColor(_clamp((fw-0)/(60-0),0,1));}

  /* ============================================================
     FINANCIAL CALCULATIONS
     ============================================================ */

  function calcPI(loan, rate){
    var r=(rate/100)/12, n=360;
    if(r===0) return loan/n;
    return loan*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
  }

  function calcTrueMonthly(homePrice, down, rate, zip){
    var loan = homePrice - down;
    var pi   = calcPI(loan, rate);
    var tax  = (homePrice*(ZIP_TAX[zip]||0.0114))/12;
    var ins  = (ZIP_INS[zip]||ZIP_INS.default)/12;
    var pmi  = (down/homePrice)<0.20 ? (loan*0.0085)/12 : 0;
    var maint= (homePrice*0.015)/12;
    return {
      pi:    Math.round(pi),
      tax:   Math.round(tax),
      ins:   Math.round(ins),
      pmi:   Math.round(pmi),
      maint: Math.round(maint),
      total: Math.round(pi+tax+ins+pmi+maint),
      taxRate: ZIP_TAX[zip]||0.0114
    };
  }

  function calcMaxPrice(payment, down, rate, debts){
    var r=(rate/100)/12, n=360;
    var mrf = r===0 ? 1/n : (r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
    var factor = mrf + 0.0015;
    var net = payment - (debts*0.1);
    return Math.round(Math.max(0, net/factor) + down);
  }

  function getTierPrice(d, condition){
    var p = d.price;
    if(condition==='aisis') return Math.round(p*0.82/1000)*1000;
    if(condition==='mid')   return Math.round(p*0.93/1000)*1000;
    if(condition==='move')  return Math.round(p*1.08/1000)*1000;
    return p;
  }

  function getValueFlag(d, zip){
    var fw      = d.fw;
    var taxRate = ZIP_TAX[zip]||0.0114;
    if(fw>=50 && d.splp>=101) return {
      flag:'Hot Market', color:'#5dcaa5',
      text:fw+'% of homes here sell the first weekend at or above list. Come with pre-approval and be ready to move within hours.'
    };
    if(fw<30 && d.dom>20) return {
      flag:'Buyer Leverage', color:'#5dcaa5',
      text:'At '+fw+'% first weekend rate and '+d.dom+' average days on market, buyers have more negotiating room here than most of the metro.'
    };
    if(taxRate<=0.0092) return {
      flag:'Tax Advantage Zone', color:'#5dcaa5',
      text:(ZIP_COUNTY[zip]||'This county')+' rate is '+(taxRate*100).toFixed(2)+'% — lowest in the metro. At $300K that saves $110–$140/month vs. a comparable St. Louis County address.'
    };
    return {
      flag:'Active Market', color:'#ffcc4d',
      text:fw+'% first weekend rate means competition is real but not overwhelming. Correctly priced homes move fast. Overpriced ones give buyers an opening.'
    };
  }

  function searchZips(query){
    var q = query.trim().toLowerCase();
    if(!q) return [];
    var results=[], seen={};
    function add(zip){
      if(!seen[zip] && ZIP_DATA[zip]){
        results.push({zip:zip, city:ZIP_DATA[zip].city});
        seen[zip]=true;
      }
    }
    if(/^\d{5}$/.test(q)) add(q);
    var aliases = Object.keys(ZIP_ALIASES);
    for(var i=0;i<aliases.length;i++){
      if(aliases[i].indexOf(q)!==-1) ZIP_ALIASES[aliases[i]].forEach(add);
    }
    var zips = Object.keys(ZIP_DATA);
    for(var j=0;j<zips.length;j++){
      var s=(zips[j]+' '+ZIP_DATA[zips[j]].city).toLowerCase();
      if(s.indexOf(q)!==-1) add(zips[j]);
    }
    return results.slice(0,8);
  }

  /* Formatting helpers */
  function fmt$(n){ return n<0 ? '-$'+Math.abs(Math.round(n)).toLocaleString() : '$'+Math.round(n).toLocaleString(); }
  function fmtK(n){ return '$'+Math.round(n/1000)+'K'; }
  function fmtPct(n){ return n.toFixed(1)+'%'; }

  /* ============================================================
     EXPOSE GLOBALS
     ============================================================ */
  window.ZIP_DATA = ZIP_DATA;

  window.STL_CALC = {
    calcPI:          calcPI,
    calcTrueMonthly: calcTrueMonthly,
    calcMaxPrice:    calcMaxPrice,
    getTierPrice:    getTierPrice,
    getValueFlag:    getValueFlag,
    searchZips:      searchZips,
    heatColor:       heatColor,
    fwHeatColor:     fwHeatColor,
    fmt$:            fmt$,
    fmtK:            fmtK,
    fmtPct:          fmtPct,
    ZIP_TAX:         ZIP_TAX,
    ZIP_INS:         ZIP_INS,
    ZIP_COUNTY:      ZIP_COUNTY,
    ZIP_DISTRICT:    ZIP_DISTRICT,
    ZIP_ALIASES:     ZIP_ALIASES
  };

})();
