CREATE TABLE carts (
    id          UUID PRIMARY KEY,
    user_id     UUID NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT uq_carts_user UNIQUE (user_id),
    CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id          UUID PRIMARY KEY,
    cart_id     UUID            NOT NULL,
    listing_id  UUID            NOT NULL,
    quantity    INTEGER         NOT NULL,
    unit_price  NUMERIC(12,2)   NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT chk_cart_items_qty CHECK (quantity > 0),
    CONSTRAINT uq_cart_items_cart_listing UNIQUE (cart_id, listing_id),
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_listing FOREIGN KEY (listing_id) REFERENCES book_listings(id)
);

CREATE INDEX idx_cart_items_cart ON cart_items (cart_id);
CREATE INDEX idx_cart_items_listing ON cart_items (listing_id);
