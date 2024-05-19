import { useMemo } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mc/ui/breadcrumb";

import type { EditDataSourceProps } from "./Options/EditDataSourceOptions";
import { getDataSourceMetadata } from "./dataSourcesMetadata";

export const NestedDataSourceBreadcrumb = ({
  editStack,
  navigateTo,
}: {
  editStack: EditDataSourceProps[];
  navigateTo: (i: number) => void;
}) => {
  const displayNames = useMemo(
    () =>
      editStack.map((editStack) => {
        const metadata = getDataSourceMetadata(editStack.dataSource.id);

        return metadata.displayName({ ...editStack.dataSource });
      }),
    [editStack],
  );
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {displayNames.map((displayName, index) => {
          const isLast = editStack.length === index + 1;
          return (
            <BreadcrumbItem key={index}>
              {!isLast ? (
                <BreadcrumbLink
                  className="cursor-pointer select-none"
                  onClick={() => navigateTo(index)}
                >
                  <span>{displayName}</span>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="select-none">
                  <span>{displayName}</span>
                </BreadcrumbPage>
              )}
              {!isLast && <BreadcrumbSeparator className="ml-1" />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
