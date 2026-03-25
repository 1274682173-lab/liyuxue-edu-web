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


  if (document.documentElement.scrollTop > viewportHeight * 0.2) {
    //originbox出现
    originBox.style.opacity = '1'
    originBox.style.left = '0'
  }
  else {
    //originbox消失
    originBox.style.opacity = '0'
    originBox.style.left = '40%'
  }


  if (document.documentElement.scrollTop > viewportHeight * 0.5) {
    //originbox出现
    originText.style.opacity = '1'
    originText.style.left = '0'
  }
  else {
    //originbox消失
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
          startBanner()
          bannerself()
        }, 3000)

      }, 1000)


    }
  }, 4000)
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
      fixdQrcodeBoxImg[e.target.dataset.index - 1].style.transform = 'translateX(102%)'// 复原
    }
  }
})


//手机号验证

const phoneInput = document.getElementById('phoneInput');
const submitBtn = document.getElementById('submitPhoneBtn');
const messageDiv = document.getElementById('phoneMessage');

submitBtn.addEventListener('click', async () => {
  const phone = phoneInput.value.trim();

  if (!phone) {
    messageDiv.innerHTML = '<span style="color: #ef4444;">请输入手机号</span>';
    return;
  }
  if (!/^1[0-9]{10}$/.test(phone)) {
    messageDiv.innerHTML = '<span style="color: #ef4444;">手机号格式不正确（11位数字）</span>';
    return;
  }

  messageDiv.innerHTML = '<span style="color: #6b7280;">提交中...</span>';

  try {
    const response = await fetch('/api/phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phone })
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.innerHTML = '<span style="color: #10b981;">提交成功！我们会尽快联系您</span>';
      phoneInput.value = '';
      setTimeout(() => {
        if (messageDiv.innerHTML.includes('提交成功')) messageDiv.innerHTML = '';
      }, 3000);
    } else {
      messageDiv.innerHTML = `<span style="color: #ef4444;">${data.error || '提交失败'}</span>`;
    }
  } catch (err) {
    messageDiv.innerHTML = '<span style="color: #ef4444;">网络错误，请确保服务器已启动</span>';
    console.error('提交错误:', err);
  }
});


//初始化 AI 客服聊天功能
function initAIChat() {
  // 获取 DOM 元素
  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const closeChat = document.getElementById('closeChat');
  const sendBtn = document.getElementById('sendMessage');
  const userInput = document.getElementById('userMessage');
  const messagesDiv = document.getElementById('chatMessages');

  // 防御性检查：确保所有元素都存在
  if (!chatToggle || !chatWindow || !closeChat || !sendBtn || !userInput || !messagesDiv) {
    console.warn('AI 聊天所需 DOM 元素未找到');
    return;
  }

  // 切换聊天窗口显示/隐藏
  const toggleChatWindow = () => {
    const isHidden = chatWindow.style.display === 'none';
    chatWindow.style.display = isHidden ? 'flex' : 'none';
  };

  // 关闭聊天窗口
  const closeChatWindow = () => {
    chatWindow.style.display = 'none';
  };

  // 添加消息到界面
  const addMessage = (text, type) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.textContent = text;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return msgDiv;
  };

  // 添加“正在输入”提示
  const addTypingIndicator = () => {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.textContent = '正在输入...';
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return typingDiv;
  };

  // 发送消息核心逻辑
  const sendChatMessage = async () => {
    const message = userInput.value.trim();
    if (!message) return;

    // 显示用户消息并清空输入框
    addMessage(message, 'user');
    userInput.value = '';

    // 显示“正在输入”
    const typingMsg = addTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
      });

      const data = await response.json();

      // 移除“正在输入”
      typingMsg.remove();

      // 显示 AI 回复
      if (response.ok) {
        const reply = data.reply || '抱歉，我没理解您的问题';
        addMessage(reply, 'bot');
      } else {
        const errorMsg = data.error || '服务繁忙，请稍后再试';
        addMessage(errorMsg, 'bot');
      }
    } catch (err) {
      typingMsg.remove();
      addMessage('网络错误，请检查网络连接', 'bot');
      console.error('AI 聊天错误:', err);
    }
  };

  // 绑定事件
  chatToggle.addEventListener('click', toggleChatWindow);
  closeChat.addEventListener('click', closeChatWindow);
  sendBtn.addEventListener('click', sendChatMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAIChat);
} else {
  initAIChat();
}


// 获取左侧按钮和 AI 窗口元素
const consultBtn = document.getElementById('consultBtn');
const chatWindow = document.getElementById('chatWindow');  // 请确保 AI 窗口 ID 正确

if (consultBtn && chatWindow) {
  consultBtn.addEventListener('click', () => {
    // 显示 AI 聊天窗口（根据您的实际显示方式调整）
    chatWindow.style.display = 'flex';
    // 如果窗口有隐藏/显示逻辑，可模拟点击切换按钮
    // 或者直接设置样式
  });
}