import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../../styles/components/ui/Breadcrumb.scss';

const Breadcrumb = ({
  items = [],
  separator = '/',
  maxItems = 4,
  showHome = true,
  className = '',
  ...props
}) => {
  const location = useLocation();

  // Auto-generate breadcrumbs from current route if no items provided
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    if (showHome) {
      breadcrumbs.push({
        label: 'Dashboard',
        href: '/admin',
        icon: '🏠'
      });
    }

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip if it's just 'admin'
      if (segment === 'admin' && showHome) return;

      // Format segment label
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      label = label.replace(/-/g, ' ').replace(/_/g, ' ');
      
      // Add special cases
      if (segment === 'newspapers') label = 'E-Journals';
      if (segment === 'whistleblower-reports') label = 'Reports';
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();
  
  // Truncate items if too many
  const displayItems = breadcrumbItems.length > maxItems
    ? [
        breadcrumbItems[0],
        { label: '...', isEllipsis: true },
        ...breadcrumbItems.slice(-maxItems + 2)
      ]
    : breadcrumbItems;

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumb for single item
  }

  const baseClass = 'admin-breadcrumb';

  return (
    <nav 
      className={`${baseClass} ${className}`}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className={`${baseClass}__list`}>
        {displayItems.map((item, index) => (
          <li key={index} className={`${baseClass}__item`}>
            {item.isEllipsis ? (
              <span className={`${baseClass}__ellipsis`}>
                {item.label}
              </span>
            ) : item.isActive ? (
              <span 
                className={`${baseClass}__text ${baseClass}__text--active`}
                aria-current="page"
              >
                {item.icon && (
                  <span className={`${baseClass}__icon`}>
                    {item.icon}
                  </span>
                )}
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.href}
                className={`${baseClass}__link`}
                title={item.label}
              >
                {item.icon && (
                  <span className={`${baseClass}__icon`}>
                    {item.icon}
                  </span>
                )}
                {item.label}
              </Link>
            )}
            
            {index < displayItems.length - 1 && (
              <span className={`${baseClass}__separator`}>
                {separator}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;