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
    email: "xiaohao890809@126.com",
    filterUsers: ["xiaohao890809","xiaohao89"]
  },

  title: "耗子的博客",
  description: "在这里了解我的一切，对编程的热爱永不停歇。",
  customDomain: "",
  base: "/",

  slogan: {
    main: "永忆江湖归白发，",
    sub: "欲回天地入扁舟。"
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
    headTitle: ["越努力，越幸运", "生活不止眼前的苟且，还有诗和远方"],
    friendLinks: [
      {
        name: "watercow",
        link: "https://github.com/watercow/watercow.github.io/issues"
      },
      {
        name: "yidada",
        link: "https://blog.simplenaive.cn/"
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