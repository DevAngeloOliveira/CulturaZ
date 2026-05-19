CREATE TABLE favorites (
    id          UUID PRIMARY KEY,
    user_id     UUID NOT NULL,
    listing_id  UUID NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT uq_favorites_user_listing UNIQUE (user_id, listing_id),
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_listing FOREIGN KEY (listing_id) REFERENCES book_listings(id) ON DELETE CASCADE
);

CREATE INDEX idx_favorites_user ON favorites (user_id);
CREATE INDEX idx_favorites_listing ON favorites (listing_id);
