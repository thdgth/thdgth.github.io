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
    showMessage('你都复制了些什么呀，转载要记得加上出处哦~~', 5000);
});

$('.tool .fui-home').click(function (){
    //window.location = 'https://www.fghrsh.net/';
    window.location = window.location.protocol+'//'+window.location.hostname+'/'
});

$('.tool .fui-eye').click(function (){
    loadRandModel();
});

$('.tool .fui-chat').click(function (){
    showHitokoto();
});

$('.tool .fui-user').click(function (){
    loadRandModelClothes();
});

$('.tool .fui-info-circle').click(function (){
    //window.open('https://imjad.cn/archives/lab/add-dynamic-poster-girl-with-live2d-to-your-blog-02');
    window.open('https://www.fghrsh.net/post/123.html');
});

$('.tool .fui-cross').click(function (){
    //sessionStorage.setItem('waifu-dsiplay', 'none');
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
                if($(tips.selector).is('.class')){
                    $(tips.selector).mouseover(function (){
                        var text = tips.text;
                        if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                        text = text.renderTip({text: $(this).text()});
                        showMessage(text, 3000);
                    });
                }else{
                    $(document).on('mouseover', tips.selector, function(e){
                        var text = tips.text;
                        if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                        text = text.renderTip({text: $(this).text()});
                        showMessage(text, 3000);
                    });
                }
            });
            $.each(result.click, function (index, tips){
                if($(tips.selector).is('.class')){
                    $(tips.selector).click(function (){
                        var text = tips.text;
                        if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                        text = text.renderTip({text: $(this).text()});
                        showMessage(text, 3000);
                    });
                }else{
                    $(document).on('click', tips.selector, function(e){
                        var text = tips.text;
                        if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                        text = text.renderTip({text: $(this).text()});
                        showMessage(text, 3000);
                    });
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

function showMessage(text, timeout){
    if(Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1)-1];
    console.log('showMessage', text);
    $('.message').stop();
    $('.message').html(text).fadeTo(200, 1);
    if (timeout === null) timeout = 5000;
    hideMessage(timeout);
}

function hideMessage(timeout){
    $('.message').stop().css('opacity',1);
    if (timeout === null) timeout = 5000;
    $('.message').delay(timeout).fadeTo(200, 0);
}

var numid; 
var clothid;
var modelnums;
var loadImg = [];

function loadpngs(url){
    var request = new XMLHttpRequest();
    request.open("get", url);
    request.send(null);
    request.onload = function() {
        if (request.status == 200) {
            var json = JSON.parse(request.responseText);
            var textures = json.textures;
            for(var i = 0; i < textures.length - 1; i++)
                loadImg.push(url.substring(0, url.lastIndexOf('/')) + '/' + textures[i]);
            load_callback();
        }
    }
}

function load_callback(){
    modelnums--;
    if(modelnums > 0){
        console.log('剩余' + modelnums + '个json正在读取中');
    }else{
        console.log('开始加载图片');
        var imgsNum = loadImg.length;
        var nowNum = 0;
        var nowPercentage = 0; // 用于显示加载每一张图片之后，能够给出百分比
        // 通过for循环，针对loadImg整个数组进行遍历
        for (var i = 0; i < imgsNum; i++) {
            
            // 每一次i变化之后，都需要执行这样的内容 - 创建一个img对象，将img对象的src设置为相应的图片地址
            var newImg = new Image();
            newImg.src = loadImg[i];
         
            // 每一张图片加载完成之后，都可以执行相应的功能，比如我们在制作loading条时，希望每加载一张图片之后就能够将当前进度显示出来，就可以用这个方法
            newImg.onload = (function() {
                // 一张图片加载完毕之后执行的功能 - 通常是为了控制进度条
                nowNum++;
                if (nowNum == imgsNum) {
                    // 加载完成一张图片之后，我们还可以判断是否完成了所有图片的加载，如果完成再执行相应的内容
                };
                nowPercentage = nowNum / imgsNum * 100;
                console.log(nowPercentage + '%');
            })();
        }
    }
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

function loadRandModel(){
    var url = "/live2d/model/model_list.json";
    var request = new XMLHttpRequest();
    request.open("get", url);
    request.send(null);
    request.onload = function() {
        if (request.status == 200) {
            var json = JSON.parse(request.responseText);
            var models = json.models;
            var messages = json.messages;
            var length = models.length - 1;
            var randid;
            do{
                randid = Math.round(Math.random() * length);
            }while(numid == randid);
            numid = randid;
            var ModelURL = null;
            if (Array.isArray(models[numid]))
                ModelURL = models[numid][0];
            else ModelURL = models[numid];
            loadlive2d("live2d", "/live2d/model/" + ModelURL + "/index.json");
            showMessage(messages[numid], 3000, true);
        }
    }
}

function loadRandModelClothes(){
    var url = "/live2d/model/model_list.json";
    var request = new XMLHttpRequest();
    request.open("get", url);
    request.send(null);
    request.onload = function() {
        if (request.status == 200) {
            var json = JSON.parse(request.responseText);
            var models = json.models;
            if (Array.isArray(models[numid])){
                var Length = models[numid].length - 1;
                var randid;
                do{
                    randid = Math.round(Math.random() * Length);
                }while(clothid == randid);
                clothid = randid;
                var ModelURL = models[numid][clothid];
                loadlive2d("live2d", "/live2d/model/" + ModelURL + "/index.json");
                showMessage('我的新衣服好看嘛', 3000, true);
            }else{
                showMessage('我还没有其他衣服呢', 3000, true);
            }
        }
    }
}
