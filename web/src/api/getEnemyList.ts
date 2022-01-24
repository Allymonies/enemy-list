export default async function getEnemeyList(): Promise<any> {
    const response = await fetch(`/api/enemies`, {
        method: "GET",
        cache: "no-cache"
    });
    if (!response.ok || response.status !== 200) throw new Error(response.statusText);

    const data = await response.json();

    return data.enemies;
}