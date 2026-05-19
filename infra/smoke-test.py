"""
Smoke test end-to-end da API CulturaZ.

Pré-requisitos:
  - Stack rodando: `docker compose --profile full -f infra/docker-compose.yml up -d --build`
  - API disponível em http://localhost:8080
  - Seed V013 aplicado (admin@culturaz.local / Admin123456)

Uso:
  python infra/smoke-test.py
  python infra/smoke-test.py --base-url http://localhost:8080
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.request
import uuid
from typing import Any


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


BASE_URL = "http://localhost:8080"


class SmokeError(Exception):
    pass


def request(
    method: str,
    path: str,
    *,
    token: str | None = None,
    body: dict[str, Any] | None = None,
    expected_status: int = 200,
) -> Any:
    url = f"{BASE_URL}{path}"
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    if data is not None:
        req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            status = resp.status
            payload = resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        status = e.code
        payload = e.read().decode("utf-8", errors="replace") if e.fp else ""
    if status != expected_status:
        raise SmokeError(
            f"{method} {path} -> esperado {expected_status}, recebido {status}: {payload}"
        )
    if not payload:
        return None
    try:
        return json.loads(payload)
    except json.JSONDecodeError:
        return payload


def wait_for_health(timeout_seconds: int = 120) -> None:
    deadline = time.time() + timeout_seconds
    last_error: Exception | None = None
    while time.time() < deadline:
        try:
            request("GET", "/actuator/health")
            print("  API saudavel.")
            return
        except Exception as exc:
            last_error = exc
            time.sleep(3)
    raise SmokeError(
        f"API nao respondeu /actuator/health em {timeout_seconds}s. Ultimo erro: {last_error}"
    )


def step(title: str) -> None:
    print(f"\n>> {title}")


def main() -> int:
    global BASE_URL
    parser = argparse.ArgumentParser(description="Smoke test da API CulturaZ.")
    parser.add_argument("--base-url", default=BASE_URL)
    args = parser.parse_args()
    BASE_URL = args.base_url.rstrip("/")

    print(f"Smoke test contra {BASE_URL}")

    step("Aguardando /actuator/health")
    wait_for_health()

    step("GET /api/categories deve listar 10 categorias do seed")
    categories = request("GET", "/api/categories")
    assert isinstance(categories, list), "Resposta deve ser lista"
    assert len(categories) >= 10, f"Esperado >= 10 categorias, obtido {len(categories)}"
    print(f"  {len(categories)} categorias retornadas.")
    academic = next((c for c in categories if c["name"] == "Acadêmicos"), None)
    if academic is None:
        raise SmokeError("Categoria 'Acadêmicos' não encontrada no seed.")

    step("Login do admin local")
    admin_auth = request(
        "POST",
        "/api/auth/login",
        body={"email": "admin@culturaz.local", "password": "Admin123456"},
    )
    admin_token = admin_auth["accessToken"]
    assert "ADMIN" in admin_auth["user"]["roles"], "Admin local sem role ADMIN"
    print("  Admin autenticado e com role ADMIN.")

    step("GET /api/auth/me com o token do admin")
    me = request("GET", "/api/auth/me", token=admin_token)
    assert me["email"] == "admin@culturaz.local"

    step("Registrar comprador novo")
    random_suffix = uuid.uuid4().hex[:8]
    buyer_email = f"buyer-{random_suffix}@culturaz.test"
    buyer_register = request(
        "POST",
        "/api/auth/register",
        expected_status=201,
        body={
            "name": f"Comprador Smoke {random_suffix}",
            "email": buyer_email,
            "password": "Senha12345",
            "phone": "83999999999",
        },
    )
    buyer_token = buyer_register["accessToken"]
    print(f"  Comprador registrado: {buyer_email}")

    step("Endpoint protegido sem token deve falhar com 401")
    request("GET", "/api/cart", expected_status=401)

    step("Comprador busca catálogo público de anúncios (esperado vazio inicialmente)")
    listings = request("GET", "/api/listings?size=5")
    print(f"  {listings['pagination']['total']} anúncio(s) ativos no catálogo.")

    step("Login do vendedor demo")
    seller_auth = request(
        "POST",
        "/api/auth/login",
        body={"email": "seller@culturaz.local", "password": "Seller123456"},
    )
    seller_token = seller_auth["accessToken"]
    assert "SELLER" in seller_auth["user"]["roles"]

    step("Vendedor ativa perfil de seller (se ainda não tiver) ou recupera /me")
    try:
        request(
            "POST",
            "/api/sellers",
            token=seller_token,
            expected_status=201,
            body={
                "storeName": "Sebo Smoke Test",
                "description": "Loja criada pelo smoke test",
                "type": "SEBO",
            },
        )
        print("  Perfil de vendedor criado.")
    except SmokeError as ex:
        if "409" in str(ex):
            print("  Perfil de vendedor já existia, prosseguindo.")
        else:
            raise

    seller_profile = request("GET", "/api/sellers/me", token=seller_token)
    seller_id = seller_profile["id"]
    print(f"  Vendedor: {seller_profile['storeName']} ({seller_id}).")

    step("Admin cria livro vinculado à categoria Acadêmicos")
    book = request(
        "POST",
        "/api/books",
        token=admin_token,
        expected_status=201,
        body={
            "title": f"Livro Smoke Test {random_suffix}",
            "author": "Autor Smoke",
            "publisher": "Editora Smoke",
            "isbn": None,
            "publicationYear": 2025,
            "description": "Livro criado por smoke test",
            "categoryId": academic["id"],
        },
    )
    print(f"  Livro criado: {book['id']}.")

    step("Vendedor cria anúncio para o livro")
    listing = request(
        "POST",
        "/api/seller/listings",
        token=seller_token,
        expected_status=201,
        body={
            "bookId": book["id"],
            "price": "49.90",
            "originalPrice": "79.90",
            "stockQuantity": 3,
            "condition": "GOOD",
            "description": "Anúncio criado por smoke test",
            "city": "João Pessoa",
            "state": "PB",
        },
    )
    listing_id = listing["id"]
    assert listing["status"] == "PENDING_REVIEW", f"Status inicial inesperado: {listing['status']}"
    print(f"  Anúncio em PENDING_REVIEW: {listing_id}.")

    step("Admin aprova anúncio")
    approved = request(
        "PATCH",
        f"/api/admin/listings/{listing_id}/approve",
        token=admin_token,
    )
    assert approved["status"] == "ACTIVE", f"Após aprovação esperado ACTIVE, obtido {approved['status']}"
    print("  Anúncio ACTIVE.")

    step("Catálogo público agora exibe o anúncio")
    catalog = request("GET", "/api/listings?size=20")
    ids_in_catalog = [item["id"] for item in catalog["items"]]
    assert listing_id in ids_in_catalog, "Anúncio aprovado não apareceu no catálogo"

    step("Comprador cria endereço")
    address = request(
        "POST",
        "/api/users/me/addresses",
        token=buyer_token,
        expected_status=201,
        body={
            "label": "Casa",
            "recipient": "Comprador Smoke",
            "street": "Rua Smoke",
            "number": "42",
            "neighborhood": "Bairro Smoke",
            "city": "João Pessoa",
            "state": "PB",
            "postalCode": "58000-000",
            "isDefault": True,
        },
    )
    print(f"  Endereço criado: {address['id']}.")

    step("Comprador adiciona item ao carrinho")
    cart = request(
        "POST",
        "/api/cart/items",
        token=buyer_token,
        expected_status=201,
        body={"listingId": listing_id, "quantity": 2},
    )
    assert cart["itemsCount"] == 2
    print(f"  Carrinho com subtotal {cart['subtotalAmount']}.")

    step("Comprador finaliza pedido (checkout simulado)")
    order = request(
        "POST",
        "/api/orders",
        token=buyer_token,
        expected_status=201,
        body={"shippingAddressId": address["id"], "paymentMethod": "SIMULATED"},
    )
    assert order["status"] == "CONFIRMED"
    assert order["paymentStatus"] == "SIMULATED"
    assert len(order["items"]) == 1
    print(f"  Pedido {order['code']} criado em {order['status']}.")

    step("Estoque do anúncio caiu de 3 para 1")
    listing_after = request("GET", f"/api/listings/{listing_id}")
    assert listing_after["stockQuantity"] == 1, (
        f"Estoque esperado 1, obtido {listing_after['stockQuantity']}"
    )

    step("Carrinho ficou vazio após checkout")
    cart_after = request("GET", "/api/cart", token=buyer_token)
    assert cart_after["itemsCount"] == 0

    step("Vendedor enxerga o pedido em /api/seller/orders")
    seller_orders = request("GET", "/api/seller/orders", token=seller_token)
    seller_order_ids = [o["id"] for o in seller_orders["items"]]
    assert order["id"] in seller_order_ids

    step("Vendedor avanca pedido para IN_PREPARATION -> SHIPPED -> DELIVERED")
    request(
        "PATCH",
        f"/api/seller/orders/{order['id']}/status",
        token=seller_token,
        body={"status": "IN_PREPARATION"},
    )
    request(
        "PATCH",
        f"/api/seller/orders/{order['id']}/status",
        token=seller_token,
        body={"status": "SHIPPED"},
    )
    delivered = request(
        "PATCH",
        f"/api/seller/orders/{order['id']}/status",
        token=seller_token,
        body={"status": "DELIVERED"},
    )
    assert delivered["status"] == "DELIVERED"
    print("  Pedido entregue.")

    step("Comprador avalia vendedor")
    review = request(
        "POST",
        "/api/reviews",
        token=buyer_token,
        expected_status=201,
        body={
            "orderId": order["id"],
            "sellerId": seller_id,
            "rating": 5,
            "comment": "Tudo certo no smoke test",
            "tags": ["entrega-rapida", "bem-embalado"],
        },
    )
    assert review["rating"] == 5
    print("  Avaliação registrada.")

    step("Admin dashboard agrega métricas")
    dashboard = request("GET", "/api/admin/dashboard", token=admin_token)
    print(
        "  Dashboard: "
        f"users={dashboard['usersCount']} "
        f"sellers={dashboard['sellersCount']} "
        f"activeListings={dashboard['activeListingsCount']} "
        f"ordersToday={dashboard['ordersTodayCount']}"
    )

    print("\nSmoke test concluído com sucesso.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except SmokeError as exc:
        print(f"\nFALHA: {exc}", file=sys.stderr)
        sys.exit(1)
