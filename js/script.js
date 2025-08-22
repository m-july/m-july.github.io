// 为缺失的jQuery提供基本替代，避免错误
if (typeof jQuery === 'undefined') {
  window.jQuery = window.$ = function() {
    return {
      on: function() { return this; },
      addClass: function() { return this; },
      removeClass: function() { return this; },
      each: function() { return this; },
      find: function() { return this; },
      attr: function() { return this; },
      css: function() { return this; },
      append: function() { return this; },
      hide: function() { return this; },
      after: function() { return this; },
      wrap: function() { return this; },
      focus: function() { return this; },
      select: function() { return this; },
      offset: function() { return { top: 0, left: 0 }; },
      hasClass: function() { return false; },
      length: 0,
      ready: function(fn) {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', fn);
        } else {
          fn();
        }
        return this;
      },
      fancybox: function() { return this; }
    };
  };
  window.jQuery.fancybox = function() {};
}

(function($){
  // Search
  var $searchWrap = $('#search-form-wrap'),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var startSearchAnim = function(){
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $('#nav-search-btn').on('click', function(){
    if (isSearchAnim) return;

    startSearchAnim();
    $searchWrap.addClass('on');
    stopSearchAnim(function(){
      $('.search-form-input').focus();
    });
  });

  $('.search-form-input').on('blur', function(){
    startSearchAnim();
    $searchWrap.removeClass('on');
    stopSearchAnim();
  });

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      title = $this.attr('data-title'),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
            '<a href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter"></a>',
            '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook"></a>',
            '<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="article-share-pinterest" target="_blank" title="Pinterest"></a>',
            '<a href="https://www.linkedin.com/shareArticle?mini=true&url=' + encodedUrl + '" class="article-share-linkedin" target="_blank" title="LinkedIn"></a>',
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox') || $(this).parent().is('a')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" data-fancybox=\"gallery\" data-caption="' + alt + '"></a>')
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });

  // 代码块复制功能
  function initCodeCopy() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const codeBlock = this.closest('.highlight');
        
        // 正确提取代码内容，保持换行符
        const codeLines = Array.from(codeBlock.querySelectorAll('.code .line'));
        const codeContent = codeLines.map(line => line.textContent).join('\n');
        
        // 使用现代剪贴板API
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(codeContent).then(() => {
            showCopySuccess(this);
          }).catch(err => {
            console.error('复制失败:', err);
            fallbackCopyTextToClipboard(codeContent, this);
          });
        } else {
          // 降级方案
          fallbackCopyTextToClipboard(codeContent, this);
        }
      });
    });
  }

  // 降级复制方案
  function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showCopySuccess(button);
    } catch (err) {
      console.error('降级复制也失败了:', err);
    }
    
    document.body.removeChild(textArea);
  }

  // 显示复制成功反馈
  function showCopySuccess(button) {
    const originalIcon = button.innerHTML;
    button.innerHTML = '<i class="fa-solid fa-check"></i>';
    button.style.color = 'var(--primary)';
    button.disabled = true;
    
    setTimeout(() => {
      button.innerHTML = originalIcon;
      button.style.color = '';
      button.disabled = false;
    }, 1500);
  }

  // 为现有代码块添加头部栏
  function addCodeHeaders() {
    document.querySelectorAll('.highlight').forEach(block => {
      if (block.querySelector('.code-header')) return; // 已存在头部栏
      
      // 提取语言信息
      const langClass = Array.from(block.classList)
        .find(cls => cls !== 'highlight');
      const lang = langClass || 'text';
      
      // 创建头部栏
      const header = document.createElement('div');
      header.className = 'code-header';
      header.innerHTML = `
        <span class="code-lang">${lang}</span>
        <button class="copy-btn" title="复制代码">
          <i class="fa-regular fa-copy"></i>
        </button>
      `;
      
      // 插入到代码块顶部
      block.insertBefore(header, block.firstChild);
    });
  }

  // DOM加载完成后初始化
  $(document).ready(function() {
    addCodeHeaders();
    initCodeCopy();
  });

})(typeof jQuery !== 'undefined' ? jQuery : null);

// 代码块功能 - 独立的纯JavaScript实现，不依赖jQuery
(function() {
  'use strict';
  
  // 代码块复制功能
  function initCodeCopy() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const codeBlock = this.closest('.highlight');
        
        // 正确提取代码内容，保持换行符
        const codeLines = Array.from(codeBlock.querySelectorAll('.code .line'));
        const codeContent = codeLines.map(line => line.textContent).join('\n');
        
        // 使用现代剪贴板API
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(codeContent).then(() => {
            showCopySuccess(this);
          }).catch(err => {
            console.error('复制失败:', err);
            fallbackCopyTextToClipboard(codeContent, this);
          });
        } else {
          // 降级方案
          fallbackCopyTextToClipboard(codeContent, this);
        }
      });
    });
  }

  // 降级复制方案
  function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showCopySuccess(button);
    } catch (err) {
      console.error('降级复制也失败了:', err);
    }
    
    document.body.removeChild(textArea);
  }

  // 显示复制成功反馈
  function showCopySuccess(button) {
    const originalIcon = button.innerHTML;
    button.innerHTML = '<i class="fa-solid fa-check"></i>';
    button.style.color = 'var(--primary)';
    button.disabled = true;
    
    setTimeout(() => {
      button.innerHTML = originalIcon;
      button.style.color = '';
      button.disabled = false;
    }, 1500);
  }

  // 为现有代码块添加头部栏
  function addCodeHeaders() {
    document.querySelectorAll('.highlight').forEach(block => {
      if (block.querySelector('.code-header')) return; // 已存在头部栏
      
      // 提取语言信息
      const langClass = Array.from(block.classList)
        .find(cls => cls !== 'highlight');
      const lang = langClass || 'text';
      
      // 创建头部栏
      const header = document.createElement('div');
      header.className = 'code-header';
      header.innerHTML = `
        <span class="code-lang">${lang}</span>
        <button class="copy-btn" title="复制代码">
          <i class="fa-regular fa-copy"></i>
        </button>
      `;
      
      // 插入到代码块顶部
      block.insertBefore(header, block.firstChild);
    });
  }

  // DOM加载完成后初始化 - 纯JavaScript版本
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      addCodeHeaders();
      initCodeCopy();
    });
  } else {
    // DOM已经加载完成
    addCodeHeaders();
    initCodeCopy();
  }

})();