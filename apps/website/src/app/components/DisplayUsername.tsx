export function DisplayUsername({
  className,
  username,
  discriminator,
}: {
  className?: string;
  username: string;
  discriminator: string;
}) {
  return (
    <div className={className}>
      {username}
      {discriminator !== "0" && (
        <span className="text-muted-foreground">#{discriminator}</span>
      )}
    </div>
  );
}
