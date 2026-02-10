// menu 타입
export interface MenuItem {
  menu_id: number;
  menu_name: string;
  description: string;
  price: number | string;
  category: string;
  allergies: string[];
  vegan_lv: number;
  image: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  user_id: number;
  username: string;
  password_hash: string;
  birth_date: string;
  point: number;
  phone: string;
  nfc_uid: string;
  allergies: string[];
  vegan_lv: number;
  created_at: Date;
  updated_at: Date;
}

export interface AdminUser {
  admin_id: number;
  name: string;
  password_hash: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
}