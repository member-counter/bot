import { useNavigate } from "react-router";

import { routes } from "@mc/common/Routes";
import { Button } from "@mc/ui/button";

import { api } from "~/lib/trpc";
import { DisplayUser } from "./DisplayUser";

interface Props {
  userId: string;
}

export const RecentUser = ({ userId }: Props) => {
  const navigate = useNavigate();
  const discordUser = api.discord.getUser.useQuery({ id: userId });

  return (
    <Button
      onClick={() =>
        navigate(routes.admin.users.user.$buildPath({ params: { userId } }))
      }
      className="py-8 text-start"
      variant="ghost"
    >
      <div className="w-full py-8">
        <DisplayUser {...{ id: userId, ...discordUser.data }} />
      </div>
    </Button>
  );
};
