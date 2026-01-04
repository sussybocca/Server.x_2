"use client";

import { useState } from "react";
import AddressBar from "./AddressBar";
import TabManager from "./TabManager";
import FullscreenGuard from "./FullscreenGuard";
import { resolveVirtualUrl } from "@/lib/url-router";

export default function BrowserShell() {
  const [tabs, setTabs] = useState(["server://home"]);
  const [active, setActive] = useState(0);

  const navigate = (url: string) => {
    const newTabs = [...tabs];
    newTabs[active] = resolveVirtualUrl(url);
    setTabs(newTabs);
  };

  const openNewTab = () => {
    setTabs([...tabs, "server://home"]);
    setActive(tabs.length);
  };

  const closeTab = (index: number) => {
    const newTabs = tabs.filter((_, i) => i !== index);
    setTabs(newTabs.length ? newTabs : ["server://home"]);
    setActive(Math.max(0, active - 1));
  };

  return (
    <FullscreenGuard>
      <div className="h-screen w-screen bg-zinc-900 text-white flex flex-col">
        {/* Tabs */}
        <TabManager
          tabs={tabs}
          active={active}
          onNew={openNewTab}
          onSelect={setActive}
          onClose={closeTab}
        />

        {/* Address Bar */}
        <div className="border-b border-zinc-700">
          <AddressBar
            value={tabs[active]}
            onSubmit={navigate}
          />
        </div>

        {/* Server iframe */}
        <div className="flex-1 bg-black">
          <iframe
            className="w-full h-full border-none bg-black"
            src={`/server/${encodeURIComponent(tabs[active])}`}
            title={tabs[active]}
          />
        </div>
      </div>
    </FullscreenGuard>
  );
}
