const routes = [
  {
    path: "/",
    redirect: "/home",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "home", component: () => import("pages/CustomerDashboard.vue") }
    ]
  },
  {
    path: "/staff",
    redirect: "/staff/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "dashboard", component: () => import("pages/StaffDashboard.vue") }
    ]
  },
  {
    path: "/admin",
    redirect: "/admin/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "dashboard",
        component: () => import("pages/AdminDashboard.vue")
      },
      {
        path: "attractions",
        component: () => import("pages/AdminAttractions.vue")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("pages/Login.vue")
  },
  {
    path: "/register",
    component: () => import("pages/Register.vue")
  },
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
