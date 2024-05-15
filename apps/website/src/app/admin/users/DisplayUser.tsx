/* eslint-disable @next/next/no-img-element */
export const DisplayUser = ({
  id,
  username,
  discriminator,
  avatar,
}: {
  id: string;
  username?: string;
  discriminator?: string;
  avatar?: string;
}) => (
  <div className="flex flex-row items-center gap-2">
    {avatar && username && discriminator ? (
      <>
        <img
          src={avatar}
          alt={`${username}'s avatar`}
          className="h-8 w-8 rounded-full"
        />
        <div>
          {username}
          {discriminator !== "0" && (
            <span className="text-muted-foreground">#{discriminator}</span>
          )}
        </div>
      </>
    ) : (
      <span className="text-muted-foreground">Uknown user {id}</span>
    )}
  </div>
);
