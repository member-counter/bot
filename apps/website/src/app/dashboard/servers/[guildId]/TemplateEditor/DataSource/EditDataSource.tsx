import { useContext, useEffect, useMemo, useState } from "react";

import { Drawer, DrawerContent } from "@mc/ui/drawer";
import { Portal } from "@mc/ui/portal";

import { useBreakpoint } from "~/hooks/useBreakpoint";
import { SidePanelContext } from "../../SidePanelContext";
import { TemplateEditorContext } from "../TemplateEditorContext";
import EditDataSourcePanel from "./EditDataSourcePanel";

export default function EditDataSource() {
  const isDesktop = useBreakpoint("md");
  const [open, setOpen] = useState(false);
  const sidePanel = useContext(SidePanelContext);
  const {
    dataSourceRefs,
    setDataSourceRef,
    editingDataSourceRefId,
    setEditingDataSourceRefId,
    disabled,
  } = useContext(TemplateEditorContext);

  useEffect(() => {
    setOpen(!!editingDataSourceRefId);
  }, [editingDataSourceRefId]);

  const editingDataSource = useMemo(
    () => dataSourceRefs.get(editingDataSourceRefId ?? ""),
    [editingDataSourceRefId, dataSourceRefs],
  );

  const editDataSourceRendered = useMemo(
    () =>
      editingDataSourceRefId &&
      editingDataSource && (
        <EditDataSourcePanel
          dataSourceRefId={editingDataSourceRefId}
          dataSource={editingDataSource}
          onChangeDataSource={(dataSource) =>
            setDataSourceRef([editingDataSourceRefId, dataSource])
          }
          onClose={() => setEditingDataSourceRefId(null)}
        />
      ),
    [
      editingDataSource,
      editingDataSourceRefId,
      setDataSourceRef,
      setEditingDataSourceRefId,
    ],
  );

  if (isDesktop) {
    if (!sidePanel) return;
    return <Portal container={sidePanel}>{editDataSourceRendered}</Portal>;
  }
  return (
    <Drawer
      open={!disabled && open}
      onClose={() => setEditingDataSourceRefId(null)}
    >
      <DrawerContent className="max-h-screen bg-popover">
        {editDataSourceRendered}
      </DrawerContent>
    </Drawer>
  );
}
