/** Marketing site + Portfolio CRM OS routes. */
export const marketingRoutes = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/industries', label: 'Industries' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
] as const;

export const osRoutes = [
  { href: '/os', label: 'Dashboard' },
  { href: '/os/portal', label: 'Portal' },
  { href: '/os/crm', label: 'Admin CRM' },
  { href: '/os/pipeline', label: 'Pipeline' },
  { href: '/os/portfolio', label: 'Portfolio CRM' },
] as const;
