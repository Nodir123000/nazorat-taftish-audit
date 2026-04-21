import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    const schemaText = fs.readFileSync(schemaPath, 'utf-8');

    const models: any[] = [];
    const lines = schemaText.split('\n');
    let currentModel: any = null;

    for (let line of lines) {
      line = line.trim();
      
      // Start of model
      if (line.startsWith('model ')) {
        const modelName = line.split(' ')[1];
        currentModel = {
          name: modelName,
          fields: [],
          relations: []
        };
        models.push(currentModel);
        continue;
      }

      // End of model
      if (line === '}' && currentModel) {
        currentModel = null;
        continue;
      }

      // Parse fields inside model
      if (currentModel && line && !line.startsWith('@@') && !line.startsWith('//')) {
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
          const fieldName = parts[0];
          let fieldType = parts[1];
          
          const isRelation = line.includes('@relation');
          const isId = line.includes('@id');
          const isOptional = fieldType.endsWith('?');

          if (isRelation) {
              // Extract target model from field type (e.g. "users @relation(...)")
              const targetModel = fieldType.replace('?', '').replace('[]', '');
              currentModel.relations.push({
                  field: fieldName,
                  target: targetModel,
                  type: fieldType.endsWith('[]') ? 'one-to-many' : 'one-to-one',
                  isOptional
              });
          } else {
              currentModel.fields.push({
                  name: fieldName,
                  type: fieldType.replace('?', ''),
                  isId,
                  isOptional
              });
          }
        }
      }
    }

    // Add module markers based on naming conventions
    models.forEach(model => {
        if (model.name.startsWith('Planning')) model.module = 'Planning';
        else if (model.name.startsWith('Audit')) model.module = 'Audit';
        else if (model.name.startsWith('User')) model.module = 'Admin';
        else if (model.name.startsWith('Unit') || model.name.startsWith('Military')) model.module = 'Reference';
        else model.module = 'Common';
    });

    return NextResponse.json({ models });
  } catch (error: any) {
    console.error('Failed to parse schema:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
