(function () {
  'use strict';

  if (!['chatsaudia.com', 'www.chatsaudia.com'].includes(location.hostname)) return;

  const key = '__CHAT_SPORTS_SD_V1__';
  window[key]?.destroy();
  window.__BEIN_SD_TEST__?.();
  window.__CHAT_SPORTS_TEST__?.destroy?.();
  document.getElementById('bein-chat-test')?.remove();

  const relay = 'https://chat-scripts-source.onrender.com/sports-live/';
  const catalog = [["بي إن سبورت","SD","بي إن سبورت","SD",[491751]],
    ["بي إن سبورت","SD","بي إن سبورت 1","SD",[491608,491753]],
    ["بي إن سبورت","SD","بي إن سبورت 2","SD",[491609,491754]],
    ["بي إن سبورت","SD","بي إن سبورت 3","SD",[491610,491755]],
    ["بي إن سبورت","SD","بي إن سبورت 4","SD",[491611,491756]],
    ["بي إن سبورت","SD","بي إن سبورت 5","SD",[491612,491757]],
    ["بي إن سبورت","SD","بي إن سبورت 6","SD",[491613,491758]],
    ["بي إن سبورت","SD","بي إن سبورت 7","SD",[491614,491759]],
    ["بي إن سبورت","SD","بي إن سبورت 8","SD",[491615,491760]],
    ["بي إن سبورت","SD","بي إن سبورت 9","SD",[491616,491761]],
    ["بي إن سبورت","HD","بي إن سبورت","HD",[491736]],
    ["بي إن سبورت","HD","بي إن سبورت 1","HD",[491595,491738]],
    ["بي إن سبورت","HD","بي إن سبورت 2","HD",[491596,491739]],
    ["بي إن سبورت","HD","بي إن سبورت 3","HD",[491597,491740]],
    ["بي إن سبورت","HD","بي إن سبورت 4","HD",[491598,491741]],
    ["بي إن سبورت","HD","بي إن سبورت 5","HD",[491599,491742]],
    ["بي إن سبورت","HD","بي إن سبورت 6","HD",[491600,491743]],
    ["بي إن سبورت","HD","بي إن سبورت 7","HD",[491601,491744]],
    ["بي إن سبورت","HD","بي إن سبورت 8","HD",[491602,491745]],
    ["بي إن سبورت","HD","بي إن سبورت 9","HD",[491603,491746]],
    ["بي إن سبورت","FHD","بي إن سبورت 1","FHD",[491573,491727]],
    ["بي إن سبورت","FHD","بي إن سبورت 2","FHD",[491574,491728]],
    ["بي إن سبورت","FHD","بي إن سبورت 3","FHD",[491575,491729]],
    ["بي إن سبورت","FHD","بي إن سبورت 4","FHD",[491576,491730]],
    ["بي إن سبورت","FHD","بي إن سبورت 5","FHD",[491577,491731]],
    ["بي إن سبورت","FHD","بي إن سبورت 6","FHD",[491578,491732]],
    ["بي إن سبورت","FHD","بي إن سبورت 7","FHD",[491579,491733]],
    ["بي إن سبورت","FHD","بي إن سبورت 8","FHD",[491580,491734]],
    ["بي إن سبورت","FHD","بي إن سبورت 9","FHD",[491581,491735]],
    ["بي إن سبورت","4K","بي إن سبورت","4K",[491725,492234]],
    ["بي إن سبورت","4K","بي إن سبورت 1","4K",[491548,491711]],
    ["بي إن سبورت","4K","بي إن سبورت 2","4K",[491549,491713]],
    ["بي إن سبورت","4K","بي إن سبورت 3","4K",[491550,491712]],
    ["بي إن سبورت","4K","بي إن سبورت 4","4K",[491551,491714]],
    ["بي إن سبورت","4K","بي إن سبورت 5","4K",[491552,491715]],
    ["بي إن سبورت","4K","بي إن سبورت 6","4K",[491553,491716]],
    ["بي إن سبورت","4K","بي إن سبورت 7","4K",[491554,491717]],
    ["بي إن سبورت","4K","بي إن سبورت 8","4K",[491555,491718]],
    ["بي إن سبورت","4K","بي إن سبورت 9","4K",[491556,491719]],
    ["بي إن سبورت","LOW","بي إن سبورت 1","LOW",[491762]],
    ["بي إن سبورت","LOW","بي إن سبورت 2","LOW",[491763]],
    ["بي إن سبورت","LOW","بي إن سبورت 3","LOW",[491764]],
    ["بي إن سبورت","LOW","بي إن سبورت 4","LOW",[491765]],
    ["بي إن سبورت","LOW","بي إن سبورت 5","LOW",[491766]],
    ["بي إن سبورت","LOW","بي إن سبورت 6","LOW",[491767]],
    ["بي إن سبورت","LOW","بي إن سبورت 7","LOW",[491770]],
    ["بي إن سبورت","LOW","بي إن سبورت 8","LOW",[491768]],
    ["بي إن سبورت","LOW","بي إن سبورت 9","LOW",[491769]],
    ["بي إن سبورت","إكسترا","إكسترا 1","4K",[491562,491722]],
    ["بي إن سبورت","إكسترا","إكسترا 1","FHD",[491582]],
    ["بي إن سبورت","إكسترا","إكسترا 1","HD",[491748]],
    ["بي إن سبورت","إكسترا","إكسترا 1","SD",[491622]],
    ["بي إن سبورت","إكسترا","إكسترا 2","4K",[491563,491723]],
    ["بي إن سبورت","إكسترا","إكسترا 2","FHD",[491583]],
    ["بي إن سبورت","إكسترا","إكسترا 2","HD",[491749]],
    ["بي إن سبورت","إكسترا","إكسترا 2","SD",[491623]],
    ["بي إن سبورت","إكسترا","إكسترا 3","4K",[491564,491724]],
    ["بي إن سبورت","إكسترا","إكسترا 3","FHD",[491584]],
    ["بي إن سبورت","إكسترا","إكسترا 3","HD",[491750]],
    ["بي إن سبورت","إكسترا","إكسترا 3","SD",[491624]],
    ["بي إن سبورت","إكسترا","إكسترا 4","4K",[491565,491773]],
    ["بي إن سبورت","إكسترا","إكسترا 4","FHD",[491585]],
    ["بي إن سبورت","إكسترا","إكسترا 4","HD",[491774]],
    ["بي إن سبورت","إكسترا","إكسترا 4","SD",[491625]],
    ["بي إن سبورت","إكسترا","إكسترا 5","4K",[491566,491775]],
    ["بي إن سبورت","إكسترا","إكسترا 5","FHD",[491586]],
    ["بي إن سبورت","إكسترا","إكسترا 5","HD",[491776]],
    ["بي إن سبورت","إكسترا","إكسترا 5","SD",[491626]],
    ["بي إن سبورت","إكسترا","إكسترا 6","4K",[491567,491777]],
    ["بي إن سبورت","إكسترا","إكسترا 6","FHD",[491587]],
    ["بي إن سبورت","إكسترا","إكسترا 6","HD",[491778]],
    ["بي إن سبورت","إكسترا","إكسترا 6","SD",[491627]],
    ["بي إن سبورت","إكسترا","إكسترا 7","4K",[491568]],
    ["بي إن سبورت","إكسترا","إكسترا 7","FHD",[491588]],
    ["بي إن سبورت","إكسترا","إكسترا 7","SD",[491628]],
    ["بي إن سبورت","إكسترا","إكسترا 8","4K",[491569]],
    ["بي إن سبورت","إكسترا","إكسترا 8","FHD",[491589]],
    ["بي إن سبورت","إكسترا","إكسترا 8","SD",[491629]],
    ["بي إن سبورت","إكسترا","إكسترا 9","4K",[491570]],
    ["بي إن سبورت","إكسترا","إكسترا 9","FHD",[491590]],
    ["بي إن سبورت","إكسترا","إكسترا 9","SD",[491630]],
    ["بي إن سبورت","الإخبارية","الإخبارية","4K",[491726,492235]],
    ["بي إن سبورت","الإخبارية","الإخبارية","FHD",[491737]],
    ["بي إن سبورت","الإخبارية","الإخبارية","HD",[491572,491752]],
    ["بي إن سبورت","RAW","بي إن سبورت","RAW",[491782]],
    ["ثمانية","القنوات","ثمانية 1","4K",[491702,491824,492213]],
    ["ثمانية","القنوات","ثمانية 1","HD",[491705,491827,492210]],
    ["ثمانية","القنوات","ثمانية 1","HEVC",[492204]],
    ["ثمانية","القنوات","ثمانية 1","RAW",[491821]],
    ["ثمانية","القنوات","ثمانية 1","SD",[491708,491830,492207]],
    ["ثمانية","القنوات","ثمانية 1","عادي",[491833]],
    ["ثمانية","القنوات","ثمانية 2","4K",[491703,491825,492212]],
    ["ثمانية","القنوات","ثمانية 2","HD",[491706,491828,492209]],
    ["ثمانية","القنوات","ثمانية 2","HEVC",[492203]],
    ["ثمانية","القنوات","ثمانية 2","RAW",[491822]],
    ["ثمانية","القنوات","ثمانية 2","SD",[491709,491831,492206]],
    ["ثمانية","القنوات","ثمانية 2","عادي",[491834]],
    ["ثمانية","القنوات","ثمانية 3","4K",[491704,491826,492211]],
    ["ثمانية","القنوات","ثمانية 3","HD",[491707,491829,492208]],
    ["ثمانية","القنوات","ثمانية 3","HEVC",[492202]],
    ["ثمانية","القنوات","ثمانية 3","RAW",[491823]],
    ["ثمانية","القنوات","ثمانية 3","SD",[491710,491832,492205]],
    ["ثمانية","القنوات","ثمانية 3","عادي",[491835]],
    ["ثمانية","القنوات","ثمانية 4","4K",[492201]],
    ["ثمانية","القنوات","ثمانية 4","HD",[492200]],
    ["ثمانية","القنوات","ثمانية 4","SD",[492199]],
    ["ثمانية","القنوات","ثمانية 10","4K",[492197]],
    ["ثمانية","القنوات","ثمانية 11","4K",[492196]],
    ["ثمانية","القنوات","ثمانية 12","4K",[492195]],
    ["ثمانية","المناسبات","ثمانية مناسبات","4K",[492198]],
    ["السعودية الرياضية","إس تي سي الرياضية","إس تي سي الرياضية 1","عادي",[491928]],
    ["السعودية الرياضية","إس تي سي الرياضية","إس تي سي الرياضية 2","عادي",[491929]],
    ["السعودية الرياضية","إس تي سي الرياضية","إس تي سي الرياضية 3","عادي",[491930]],
    ["السعودية الرياضية","إس تي سي الرياضية","إس تي سي الرياضية 4","عادي",[491931]],
    ["السعودية الرياضية","السعودية الرياضية","السعودية الرياضية 1","4K",[492236]],
    ["السعودية الرياضية","السعودية الرياضية","السعودية الرياضية 1","HD",[492237]],
    ["السعودية الرياضية","السعودية الرياضية","السعودية الرياضية 2","4K",[492238]],
    ["السعودية الرياضية","السعودية الرياضية","السعودية الرياضية 2","HD",[492239]],
    ["السعودية الرياضية","السعودية الرياضية","السعودية الرياضية 3","4K",[492240]],
    ["السعودية الرياضية","السعودية الرياضية","السعودية الرياضية 3","HD",[492241]],
    ["السعودية الرياضية","السعودية الرياضية","السعودية الرياضية 4","4K",[492224]],
    ["السعودية الرياضية","شاهد للمناسبات","شاهد للمناسبات 1","4K",[491920]],
    ["السعودية الرياضية","شاهد للمناسبات","شاهد للمناسبات 2","4K",[491922]],
    ["السعودية الرياضية","شاهد للمناسبات","شاهد للمناسبات 3","4K",[491921]],
    ["السعودية الرياضية","شاهد للمناسبات","شاهد للمناسبات 4","4K",[491923]],
    ["السعودية الرياضية","شاهد للمناسبات","شاهد للمناسبات 5","4K",[491924]],
    ["السعودية الرياضية","شاهد للمناسبات","شاهد للمناسبات 6","4K",[491925]],
    ["السعودية الرياضية","شاهد للمناسبات","شاهد للمناسبات 7","4K",[491926]],
    ["السعودية الرياضية","شاهد للمناسبات","شاهد للمناسبات 8","4K",[491927]],
    ["الكأس","الكأس","الكأس 1","4K",[491944,491631,492216]],
    ["الكأس","الكأس","الكأس 1","HD",[491641,492217]],
    ["الكأس","الكأس","الكأس 1","SD",[491650]],
    ["الكأس","الكأس","الكأس 2","4K",[491632,492218]],
    ["الكأس","الكأس","الكأس 2","FHD",[491945]],
    ["الكأس","الكأس","الكأس 2","HD",[491642,492219]],
    ["الكأس","الكأس","الكأس 2","SD",[491651]],
    ["الكأس","الكأس","الكأس 3","4K",[491633,492220]],
    ["الكأس","الكأس","الكأس 3","FHD",[491946]],
    ["الكأس","الكأس","الكأس 3","HD",[491643,491947,492221]],
    ["الكأس","الكأس","الكأس 3","SD",[491652]],
    ["الكأس","الكأس","الكأس 4","4K",[491634,492222]],
    ["الكأس","الكأس","الكأس 4","FHD",[491948]],
    ["الكأس","الكأس","الكأس 4","HD",[491644,491949,492223]],
    ["الكأس","الكأس","الكأس 4","SD",[491653]],
    ["الكأس","الكأس","الكأس 5","4K",[491635,492037]],
    ["الكأس","الكأس","الكأس 5","FHD",[491950]],
    ["الكأس","الكأس","الكأس 5","HD",[491654,491951,492038]],
    ["الكأس","الكأس","الكأس 5","SD",[491655]],
    ["الكأس","الكأس","الكأس 6","4K",[491636]],
    ["الكأس","الكأس","الكأس 6","FHD",[491952]],
    ["الكأس","الكأس","الكأس 6","HD",[491645]],
    ["الكأس","الكأس","الكأس 6","SD",[491656]],
    ["الكأس","الكأس","الكأس 7","4K",[491637]],
    ["الكأس","الكأس","الكأس 7","FHD",[491953]],
    ["الكأس","الكأس","الكأس 7","HD",[491646,491954]],
    ["الكأس","الكأس","الكأس 7","SD",[491657]],
    ["الكأس","الكأس","الكأس 8","4K",[491638]],
    ["الكأس","الكأس","الكأس 8","FHD",[491955]],
    ["الكأس","الكأس","الكأس 8","HD",[491647,491956]],
    ["الكأس","الكأس","الكأس 8","SD",[491658]],
    ["الكأس","الكأس","الكأس 9","4K",[491639]],
    ["الكأس","الكأس","الكأس 9","HD",[491648]],
    ["الكأس","الكأس","الكأس 9","SD",[491659]],
    ["الكأس","الكأس","الكأس 10","4K",[491640]],
    ["الكأس","الكأس","الكأس 10","HD",[491649]],
    ["الكأس","الكأس","الكأس 10","SD",[491660]],
    ["الكأس","الكأس شوف","الكأس شوف 1","4K",[492215]],
    ["الكأس","الكأس شوف","الكأس شوف 2","4K",[492214]],
    ["الإمارات الرياضية","أبوظبي آسيا","أبوظبي آسيا 1","HD",[491936]],
    ["الإمارات الرياضية","أبوظبي آسيا","أبوظبي آسيا 1","HEVC",[491935]],
    ["الإمارات الرياضية","أبوظبي آسيا","أبوظبي آسيا 2","HD",[491938]],
    ["الإمارات الرياضية","أبوظبي آسيا","أبوظبي آسيا 2","HEVC",[491937]],
    ["الإمارات الرياضية","أبوظبي الرياضية","أبوظبي الرياضية 1","عادي",[492232]],
    ["الإمارات الرياضية","أبوظبي الرياضية","أبوظبي الرياضية 2","عادي",[492231]],
    ["الإمارات الرياضية","الشارقة الرياضية","الشارقة الرياضية","4K",[492253]],
    ["الإمارات الرياضية","الشارقة الرياضية","الشارقة الرياضية","HD",[492254]],
    ["الإمارات الرياضية","الشارقة الرياضية","الشارقة الرياضية 2","4K",[492233]],
    ["الإمارات الرياضية","الشارقة الرياضية","الشارقة الرياضية 2","HD",[492227]],
    ["الإمارات الرياضية","دبي الرياضية","دبي الرياضية 1","4K",[492245]],
    ["الإمارات الرياضية","دبي الرياضية","دبي الرياضية 1","HD",[492246]],
    ["الإمارات الرياضية","دبي الرياضية","دبي الرياضية 2","4K",[492247]],
    ["الإمارات الرياضية","دبي الرياضية","دبي الرياضية 2","HD",[492248]],
    ["الإمارات الرياضية","دبي ريسنغ","دبي ريسنغ 1","4K",[492249]],
    ["الإمارات الرياضية","دبي ريسنغ","دبي ريسنغ 1","HD",[492250]],
    ["الإمارات الرياضية","دبي ريسنغ","دبي ريسنغ 2","4K",[492251]],
    ["الإمارات الرياضية","دبي ريسنغ","دبي ريسنغ 2","HD",[492252]],
    ["الإمارات الرياضية","ياس الرياضية","ياس الرياضية","4K",[492255]],
    ["الإمارات الرياضية","ياس الرياضية","ياس الرياضية","HD",[492256]],
    ["الخليج والعراق","البحرين الرياضية","البحرين الرياضية 1","4K",[492264]],
    ["الخليج والعراق","البحرين الرياضية","البحرين الرياضية 1","HD",[492265]],
    ["الخليج والعراق","البحرين الرياضية","البحرين الرياضية 2","4K",[492266]],
    ["الخليج والعراق","البحرين الرياضية","البحرين الرياضية 2","HD",[492267]],
    ["الخليج والعراق","الرابعة الرياضية","الرابعة الرياضية","4K",[492257]],
    ["الخليج والعراق","الرابعة الرياضية","الرابعة الرياضية","HD",[492228]],
    ["الخليج والعراق","الرابعة الرياضية","الرابعة الرياضية 1","عادي",[491984]],
    ["الخليج والعراق","الرابعة الرياضية","الرابعة الرياضية 2","عادي",[491985]],
    ["الخليج والعراق","الرابعة الرياضية","الرابعة الرياضية 3","عادي",[491986]],
    ["الخليج والعراق","الرابعة الرياضية","الرابعة الرياضية 4","عادي",[491987]],
    ["الخليج والعراق","العراقية الرياضية","العراقية الرياضية","4K",[492258]],
    ["الخليج والعراق","العراقية الرياضية","العراقية الرياضية","HD",[492259]],
    ["الخليج والعراق","الكويت الرياضية","الكويت الرياضية","4K",[492225,492268]],
    ["الخليج والعراق","الكويت الرياضية بلس","الكويت الرياضية بلس","4K",[492269]],
    ["الخليج والعراق","الكويت الرياضية بلس","الكويت الرياضية بلس","HD",[492270]],
    ["الخليج والعراق","عُمان الرياضية","عُمان الرياضية","4K",[492260]],
    ["الخليج والعراق","عُمان الرياضية","عُمان الرياضية","HD",[492261]],
    ["مصر الرياضية","أون تايم سبورت","أون تايم سبورت","4K",[492242,492608]],
    ["مصر الرياضية","أون تايم سبورت","أون تايم سبورت","HD",[492243]],
    ["مصر الرياضية","أون سبورت بلس","أون سبورت بلس","4K",[492229]],
    ["مصر الرياضية","أون سبورت ماكس","أون سبورت ماكس","4K",[492226,492230]],
    ["مصر الرياضية","الأهلي","الأهلي","4K",[492273]],
    ["مصر الرياضية","الأهلي","الأهلي","HD",[492274]],
    ["مصر الرياضية","الزمالك","الزمالك","عادي",[492275]],
    ["مصر الرياضية","النيل للرياضة","النيل للرياضة","عادي",[492272]],
    ["رياضة عربية أخرى","الأردنية الرياضية","الأردنية الرياضية","4K",[492872]],
    ["رياضة عربية أخرى","الأردنية الرياضية","الأردنية الرياضية","HD",[492873]],
    ["رياضة عربية أخرى","المغربية الرياضية","المغربية الرياضية","4K",[492826]],
    ["رياضة عربية أخرى","المغربية الرياضية","المغربية الرياضية","HD",[492830]],
    ["رياضة عربية أخرى","المغربية الرياضية","المغربية الرياضية 1","4K",[492827]],
    ["رياضة عربية أخرى","المغربية الرياضية","المغربية الرياضية 2","4K",[492828]],
    ["رياضة عربية أخرى","المغربية الرياضية","المغربية الرياضية 3","4K",[492829]],
    ["رياضة عربية أخرى","المغربية الرياضية الأولمبية","المغربية الرياضية الأولمبية","4K",[492825]],
    ["رياضة عربية أخرى","المغربية الرياضية الأولمبية","المغربية الرياضية الأولمبية","HD",[492831]],
    ["رياضة عربية أخرى","المغربية الرياضية كأس أفريقيا","المغربية الرياضية كأس أفريقيا 1","4K",[492810]],
    ["رياضة عربية أخرى","تونس الرياضية","تونس الرياضية","4K",[493086]],
    ["رياضة عربية أخرى","تونس الرياضية","تونس الرياضية","HD",[493085]],
    ["رياضة عربية أخرى","رؤيا سبورت","رؤيا سبورت","عادي",[492875,492924]],
    ["رياضة عربية أخرى","فلسطين الرياضية","فلسطين الرياضية","4K",[492271]],
    ["رياضة عربية أخرى","ليبيا الرياضية","ليبيا الرياضية 1","4K",[492262]],
    ["رياضة عربية أخرى","ليبيا الرياضية","ليبيا الرياضية 2","4K",[492263]]];
  const libraryUrl = 'https://cdn.jsdelivr.net/npm/hls.js@1.6.13/dist/hls.min.js';

  const style = document.createElement('style');
  style.textContent = `
    #chat-tv > .sd-sports {display:none!important}
    #chat-tv.sd-open > :not(.sd-sports) {display:none!important}
    #chat-tv.sd-open > .sd-sports {display:block!important;width:100%;min-width:0}
  `;
  document.head.append(style);

  const sheet = `
    :host {direction:rtl;color:#172526;font:14px Tahoma,Arial,sans-serif}
    * {box-sizing:border-box}
    .layout {padding:8px;background:#f5f8f7;border-radius:10px;display:grid;gap:9px}
    .slot {position:relative;width:100%}
    .slot.away {aspect-ratio:16/9;display:grid;place-items:center;
      border:1px dashed #b6cac5;border-radius:8px;background:#f4f8f6}
    .screen {background:#101818;color:white;border-radius:8px;overflow:hidden}
    .head {display:flex;align-items:center;justify-content:space-between;
      padding:7px 10px;background:#103d34;color:white}
    .floating .head {cursor:move;touch-action:none;user-select:none}
    video {display:block;width:100%;aspect-ratio:16/9;background:#090d0c;object-fit:contain}
    .floating {position:fixed!important;z-index:2147483646;
      display:flex;flex-direction:column;box-shadow:0 4px 22px #0006}
    .floating video {flex:1;min-height:0;height:0;aspect-ratio:auto}
    .grip {display:none}
    .floating .grip {display:block;position:absolute;bottom:0;right:0;
      width:20px;height:20px;background:#135649;color:white;
      text-align:center;cursor:nwse-resize;touch-action:none}
    .screen:fullscreen {
      width:100%!important;height:100%!important;max-width:none!important;
      max-height:none!important;border-radius:0;display:flex;flex-direction:column}
    .screen:-webkit-full-screen {
      width:100%!important;height:100%!important;max-width:none!important;
      max-height:none!important;border-radius:0;display:flex;flex-direction:column}
    .screen:fullscreen video {
      flex:1;height:0;min-height:0;aspect-ratio:auto}
    .screen:-webkit-full-screen video {
      flex:1;height:0;min-height:0;aspect-ratio:auto}
    .tools {display:flex;flex-wrap:wrap;gap:5px}
    button {font:inherit;color:inherit;cursor:pointer;padding:6px 9px;
      border:1px solid #cbd5d2;border-radius:6px;background:#fff}

    button[aria-pressed=true] {background:#103d34;border-color:#103d34;color:#fff}
    .head button {padding:3px 8px;background:transparent;color:white;border-color:#ffffff66}
    .channels {max-height:clamp(128px,30vh,320px);overflow:auto;align-content:start;padding:3px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}

    .filters {display:grid;grid-template-columns:1fr 1fr;gap:5px;border-top:1px solid #e0e7e4;padding-top:8px}
    .status {margin:0;min-height:1.4em;color:#435653}
    .volume {display:flex;align-items:center;gap:5px}.volume input {width:78px}
    .screen {padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}
    .floating {padding-bottom:env(safe-area-inset-bottom);padding-top:env(safe-area-inset-top)}
    .floating .grip {width:26px;height:26px}
    [hidden] {display:none!important}
    @media(max-width:360px){.channels{grid-template-columns:repeat(2,minmax(0,1fr))}}


    .filters label {display:grid;gap:4px;color:#34564e;font-weight:bold;min-width:0}
    select {width:100%;min-width:0;height:42px;background:white;color:#173e32;border:1px solid #bbcfc7;border-radius:7px;font:inherit}

    .channels button,.tools button {min-height:42px}.channels button {direction:rtl}
    .channels button[aria-pressed=true] {background:#124d3e;color:white}
    button:focus-visible,select:focus-visible {outline:2px solid #268a73;outline-offset:1px}
  `;

  const T = {
    sports:'رياضة', choose:'اختر القناة.', stop:'إيقاف', stopped:'تم إيقاف البث.',
    retry:'إعادة المحاولة', source:'تبديل المصدر', full:'ملء الشاشة', exitFull:'خروج من ملء الشاشة',
    float:'نافذة عائمة', back:'إرجاع الشاشة', pip:'صورة داخل صورة', exitPip:'إرجاع من صورة داخل صورة',
    mute:'كتم', unmute:'تشغيل الصوت', volume:'الصوت', network:'الشبكة', section:'المجموعة',
    channels:'القنوات', resize:'تغيير حجم الشاشة', screen:'شاشة الرياضة',
    reconnect:'انقطع الاتصال، جارٍ المحاولة…', recover:'جارٍ استعادة الفيديو…',
    tap:'اضغط تشغيل داخل الشاشة.', unavailable:'تعذّر تشغيل القناة.',
    fullscreenError:'تعذّر فتح ملء الشاشة.', pipError:'تعذّر فتح صورة داخل صورة.',
    loading:'جارٍ فتح ', playing:'البث يعمل · ', server:'ردّ السيرفر',
    unsupported:'المتصفح لا يدعم تشغيل هذا البث.', library:'تعذّر تحميل مكتبة تشغيل الفيديو.',
    noEngine:'اكتمل التحميل لكن مكتبة الفيديو غير متاحة.'
  };
  const storeKey = 'chat-sports-view-v2';
  function readPrefs() {
    try { return JSON.parse(localStorage.getItem(storeKey)) || {}; } catch { return {}; }
  }
  const prefs = readPrefs();
  const els = {};
  const state = { active:false, floating:false, gesture:null, box:null, row:null, index:0,
    generation:0, hls:null, loading:null, timer:0, observer:null, scan:0, media:false };
  if (prefs.box && ['x','y','width','height'].every(k => Number.isFinite(prefs.box[k]))) state.box = {...prefs.box};
  function save() {
    try { localStorage.setItem(storeKey,JSON.stringify({box:state.box,last:prefs.last})); } catch {}
  }
  const life = new AbortController();
  let mounted;
  const $ = sel => els.root.querySelector(sel);
  function on(target,type,fn,options={}) {
    target.addEventListener(type,fn,{...options,signal:mounted.signal});
  }
  function show(msg) { els.status.textContent = msg; }
  function engine() {
    if (window.Hls) return Promise.resolve(window.Hls);
    if (!state.loading) state.loading = new Promise((resolve,reject) => {
      const script = document.createElement('script');
      script.crossOrigin = 'anonymous';
      const integrity = ''; // Populated by pin-hls.ps1 from the pinned release.
      if (integrity) script.integrity = integrity;
      script.src = libraryUrl;
      script.onload = () => window.Hls ? resolve(window.Hls) : reject(new Error(T.noEngine));
      script.onerror = () => { script.remove(); reject(new Error(T.library)); };
      document.head.append(script);
    }).catch(e => { state.loading = null; throw e; });
    return state.loading;
  }
  function release() {
    state.generation++;
    clearTimeout(state.timer);
    if (els.video) els.video.onerror = els.video.onplaying = null;
    state.hls?.destroy();
    state.hls = null;
    if (els.video) {
      els.video.pause();
      els.video.removeAttribute('src');
      els.video.load();
    }
  }
  function mediaOff() {
    if (!state.media) return;
    for (const action of ['play','pause','stop']) {
      try { navigator.mediaSession.setActionHandler(action,null); } catch {}
    }
    navigator.mediaSession.metadata = null;
    state.media = false;
  }
  function stop() {
    release(); mediaOff();
    state.row = null;
    els.title.textContent = T.sports;
    $('[data-alt]').hidden = $('[data-retry]').hidden = true;
    mark(); show(T.stopped);
  }
  function mark() {
    for (const b of els.root.querySelectorAll('[data-channel]')) {
      b.setAttribute('aria-pressed',String(Number(b.dataset.channel) === state.row?.[4][0]));
    }
  }
  function address(row,index) {
    const [network,section,label,,ids] = row;
    const match = network === 'بي إن سبورت' && section === 'SD' && index === 0 && /^بي إن سبورت ([1-9])$/.exec(label);
    return relay + (match ? 'sd'+match[1] : 'ch/'+ids[index]) + '/index.m3u8';
  }
  function activateMedia(name) {
    if (!navigator.mediaSession) return;
    state.media = true;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({title:name,artist:T.sports});
      navigator.mediaSession.setActionHandler('play',() => els.video?.play().catch(() => show(T.tap)));
      navigator.mediaSession.setActionHandler('pause',() => els.video?.pause());
      navigator.mediaSession.setActionHandler('stop',stop);
    } catch {}
  }
  function renderChoice(row,index) {
    state.row = row; state.index = index;
    const name = row[2]+' · '+row[3];
    els.title.textContent = name;
    $('[data-retry]').hidden = true;
    const alt = $('[data-alt]');
    alt.hidden = row[4].length < 2;
    alt.textContent = T.source+' ('+(index+1)+'/'+row[4].length+')';
    mark(); show(T.loading+name);
    return name;
  }
  function failed(id,msg) {
    if (id !== state.generation) return;
    release(); mediaOff(); show(msg);
    $('[data-retry]').hidden = false;
  }
  function attach(Hls,player,url,id) {
    let networkAttempts = 0, mediaAttempts = 0;
    const instance = new Hls({maxBufferLength:30,liveSyncDurationCount:3,lowLatencyMode:false});
    state.hls = instance;
    instance.on(Hls.Events.ERROR,(_,data) => {
      if (!data.fatal || state.generation !== id) return;
      const code = data.response?.code;
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR && ![401,403,404,410].includes(code) && networkAttempts < 2) {
        clearTimeout(state.timer);
        show(T.reconnect);
        state.timer = setTimeout(() => {
          if (id === state.generation) instance.startLoad();
        }, 750 * ++networkAttempts);
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR && mediaAttempts++ < 1) {
        show(T.recover); instance.recoverMediaError();
      } else failed(id,T.unavailable+(code ? ' '+T.server+' '+code : ''));
    });
    instance.loadSource(url); instance.attachMedia(player);
  }
  async function play(row,index=0,force=false) {
    if (!force && row === state.row && index === state.index && !els.video.paused) return;
    release(); mediaOff();
    const id = state.generation, player = els.video;
    const name = renderChoice(row,index);
    player.onplaying = () => {
      if (id !== state.generation) return;
      prefs.last = row[4][0]; save(); show(T.playing+name); activateMedia(name);
    };
    try {
      let Hls;
      const native = player.canPlayType('application/vnd.apple.mpegurl');
      try { Hls = await engine(); } catch (e) { if (!native) throw e; }
      if (id !== state.generation) return;
      const url = address(row,index);
      if (Hls?.isSupported()) attach(Hls,player,url,id);
      else if (native) {
        player.onerror = () => failed(id,T.unavailable);
        player.src = url;
      } else throw new Error(T.unsupported);
      await player.play();
    } catch (e) {
      if (id !== state.generation) return;
      if (e.name === 'NotAllowedError') show(T.tap);
      else if (!(state.hls && (e.name === 'AbortError' || e.name === 'NotSupportedError'))) failed(id,[T.unsupported,T.library,T.noEngine].includes(e.message)?e.message:T.unavailable);
    }
  }
  function paintBox() {
    const b = state.box;
    if (!state.floating || !b) return;
    const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
    b.width = clamp(b.width, Math.min(220,innerWidth),innerWidth);
    b.height = clamp(b.height,Math.min(145,innerHeight),innerHeight);
    b.x = clamp(b.x,0,innerWidth-b.width); b.y = clamp(b.y,0,innerHeight-b.height);
    Object.assign(els.screen.style,{left:b.x+'px',top:b.y+'px',width:b.width+'px',height:b.height+'px'});
  }
  function setFloat(on) {
    state.floating = on; state.gesture = null;
    els.screen.classList.toggle('floating',on);
    els.slot.classList.toggle('away',on);
    $('[data-float]').textContent = on ? T.back : T.float;
    $('[data-float]').setAttribute('aria-pressed',String(on));
    $('[data-return]').hidden = $('[data-slot-return]').hidden = !on;
    if (!on) { els.screen.removeAttribute('style'); return; }
    const w = Math.min(420,innerWidth-12);
    state.box ??= {x:innerWidth-w-6,y:65,width:w,height:w*9/16+36};
    paintBox();
  }
  function drag(handle,resize) {
    on(handle,'pointerdown',e => {
      if (!state.floating || e.button !== 0 || e.target.closest('button')) return;
      state.gesture = {id:e.pointerId,x:e.clientX,y:e.clientY,box:{...state.box}};
      handle.setPointerCapture(e.pointerId); e.preventDefault();
    });
    on(handle,'pointermove',e => {
      const g = state.gesture;
      if (g?.id !== e.pointerId) return;
      const dx=e.clientX-g.x, dy=e.clientY-g.y;
      if (resize) {
        state.box.width = g.box.width+dx; state.box.height = g.box.height+dy;
      } else {
        state.box.x = g.box.x+dx; state.box.y = g.box.y+dy;
      }
      paintBox();
    });
    on(handle,'lostpointercapture',() => { state.gesture = null; save(); });
  }
  function modes() {
    const full = Boolean(els.root.fullscreenElement || els.root.webkitFullscreenElement || els.video.webkitDisplayingFullscreen);
    $('[data-full]').textContent = full ? T.exitFull : T.full;
    $('[data-full]').setAttribute('aria-pressed',String(full));
    const pip = Boolean(document.pictureInPictureElement || els.root.pictureInPictureElement);
    $('[data-pip]').textContent = pip ? T.exitPip : T.pip;
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        await (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else if (els.screen.requestFullscreen || els.screen.webkitRequestFullscreen) {
        await (els.screen.requestFullscreen || els.screen.webkitRequestFullscreen).call(els.screen);
      } else if (els.video.webkitEnterFullscreen) els.video.webkitEnterFullscreen();
      else show(T.fullscreenError);
    } catch { show(T.fullscreenError); }
  }
  async function pip() {
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await els.video.requestPictureInPicture();
    } catch { show(T.pipError); }
  }
  function volumeUI() {
    const silent = els.video.muted || !els.video.volume;
    $('[data-mute]').textContent = silent ? T.unmute : T.mute;
    $('[data-mute]').setAttribute('aria-pressed',String(silent));
    $('[data-volume]').value = els.video.muted ? 0 : els.video.volume;
  }
  function mute() {
    if (!els.video.volume) { els.video.volume=0.5; els.video.muted=false; }
    else els.video.muted = !els.video.muted;
    volumeUI();
  }
  function keyboard(e) {
    if (!state.active || e.ctrlKey || e.metaKey || e.altKey ||
        e.target.closest('input,select,textarea,[contenteditable=true]')) return;
    switch (e.key.toLowerCase()) {
      case 'f': fullscreen(); break;
      case 'm': mute(); break;
      case ' ':
        if (e.target.closest('button')) return;
        if (els.video.paused) els.video.play().catch(() => show(T.tap)); else els.video.pause();
        break;
      case 'arrowup': case 'arrowdown':
        els.video.muted = false;
        els.video.volume = Math.max(0,Math.min(1,els.video.volume+(e.key==='ArrowUp'?0.1:-0.1)));
        volumeUI(); break;
      default: return;
    }
    e.preventDefault();
  }
  function options(select,values) { select.replaceChildren(...values.map(v=>new Option(v,v))); }
  function catalogUI() {
    const network=$('[data-network]'), section=$('[data-section]'), list=$('.channels');
    function rows() {
      list.replaceChildren();
      for (const row of catalog.filter(r=>r[0]===network.value && r[1]===section.value)) {
        const b=document.createElement('button');
        b.type='button'; b.dataset.channel=row[4][0];
        b.textContent=row[2]+(row[3]===section.value || row[3]==='عادي'?'':' · '+row[3]);
        b.onclick=()=>play(row); list.append(b);
      }
      mark();
    }
    function sections(preferred) {
      options(section,[...new Set(catalog.filter(r=>r[0]===network.value).map(r=>r[1]))]);
      if (preferred) section.value=preferred;
      rows();
    }
    options(network,[...new Set(catalog.map(r=>r[0]))]);
    const last=catalog.find(r=>r[4][0]===prefs.last);
    if (last) network.value=last[0];
    sections(last?.[1]);
    if (last) {
      const resume=$('[data-last]');
      resume.hidden=false; resume.textContent='آخر قناة · '+last[2]+' · '+last[3];
      resume.onclick=()=>play(last);
    }
    on(network,'change',()=>sections()); on(section,'change',rows);
  }
  function leave() {
    if (!state.active) return;
    state.active=false; stop(); setFloat(false);
    els.pane.classList.remove('sd-open'); els.tab.setAttribute('aria-pressed','false');
  }
  function activate() {
    if (state.active) return;
    els.tabs.querySelector('[data-mode="tv"]')?.click();
    els.pane.querySelector('[data-tv-stop]')?.click();
    document.querySelector('#chat-tv-floating [data-float-close]')?.click();
    state.active=true; els.pane.classList.add('sd-open');
    for (const b of els.tabs.querySelectorAll('button')) b.setAttribute('aria-pressed',String(b===els.tab));
    show(T.choose);
  }
  function unmount() {
    leave(); mounted?.abort();
    els.panel?.remove(); els.tab?.remove();
    for (const k of Object.keys(els)) delete els[k];
  }
  function mount() {
    const tabs=document.querySelector('#dpnl .chat-youtube-tabs'), pane=document.getElementById('chat-tv');
    if (tabs && pane && els.tab?.parentNode===tabs && els.panel?.parentNode===pane) return;
    unmount();
    if (!tabs || !pane) return;
    mounted=new AbortController();
    els.tabs=tabs; els.pane=pane;
    els.tab=document.createElement('button'); els.tab.type='button'; els.tab.textContent='⚽ '+T.sports;
    els.tab.setAttribute('aria-pressed','false'); on(els.tab,'click',activate);
    els.panel=document.createElement('section'); els.panel.className='sd-sports';
    els.panel.setAttribute('aria-label',T.sports);
    els.root=els.panel.attachShadow({mode:'open'});
    els.root.innerHTML=`
      <style>${sheet}</style><div class="layout">
        <div class="slot"><button type="button" data-slot-return hidden>${T.back}</button>
          <div class="screen" tabindex="0" aria-label="${T.screen}">
            <div class="head"><strong>${T.sports}</strong><button type="button" data-return hidden>${T.back}</button></div>
            <video controls playsinline aria-label="${T.screen}"></video><div class="grip" title="${T.resize}">◢</div>
          </div>
        </div>
        <div class="tools">
          <button type="button" data-full>${T.full}</button><button type="button" data-float aria-pressed="false">${T.float}</button>
          <button type="button" data-pip hidden>${T.pip}</button><button type="button" data-stop>${T.stop}</button>
          <button type="button" data-mute>${T.mute}</button>
          <label class="volume">${T.volume}<input type="range" data-volume min="0" max="1" step="0.05" value="1"></label>
          <button type="button" data-retry hidden>${T.retry}</button><button type="button" data-alt hidden></button>
        </div><p class="status" role="status">${T.choose}</p>
        <div class="filters"><label>${T.network}<select data-network></select></label><label>${T.section}<select data-section></select></label></div>
        <button type="button" data-last hidden></button><div class="channels" role="group" aria-label="${T.channels}"></div>
      </div>`;
    Object.assign(els,{screen:$('.screen'),slot:$('.slot'),video:$('video'),title:$('strong'),status:$('.status')});
    catalogUI(); volumeUI();
    const actions={full:fullscreen,float:()=>setFloat(!state.floating),stop,mute,pip,
      return:()=>setFloat(false),'slot-return':()=>setFloat(false),
      retry:()=>state.row && play(state.row,state.index,true),
      alt:()=>state.row && play(state.row,(state.index+1)%state.row[4].length,true)};
    for (const [name,fn] of Object.entries(actions)) on($('[data-'+name+']'),'click',fn);
    $('[data-pip]').hidden=!(document.pictureInPictureEnabled && els.video.requestPictureInPicture);
    on($('[data-volume]'),'input',e=>{els.video.muted=false;els.video.volume=Number(e.target.value);volumeUI();});
    on(els.video,'volumechange',volumeUI); on(els.root,'keydown',keyboard);
    for (const type of ['fullscreenchange','webkitfullscreenchange']) on(document,type,modes);
    for (const type of ['enterpictureinpicture','leavepictureinpicture','webkitbeginfullscreen','webkitendfullscreen']) on(els.video,type,modes);
    drag($('.head'),false); drag($('.grip'),true); tabs.append(els.tab); pane.prepend(els.panel);
  }
  function schedule() {
    if (state.scan) return;
    state.scan=requestAnimationFrame(()=>{state.scan=0;mount();});
  }
  const narrow=new MutationObserver(schedule);
  function observe() {
    const dpnl=document.getElementById('dpnl');
    if (state.observed!==dpnl) {
      narrow.disconnect(); state.observed=dpnl;
      if (dpnl) narrow.observe(dpnl,{childList:true,subtree:true});
    }
    if (!els.tab?.isConnected || !els.panel?.isConnected) schedule();
  }
  const outer=new MutationObserver(() => {
    if (!state.observed?.isConnected || !els.panel?.isConnected || !els.tab?.isConnected) observe();
  });
  function start() { outer.observe(document.body,{childList:true,subtree:true}); observe(); mount(); }
  const optionsLife={signal:life.signal};
  document.addEventListener('click',e=>{
    if (state.active && e.target.closest?.('.chat-youtube-tabs [data-mode],#chat-cinema-tab,#dpnl .th-dpnl-close,#settings .SERT,#d0 [data-key]')) leave();
  },{capture:true,signal:life.signal});
  window.addEventListener('pagehide',leave,optionsLife);
  window.addEventListener('resize',paintBox,optionsLife);
  window[key]={destroy() {
    life.abort(); narrow.disconnect(); outer.disconnect(); cancelAnimationFrame(state.scan);
    unmount(); style.remove(); delete window[key];
  }};
  if (document.body) start(); else document.addEventListener('DOMContentLoaded',start,{once:true,signal:life.signal});
})();
