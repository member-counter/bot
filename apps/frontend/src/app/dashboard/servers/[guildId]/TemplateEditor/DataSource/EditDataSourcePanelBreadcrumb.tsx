import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mc/ui/breadcrumb";

import type { EditDataSourceProps } from "./Options/EditDataSourceOptions";
import { getDataSourceMetadata } from "../DataSource/metadata";

export const NestedDataSourceBreadcrumb = ({
  editStack,
  navigateTo,
}: {
  editStack: EditDataSourceProps[];
  navigateTo: (i: number) => void;
}) => {
  const { i18n } = useTranslation();
  const displayNames = useMemo(
    () =>
      editStack.map((editStack) => {
        const metadata = getDataSourceMetadata(editStack.dataSource.id, i18n);

        return metadata.displayName({ ...editStack.dataSource });
      }),
    [editStack, i18n],
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
