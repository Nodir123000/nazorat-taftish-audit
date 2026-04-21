const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://postgres:Muslima-3001%23%23@localhost:5432/nazorat_taftish"
});

async function main() {
    await client.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('Tables:', res.rows.length);

    if (res.rows.length > 0) {
        const users = await client.query("SELECT count(*) FROM \"users\"");
        const people = await client.query("SELECT count(*) FROM \"ref_physical_persons\"");
        const units = await client.query("SELECT count(*) FROM \"ref_units\"");
        const areas = await client.query("SELECT count(*) FROM \"ref_areas\"");
        const regions = await client.query("SELECT count(*) FROM \"ref_regions\"");
        console.log('Users:', users.rows[0].count);
        console.log('Physical Persons:', people.rows[0].count);
        console.log('Units:', units.rows[0].count);
        console.log('Areas:', areas.rows[0].count);
        console.log('Regions:', regions.rows[0].count);
    }

    await client.end();
}

main().catch(err => console.error(err));
