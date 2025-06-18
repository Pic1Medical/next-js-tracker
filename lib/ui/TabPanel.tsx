import { usePathname } from "next/navigation";

export interface Tab<Name extends string = string> {
  name: Name;
  label: (props: { active: boolean }) => React.ReactNode;
  onClick: () => void;
}

export interface Props<Names extends string = string> {
  activeTab: Names;
  children: {
    tabs: Array<Tab<Names>>;
    viewport: React.ReactNode;
  };
}

export default function TabPanel({ activeTab, children }: Props) {
  function Tab({ name, label: TabLabel, onClick }: Tab) {
    return (
      <div
        className="tab"
        aria-selected={activeTab === name}
        onClick={onClick}
      >
        <TabLabel active={activeTab === name} />
      </div>
    );
  }
  return (
    <div className="tab-panel">
      <div className="tabs">{children.tabs.map(Tab)}</div>
      <div className="tab-viewport">{children.viewport}</div>
    </div>
  );
}
