from decimal import Decimal
from typing import List
from django.conf import settings
from django.db import transaction
from django.db.models import Q
from rest_framework import generics, views, response, status
from catalog.models import Product, Inventory
from orders.models import Order, OrderItem
from .serializers import ProductSerializer, CheckoutIn, CheckoutOut, BuyNowIn, BuyNowOut, serialize_cart_snapshot
from .services import EnvPhoneProvider, OrderMessageBuilder, WhatsAppLinkService, CartLine
from .utils import get_primary_image_url

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        qs = Product.objects.filter(is_active=True).select_related("category").prefetch_related("images").order_by("-featured", "-id")
        q = self.request.query_params.get("q", "").strip()
        cat = self.request.query_params.get("category")
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(description__icontains=q) | Q(sku__icontains=q))
        if cat:
            qs = qs.filter(category__slug=cat)
        return qs

class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.filter(is_active=True).select_related("category").prefetch_related("images")

class CheckoutWhatsAppView(views.APIView):
    def post(self, request):
        serializer = CheckoutIn(data=request.data)
        if not serializer.is_valid():
            return response.Response({"code": "invalid_input", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        items_in = serializer.validated_data["items"]
        customer_name = serializer.validated_data.get("customer_name", "")
        customer_phone = serializer.validated_data.get("customer_phone", "")

        pids = [int(i["product_id"]) for i in items_in]
        products_qs = Product.objects.filter(id__in=pids, is_active=True).select_related("category").prefetch_related("images")
        products = {p.id: p for p in products_qs}
        if len(products) != len(items_in):
            return response.Response({"code": "invalid_product", "detail": "Produto inválido ou inativo."}, status=status.HTTP_400_BAD_REQUEST)

        inv_qs = Inventory.objects.filter(product_id__in=pids)
        inv_by_pid = {i.product_id: i for i in inv_qs}

        lines: List[CartLine] = []
        snapshot_items: List[dict] = []
        total = Decimal("0")

        for it in items_in:
            pid = int(it["product_id"])
            qty = int(it["qty"])
            p = products[pid]

            inv = inv_by_pid.get(pid)
            if not inv or inv.quantity < qty:
                return response.Response({"code": "out_of_stock", "detail": f"Sem estoque suficiente para {p.name}."}, status=status.HTTP_400_BAD_REQUEST)

            unit = Decimal(p.promo_price or p.price)
            total += unit * qty
            lines.append(CartLine(p.name, qty, unit))
            snapshot_items.append({
                "product_id": pid,
                "name": p.name,
                "qty": qty,
                "unit_price": str(unit),
                "image_url": get_primary_image_url(p),
            })

        builder = OrderMessageBuilder(getattr(settings, "STORE_NAME", "Minha Loja"))
        msg = builder.build(lines, total, customer_name, customer_phone)

        link_service = WhatsAppLinkService(EnvPhoneProvider(getattr(settings, "WHATSAPP_PHONE", "")))
        link = link_service.build(msg)

        with transaction.atomic():
            order = Order.objects.create(
                customer_name=customer_name,
                customer_phone=customer_phone,
                total=total,
                snapshot={"items": snapshot_items},
            )
            for snap in snapshot_items:
                OrderItem.objects.create(
                    order=order,
                    product_id=snap["product_id"],
                    name=snap["name"],
                    qty=int(snap["qty"]),
                    unit_price=Decimal(snap["unit_price"]),
                    line_total=Decimal(snap["unit_price"]) * int(snap["qty"]),
                )

        out = CheckoutOut({"whatsapp_link": link, "total": total})
        return response.Response(out.data, status=status.HTTP_201_CREATED)

class BuyNowWhatsAppView(views.APIView):
    def post(self, request):
        from .serializers import BuyNowIn, BuyNowOut
        serializer = BuyNowIn(data=request.data)
        if not serializer.is_valid():
            return response.Response({"code": "invalid_input", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        pid = int(serializer.validated_data["product_id"])
        qty = int(serializer.validated_data["qty"])

        p = Product.objects.filter(id=pid, is_active=True).prefetch_related("images").first()
        if not p:
            return response.Response({"code": "invalid_product", "detail": "Produto inválido ou inativo."}, status=status.HTTP_400_BAD_REQUEST)

        inv = Inventory.objects.filter(product_id=pid).first()
        if not inv or inv.quantity < qty:
            return response.Response({"code": "out_of_stock", "detail": f"Sem estoque suficiente para {p.name}."}, status=status.HTTP_400_BAD_REQUEST)

        unit = Decimal(p.promo_price or p.price)
        total = unit * qty
        line = CartLine(p.name, qty, unit)

        builder = OrderMessageBuilder(getattr(settings, "STORE_NAME", "Minha Loja"))
        msg = builder.build([line], total, "", "")

        link_service = WhatsAppLinkService(EnvPhoneProvider(getattr(settings, "WHATSAPP_PHONE", "")))
        link = link_service.build(msg)

        snapshot_item = {
            "product_id": p.id,
            "name": p.name,
            "qty": qty,
            "unit_price": str(unit),
            "image_url": get_primary_image_url(p),
        }

        with transaction.atomic():
            order = Order.objects.create(customer_name="", customer_phone="", total=total, snapshot={"items": [snapshot_item]})
            OrderItem.objects.create(order=order, product_id=p.id, name=p.name, qty=qty, unit_price=unit, line_total=total)

        out = BuyNowOut({"whatsapp_link": link, "total": total})
        return response.Response(out.data, status=status.HTTP_201_CREATED)

