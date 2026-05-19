CREATE SEQUENCE order_code_seq START 1;

CREATE TABLE orders (
    id                      UUID PRIMARY KEY,
    code                    VARCHAR(20)     NOT NULL,
    buyer_id                UUID            NOT NULL,
    status                  VARCHAR(30)     NOT NULL DEFAULT 'CREATED',
    payment_status          VARCHAR(30)     NOT NULL DEFAULT 'PENDING',
    subtotal_amount         NUMERIC(12,2)   NOT NULL,
    shipping_amount         NUMERIC(12,2)   NOT NULL DEFAULT 0,
    total_amount            NUMERIC(12,2)   NOT NULL,
    shipping_address_id     UUID,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT chk_orders_status CHECK (status IN ('CREATED','WAITING_PAYMENT','CONFIRMED','IN_PREPARATION','SHIPPED','DELIVERED','CANCELLED','REFUNDED')),
    CONSTRAINT chk_orders_payment_status CHECK (payment_status IN ('SIMULATED','PENDING','APPROVED','REJECTED','REFUNDED','CANCELLED')),
    CONSTRAINT fk_orders_buyer FOREIGN KEY (buyer_id) REFERENCES users(id),
    CONSTRAINT fk_orders_address FOREIGN KEY (shipping_address_id) REFERENCES addresses(id)
);

CREATE UNIQUE INDEX uq_orders_code ON orders (code);
CREATE INDEX idx_orders_buyer ON orders (buyer_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at);

CREATE TABLE order_items (
    id          UUID PRIMARY KEY,
    order_id    UUID            NOT NULL,
    listing_id  UUID            NOT NULL,
    seller_id   UUID            NOT NULL,
    book_title  VARCHAR(255)    NOT NULL,
    quantity    INTEGER         NOT NULL,
    unit_price  NUMERIC(12,2)   NOT NULL,
    subtotal    NUMERIC(12,2)   NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT chk_order_items_qty CHECK (quantity > 0),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_listing FOREIGN KEY (listing_id) REFERENCES book_listings(id),
    CONSTRAINT fk_order_items_seller FOREIGN KEY (seller_id) REFERENCES seller_profiles(id)
);

CREATE INDEX idx_order_items_order ON order_items (order_id);
CREATE INDEX idx_order_items_seller ON order_items (seller_id);
CREATE INDEX idx_order_items_listing ON order_items (listing_id);
