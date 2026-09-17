ALTER TABLE "site_settings"
  ADD COLUMN "whatsapp_number" TEXT NOT NULL DEFAULT '50212345678',
  ADD COLUMN "bank_name" TEXT NOT NULL DEFAULT 'Banco Industrial',
  ADD COLUMN "bank_account_type" TEXT NOT NULL DEFAULT 'Cuenta Monetaria',
  ADD COLUMN "bank_account_number" TEXT NOT NULL DEFAULT '123-456789-0',
  ADD COLUMN "bank_account_holder" TEXT NOT NULL DEFAULT 'Asociación Huellitas de la Calle',
  ADD COLUMN "donation_dropoff_address" TEXT NOT NULL DEFAULT 'Zona 10, Ciudad de Guatemala',
  ADD COLUMN "donation_dropoff_hours" TEXT NOT NULL DEFAULT 'Lunes a sábado de 9:00 AM a 4:00 PM',
  ADD COLUMN "needed_supplies" TEXT[] NOT NULL DEFAULT ARRAY[
    'Concentrado para perros',
    'Concentrado para gatos',
    'Medicamentos',
    'Camas y Cobijas',
    'Correas',
    'Transportadoras',
    'Arena para gatos',
    'Productos de limpieza'
  ]::TEXT[];
