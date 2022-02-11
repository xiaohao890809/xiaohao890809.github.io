/**
 * @file: custom config
 */

let mainConfig = {
  vssueConfig: {
    owner: "xiaohao890809",
    repo: "xiaohao890809.github.io",
    clientId: "0d936e21f37435f24ee5",
    clientSecret: "a5c8c89ed767fb9192989064ebf46159d4efe9f7"
  },

  repoConfig: {
    owner: "xiaohao890809",
    repo: "xiaohao890809.github.io",
    pushBranch: "master",
    email: "419969329@qq.com",
    filterUsers: []
  },

  title: "YiFei Zhang's Blog",
  description: "在这里了解我的一切，对编程的热爱永不停歇。",
  customDomain: "",
  base: "/",

  slogan: {
    main: "有逻辑的灵魂，",
    sub: "造就有温度的编码。"
  },

  themeConfig: {
    nav: [
      {
        name: "首页",
        link: "/"
      },
      {
        name: "Github",
        link: "https://github.com/xiaohao890809"
      },
      {
        name: "CV",
        link: "/Issue-Blog-With-Github-Action/cv.html"
      }
    ],
    headTitle: ["暮春早夏的月亮", "原是情人的月亮，不比秋冬是诗人的月亮"],
    friendLinks: [
      {
        name: "watercow",
        link: "https://github.com/watercow/watercow.github.io/issues"
      },
      {
        name: "ycjgg",
        link: "https://ycjgg.github.io"
      }
    ],
    extraFooters: [
      {
        title: "",
        text: "",
        link: ""
      }
    ],
    pageCount: false
  },

  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: "https://avatars.githubusercontent.com/u/9626465"
      }
    ]
  ]
}

module.exports = mainConfig