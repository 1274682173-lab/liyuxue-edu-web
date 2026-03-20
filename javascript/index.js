// 获取当前视口的宽高度
let viewportWidth = window.innerWidth
let viewportHeight = window.innerHeight
window.addEventListener('resize', () => {
  viewportWidth = window.innerWidth
  viewportHeight = window.innerHeight
})



//origin 滑动

//顶部固定栏滑动
const topNav = document.querySelector('.header')
const logo = document.querySelector('.header h1 a img')
const originBox = document.querySelector('.origin .box')
const originText = document.querySelector('.origin .origintext')

// 滚动触发器
window.addEventListener('scroll', function () {


  if (document.documentElement.scrollTop > viewportHeight * 0.12) {
    //logo变色
    logo.style.filter = 'brightness(0) invert(1)'
    //header出现
    topNav.style.backgroundColor = '#126fe0d3'
  } else {
    //logo变色
    logo.style.filter = 'none'
    //header离开
    topNav.style.backgroundColor = '#126fe000'
  }


  if (document.documentElement.scrollTop > viewportHeight * 0.4) {
    //originbox出现
    originBox.style.opacity = '1'
    originBox.style.left = '0'
  }
  else {
    //originbox出现
    originBox.style.opacity = '0'
    originBox.style.left = '40%'
  }


  if (document.documentElement.scrollTop > viewportHeight * 0.8) {
    //originbox出现
    originText.style.opacity = '1'
    originText.style.left = '0'
  }
  else {
    //originbox出现
    originText.style.opacity = '0'
    originText.style.left = '40%'
  }
})



//banner自动翻页
const bannerUl = document.querySelector('.banner ul')
let bannerimgk = 1 // 初始指向第一页（0vw）
let bannerInterval = null

function startBanner() {
  bannerInterval = setInterval(function bannerself() {
    if (bannerimgk < 4) {
      bannerimgk += 1
      bannerUl.style.transition = 'transform 0.5s ease'
      bannerUl.style.transform = `translateX(-${100 * (bannerimgk - 1)}vw)`
    } else {
      // 到达第四页，准备翻到第五页（复制的第一张）
      bannerimgk += 1

      // 第1步：0.5秒动画从第四页翻到第五页
      bannerUl.style.transition = 'transform 0.5s ease'
      bannerUl.style.transform = `translateX(-${100 * (bannerimgk - 1)}vw)`

      // 清除当前轮播
      clearInterval(bannerInterval)

      // 第2步：500ms后闪现到第一页，然后重新开始轮播
      setTimeout(() => {
        console.log('闪现到第一页')

        // 关闭过渡，瞬间跳转到第一页
        bannerUl.style.transition = 'none'
        bannerUl.style.transform = `translateX(0vw)`
        bannerimgk = 1

        // 等待一小段时间后重新开始轮播
        setTimeout(() => {
          bannerUl.style.transition = 'transform 0.5s ease'
          startBanner()  // 重新开始轮播，从第二页开始
          bannerself()
        }, 3000)

      }, 1000) // 


    }
  }, 4000) // 每1秒翻一页
}

// 初始化启动
startBanner()

//进入大菜单
const menuBt = document.querySelector('.menubt')
const menuOpen = document.querySelector('.menuopen')
const menuClose = document.querySelector('.menubtopen')
let closeMenuTimecount = null;
let isLocked = false;  // 添加锁

// 打开菜单
menuBt.addEventListener('click', () => {
  if (isLocked) return;  // 锁住时直接返回

  isLocked = true;  // 上锁

  if (closeMenuTimecount) {
    clearTimeout(closeMenuTimecount);
  }

  menuOpen.style.opacity = '1';
  menuOpen.style.display = 'block';
  menuOpen.style.top = '0%';

  // 0.8秒后解锁
  setTimeout(() => {
    isLocked = false;
  }, 800);

  console.log('菜单打开了');
});

// 关闭菜单
menuClose.addEventListener('click', () => {
  if (isLocked) return;  // 锁住时直接返回

  isLocked = true;  // 上锁

  if (closeMenuTimecount) {
    clearTimeout(closeMenuTimecount);
  }

  menuOpen.style.opacity = '0';
  menuOpen.style.top = '-100%';

  closeMenuTimecount = setTimeout(() => {
    menuOpen.style.display = 'none';
    closeMenuTimecount = null;
  }, 500);

  // 0.8秒后解锁
  setTimeout(() => {
    isLocked = false;
  }, 800);

  console.log('菜单关闭了');
});

//固定菜单栏二维码弹出
const fixdIcon = document.querySelector('.fixdconect ul')
const fixdQrcodeBoxImg = document.querySelectorAll('.qrcodebox ul li img')
console.log(fixdQrcodeBoxImg[0].dataset.index);

fixdIcon.addEventListener('mouseover', e => {
  if (viewportWidth <= 1300) {
    if (e.target.tagName === 'SPAN') {
      fixdQrcodeBoxImg[e.target.dataset.index - 1].style.transform = 'translateY(0%)'
    }
  } else {
    if (e.target.tagName === 'SPAN') {
      fixdQrcodeBoxImg[e.target.dataset.index - 1].style.transform = 'translateX(0%)'
    }
  }
})


fixdIcon.addEventListener('mouseout', e => {
  if (viewportWidth <= 1300) {
    if (e.target.tagName === 'SPAN') {
      fixdQrcodeBoxImg[e.target.dataset.index - 1].style.transform = 'translateY(100%)'// 复原
    }
  } else {
    if (e.target.tagName === 'SPAN') {
      fixdQrcodeBoxImg[e.target.dataset.index - 1].style.transform = 'translateX(100%)'// 复原
    }
  }
})