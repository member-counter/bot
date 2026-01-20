export const PremiumTier3 = ({
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
        d="M20.14.8a1.21 1.21 0 0 0-2.28 0l-.5 1.37a2 2 0 0 1-1.19 1.18l-1.38.51a1.21 1.21 0 0 0 0 2.28l1.38.5a2 2 0 0 1 1.18 1.19l.51 1.38c.13.34.37.57.65.7.6.24 1.36.01 1.63-.7l.5-1.38a2 2 0 0 1 1.19-1.18l1.38-.51a1.21 1.21 0 0 0 0-2.28l-1.38-.5a2 2 0 0 1-1.18-1.19L20.14.79Z"
      ></path>
      <path
        fill={fill}
        d="M13.25 1.56c.3.24.23.7-.06.93a3.22 3.22 0 0 0 .9 5.52l1.17.43a.5.5 0 0 1 .3.3l.43 1.16a3.14 3.14 0 0 0 2.51 2.06c.27.04.5.26.5.54V16c0 1.07-.4 2.06-1.05 2.6l-4.9 4c-.65.53-1.45.53-2.1 0l-4.9-4A3.37 3.37 0 0 1 5 16V8c0-1.07.4-2.06 1.05-2.6l4.9-4a1.59 1.59 0 0 1 2.1 0l.2.16Z"
      ></path>
    </svg>
  );
};
