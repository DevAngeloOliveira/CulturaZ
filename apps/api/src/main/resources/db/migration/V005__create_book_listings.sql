CREATE TABLE book_listings (
    id                UUID PRIMARY KEY,
    book_id           UUID            NOT NULL,
    seller_id         UUID            NOT NULL,
    price             NUMERIC(12,2)   NOT NULL,
    original_price    NUMERIC(12,2),
    stock_quantity    INTEGER         NOT NULL DEFAULT 0,
    condition         VARCHAR(20)     NOT NULL,
    status            VARCHAR(20)     NOT NULL DEFAULT 'PENDING_REVIEW',
    cover_image_url   VARCHAR(500),
    description       TEXT            NOT NULL,
    city              VARCHAR(120),
    state             VARCHAR(2),
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT chk_book_listings_price_positive CHECK (price > 0),
    CONSTRAINT chk_book_listings_stock_nonneg CHECK (stock_quantity >= 0),
    CONSTRAINT chk_book_listings_condition CHECK (condition IN ('NEW','LIKE_NEW','GOOD','FAIR','DAMAGED')),
    CONSTRAINT chk_book_listings_status CHECK (status IN ('PENDING_REVIEW','ACTIVE','PAUSED','BLOCKED','SOLD_OUT','REMOVED')),
    CONSTRAINT fk_book_listings_book FOREIGN KEY (book_id) REFERENCES books(id),
    CONSTRAINT fk_book_listings_seller FOREIGN KEY (seller_id) REFERENCES seller_profiles(id)
);

CREATE INDEX idx_book_listings_book ON book_listings (book_id);
CREATE INDEX idx_book_listings_seller ON book_listings (seller_id);
CREATE INDEX idx_book_listings_status ON book_listings (status);
CREATE INDEX idx_book_listings_condition ON book_listings (condition);
CREATE INDEX idx_book_listings_price ON book_listings (price);
CREATE INDEX idx_book_listings_status_price ON book_listings (status, price);
CREATE INDEX idx_book_listings_status_created_at ON book_listings (status, created_at);
