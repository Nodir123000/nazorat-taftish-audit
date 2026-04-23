const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'prisma', 'schema.prisma');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('model notifications')) {
    content += `

model notifications {
  id Int @id @default(autoincrement())
  user_id Int
  title String @db.VarChar(255)
  message String
  type String @default("info") @db.VarChar(50)
  category String @default("system") @db.VarChar(50)
  link String? @db.VarChar(255)
  is_read Boolean @default(false)
  created_at DateTime? @default(now())
  updated_at DateTime? @default(now())
  users users @relation(fields: [user_id], references: [user_id])
}
`;
    
    // Add back relation to users
    content = content.replace(
        '  orders                orders[]', 
        '  orders                orders[]\n  notifications         notifications[]'
    );
    
    fs.writeFileSync(file, content);
    console.log('Appended model notifications');
} else {
    console.log('Model already exists');
}
