import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("🚀 Setting up automatic full_name synchronization via DB Trigger...")

    try {
        // 1. Create a function to update full_name in personnel
        console.log("🛠️ Creating trigger function sync_personnel_fullname...")
        await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION sync_personnel_fullname()
      RETURNS TRIGGER AS $$
      BEGIN
          IF (TG_OP = 'UPDATE') THEN
              IF (OLD.last_name IS DISTINCT FROM NEW.last_name OR 
                  OLD.first_name IS DISTINCT FROM NEW.first_name OR 
                  OLD.middle_name IS DISTINCT FROM NEW.middle_name) THEN
                  
                  UPDATE personnel
                  SET full_name = NEW.last_name || ' ' || NEW.first_name || ' ' || COALESCE(NEW.middle_name, '')
                  WHERE physical_person_id = NEW.id;
              END IF;
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `)

        // 2. Drop and Create the trigger on ref_physical_persons
        console.log("🛠️ Dropping old trigger...")
        await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_sync_personnel_fullname ON ref_physical_persons;`)

        console.log("🛠️ Creating trigger on ref_physical_persons...")
        await prisma.$executeRawUnsafe(`
      CREATE TRIGGER trg_sync_personnel_fullname
      AFTER UPDATE ON ref_physical_persons
      FOR EACH ROW
      EXECUTE FUNCTION sync_personnel_fullname();
    `)

        // 3. Create a trigger for when a NEW personnel record is inserted
        console.log("🛠️ Creating trigger function populate_personnel_fullname...")
        await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION populate_personnel_fullname()
      RETURNS TRIGGER AS $$
      BEGIN
          SELECT last_name || ' ' || first_name || ' ' || COALESCE(middle_name, '')
          INTO NEW.full_name
          FROM ref_physical_persons
          WHERE id = NEW.physical_person_id;
          
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `)

        console.log("🛠️ Dropping old populate trigger...")
        await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trg_populate_personnel_fullname ON personnel;`)

        console.log("🛠️ Creating trigger on personnel (BEFORE INSERT)...")
        await prisma.$executeRawUnsafe(`
      CREATE TRIGGER trg_populate_personnel_fullname
      BEFORE INSERT ON personnel
      FOR EACH ROW
      EXECUTE FUNCTION populate_personnel_fullname();
    `)

        console.log("✅ Database triggers established successfully!")
    } catch (error) {
        console.error("❌ Failed to establish triggers:", error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
