// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
//怎让当前页面内容存活：用数据结构把它数据存起来，刷新页面时再把数据结构里的数据渲染到页面
//当前用到的数据结构：数组里面存哈希表
//[
// {logo:'A', url:'https://www.acfun.cn'},
// {logo:'./images/bilibili.jpg', url:'https://www.bilibili.com/'}
// ]
var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last');
var x = localStorage.getItem('x'); //读取本地存储

var xObject = JSON.parse(x); //变成对象
//用parcel会默认在代码外面加一曾作用域，所以这个不是全局变量，不用当心全局污染

var hashMap = xObject || [//第一次的时候xObject是空的，所以这里要设置一个初始值
{
  logo: 'G',
  logoType: 'text',
  url: 'https://github.com/'
}, {
  logo: 'J',
  logoType: 'text',
  url: 'https://juejin.im/'
}, {
  logo: 'V',
  logoType: 'text',
  url: 'https://vuejs.org/'
}, {
  logo: 'R',
  logoType: 'text',
  url: 'https://reactjs.org/'
}, {
  logo: 'I',
  logoType: 'text',
  url: 'https://www.iconfont.cn/'
}, {
  logo: 'B',
  logoType: 'text',
  url: 'https://www.bilibili.com/'
} //新增网站：
];

var simplifyUrl = function simplifyUrl(url) {
  //显示函数，把协议省略不显示
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, '') //如果输入的网址包含查询字符串
  .split('.')[0];
};

var render = function render() {
  //渲染添加了成员的新哈希表，要去掉之前的存在的已经渲染的
  $siteList.find('li:not(.last)').remove();
  hashMap.forEach(function (node, index) {
    //用js写html
    var $li = $("<li>\n<!--            <a href=\"".concat(node.url, "\">-->\n                <div class=\"site\">\n                    <div class=\"logo\">").concat(node.logo, "</div>\n                    <div class=\"close\">\n                        <svg class=\"icon\">\n                            <use xlink:href=\"#icon-baseline-close-px\"></use>\n                        </svg>\n                    </div>\n                </div>\n                <div class=\"link\">").concat(simplifyUrl(node.url), "</div>\n<!--            </a>-->\n        </li>")).insertBefore($lastLi);
    $li.on('click', function () {
      //不用a标签，用js实现代替跳转到新页面，还是要阻止冒泡
      window.open(node.url);
    });
    $li.on('click', '.close', function (e) {
      e.stopPropagation(); //阻止冒泡点击还是会触发a标签跳转，不用a标签

      hashMap.splice(index, 1);
      render(); //删除之后记得重新渲染
    });
  });
}; //声名了要render一次


render();
$('.addButton').on('click', function () {
  //问用户填啥的全局方法
  var url = window.prompt('请输入地址');
  if (!url) return;

  if (url.indexOf('http') !== 0) {
    url = 'https://' + url;
  } // console.log(url);
  // console.log($siteList);
  // const $li = $(`
  //       <li>
  //     <a href="${url}">
  //         <div class="site">
  //             <div class="logo">${url[8]}</div>
  //             <div class="link">${url}</div>
  //         </div>
  //     </a>
  // </li>
  // `).insertBefore($lastLi);
  //新增网址


  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    logoType: 'text',
    url: url
  });
  render();
}); //点击链接其他网站之前要把当前的哈希存一下，确保退回当前页的时候你添加的网址还存在
//监听离开当前页面之前触发的事件：
//存到localStorage,storage只能存储字符串

window.onbeforeunload = function () {
  // console.log("页面要关闭了");
  //对象变成字符串
  var string = JSON.stringify(hashMap);
  localStorage.setItem('x', string); //key, value   意思是在本地的存储里面设置一个x，x的值就是string
}; //监听键盘事件


$(document).on('keypress', function (e) {
  // const key=e.key;
  var key = e.key; //e对象中有key同名
  // for (let i=0; i<hashMap.length; i++){
  //     if (hashMap[i].logo.toLowerCase()===key){
  //         window.open(hashMap[i].url);
  //     }
  // }

  hashMap.forEach(function (node, index) {
    if (node.logo.toLowerCase() === key) {
      window.open(node.url);
    }
  });
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.7de81cda.js.map