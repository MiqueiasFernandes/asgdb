from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.users.permissions import CustomDjangoModelPermission
from .serializers import *
from .models import *


def isWriter(context):
    return not context.action in ['list', 'retrieve']

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


    @action(methods=['GET'], detail=False)
    def list_all(self, request):
        return Response(data={'items': [OrganismBasicSerializer(i).data for i in self.queryset]})


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

    @action(methods=['GET'], detail=False)
    def list_all(self, request):
        items = Annotation.objects.all()
        return Response(data={'items': [AnnotationBasicSerializer(i).data for i in items]})

class GeneViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Genes.
    """
    queryset = Gene.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = GeneSerializer

    filter_fields = ['id', 'gene_id', 'name', 'family']  
    search_fields = ['id', 'gene_id', 'name', 'family', 'organism__name', 'annotations__entry', 'annotations__name'] 
    ordering = ['-id'] 
    ordering_fields = ['id','gene_id', 'name', 'family', 'organism__name']

    def get_serializer_class(self):
        return GeneWriteSerializer if isWriter(self) else GeneSerializer

    @action(methods=['GET'], detail=False)
    def list_all(self, request):
        return Response(data={'items': [GeneBasicSerializer(i).data for i in self.queryset]})


class ProteinViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Proteins.
    """
    queryset = Protein.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = ProteinSerializer

    filter_fields = ['id', 'protein_id', 'name', 'family']  
    search_fields = ['id', 'protein_id', 'name', 'family', 'annotations__entry', 'annotations__name'] 
    ordering = ['-id'] 
    ordering_fields = ['id','protein_id', 'name', 'family' ]  

    @action(methods=['GET'], detail=False)
    def list_all(self, request):
        return Response(data={'items': [ProteinBasicSerializer(i).data for i in self.queryset]})

    def get_serializer_class(self):
        return ProteinWriteSerializer if isWriter(self) else ProteinSerializer

class DomainViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Domains.
    """
    queryset = Domain.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = DomainSerializer

    filter_fields = ['id', 'start', 'end', 'description']  
    search_fields = ['id', 'description', 'protein__protein_id', 'protein__protein_name', 'annotations__entry', 'annotations__name' ] 
    ordering = ['-id'] 
    ordering_fields = ['id','start', 'end', 'description', 'protein__protein_id' ]  

    def get_serializer_class(self):
        return DomainWriteSerializer if isWriter(self) else DomainSerializer


class ConditionViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Conditions.
    """
    queryset = Condition.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = ConditionSerializer

    filter_fields = ['id', 'name','label','replicate','reference','ontology' ]  
    search_fields = ['id', 'name','label','replicate','reference','ontology', 'organism__name'] 
    ordering = ['-id'] 
    ordering_fields = ['id','name','label','replicate','reference','ontology', 'organism__name' ] 

    def get_serializer_class(self):
        return ConditionWriteSerializer if isWriter(self) else ConditionSerializer

    @action(methods=['GET'], detail=False)
    def list_all(self, request):
        return Response(data={'items': [ConditionBasicSerializer(i).data for i in self.queryset]}) 



class ExpressionViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Expressions.
    """
    queryset = Expression.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = ExpressionSerializer

    filter_fields = ['id', 'count', 'RPKM', 'note']  
    search_fields = ['id', 'note', 'condition__name'] 
    ordering = ['-id'] 
    ordering_fields = ['id','count', 'RPKM', 'condition__name']  

    def get_serializer_class(self):
        return ExpressionWriteSerializer if isWriter(self) else ExpressionSerializer

    @action(methods=['GET'], detail=False)
    def list_all(self, request):
        return Response(data={'items': [ExpressionBasicSerializer(i).data for i in self.queryset]}) 


class IsoformViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Isoforms.
    """
    queryset = Isoform.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = IsoformSerializer

    filter_fields = ['id', 'isoform_id', 'splicing', 'psi']  
    search_fields = ['id', 'isoform_id', 'splicing', 'gene__gene_id', 'gene__name', 'expression__note', 'protein__protein_id', 'protein__name'] 
    ordering = ['-id'] 
    ordering_fields = ['id', 'isoform_id', 'splicing', 'psi', 'gene__gene_id', 'expression__note', 'protein__protein_id']  

    def get_serializer_class(self):
        return IsoformWriteSerializer if isWriter(self) else IsoformSerializer

    @action(methods=['GET'], detail=False)
    def list_all(self, request):
        return Response(data={'items': [IsoformBasicSerializer(i).data for i in self.queryset]})


class FeatureViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for REST access to create, update and remove Features.
    """
    queryset = Feature.objects.all()
    permission_classes = [CustomDjangoModelPermission]
    serializer_class = FeatureSerializer

    filter_fields = ['id', 'feature_id', 'name', 'contig', 'start', 'strand', 'end', 'feature']  
    search_fields = ['id', 'feature_id', 'name', 'contig', 'gene__gene_id', 'gene__name', 'isoform__isoform_id'] 
    ordering = ['-id'] 
    ordering_fields = ['id', 'feature_id', 'name', 'contig', 'start', 'end', 'feature', 'strand', 'gene__gene_id', 'isoform__isoform_id']  

    def get_serializer_class(self):
        return FeatureWriteSerializer if isWriter(self) else FeatureSerializer
