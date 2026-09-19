export const PremiumTier1 = ({
  fill,
  size = "24",
  className,
}: {
  fill: string;
  size: string;
  className?: string;
}) => {
  return (
    <svg
      className={className}
      aria-hidden="true"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill={fill}
        fillRule="evenodd"
        d="M13.05 1.4a1.59 1.59 0 0 0-2.1 0l-4.9 4A3.37 3.37 0 0 0 5 8v8c0 1.07.4 2.06 1.05 2.6l4.9 4c.65.53 1.45.53 2.1 0l4.9-4A3.37 3.37 0 0 0 19 16V8c0-1.07-.4-2.06-1.05-2.6l-4.9-4ZM12 3.12 7.32 6.95C7.25 7.01 7 7.35 7 8v8c0 .65.25 1 .32 1.05L12 20.88l4.68-3.83c.07-.06.32-.4.32-1.05V8c0-.65-.25-1-.32-1.05L12 3.12Z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};
