/**
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import cloneDeep from 'lodash/cloneDeep';

const callbacks = {
  /**
   * 全局的URL处理器
   * @param {string} url 来源url
   * @param {'image'|'audio'|'video'|'autolink'|'link'} srcType 来源类型
   * @returns
   */
  urlProcessor: (url, srcType) => url,
  fileUpload(file, callback) {
    callback('images/demo-dog.png');
  },
  afterChange: (text, html) => {},
  afterInit: (text, html) => {},
  beforeImageMounted: (srcProp, src) => ({ srcProp, src }),
};

/** @type {Partial<import('~types/cherry').CherryOptions>} */
const defaultConfig = {
  // 第三方包
  externals: {
    // externals
  },
  // 解析引擎配置
  engine: {
    // 全局配置
    global: {
      // 是否启用经典换行逻辑
      // true：一个换行会被忽略，两个以上连续换行会分割成段落，
      // false： 一个换行会转成<br>，两个连续换行会分割成段落，三个以上连续换行会转成<br>并分割段落
      classicBr: false,
      /**
       * 全局的URL处理器
       * @param {string} url 来源url
       * @param {'image'|'audio'|'video'|'autolink'|'link'} srcType 来源类型
       * @returns
       */
      urlProcessor: callbacks.urlProcessor,
      /**
       * 额外允许渲染的html标签
       * 标签以英文竖线分隔，如：htmlWhiteList: 'iframe|script|style'
       * 默认为空，默认允许渲染的html见src/utils/sanitize.js whiteList 属性
       * 需要注意：
       *    - 启用iframe、script等标签后，会产生xss注入，请根据实际场景判断是否需要启用
       *    - 一般编辑权限可控的场景（如api文档系统）可以允许iframe、script等标签
       */
      htmlWhiteList: '',
    },
    // 内置语法配置
    syntax: {
      // 语法开关
      // 'hookName': false,
      // 语法配置
      // 'hookName': {
      //
      // }
      list: {
        listNested: false, // 同级列表类型转换后变为子级
        indentSpace: 2, // 默认2个空格缩进
      },
      table: {
        enableChart: false,
        // chartRenderEngine: EChartsTableEngine,
        // externals: ['echarts'],
      },
      inlineCode: {
        theme: 'red',
      },
      codeBlock: {
        theme: 'dark', // 默认为深色主题
        wrap: true, // 超出长度是否换行，false则显示滚动条
        lineNumber: true, // 默认显示行号
        customRenderer: {
          // 自定义语法渲染器
        },
        /**
         * indentedCodeBlock是缩进代码块是否启用的开关
         *
         *    在6.X之前的版本中默认不支持该语法。
         *    因为cherry的开发团队认为该语法太丑了（容易误触）
         *    开发团队希望用```代码块语法来彻底取代该语法
         *    但在后续的沟通中，开发团队发现在某些场景下该语法有更好的显示效果
         *    因此开发团队在6.X版本中才引入了该语法
         *    已经引用6.x以下版本的业务如果想做到用户无感知升级，可以去掉该语法：
         *        indentedCodeBlock：false
         */
        indentedCodeBlock: true,
      },
      emoji: {
        useUnicode: true, // 是否使用unicode进行渲染
      },
      fontEmphasis: {
        allowWhitespace: false, // 是否允许首尾空格
      },
      strikethrough: {
        needWhitespace: false, // 是否必须有首位空格
      },
      mathBlock: {
        engine: 'MathJax', // katex或MathJax
        src: '',
        plugins: true, // 默认加载插件
      },
      inlineMath: {
        engine: 'MathJax', // katex或MathJax
        src: '',
      },
      toc: {
        /** 默认只渲染一个目录 */
        allowMultiToc: false,
      },
      header: {
        /**
         * 标题的样式：
         *  - default       默认样式，标题前面有锚点
         *  - autonumber    标题前面有自增序号锚点
         *  - none          标题没有锚点
         */
        anchorStyle: 'default',
      },
    },
  },
  editor: {
    theme: 'default', // depend on codemirror theme name: https://codemirror.net/demo/theme.htm
    // 编辑器的高度，默认100%，如果挂载点存在内联设置的height则以内联样式为主
    height: '100%',
    // defaultModel 编辑器初始化后的默认模式，一共有三种模式：1、双栏编辑预览模式；2、纯编辑模式；3、预览模式
    // edit&preview: 双栏编辑预览模式
    // editOnly: 纯编辑模式（没有预览，可通过toolbar切换成双栏或预览模式）
    // previewOnly: 预览模式（没有编辑框，toolbar只显示“返回编辑”按钮，可通过toolbar切换成编辑模式）
    defaultModel: 'edit&preview',
    // 粘贴时是否自动将html转成markdown
    convertWhenPaste: true,
  },
  toolbars: {
    theme: 'dark', // light or dark
    showToolbar: true, // false：不展示顶部工具栏； true：展示工具栏; toolbars.showToolbar=false 与 toolbars.toolbar=false 等效
    toolbar: [
      'bold',
      'italic',
      'strikethrough',
      '|',
      'color',
      'header',
      '|',
      'list',
      {
        insert: [
          'image',
          'audio',
          'video',
          'link',
          'hr',
          'br',
          'code',
          'formula',
          'toc',
          'table',
          'line-table',
          'bar-table',
          'pdf',
          'word',
        ],
      },
      'graph',
      'settings',
    ],
    sidebar: [],
    bubble: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', '|', 'size', 'color'], // array or false
    float: ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'quickTable', 'code'], // array or false
  },
  fileUpload: callbacks.fileUpload,
  callback: {
    afterChange: callbacks.afterChange,
    afterInit: callbacks.afterInit,
    beforeImageMounted: callbacks.beforeImageMounted,
  },
  previewer: {
    dom: false,
    className: 'cherry-markdown',
    // 是否启用预览区域编辑能力（目前支持编辑图片尺寸、编辑表格内容）
    enablePreviewerBubble: true,
  },
  // 预览页面不需要绑定事件
  isPreviewOnly: false,
  // 预览区域跟随编辑器光标自动滚动
  autoScrollByCursor: true,
  // 外层容器不存在时，是否强制输出到body上
  forceAppend: true,
};

export default cloneDeep(defaultConfig);
