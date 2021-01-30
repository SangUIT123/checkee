module.exports = {
  // Uncomment the line below to enable basePath, pages and
  // redirects will then have a path prefix (`/app` in this case)
  //
  // basePath: '/app',

  async redirects() {
    return [
      {
        source: "/emloyee",
        destination: "/homepage",
        permanent: false,
      },
      {
        source: "/sign-up",
        destination: "/signup",
        permanent: false,
      },
      {
        source: "/forgot-pass",
        destination: "/forgotpass",
        permanent: false,
      },
      {
        source: "/user-type",
        destination: "/usertype",
        permanent: false,
      },
      {
        source: "/system-page",
        destination: "/systempage",
        permanent: false,
      },
      {
        source: "/list-user",
        destination: "/listuser",
        permanent: false,
      },
      {
        source: "/management-menu",
        destination: "/managementmenu",
        permanent: false,
      },
    ];
  },
};
