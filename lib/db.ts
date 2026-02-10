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

    await db.get('PRAGMA foreign_keys = ON');

    // 1. 테이블이 있는지 확인 (간단한 체크)
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND  name='menu'"
    );

    // 2. 테이블이 없으면 schema.sql과 seed.sql 실행
    if (!tableExists) {
      console.log('데이터베이스 초기화 중...');
      
      // 파일 경로 설정 (process.cwd()는 프로젝트 루트를 가리킵니다)
      const create_table_Path = path.join(process.cwd(), 'sql', 'create_table.sql');
      const add_menu_Path = path.join(process.cwd(), 'sql', 'add_menu.sql');

      const create_table = fs.readFileSync(create_table_Path, 'utf8');
      const add_menu = fs.readFileSync(add_menu_Path, 'utf8');

      // SQL 실행
      await db.exec(create_table);
      await db.exec(add_menu);
      
      console.log('테이블 생성 및 메뉴 추가 완료');
    }
  }
  return db;
}