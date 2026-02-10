import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export const initDb = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS companies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID REFERENCES companies(id),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      role TEXT NOT NULL CHECK (role IN ('landlord', 'tenant', 'guest', 'admin')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'invited')),
      registration_token UUID,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS properties (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID REFERENCES companies(id) NOT NULL,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      type TEXT NOT NULL,
      units INTEGER NOT NULL DEFAULT 1,
      monthly_rent NUMERIC(10, 2) NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'vacant', 'maintenance')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tenants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID REFERENCES companies(id) NOT NULL,
      user_id UUID REFERENCES users(id),
      property_id UUID REFERENCES properties(id) NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'inactive')),
      lease_end_date DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID REFERENCES tenants(id) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      due_date DATE NOT NULL,
      paid_date DATE,
      status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'overdue')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS documents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      property_id UUID REFERENCES properties(id),
      tenant_id UUID REFERENCES tenants(id),
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      type TEXT NOT NULL,
      ai_analysis TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
};
