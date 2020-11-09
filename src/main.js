//怎让当前页面内容存活：用数据结构把它数据存起来，刷新页面时再把数据结构里的数据渲染到页面
//当前用到的数据结构：数组里面存哈希表
//[
// {logo:'A', url:'https://www.acfun.cn'},
// {logo:'./images/bilibili.jpg', url:'https://www.bilibili.com/'}
// ]
const $siteList = $('.siteList');
const $lastLi = $siteList.find('li.last');
const x = localStorage.getItem('x');//读取本地存储
const xObject = JSON.parse(x);//变成对象
//用parcel会默认在代码外面加一曾作用域，所以这个不是全局变量，不用当心全局污染
const hashMap = xObject || [//第一次的时候xObject是空的，所以这里要设置一个初始值
    {logo: 'A', logoType: 'text', url: 'https://www.acfun.cn'},
    {logo: 'B', logoType: 'text', url: 'https://www.bilibili.com'},

    //新增网站：
];

const simplifyUrl = (url) => {
    //显示函数，把协议省略不显示
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '')//如果输入的网址包含查询字符串
      .split('.')[0]

}
const render = () => {
    //渲染添加了成员的新哈希表，要去掉之前的存在的已经渲染的
    $siteList.find('li:not(.last)').remove();
    hashMap.forEach((node, index) => {
        //用js写html
        const $li = $(`<li>
<!--            <a href="${node.url}">-->
                <div class="site">
                    <div class="logo">${node.logo}</div>
                    <div class="close">
                        <svg class="icon">
                            <use xlink:href="#icon-baseline-close-px"></use>
                        </svg>
                    </div>
                </div>
                <div class="link">${simplifyUrl(node.url)}</div>
<!--            </a>-->
        </li>`).insertBefore($lastLi);
        $li.on('click', ()=>{//不用a标签，用js实现代替跳转到新页面，还是要阻止冒泡
            window.open(node.url);
        })
        $li.on('click', '.close', (e) => {
            e.stopPropagation();//阻止冒泡点击还是会触发a标签跳转，不用a标签
            hashMap.splice(index, 1);
            render();//删除之后记得重新渲染
        })

    })
}
//声名了要render一次
render();
$('.addButton')
    .on('click', () => {
        //问用户填啥的全局方法
        let url = window.prompt('请输入地址');
        if (!url)return
        if (url.indexOf('http') !== 0) {
            url = 'https://' + url;
        }

        // console.log(url);
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
        hashMap.push({logo: simplifyUrl(url)[0].toUpperCase(), logoType: 'text', url: url});
        render();
    })
//点击链接其他网站之前要把当前的哈希存一下，确保退回当前页的时候你添加的网址还存在
//监听离开当前页面之前触发的事件：
//存到localStorage,storage只能存储字符串
window.onbeforeunload = () => {
    // console.log("页面要关闭了");
    //对象变成字符串
    const string = JSON.stringify(hashMap);
    localStorage.setItem('x', string);//key, value   意思是在本地的存储里面设置一个x，x的值就是string

}

//监听键盘事件
$(document).on('keypress', (e)=>{
    // const key=e.key;
    const {key} = e;//e对象中有key同名

    // for (let i=0; i<hashMap.length; i++){
    //     if (hashMap[i].logo.toLowerCase()===key){
    //         window.open(hashMap[i].url);
    //     }
    // }

    hashMap.forEach((node, index) =>{
        if (node.logo.toLowerCase()===key){
            window.open(node.url);
        }
    })
})