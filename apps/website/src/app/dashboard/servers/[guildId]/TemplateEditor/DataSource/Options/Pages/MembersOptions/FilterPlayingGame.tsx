import type { DataSource } from "@mc/common/DataSource";
import { useTranslation } from "react-i18next";
import { Label } from "@mc/ui/label";
import { Combobox } from "~/app/components/Combobox";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { addTo, removeFrom, updateIn } from "~/other/array";
import { knownSearcheableDataSources } from "../../../dataSourcesMetadata";

type Type = (string | DataSource)[];
export function FilterPlayingGame({
  value,
  onChange,
}: {
  value: Type;
  onChange: (value: Type) => void;
}) {
  const { t } = useTranslation();

  return (
    <div>
      <Label>{t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterPlayingGame.label')}</Label>
      {value.map((item, index) => (
        <Combobox
          key={index}
          items={knownSearcheableDataSources}
          allowSearchedTerm
          prefillSelectedItemOnSearchOnFocus
          placeholder=""
          selectedItem={item}
          onItemSelect={(item) => {
            onChange(updateIn(value, item, index));
          }}
          onItemRender={textWithDataSourceItemRendererFactory()}
          onSelectedItemRender={textWithDataSourceItemRendererFactory({
            onUpdate: (item) => {
              onChange(updateIn(value, item, index));
            },
            onRemove: () => {
              onChange(removeFrom(value, index));
            },
          })}
        />
      ))}
      <Combobox
        items={knownSearcheableDataSources}
        allowSearchedTerm
        placeholder={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterPlayingGame.placeholder')}
        onItemSelect={(item) => {
          onChange(addTo(value, item));
        }}
        onItemRender={textWithDataSourceItemRendererFactory()}
      />
    </div>
  );
}
