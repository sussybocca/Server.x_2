"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Editor from "@monaco-editor/react";
import { supabase } from "../../lib/supabase";

// Type for file/folder nodes
type FileNode = {
  type: "file" | "folder";
  name: string;
  content?: string;
  children?: FileNode[];
};

export default function ServerEditor() {
  const params = useParams();
  const serverUrl = decodeURIComponent(params.serverUrl);

  const [root, setRoot] = useState<FileNode>({ type: "folder", name: "root", children: [] });
  const [activePath, setActivePath] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Helper: find node by path
  const findNode = (node: FileNode, path: string[]): FileNode | null => {
    if (path.length === 0) return node;
    if (!node.children) return null;
    const [head, ...rest] = path;
    const child = node.children.find(c => c.name === head);
    if (!child) return null;
    return findNode(child, rest);
  };

  // Load server files
  useEffect(() => {
    async function loadServer() {
      const { data, error } = await supabase
        .from("servers")
        .select("files")
        .eq("virtual_url", serverUrl)
        .single();
      if (error) return console.error(error);

      setRoot(data.files || { type: "folder", name: "root", children: [] });

      // Set first file found as active
      const firstFile = data.files?.children?.find((n: FileNode) => n.type === "file")?.name || null;
      if (firstFile) setActivePath([firstFile]);
    }
    loadServer();
  }, [serverUrl]);

  // Save server files
  const saveFiles = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("servers")
      .update({ files: root })
      .eq("virtual_url", serverUrl);
    if (error) console.error(error);
    setSaving(false);
  };

  // Active node
  const activeNode = findNode(root, activePath);

  // Add file or folder
  const addNode = (parentPath: string[], type: "file" | "folder") => {
    const name = prompt(type === "file" ? "File name" : "Folder name");
    if (!name) return;
    const parent = findNode(root, parentPath);
    if (!parent || parent.type !== "folder") return;
    parent.children = parent.children || [];
    parent.children.push({
      type,
      name,
      content: type === "file" ? "" : undefined,
      children: type === "folder" ? [] : undefined
    });
    setRoot({ ...root });
    if (type === "file") setActivePath([...parentPath, name]);
  };

  // Rename node
  const renameNode = (path: string[]) => {
    const node = findNode(root, path);
    if (!node) return;
    const newName = prompt("Rename to", node.name);
    if (!newName) return;
    node.name = newName;
    setRoot({ ...root });
  };

  // Delete node
  const deleteNode = (path: string[]) => {
    if (path.length === 0) return;
    const parent = findNode(root, path.slice(0, -1));
    if (!parent || !parent.children) return;
    parent.children = parent.children.filter(c => c.name !== path[path.length - 1]);
    setRoot({ ...root });
    setActivePath([]);
  };

  // Recursive folder tree UI
  const renderTree = (node: FileNode, path: string[] = []) => {
    if (node.type === "file") {
      return (
        <div
          key={path.join("/")}
          className={`px-2 py-1 cursor-pointer hover:bg-zinc-700 ${
            activePath.join("/") === path.join("/") ? "bg-blue-600" : ""
          }`}
        >
          <span onClick={() => setActivePath(path)}>{node.name}</span>
          <button className="ml-2 text-red-400" onClick={() => deleteNode(path)}>×</button>
          <button className="ml-1 text-yellow-400" onClick={() => renameNode(path)}>✎</button>
        </div>
      );
    }

    return (
      <div key={path.join("/")} className="ml-2">
        <div className="font-bold flex gap-2">
          <span>{node.name}</span>
          <button className="text-green-400" onClick={() => addNode(path, "file")}>+F</button>
          <button className="text-green-600" onClick={() => addNode(path, "folder")}>+Folder</button>
          {path.length > 0 && <button className="text-yellow-400" onClick={() => renameNode(path)}>✎</button>}
          {path.length > 0 && <button className="text-red-400" onClick={() => deleteNode(path)}>×</button>}
        </div>
        <div className="ml-4">
          {node.children?.map(child => renderTree(child, [...path, child.name]))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen flex flex-row bg-zinc-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-800 p-2 overflow-auto">
        {renderTree(root)}
        <button className="mt-2 w-full bg-blue-700 p-1 rounded" onClick={saveFiles}>
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        {activeNode && activeNode.type === "file" && (
          <Editor
            height="100%"
            defaultLanguage={activeNode.name.split(".").pop() || "javascript"}
            value={activeNode.content}
            onChange={val => {
              activeNode.content = val || "";
              setRoot({ ...root });
            }}
            theme="vs-dark"
          />
        )}
      </div>
    </div>
  );
}
