/*

    く__,.ヘヽ.　　　　/　,ー､ 〉
    　　　　　＼ ', !-─‐-i　/　/´
    　　　 　 ／｀ｰ'　　　 L/／｀ヽ､            Live2D 看板娘 参数设置
    　　 　 /　 ／,　 /|　 ,　 ,　　　 ',                                           Version 1.4.2
    　　　ｲ 　/ /-‐/　ｉ　L_ ﾊ ヽ!　 i                            Update 2018.11.12
    　　　 ﾚ ﾍ 7ｲ｀ﾄ　 ﾚ'ｧ-ﾄ､!ハ|　 |  
    　　　　 !,/7 '0'　　 ´0iソ| 　 |　　　
    　　　　 |.从"　　_　　 ,,,, / |./ 　 |             网页添加 Live2D 看板娘
    　　　　 ﾚ'| i＞.､,,__　_,.イ / 　.i 　|                    https://www.fghrsh.net/post/123.html
    　　　　　 ﾚ'| | / k_７_/ﾚ'ヽ,　ﾊ.　|           
    　　　　　　 | |/i 〈|/　 i　,.ﾍ |　i　|    Thanks
    　　　　　　.|/ /　ｉ： 　 ﾍ!　　＼　|          journey-ad / https://github.com/journey-ad/live2d_src
    　　　 　 　 kヽ>､ﾊ 　 _,.ﾍ､ 　 /､!            xiazeyu / https://github.com/xiazeyu/live2d-widget.js
    　　　　　　 !'〈//｀Ｔ´', ＼ ｀'7'ｰr'          Live2d Cubism SDK WebGL 2.1 Projrct & All model authors.
    　　　　　　 ﾚ'ヽL__|___i,___,ンﾚ|ノ
    　　　　　 　　　ﾄ-,/　|___./
    　　　　　 　　　'ｰ'　　!_,.:*********************************************************************************/
var in_rand = 1;
var in_order = 2;
var numid; 
var clothid;
var modelnums;
var loadImg = [];
const can = document.getElementById('loading');
const van = can.getContext('2d');
var trigger;
var iskeeping = false;

function renderTip(template, context) {
    var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;
    return template.replace(tokenReg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) {
            return word.replace('\\', '');
        }
        var variables = token.replace(/\s/g, '').split('.');
        var currentObject = context;
        var i, length, variable;
        for (i = 0, length = variables.length; i < length; ++i) {
            variable = variables[i];
            currentObject = currentObject[variable];
            if (currentObject === undefined || currentObject === null) return '';
        }
        return currentObject;
    });
}

String.prototype.renderTip = function (context) {
    return renderTip(this, context);
};

$(document).on('copy', function (){
    showMessage('你都复制了些什么呀，转载要记得加上出处哦~~', 5000, true);
});

$('.tool .fui-home').click(function (){
    //window.location = 'https://www.fghrsh.net/';
    window.location = window.location.protocol+'//'+window.location.hostname+'/'
});

$('.tool .fui-eye').click(function (){
    loadRandModel(in_order);
});

$('.tool .fui-chat').click(function (){
    showHitokoto();
});

$('.tool .fui-user').click(function (){
    loadRandModelClothes(in_order);
});

$('.tool .fui-info-circle').click(function (){
    //window.open('https://imjad.cn/archives/lab/add-dynamic-poster-girl-with-live2d-to-your-blog-02');
    window.open('https://www.fghrsh.net/post/123.html');
});

$('.tool .fui-cross').click(function (){
    sessionStorage.setItem('waifu-dsiplay', 'none');
    showMessage('愿你有一天能与重要的人重逢', 1300, true);
    window.setTimeout(function() {$('#landlord').hide();}, 1300);
});

$('.tool .fui-photo').click(function (){
    showMessage('照好了嘛，是不是很可爱呢？', 5000, true);
    window.Live2D.captureName = 'live2d.png';
    window.Live2D.captureFrame = true;
});

$.ajax({
    cache: true,
    url: '/live2d/message.json',
    dataType: "json",
    success: function (result){
        $.each(result.mouseover, function (index, tips){
            $(document).on('mouseover', tips.selector, function(e){
                if(trigger != this){
                    var text = tips.text;
                    if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                    if(tips.hasOwnProperty("textselector"))
                        text = text.renderTip({text: $(tips.textselector, this).text()});
                    else
                        text = text.renderTip({text: $(this).text()});
                    showMessage(text, 3000);
                    trigger = this;
                }
            });
            $(document).on('mouseleave', tips.selector, function(e){
                trigger = null;
            });
        });
        $.each(result.click, function (index, tips){
            $(document).on('click', tips.selector, function(e){
                var text = tips.text;
                if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                text = text.renderTip({text: $(this).text()});
                showMessage(text, 3000, true);
            });
        });
        $.each(result.seasons, function (index, tips){
            var now = new Date();
            var after = tips.date.split('-')[0];
            var before = tips.date.split('-')[1] || after;
            
            if((after.split('/')[0] <= now.getMonth()+1 && now.getMonth()+1 <= before.split('/')[0]) && 
               (after.split('/')[1] <= now.getDate() && now.getDate() <= before.split('/')[1])){
                var text = tips.text;
                if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                text = text.renderTip({year: now.getFullYear()});
                showMessage(text, 6000, true);
            }
        });
    }
});

(function (){
    var text;
    var SiteIndexUrl = window.location.protocol+'//'+window.location.hostname+'/';  // 自动获取主页
    
    if (window.location.href == SiteIndexUrl) {      // 如果是主页
        var now = (new Date()).getHours();
        if (now > 23 || now <= 5) {
            text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛';
        } else if (now > 5 && now <= 7) {
            text = '早上好！一日之计在于晨，美好的一天就要开始了';
        } else if (now > 7 && now <= 11) {
            text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！';
        } else if (now > 11 && now <= 14) {
            text = '中午了，工作了一个上午，现在是午餐时间！';
        } else if (now > 14 && now <= 17) {
            text = '午后很容易犯困呢，今天的运动目标完成了吗？';
        } else if (now > 17 && now <= 19) {
            text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~';
        } else if (now > 19 && now <= 21) {
            text = '晚上好，今天过得怎么样？';
        } else if (now > 21 && now <= 23) {
            text = '已经这么晚了呀，早点休息吧，晚安~';
        } else {
            text = '嗨~ 快来逗我玩吧！';
        }
    } else {
        if(document.referrer !== ''){
            var referrer = document.createElement('a');
            referrer.href = document.referrer;
            var domain = referrer.hostname.split('.')[1];
            if (window.location.hostname == referrer.hostname) {
                text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
            } else if (domain == 'baidu') {
                text = 'Hello! 来自 百度搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&wd=')[1].split('&')[0] + '</span> 找到的我吗？';
            } else if (domain == 'so') {
                text = 'Hello! 来自 360搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&q=')[1].split('&')[0] + '</span> 找到的我吗？';
            } else if (domain == 'google') {
                text = 'Hello! 来自 谷歌搜索 的朋友<br>欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
            } else {
                text = 'Hello! 来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友';
            }
        } else {
            text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
        }
    }
    showMessage(text, 6000);
})();

window.setInterval(showHitokoto,30000);

function showHitokoto(){
    $.getJSON('https://api.imjad.cn/hitokoto/?cat=&charset=utf-8&length=28&encode=json',function(result){
        showMessage(result.hitokoto, 5000);
    });
}

function showMessage(text, timeout, flag = false){
    if(!iskeeping || flag){
        if(Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1)-1];
        console.log('showMessage', text);
        $('.message').stop();
        $('.message').html(text).fadeTo(200, 1);
        if (timeout === null) timeout = 5000;
        hideMessage(timeout);
        if(flag){
            iskeeping = true;
            setTimeout(function(){ iskeeping = false; }, timeout);
        }
    }
}

function hideMessage(timeout){
    $('.message').stop().css('opacity',1);
    if (timeout === null) timeout = 5000;
    $('.message').delay(timeout).fadeTo(200, 0);
}

function loadpngs(url){
    var request = new XMLHttpRequest();
    request.open("get", url);
    request.send(null);
    request.onload = function() {
        if (request.status == 200) {
            var json = JSON.parse(request.responseText);
            var textures = json.textures;
            for(var i = 0; i < textures.length; i++)
                loadImg.push(url.substring(0, url.lastIndexOf('/')) + '/' + textures[i]);
            load_callback();
        }
    }
}

function load_callback(){
    modelnums--;
    if(modelnums == 0){
        //绘制进度条
        // 先绘制背景，这里只绘制一次，跟水平进度条不一样呢
        drawCircle();

        var imgsNum = loadImg.length;
        var nowNum = 0;
        var nowPercentage = 0; // 用于显示加载每一张图片之后，能够给出百分比
        // 通过for循环，针对loadImg整个数组进行遍历
        for (var i = 0; i < imgsNum; i++) {
            (function(i){
                setTimeout(function(){
                    // 每一次i变化之后，都需要执行这样的内容 - 创建一个img对象，将img对象的src设置为相应的图片地址
                    var newImg = new Image();
                    newImg.src = loadImg[i];
                 
                    // 每一张图片加载完成之后，都可以执行相应的功能，比如我们在制作loading条时，
                    // 希望每加载一张图片之后就能够将当前进度显示出来，就可以用这个方法
                    newImg.onload = (function() {
                        // 一张图片加载完毕之后执行的功能 - 通常是为了控制进度条
                        nowNum++;
                        if (nowNum == imgsNum) {
                            // 加载完成一张图片之后，我们还可以判断是否完成了所有图片的加载，如果完成再执行相应的内容
                        };
                        nowPercentage = nowNum / imgsNum;
                        drawArc(nowPercentage * 360);
                    })();
                },1000);
            })(i);
        }
        loadRandModel();
    }
}

function drawArc(deg) {
    // 计算deg次时的开始角度
    let from = (Math.PI/180)*deg;
    // 计算deg次时的结束角度
    let to = (Math.PI/180)*deg + Math.PI/180;
    van.beginPath();
    van.lineWidth = 6;
    // 设置线头的样式为圆头，默认是方形(不圆润)
    van.lineCap = 'round';
    van.strokeStyle = 'green';
    van.arc(135, 115, 80, from, to, false);
    // 清空画布上的文字，这里不是清除整个画布哦
    van.clearRect(75, 100, 100, 50);
    van.font = '18px serif';
    let text = (deg / 360 * 100).toFixed(2) + '%';
    van.fillText(text, 105, 123);
    van.stroke();
    van.closePath();
    if(deg >= 360){
        setTimeout(function () {
            var list = document.getElementById("landlord");
            list.removeChild(document.getElementById("loading"));
        }, 1000);
    }
}

function drawCircle() {
    van.beginPath();
    van.lineWidth = 6;
    van.strokeStyle = '#ccc';
    van.arc(135, 115, 80, 0,Math.PI * 2, false);
    van.stroke();
    van.closePath();
}

function initModels(){
    var url = "/live2d/model/model_list.json";
    var request = new XMLHttpRequest();
    request.open("get", url);
    request.send(null);
    request.onload = function() {
        if (request.status == 200) {
            var json = JSON.parse(request.responseText);
            var models = json.models;
            modelnums = models.length;
            for(var i = 0; i < models.length; i++){
                if(Array.isArray(models[i])){
                    modelnums += models[i].length - 1;
                }
            }
            for(var i = 0; i < models.length; i++){
                if(Array.isArray(models[i])){
                    for(var j = 0; j < models[i].length; j++){
                        var ModelURL = models[i][j];
                        console.log('live2d', '加载模型' + i + '.' + j);
                        loadpngs("/live2d/model/" + ModelURL + "/index.json");
                    }
                }else{
                    var ModelURL = models[i];
                    console.log('live2d', '加载模型' + i);
                    loadpngs("/live2d/model/" + ModelURL + "/index.json");
                }
            }
        }
    }
}

function loadRandModel(model = in_rand){
    var url = "/live2d/model/model_list.json";
    var request = new XMLHttpRequest();
    request.open("get", url);
    request.send(null);
    request.onload = function() {
        if (request.status == 200) {
            var json = JSON.parse(request.responseText);
            var models = json.models;
            var messages = json.messages;
            if(model == in_rand){
                var length = models.length - 1;
                var randid;
                do{
                    randid = Math.round(Math.random() * length);
                }while(numid == randid);
                numid = randid;
            }else if(model == in_order){
                numid++;
                if(numid == models.length)
                    numid = 0;
            }
            var ModelURL = null;
            if (Array.isArray(models[numid])){
                ModelURL = models[numid][0];
                clothid = 0;
            }else ModelURL = models[numid];
            loadlive2d("live2d", "/live2d/model/" + ModelURL + "/index.json");
            showMessage(messages[numid], 3000, true);
        }
    }
}

function loadRandModelClothes(model = in_rand){
    var url = "/live2d/model/model_list.json";
    var request = new XMLHttpRequest();
    request.open("get", url);
    request.send(null);
    request.onload = function() {
        if (request.status == 200) {
            var json = JSON.parse(request.responseText);
            var models = json.models;
            if (Array.isArray(models[numid])){
                if(model == in_rand){
                    var Length = models[numid].length - 1;
                    var randid;
                    do{
                        randid = Math.round(Math.random() * Length);
                    }while(clothid == randid);
                    clothid = randid;
                }else if(model == in_order){
                    clothid++;
                    if(clothid == models[numid].length)
                        clothid = 0;
                }
                var ModelURL = models[numid][clothid];
                loadlive2d("live2d", "/live2d/model/" + ModelURL + "/index.json");
                showMessage('我的新衣服好看嘛', 3000, true);
            }else{
                showMessage('我还没有其他衣服呢', 3000, true);
            }
        }
    }
}

document.onkeydown=function(){
    var e = window.event||arguments[0];
    if(e.keyCode==123){
        showMessage('不行！那儿有我的秘密！', 3000, true);
        return false;
    }
}