export const Verified = ({
  fill,
  size = "13",
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
      role="åimg"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill={fill}
        fillRule="evenodd"
        d="M18.7 7.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4l3.3 3.29 7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};
