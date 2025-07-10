// Copyright 2025 [Fyisvia Virell]
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
// See the LICENSE file in the project root for full license information.

export const guideData = {
  title: "入门到进阶",
  disclaimer: "声明：本文中的资料整理仅出于非商业性的学习交流目的，一切权利归原作者所有。",
  beginner: {
    title: "入门",
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
    title: "进阶",
    categories: [
      {
        id: 1,
        name: "牌效",
        resources: [
          {
            id: 1,
            title: "《麻将技术教科书：有效率的和牌方法》小林刚/井出洋介",
            link: "https://www.bilibili.com/read/readlist/rl480264",
            isExternal: true
          },
          {
            id: 2,
            title: "《麻将学习·牌效率》G·Uzaku",
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
          }
        ]
      },
      {
        id: 3,
        name: "防守",
        resources: [
          {
            id: 1,
            title: "《麻将技术教科书：不会放铳的打法》小林刚/井出洋介",
            link: "https://www.bilibili.com/read/readlist/rl398453",
            isExternal: true
          }
        ]
      },
      {
        id: 4,
        name: "何切",
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
            title: "《麻将定式\"何切\"301选》福地诚/G·Uzaku",
            link: "https://www.bilibili.com/read/readlist/rl493079",
            isExternal: true
          },
          {
            id: 3,
            title: "《麻将的二择》みーにん、梶本琢程",
            link: "https://www.bilibili.com/read/readlist/rl116320",
            isExternal: true
          }
        ]
      }
    ]
  }
};