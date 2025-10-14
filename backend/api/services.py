from typing import Iterable, Protocol
from decimal import Decimal
from urllib.parse import quote_plus

class PhoneProvider(Protocol):
    def get(self) -> str: ...

class EnvPhoneProvider:
    def __init__(self, phone: str) -> None:
        self.phone = phone

    def get(self) -> str:
        return self.phone

class CartLine:
    def __init__(self, name: str, qty: int, unit_price: Decimal) -> None:
        self.name = name
        self.qty = qty
        self.unit_price = unit_price

class OrderMessageBuilder:
    def __init__(self, store_name: str) -> None:
        self.store_name = store_name

    def build(self, lines: Iterable[CartLine], total: Decimal, customer_name: str, customer_phone: str) -> str:
        header = f"Pedido {self.store_name}"
        buyer = f"Cliente: {customer_name} | Telefone: {customer_phone}".strip()
        body = "\n".join(f"- {l.name} x{l.qty} = R$ {l.qty*l.unit_price:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".") for l in lines)
        footer = f"Total: R$ {total:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
        return "\n".join([header, buyer, body, footer]).strip()

class WhatsAppLinkService:
    def __init__(self, phone_provider: PhoneProvider) -> None:
        self.phone_provider = phone_provider

    def build(self, message: str) -> str:
        phone = self.phone_provider.get()
        return f"https://wa.me/{phone}?text={quote_plus(message)}"
