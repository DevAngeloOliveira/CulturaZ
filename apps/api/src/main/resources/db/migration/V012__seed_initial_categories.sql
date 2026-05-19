INSERT INTO categories (id, name, description, icon, active) VALUES
  (gen_random_uuid(), 'Acadêmicos',     'Livros universitários, didáticos e técnicos',        'school',     TRUE),
  (gen_random_uuid(), 'Tecnologia',     'Computação, engenharia de software, dados',          'cpu',        TRUE),
  (gen_random_uuid(), 'Literatura',     'Ficção, poesia, contos, romance',                    'book',       TRUE),
  (gen_random_uuid(), 'Concursos',      'Materiais voltados para concursos públicos',         'briefcase',  TRUE),
  (gen_random_uuid(), 'Infantil',       'Livros infantis e infantojuvenis',                   'happy',      TRUE),
  (gen_random_uuid(), 'Negócios',       'Administração, finanças e empreendedorismo',         'trending-up',TRUE),
  (gen_random_uuid(), 'Filosofia',      'Filosofia clássica e contemporânea',                 'bulb',       TRUE),
  (gen_random_uuid(), 'História',       'História geral, do Brasil e mundial',                'time',       TRUE),
  (gen_random_uuid(), 'Ciência',        'Ciências exatas, biológicas e humanas',              'flask',      TRUE),
  (gen_random_uuid(), 'HQs e Mangás',   'Quadrinhos, mangás e graphic novels',                'color-wand', TRUE)
ON CONFLICT (name) DO NOTHING;
