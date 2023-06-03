export const navigation = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
  },

  {
    name: 'Company',
    url: '',
    icon: 'fa fa-building',
    children: [
      {
        name: 'Manage Companies',
        url: '/company/list',
        icon: 'fa fa-building',
        pathMatch: 'full',
      },
      {
        name: 'Company Documents',
        url: '/company/documents',
        icon: 'fa fa-file',
      },
      {
        name: 'Company Types',
        url: '/company/types',
        icon: 'fa fa-building',
      },
      {
        name: 'Company Attributes',
        url: '/company/attributes/0/0',
        icon: 'fa fa-building',
      },
      {
        name: 'Company Status',
        url: '/company/statuses',
        icon: 'fa fa-building',
      },
    ],
  },
  {
    name: 'Locations',
    url: '',
    icon: 'fa fa-map-marker',
    children: [
      {
        name: 'Manage Locations',
        url: '/location/list',
        icon: 'fa fa-map-marker',
      },
      {
        name: 'Location Types',
        url: '/location/types',
        icon: 'fa fa-map-marker',
      },
      {
        name: 'Location Status',
        url: '/location/status',
        icon: 'fa fa-map-marker',
      },
    ],
  },
  {
    name: 'Items',
    url: '',
    icon: 'fa fa-sitemap',
    children: [
      {
        name: 'Manage Items',
        url: '/items/list',
        icon: 'fa fa-sitemap',
      },
      {
        name: 'Item Types',
        url: '/items/types',
        icon: 'fa fa-sitemap',
      },
      {
        name: 'Item Status',
        url: '/items/status',
        icon: 'fa fa-sitemap',
      },
      {
        name: 'Item Repair Items',
        url: '/items/repairItems',
        icon: 'fa fa-sitemap',
      },
    ],
  },
  {
    name: 'Template',
    url: '/template',
    icon: 'fa fa-user-circle-o',
  },
  {
    name: 'Vendor',
    url: '/vendor/list',
    icon: 'fa fa-user-circle',
  },
  {
    name: 'Warranty',
    url: '/warranty/list',
    icon: 'fa fa-superpowers',
  },
  {
    name: 'Users',
    url: '',
    icon: 'fa fa-users',
    children: [
      {
        name: 'User Management',
        url: '/user/list',
        icon: 'fa fa-users',
      },
      {
        name: 'User Types',
        url: '/user/types',
        icon: 'fa fa-users',
      },
    ],
  },

  {
    name: 'User Profile',
    url: '/profile',
    icon: 'fa fa-user',
    children: [
      {
        name: 'My Profile',
        url: '/profile',
        icon: 'fa fa-user',
      },
    ],
  },
  {
    name: 'Failure Type',
    url: '/failuretype',
    icon: 'fa fa-bug',
  },

  {
    name: 'Help',
    url: '/theme/help',
    icon: 'fa fa-question',
  },

  {
    divider: true,
  },
];
