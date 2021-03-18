export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/register";
export const CUSTOMER_ROUTE = "";
export const STAFF_ROUTE = "/staff";
export const ADMIN_ROUTE = "/admin";
export const CUSTOMER_HOME = `${CUSTOMER_ROUTE}/home`;
export const CUSTOMER_TIMESLOTS = `${CUSTOMER_ROUTE}/timeslots/:attraction_id`;
export const CUSTOMER_BOOKINGS = `${CUSTOMER_ROUTE}/bookings`;
export const STAFF_DASHBOARD = `${STAFF_ROUTE}/dashboard`;
export const ADMIN_DASHBOARD = `${ADMIN_ROUTE}/dashboard`;
export const ADMIN_ATTRACTIONS = `${ADMIN_ROUTE}/attractions`;
export const ADMIN_BOOKINGS = `${ADMIN_ROUTE}/bookings`;

const routes = [
  {
    path: CUSTOMER_ROUTE,
    name: CUSTOMER_ROUTE,
    redirect: CUSTOMER_HOME,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: CUSTOMER_HOME,
        name: CUSTOMER_HOME,
        component: () => import("src/pages/CustomerPages/CustomerHome.vue")
      },
      {
        path: CUSTOMER_TIMESLOTS,
        name: CUSTOMER_TIMESLOTS,
        component: () => import("src/pages/CustomerPages/CustomerTimeslots.vue")
      },
      {
        path: CUSTOMER_BOOKINGS,
        name: CUSTOMER_BOOKINGS,
        component: () => import("src/pages/CustomerPages/CustomerBookings.vue")
      }
    ]
  },
  {
    path: STAFF_ROUTE,
    name: STAFF_ROUTE,
    redirect: STAFF_DASHBOARD,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: STAFF_DASHBOARD,
        name: STAFF_DASHBOARD,
        component: () => import("src/pages/StaffPages/StaffDashboard.vue")
      }
    ]
  },
  {
    path: ADMIN_ROUTE,
    name: ADMIN_ROUTE,
    redirect: ADMIN_ATTRACTIONS,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: ADMIN_DASHBOARD,
        name: ADMIN_DASHBOARD,
        component: () => import("src/pages/AdminPages/AdminDashboard.vue")
      },
      {
        path: ADMIN_ATTRACTIONS,
        name: ADMIN_ATTRACTIONS,
        component: () => import("src/pages/AdminPages/AdminAttractions.vue")
      },
      {
        path: ADMIN_BOOKINGS,
        name: ADMIN_BOOKINGS,
        component: () => import("src/pages/AdminPages/AdminBookings.vue")
      }
    ]
  },
  {
    path: LOGIN_ROUTE,
    name: LOGIN_ROUTE,
    component: () => import("pages/Login.vue")
  },
  {
    path: REGISTER_ROUTE,
    name: REGISTER_ROUTE,
    component: () => import("pages/Register.vue")
  },
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
