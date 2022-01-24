import Enemy from "../types/enemy";

export default async function getEnemyList(enemies: Enemy[]): Promise<boolean> {
    const response = await fetch(`/api/enemies`, {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ enemies })
    });
    if (!response.ok || response.status !== 200) throw new Error(response.statusText);

    const data = await response.json();

    return data.success;
}