from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from catalog.models import Product, ProductImage
from .serializers import ProductImageSerializer

class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)

class ProductImageListCreateView(APIView):
    permission_classes = [IsStaff]

    def get(self, request, product_id: int):
        p = Product.objects.filter(id=product_id).first()
        if not p: return Response({"detail": "Produto não encontrado."}, status=404)
        imgs = p.images.order_by("position", "id")
        return Response(ProductImageSerializer(imgs, many=True).data)

    def post(self, request, product_id: int):
        p = Product.objects.filter(id=product_id).first()
        if not p: return Response({"detail": "Produto não encontrado."}, status=404)
        ser = ProductImageSerializer(data=request.data)
        if not ser.is_valid(): return Response(ser.errors, status=400)
        pos = p.images.count()
        img = ProductImage.objects.create(product=p, url=ser.validated_data["url"], position=pos)
        return Response(ProductImageSerializer(img).data, status=201)

class ProductImageDeleteView(APIView):
    permission_classes = [IsStaff]

    def delete(self, request, product_id: int, image_id: int):
        img = ProductImage.objects.filter(id=image_id, product_id=product_id).first()
        if not img: return Response({"detail": "Imagem não encontrada."}, status=404)
        img.delete()
        return Response(status=204)
