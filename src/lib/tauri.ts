import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

export interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Document {
  id: string;
  title: string;
  file_type: string;
  folder_id: string | null;
  path: string;
  size: number | null;
  page_count: number | null;
  embedding_status: string;
  summary: string | null;
  tags: Tag[];
  created_at: string | null;
  updated_at: string | null;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder_id: string | null;
  tags: Tag[];
  created_at: string | null;
  updated_at: string | null;
}

export interface Thread {
  id: string;
  title: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Message {
  id: string;
  thread_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string | null;
}

export interface WatchedFolder {
  id: string;
  path: string;
  is_paused: boolean;
  created_at: string | null;
}

export interface OllamaModel {
  name: string;
  size: number;
}

export async function getFolders(): Promise<Folder[]> {
  return invoke<Folder[]>("get_folders");
}

export async function getTags(): Promise<Tag[]> {
  return invoke<Tag[]>("get_tags");
}

export async function getDocuments(): Promise<Document[]> {
  return invoke<Document[]>("get_documents");
}

export async function deleteDocument(id: string): Promise<boolean> {
  return invoke<boolean>("delete_document", { id });
}

export async function addTag(
  documentId: string,
  tagName: string,
): Promise<void> {
  return invoke("add_tag", { document_id: documentId, tag_name: tagName });
}

export async function ingestFile(path: string): Promise<Document> {
  return invoke<Document>("ingest_file", { path });
}

export async function pickFile(): Promise<string | null> {
  const result = await open({
    multiple: false,
    directory: false,
  });
  return result as string | null;
}

export async function getNotes(): Promise<Note[]> {
  return invoke<Note[]>("get_notes");
}

export async function createNote(): Promise<Note> {
  return invoke<Note>("create_note");
}

export async function updateNote(
  id: string,
  title: string,
  content: string,
): Promise<void> {
  return invoke("update_note", { id, title, content });
}

export async function deleteNote(id: string): Promise<boolean> {
  return invoke<boolean>("delete_note", { id });
}

export async function getThreads(): Promise<Thread[]> {
  return invoke<Thread[]>("get_threads");
}

export async function createThread(title: string): Promise<Thread> {
  return invoke<Thread>("create_thread", { title });
}

export async function deleteThread(id: string): Promise<boolean> {
  return invoke<boolean>("delete_thread", { id });
}

export async function sendMessage(
  threadId: string,
  content: string,
): Promise<void> {
  return invoke("send_message", { threadId, content });
}

export async function getMessages(threadId: string): Promise<Message[]> {
  return invoke<Message[]>("get_messages", { threadId });
}

export async function renameThread(id: string, title: string): Promise<void> {
  return invoke("rename_thread", { id, title });
}

export async function getWatchedFolders(): Promise<WatchedFolder[]> {
  return invoke<WatchedFolder[]>("get_watched_folders");
}

export async function addWatchedFolder(path: string): Promise<WatchedFolder> {
  return invoke<WatchedFolder>("add_watched_folder", { path });
}

export async function removeWatchedFolder(id: string): Promise<boolean> {
  return invoke<boolean>("remove_watched_folder", { id });
}

export async function toggleFolderPause(id: string): Promise<WatchedFolder> {
  return invoke<WatchedFolder>("toggle_folder_pause", { id });
}

export async function getOllamaModels(): Promise<OllamaModel[]> {
  return invoke<OllamaModel[]>("get_ollama_models");
}

export async function embedDocument(documentId: string): Promise<void> {
  return invoke("embed_document", { documentId });
}
