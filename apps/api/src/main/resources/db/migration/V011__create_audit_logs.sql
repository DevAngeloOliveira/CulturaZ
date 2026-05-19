CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY,
    actor_user_id   UUID,
    action          VARCHAR(60)    NOT NULL,
    resource_type   VARCHAR(40)    NOT NULL,
    resource_id     UUID,
    metadata        TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_actor ON audit_logs (actor_user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs (resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);
