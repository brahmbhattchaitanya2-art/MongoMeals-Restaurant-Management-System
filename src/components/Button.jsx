import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
};

const Button = forwardRef(({ to, variant = 'primary', className = '', children, ...props }, ref) => {
  const classes = `${variants[variant] || variants.primary} ${className}`.trim();

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});

export default Button;
