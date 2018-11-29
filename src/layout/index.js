const menuList = [{
  title: '编辑中心',
  icon: 'icon-bianji',
  hasSubmenu: true,
  hidden: false,
  children: [
    {
      title: '焦点图管理',
      hasSubmenu: false,
      goto: 'focus',
      hidden: false,
    },
    {
      title: '非遗go',
      hasSubmenu: false,
      goto: 'produce',
      hidden: false,
    },
    {
      title: '非遗圈',
      hasSubmenu: false,
      goto: 'group',
      hidden: false,
    },
    {
      title: '活动',
      hasSubmenu: false,
      goto: 'activity',
      hidden: false,
    }
  ]
},
{
  title: '运营中心',
  icon: 'icon-yunying',
  hasSubmenu: true,
  hidden: false,
  children: [
    {
      title: '启动页管理',
      hasSubmenu: false,
      goto: 'startPage',
      hidden: false,
    },
    {
      title: '评价审核',
      hasSubmenu: false,
      goto: 'comments',
      hidden: false,
    },
    {
      title: '用户管理',
      hasSubmenu: false,
      goto: 'user',
      hidden: false,
    }
  ]
},
{
  title: '系统管理',
  icon: 'icon-shezhi',
  hasSubmenu: true,
  hidden: false,
  children: [
    {
      title: '菜单管理',
      hasSubmenu: false,
      goto: 'menu',
      hidden: false,
    },
    {
      title: '标签管理',
      hasSubmenu: false,
      goto: 'labels',
      hidden: false,
    },
    {
      title: '热搜词管理',
      hasSubmenu: false,
      goto: 'keyword',
      hidden: false,
    }
  ]
}, 
{
  title: '账号管理',
  icon: 'icon-yonghu',
  hasSubmenu: true,
  hidden: false,
  children: [
    {
      title: '管理员列表',
      icon: '',
      hasSubmenu: false,
      goto: 'account',
      hidden: false,
    }
  ]
}  
]

export {
  menuList
}