CREATE TABLE IF NOT EXISTS admin (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    updated_at DATETIME NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    password_hash TEXT NOT NULL,
    username TEXT NOT NULL,
    point INTEGER NOT NULL DEFAULT 0,
    birth_date TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    allergies TEXT NOT NULL DEFAULT '[]',
    vegan_lv INTEGER NOT NULL DEFAULT 0 CHECK (vegan_lv BETWEEN 0 AND 7),
    nfc_uid TEXT NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    updated_at DATETIME NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_price REAL NOT NULL,
    order_status TEXT NOT NULL CHECK (
        order_status IN ('pending', 'paid', 'preparing', 'completed', 'canceled', 'refunded')
    ),
    created_at DATETIME NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    updated_at DATETIME NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL CHECK (
        status IN ('pending', 'failed', 'success')
    ),
    created_at DATETIME NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE IF NOT EXISTS menu (
    menu_id INTEGER PRIMARY KEY AUTOINCREMENT,
    menu_name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL CHECK (
        category IN ('meal', 'snack', 'drink', 'dessert')
    ),
    allergies TEXT NOT NULL DEFAULT '[]',
    vegan_lv INTEGER NOT NULL CHECK (vegan_lv BETWEEN 0 AND 7),
    image TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    updated_at DATETIME NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS orderItems (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    menu_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    CONSTRAINT fk_orderItems_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_orderItems_menu FOREIGN KEY (menu_id) REFERENCES menu(menu_id)
);