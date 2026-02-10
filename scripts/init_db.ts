import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import fs from 'fs';
import path from 'path';

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: './kiotalk.db',
      driver: sqlite3.Database,
    });

    // 외래 키 제약 조건 활성화
    await db.get('PRAGMA foreign_keys = ON');

    // 테이블 존재 여부 확인
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='menu'"
    );

    if (!tableExists) {
      console.log('Database init as a first time');
      
      const create_table_Path = path.join(process.cwd(), 'sql', 'create_table.sql');
      const add_menu_Path = path.join(process.cwd(), 'sql', 'add_menu.sql');
      const add_admin_Path = path.join(process.cwd(), 'sql', 'add_admin.sql');

      try {
        const create_table = fs.readFileSync(create_table_Path, 'utf8');
        const add_menu = fs.readFileSync(add_menu_Path, 'utf8');
        const add_admin = fs.readFileSync(add_admin_Path, 'utf8');

        // SQL 실행 (테이블 생성 -> 데이터 삽입)
        await db.exec(create_table);
        await db.exec(add_menu);
        await db.exec(add_admin);
        
        console.log('create table, add menu, add admin compelete!');
      } catch (error) {
        console.error('ERROR: ', error);
        throw error;
      }
    }
  }
  return db;
}

/**
 * npx tsx scripts/init_db.ts로 실행
 */
async function setup() {
  // 스크립트로 실행되었는지 확인 (직접 실행 시 process.argv[1]에 파일명이 포함됨)
  const isDirectRun = require.main === module;

  if (isDirectRun) {
    console.log('Start init database');
    try {
      const database = await getDb();
      console.log('database is ready');
      process.exit(0);
    } catch (err) {
      console.error('database init failed: ', err);
      process.exit(1);
    }
  }
}

setup();