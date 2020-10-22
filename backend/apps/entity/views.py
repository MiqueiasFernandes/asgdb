from rest_framework import viewsets
from apps.entity.serializers import *
from apps.entity.models import *
from apps.users.permissions import CustomDjangoModelPermission

class OrganismViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Organisms.
    """
    queryset = Organism.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = OrganismSerializer


class AnnotationViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Annotations.
    """
    queryset = Annotation.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = AnnotationSerializer

class GeneViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Genes.
    """
    queryset = Gene.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = GeneSerializer


class ProteinViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Proteins.
    """
    queryset = Protein.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = ProteinSerializer


class DomainViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Domains.
    """
    queryset = Domain.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = DomainSerializer



class ConditionViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Conditions.
    """
    queryset = Condition.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = ConditionSerializer




class ExpressionViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Expressions.
    """
    queryset = Expression.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = ExpressionSerializer



class IsoformViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Isoforms.
    """
    queryset = Isoform.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = IsoformSerializer



class FeatureViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Features.
    """
    queryset = Feature.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = FeatureSerializer


    