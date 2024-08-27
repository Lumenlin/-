// 对外暴露配置路由
// 常量路由：全部用户都可以访问的路由
export const constantRoute = [
  {
    // 登录
    path: '/login',
    component: () => import('@/views/login/login.vue'),
    name: 'login', // 命名路由
    meta: {
      title: '登录', // 菜单标题
      hidden: true, // 路由在菜单中是否隐藏，true：隐藏
      icon: 'Promotion', //菜单图标
    },
  },
  {
    // 登录成功展示数据的路由
    path: '/',
    component: () => import('@/layout/layout.vue'),
    name: 'layout',
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/home.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        },
      },
    ],
  },
  {
    // 404
    path: '/404',
    component: () => import('@/views/404/404.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: 'Close',
    },
  },
  // 数据大屏
  {
    path: '/screen',
    component: () => import('@/views/screen/screen.vue'),
    name: 'Screen',
    meta: {
      title: '数据大屏',
      hidden: false,
      icon: 'Platform',
    },
  },
]

// 异步路由
export const asyncRoute = [
  // 权限管理
  {
    path: '/acl',
    component: () => import('@/layout/layout.vue'),
    name: 'Acl',
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'Lock',
    },
    redirect: '/acl/user',
    children: [
      {
        path: '/acl/user',
        component: () => import('@/views/acl/user/user.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User',
        },
      },
      {
        path: '/acl/role',
        component: () => import('@/views/acl/role/role.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'UserFilled',
        },
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/acl/permission/permission.vue'),
        name: 'Permission',
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'Monitor',
        },
      },
    ],
  },
  // 商品管理
  {
    path: '/product',
    component: () => import('@/layout/layout.vue'),
    name: 'Product',
    meta: {
      title: '商品管理',
      hidden: false,
      icon: 'Goods',
    },
    redirect: '/product/trademark',
    children: [
      {
        path: '/product/trademark',
        component: () => import('@/views/product/trademark/trademark.vue'),
        name: 'Trademark',
        meta: {
          title: '品牌管理',
          hidden: false,
          icon: 'ShoppingCartFull',
        },
      },
      {
        path: '/product/attr',
        component: () => import('@/views/product/attr/attr.vue'),
        name: 'Attr',
        meta: {
          title: '属性管理',
          hidden: false,
          icon: 'ChromeFilled',
        },
      },

      {
        path: '/product/spu',
        component: () => import('@/views/product/spu/spu.vue'),
        name: 'Spu',
        meta: {
          title: 'spu管理',
          hidden: false,
          icon: 'Calendar',
        },
      },
      {
        path: '/product/sku',
        component: () => import('@/views/product/sku/sku.vue'),
        name: 'Sku',
        meta: {
          title: 'sku管理',
          hidden: false,
          icon: 'Orange',
        },
      },
    ],
  },
]

// 任意路由
export const anyRoute = [
  {
    // 用来捕获所有没有被其他路由匹配到的路径
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
      title: '任意路由',
      hidden: true,
      icon: 'Operation',
    },
  },
]


