CREATE TABLE books (
    id                 UUID PRIMARY KEY,
    title              VARCHAR(255) NOT NULL,
    author             VARCHAR(255) NOT NULL,
    publisher          VARCHAR(255),
    isbn               VARCHAR(20),
    publication_year   INTEGER,
    description        TEXT,
    category_id        UUID         NOT NULL,
    created_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT fk_books_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX idx_books_title ON books (title);
CREATE INDEX idx_books_author ON books (author);
CREATE UNIQUE INDEX uq_books_isbn ON books (isbn) WHERE isbn IS NOT NULL;
CREATE INDEX idx_books_category ON books (category_id);
