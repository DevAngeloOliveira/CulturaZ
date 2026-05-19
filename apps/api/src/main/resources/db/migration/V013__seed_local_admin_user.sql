INSERT INTO users (id, name, email, password_hash, status)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Administrador Local',
    'admin@culturaz.local',
    '$2b$12$DIfieQUSAxh3XDCEI6iWZujWnQATgPoe3Su7qyZQLjDrgDzedLPsO',
    'ACTIVE'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_roles (user_id, role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'ADMIN'),
    ('11111111-1111-1111-1111-111111111111', 'CUSTOMER')
ON CONFLICT DO NOTHING;

INSERT INTO users (id, name, email, password_hash, status)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Comprador Demo',
    'buyer@culturaz.local',
    '$2b$12$UY3n/zW5ZuCyTSSHLU/EZedJ5r5qrhW.COm9PDqN1x.Jnck7iQV92',
    'ACTIVE'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_roles (user_id, role) VALUES
    ('22222222-2222-2222-2222-222222222222', 'CUSTOMER')
ON CONFLICT DO NOTHING;

INSERT INTO users (id, name, email, password_hash, status)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    'Vendedor Demo',
    'seller@culturaz.local',
    '$2b$12$nkMgXdEKywoNsy4GxQ9D0e/jfFEdxJ4Ztnec.7P.2Oe.QGz9N8DOa',
    'ACTIVE'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_roles (user_id, role) VALUES
    ('33333333-3333-3333-3333-333333333333', 'CUSTOMER'),
    ('33333333-3333-3333-3333-333333333333', 'SELLER')
ON CONFLICT DO NOTHING;
