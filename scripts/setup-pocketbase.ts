/**
 * PocketBase Schema Setup Script
 * Applies the KitaWorksHub schema to PocketBase
 * Run: bun run scripts/setup-pocketbase.ts
 */

import PocketBase from 'pocketbase';
import schema from '../pocketbase-schema.json';

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8091';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@kitaworkshub.com';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'KitaWorks2025!';

interface SchemaField {
  name: string;
  type: string;
  required?: boolean;
  options?: Record<string, unknown>;
}

interface SchemaCollection {
  name: string;
  type: 'base' | 'auth';
  schema: SchemaField[];
  indexes?: string[];
}

async function main() {
  console.log('🔧 KitaWorksHub PocketBase Setup');
  console.log('================================');
  console.log(`📡 Connecting to: ${PB_URL}`);

  const pb = new PocketBase(PB_URL);

  try {
    // Authenticate as admin (PocketBase 0.22+ uses collection '_superusers')
    console.log('🔐 Authenticating as admin...');
    try {
      // Try newer API first (0.22+)
      await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    } catch {
      // Fallback to older API
      await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    }
    console.log('✅ Authenticated successfully');

    // Get existing collections
    const existingCollections = await pb.collections.getFullList();
    const existingNames = existingCollections.map(c => c.name);
    console.log(`📋 Found ${existingCollections.length} existing collections`);

    // Process each collection in schema
    for (const collection of (schema as { collections: SchemaCollection[] }).collections) {
      console.log(`\n📦 Processing: ${collection.name}`);

      if (existingNames.includes(collection.name)) {
        console.log(`   ⏭️  Skipping (already exists)`);
        continue;
      }

      // Transform schema fields to PocketBase format
      const fields = collection.schema.map(field => {
        const pbField: Record<string, unknown> = {
          name: field.name,
          type: field.type,
          required: field.required || false,
        };

        // Handle field options
        if (field.options) {
          if (field.type === 'select' && field.options.values) {
            pbField.options = { values: field.options.values };
          } else if (field.type === 'relation') {
            // Find the target collection ID
            const targetName = field.options.collectionId as string;
            const targetCollection = existingCollections.find(c => c.name === targetName);
            if (targetCollection) {
              pbField.options = {
                collectionId: targetCollection.id,
                cascadeDelete: false,
                maxSelect: field.options.maxSelect || 1,
              };
            } else {
              console.log(`   ⚠️  Target collection "${targetName}" not found, will need to update relation later`);
              pbField.options = {
                collectionId: targetName, // Use name as placeholder
                cascadeDelete: false,
                maxSelect: field.options.maxSelect || 1,
              };
            }
          } else if (field.type === 'file') {
            pbField.options = {
              maxSelect: field.options.maxSelect || 1,
              maxSize: field.options.maxSize || 5242880,
              mimeTypes: field.options.mimeTypes || [],
            };
          } else if (field.options.pattern) {
            pbField.options = { pattern: field.options.pattern };
          }
        }

        return pbField;
      });

      // Create collection
      try {
        const newCollection = await pb.collections.create({
          name: collection.name,
          type: collection.type,
          schema: fields,
        });
        console.log(`   ✅ Created: ${collection.name} (ID: ${newCollection.id})`);

        // Update existing collections list for relation resolution
        existingCollections.push(newCollection);
        existingNames.push(collection.name);
      } catch (err: unknown) {
        const error = err as { message?: string };
        console.log(`   ❌ Failed to create: ${error.message || err}`);
      }
    }

    // Second pass: Update relations with correct collection IDs
    console.log('\n🔗 Updating relations...');
    const updatedCollections = await pb.collections.getFullList();
    const collectionMap = Object.fromEntries(updatedCollections.map(c => [c.name, c.id]));

    for (const collection of (schema as { collections: SchemaCollection[] }).collections) {
      const pbCollection = updatedCollections.find(c => c.name === collection.name);
      if (!pbCollection) continue;

      const relationFields = collection.schema.filter(f => f.type === 'relation');
      if (relationFields.length === 0) continue;

      const updatedSchema = pbCollection.schema.map((field: Record<string, unknown>) => {
        const schemaField = relationFields.find(f => f.name === field.name);
        if (schemaField && schemaField.options?.collectionId) {
          const targetName = schemaField.options.collectionId as string;
          const targetId = collectionMap[targetName];
          if (targetId && field.options) {
            (field.options as Record<string, unknown>).collectionId = targetId;
          }
        }
        return field;
      });

      try {
        await pb.collections.update(pbCollection.id, { schema: updatedSchema });
        console.log(`   ✅ Updated relations for: ${collection.name}`);
      } catch (err: unknown) {
        const error = err as { message?: string };
        console.log(`   ⚠️  Could not update ${collection.name}: ${error.message || err}`);
      }
    }

    console.log('\n✨ Setup complete!');
    console.log('================================');
    console.log('Collections created. You can now:');
    console.log(`  1. Visit ${PB_URL}/_/ to manage data`);
    console.log('  2. Run: bun run dev');

  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error('❌ Setup failed:', error.message || err);
    process.exit(1);
  }
}

main();
