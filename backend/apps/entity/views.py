from rest_framework import viewsets
from apps.users.permissions import CustomDjangoModelPermission
from .serializers import *
from .models import *

class OrganismViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Organisms.
    """
    queryset = Organism.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = OrganismSerializer

    filter_fields = ['id', 'taxonomy', 'name', 'aka', 'lineage']  
    search_fields = ['id','taxonomy', 'name', 'aka', 'lineage' ] 
    ordering = ['-id'] 
    ordering_fields = ['id', 'taxonomy', 'name', 'aka', 'lineage']  


class AnnotationViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Annotations.
    """
    queryset = Annotation.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = AnnotationSerializer

    filter_fields = ['id', 'entry', 'name', 'db']  
    search_fields = ['id', 'entry', 'name', 'db'] 
    ordering = ['-id'] 
    ordering_fields = ['id','entry', 'name', 'db' ]  


class GeneViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Genes.
    """
    queryset = Gene.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = GeneSerializer

    filter_fields = ['id', 'gene_id', 'name', 'family']  
    search_fields = ['id', 'gene_id', 'name', 'family'] 
    ordering = ['-id'] 
    ordering_fields = ['id','gene_id', 'name', 'family' ]  


class ProteinViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Proteins.
    """
    queryset = Protein.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = ProteinSerializer

    filter_fields = ['id', 'protein_id', 'name', 'family']  
    search_fields = ['id', 'protein_id', 'name', 'family'] 
    ordering = ['-id'] 
    ordering_fields = ['id','protein_id', 'name', 'family' ]  


class DomainViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Domains.
    """
    queryset = Domain.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = DomainSerializer

    filter_fields = ['id', 'start', 'end', 'description']  
    search_fields = ['id', ] 
    ordering = ['-id'] 
    ordering_fields = ['id','start', 'end', 'description' ]  


class ConditionViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Conditions.
    """
    queryset = Condition.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = ConditionSerializer

    filter_fields = ['id', 'name','label','replicate','reference','ontology' ]  
    search_fields = ['id', 'name','label','replicate','reference','ontology'] 
    ordering = ['-id'] 
    ordering_fields = ['id','name','label','replicate','reference','ontology' ]  



class ExpressionViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Expressions.
    """
    queryset = Expression.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = ExpressionSerializer

    filter_fields = ['id', 'count', 'RPKM', 'note']  
    search_fields = ['id', 'note'] 
    ordering = ['-id'] 
    ordering_fields = ['id','count', 'RPKM' ]  


class IsoformViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Isoforms.
    """
    queryset = Isoform.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = IsoformSerializer

    filter_fields = ['id', 'isoform_id', 'splicing', 'psi']  
    search_fields = ['id', 'isoform_id', 'splicing'] 
    ordering = ['-id'] 
    ordering_fields = ['id', 'isoform_id', 'splicing', 'psi']  


class FeatureViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Features.
    """
    queryset = Feature.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = FeatureSerializer

    filter_fields = ['id', 'feature_id', 'name', 'contig', 'start', 'end', 'feature']  
    search_fields = ['id', 'feature_id', 'name', 'contig'] 
    ordering = ['-id'] 
    ordering_fields = ['id', 'feature_id', 'name', 'contig', 'start', 'end', 'feature', 'strand']  

    