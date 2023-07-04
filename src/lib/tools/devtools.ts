import { dev } from "$app/environment";

export function devlog(...messages: any[]) {
  if (dev) console.log(...messages)
}