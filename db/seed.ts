import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2/promise";
import bcrypt from "bcryptjs";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

async function seed() {
  const connection = createConnection({ uri: DATABASE_URL });
  const db = drizzle(await connection, { mode: "planetscale", schema });

  console.log("Seeding teams...");

  const teamsData: schema.InsertTeam[] = [
    { name: "NEXUS", tier: "1", region: "Europe", points: 995, worldRank: 1, coach: "Anders Vejrgang", country: "DK" },
    { name: "ASTRA", tier: "1", region: "Europe", points: 982, worldRank: 2, coach: "Elena Kowalski", country: "PL" },
    { name: "VORTEX", tier: "1", region: "North America", points: 967, worldRank: 3, coach: "Marcus Chen", country: "US" },
    { name: "PHANTOM", tier: "1", region: "Europe", points: 951, worldRank: 4, coach: "Sven Lindqvist", country: "SE" },
    { name: "SENTINEL", tier: "2", region: "Asia", points: 934, worldRank: 5, coach: "Yuki Tanaka", country: "JP" },
    { name: "MERIDIAN", tier: "2", region: "South America", points: 918, worldRank: 6, coach: "Carlos Rivera", country: "BR" },
    { name: "DRIFTERS", tier: "2", region: "Europe", points: 899, worldRank: 7, coach: "Hans Mueller", country: "DE" },
    { name: "CYCLONE", tier: "2", region: "Asia", points: 876, worldRank: 8, coach: "Wei Zhang", country: "CN" },
    { name: "IRON", tier: "3", region: "North America", points: 854, worldRank: 9, coach: "John Smith", country: "US" },
    { name: "BLAZE", tier: "3", region: "Europe", points: 831, worldRank: 10, coach: "Ana Petrovic", country: "RS" },
    { name: "SHADOW", tier: "3", region: "Asia", points: 812, worldRank: 11, coach: "Kim Jae-hyun", country: "KR" },
    { name: "FROST", tier: "3", region: "Europe", points: 798, worldRank: 12, coach: "Lars Eriksson", country: "NO" },
  ];

  const teamIds: number[] = [];
  for (const team of teamsData) {
    const [result] = await db.insert(schema.teams).values(team);
    teamIds.push(Number(result.insertId));
  }

  console.log("Seeding players...");

  const roles = ["awper", "entry", "igl", "lurk", "support"] as const;

  const playerNames = [
    ["Alex", "Blaze", "Chronos", "Demon", "Echo"],
    ["Fenix", "Ghost", "Hawk", "Ion", "Joker"],
    ["Karma", "Lynx", "Maverick", "Nova", "Orbit"],
    ["Pulse", "Quake", "Raven", "Storm", "Titan"],
    ["Ultra", "Viper", "Wolf", "Xenon", "Yeti"],
    ["Zero", "Ace", "Bolt", "Cipher", "Drift"],
    ["Edge", "Frost", "Glitch", "Hex", "Ignite"],
    ["Jade", "Krypt", "Laser", "Matrix", "Nebula"],
    ["Omega", "Phoenix", "Quest", "Rogue", "Shadow"],
    ["Toxic", "Unit", "Venom", "Warp", "Xray"],
    ["Yard", "Zen", "Arch", "Blade", "Core"],
    ["Dash", "Evo", "Flux", "Gear", "Haze"],
  ];

  let playerIdx = 0;
  for (let t = 0; t < teamIds.length; t++) {
    const teamId = teamIds[t];
    const tier = teamsData[t].tier;
    const names = playerNames[t];

    for (let p = 0; p < 5; p++) {
      const kd = parseFloat((0.8 + Math.random() * 0.8).toFixed(2));
      const rating = parseFloat((0.9 + Math.random() * 0.6).toFixed(2));
      const maps = Math.floor(20 + Math.random() * 80);

      await db.insert(schema.players).values({
        name: `Player ${playerIdx + 1}`,
        nickname: names[p],
        role: roles[p],
        tier,
        teamId,
        statsKd: kd,
        statsRating: rating,
        statsMaps: maps,
        country: teamsData[t].country,
      });
      playerIdx++;
    }
  }

  console.log("Seeding matches...");

  const now = new Date();
  const matchStatuses: ("upcoming" | "ongoing" | "finished")[] = [
    "finished", "finished", "finished", "finished", "finished",
    "ongoing", "ongoing",
    "upcoming", "upcoming", "upcoming", "upcoming", "upcoming",
  ];

  for (let m = 0; m < 12; m++) {
    const t1 = Math.floor(Math.random() * teamIds.length);
    let t2 = Math.floor(Math.random() * teamIds.length);
    while (t2 === t1) t2 = Math.floor(Math.random() * teamIds.length);

    const status = matchStatuses[m];
    const date = new Date(now);
    date.setDate(date.getDate() + (m < 5 ? -(m + 1) : m < 7 ? 0 : m - 6));

    let s1 = 0, s2 = 0;
    if (status === "finished") {
      s1 = Math.floor(Math.random() * 16);
      s2 = Math.floor(Math.random() * 16);
      while (s1 === s2) s2 = Math.floor(Math.random() * 16);
    } else if (status === "ongoing") {
      s1 = Math.floor(Math.random() * 10);
      s2 = Math.floor(Math.random() * 10);
    }

    const hours = 18 + Math.floor(Math.random() * 6);
    const minutes = Math.floor(Math.random() * 60);

    await db.insert(schema.matches).values({
      team1Id: teamIds[t1],
      team2Id: teamIds[t2],
      team1Score: s1,
      team2Score: s2,
      status,
      matchDate: date.toISOString().split("T")[0] as any,
      matchTime: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00` as any,
    });
  }

  console.log("Seeding admin user...");

  await db.insert(schema.localUsers).values({
    username: "admin",
    password: await bcrypt.hash("adminknjazx", 10),
    displayName: "Administrator",
    role: "admin",
  });

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
