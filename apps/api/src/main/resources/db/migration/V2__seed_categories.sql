INSERT INTO categories (name, description, icon, active) VALUES
    ('Acadêmicos', 'Livros didáticos, universitários e técnicos', 'school',  true),
    ('Técnicos',   'Computação, engenharia, ciências aplicadas',  'cpu',     true),
    ('Literatura', 'Ficção, poesia, contos, romance',             'book',    true),
    ('Sebos',      'Acervo de sebos parceiros',                   'archive', true),
    ('Mais vendidos', 'Curadoria de títulos com mais saída',      'flame',   true)
ON CONFLICT (name) DO NOTHING;
