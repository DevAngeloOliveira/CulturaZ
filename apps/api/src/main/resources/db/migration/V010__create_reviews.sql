CREATE TABLE reviews (
    id              UUID PRIMARY KEY,
    order_id        UUID    NOT NULL,
    reviewer_id     UUID    NOT NULL,
    seller_id       UUID    NOT NULL,
    rating          INTEGER NOT NULL,
    comment         TEXT,
    tags            TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT uq_reviews_order_reviewer_seller UNIQUE (order_id, reviewer_id, seller_id),
    CONSTRAINT fk_reviews_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id),
    CONSTRAINT fk_reviews_seller FOREIGN KEY (seller_id) REFERENCES seller_profiles(id)
);

CREATE INDEX idx_reviews_seller ON reviews (seller_id);
CREATE INDEX idx_reviews_order ON reviews (order_id);
