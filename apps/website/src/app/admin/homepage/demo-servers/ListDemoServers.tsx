import { routes } from "@mc/common/Routes";
import { Button } from "@mc/ui/button";

import { useNavigate } from "~/lib/navigation";
import { api } from "~/lib/trpc";
import { DisplayDemoServer } from "./DisplayDemoServer";

export const ListDemoServers = () => {
  const demoServers = api.demoServers.geAll.useQuery();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2">
      {demoServers.data?.map((demoServer) => (
        <Button
          onClick={() =>
            void navigate(
              routes.admin.homepage.demoServers.demoServer.$buildPath({
                params: { id: demoServer.id },
              }),
            )
          }
          className="py-8 text-start"
          variant="ghost"
          key={demoServer.id}
        >
          <DisplayDemoServer {...demoServer} />
        </Button>
      ))}
    </div>
  );
};
