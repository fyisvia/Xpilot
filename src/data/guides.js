// Xpilot Copyright 2025 [Fyisvia Virell] — https://mj.fyisvia.com
// Licensed under AGPL-3.0 with Additional Terms (see LICENSE).
// Note: Certain non-code assets (including datasets, content sets, or media files)
// are excluded from the AGPL license and may NOT be publicly published or redistributed
// without written permission from the author. (See LICENSE for details)

export const guideData = {
  // removed top-level title/disclaimer — these are now provided via i18n
  beginner: {
    resources: [
      {
        id: 1,
        title: "《基本规则篇》星野Poteto",
        link: "https://b23.tv/zcyuy63",
        isExternal: true
      },
      {
        id: 2,
        title: "《麻将手役大全》ZERO",
        link: "https://www.bilibili.com/read/readlist/rl411847",
        isExternal: true
      }
    ]
  },
  advanced: {
    categories: [
      {
        id: 1,
        name: "基础篇",
        resources: [
          {
            id: 1,
            title: "《初学者の运气》小菅紅",
            link: "https://www.bilibili.com/read/readlist/rl819010",
            isExternal: true
          },
          {
            id: 2,
            title: "《麻将的教科书——完美算点》日本Pro麻将连盟",
            link: "https://www.bilibili.com/read/readlist/rl481924",
            isExternal: true
          },
          {
            id: 3,
            title: "《麻将学习·牌效率》G·ウザク",
            link: "https://www.bilibili.com/read/readlist/rl509592",
            isExternal: true
          }
        ]
      },
      {
        id: 2,
        name: "攻防判断",
        resources: [
          {
            id: 1,
            title: "《统计学麻将战术》みーにん",
            link: "https://www.bilibili.com/read/readlist/rl97988",
            isExternal: true
          },
          {
            id: 2,
            title: "《麻将 铁攻的条件》平澤元気",
            link: "https://www.bilibili.com/read/readlist/rl257506",
            isExternal: true
          },
          {
            id: 3,
            title: "《凶介带你一起升凤》钱默吟",
            link: "https://space.bilibili.com/7499393/lists/992145",
            isExternal: true
          }
        ]
      },
      {
        id: 3,
        name: "策略战术",
        resources: [
          {
            id: 1,
            title: "《麻将强者的0秒思考》前半/后半",
            link: "https://www.bilibili.com/read/readlist/rl265065",
            link: "https://www.bilibili.com/read/readlist/rl550974",
            isExternal: true
          },
          {
            id: 2,
            title: "《用数据读牌》平澤元気",
            link: "https://www.bilibili.com/read/readlist/rl595010",
            isExternal: true
          },
          {
            id: 3,
            title: "《序盘的铁战略》钱默吟",
            link: "https://www.bilibili.com/read/readlist/rl230215",
            isExternal: true
          }
        ]
      },
      {
        id: 4,
        name: "综合选修",
        resources: [
          {
            id: 1,
            title: "《麻将杰作\"何切\"300选》福地诚/G·Uzaku （何切三百问）",
            link: "/three-hundred",
            isExternal: false,
            useRouter: true
          },
          {
            id: 2,
            title: "《铳率原理》連鎖",
            link: "https://www.bilibili.com/read/readlist/rl514081",
            isExternal: true
          },
          {
            id: 3,
            title: "《麻将——多面听分析》纯全三色对对和",
            link: "https://www.bilibili.com/read/readlist/rl119817",
            isExternal: true
          },
          {
            id: 4,
            title: "《2+6枚复合型精细牌效》雪见yukimi",
            link: "https://zhuanlan.zhihu.com/p/63218895",
            isExternal: true
          },
          {
            id: 5,
            title: "《现代麻雀最新理论》雀ゴロK",
            link: "https://www.bilibili.com/read/readlist/rl333253",
            isExternal: true
          },
          {
            id: 6,
            title: "《麻雀数理研究会》",
            link: "https://note.com/mahjong_math",
            isExternal: true
          }
        ]
      }
    ]
  }
};