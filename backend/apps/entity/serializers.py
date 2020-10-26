from rest_framework import serializers
from apps.entity.models import *

class OrganismSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organism
        fields = ['id', 'taxonomy', 'name', 'aka', 'lineage']

class OrganismBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organism
        fields = ['id', 'name']


################## ANNOTATION

class AnnotationBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Annotation
        fields = ['id', 'entry']

class AnnotationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Annotation
        fields = ['id', 'entry', 'name', 'db', 'link']


################## GENE

class GeneBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gene
        fields = ['id', 'gene_id']


class GeneSerializer(serializers.ModelSerializer):
    organism = OrganismBasicSerializer()
    annotations = AnnotationBasicSerializer(many=True)

    class Meta:
        model = Gene
        fields = ['id', 'gene_id', 'name', 'family', 'organism', 'annotations']


class GeneWriteSerializer(serializers.ModelSerializer):
    organism_id = serializers.PrimaryKeyRelatedField(queryset=Organism.objects)
    annotations = serializers.PrimaryKeyRelatedField(queryset=Annotation.objects, many=True)

    class Meta:
        model = Gene
        fields = ['id', 'gene_id', 'name', 'family', 'organism_id', 'annotations']
    
    def create(self, validated_data):
        validated_data['organism_id'] = validated_data['organism_id'].id
        annotations = validated_data['annotations']
        del validated_data['annotations']
        gene = Gene.objects.create(**validated_data)
        gene.annotations.set(annotations)
        return gene



################## PROTEIN

class ProteinBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Protein
        fields = ['id', 'protein_id']

class ProteinSerializer(serializers.ModelSerializer):
    annotations = AnnotationBasicSerializer(many=True)

    class Meta:
        model = Protein
        fields = ['id', 'protein_id', 'name', 'family', 'sequence', 'annotations']

class ProteinWriteSerializer(serializers.ModelSerializer):
    annotations = serializers.PrimaryKeyRelatedField(queryset=Annotation.objects, many=True)

    class Meta:
        model = Protein
        fields = ['id', 'protein_id', 'name', 'family', 'sequence', 'annotations']

    def create(self, validated_data):
        annotations = validated_data['annotations']
        del validated_data['annotations']
        protein = Protein.objects.create(**validated_data)
        protein.annotations.set(annotations)
        return protein


################## DOMAIN

class DomainSerializer(serializers.ModelSerializer):
    protein = ProteinBasicSerializer()
    annotations = AnnotationBasicSerializer(many=True)

    class Meta:
        model = Domain
        fields = ['id', 'start', 'end', 'description', 'protein', 'annotations']


class DomainWriteSerializer(serializers.ModelSerializer):
    protein_id = serializers.PrimaryKeyRelatedField(queryset=Protein.objects)
    annotations = serializers.PrimaryKeyRelatedField(queryset=Annotation.objects, many=True)

    class Meta:
        model = Domain
        fields = ['id', 'start', 'end', 'description', 'protein_id', 'annotations']
    
    def create(self, validated_data):
        validated_data['protein_id'] = validated_data['protein_id'].id
        annotations = validated_data['annotations']
        del validated_data['annotations']
        domain = Domain.objects.create(**validated_data)
        domain.annotations.set(annotations)
        return domain



################## CONDITION

class ConditionBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Condition
        fields = ['id', 'name']

class ConditionSerializer(serializers.ModelSerializer):
    organism = OrganismBasicSerializer()

    class Meta:
        model = Condition
        fields = ['id', 'name', 'label', 'replicate', 'reference', 'ontology', 'organism']

class ConditionWriteSerializer(serializers.ModelSerializer):
    organism_id = serializers.PrimaryKeyRelatedField(queryset=Organism.objects)

    class Meta:
        model = Condition
        fields = ['id', 'name', 'label', 'replicate', 'reference', 'ontology', 'organism_id']
    
    def create(self, validated_data):
        validated_data['organism_id'] = validated_data['organism_id'].id
        return Condition.objects.create(**validated_data)



################## EXPRESSION      

class ExpressionBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Expression
        fields = ['id', 'note']

class ExpressionSerializer(serializers.ModelSerializer):
    condition = ConditionBasicSerializer()

    class Meta:
        model = Expression
        fields = ['id', 'count', 'RPKM', 'note', 'condition']

class ExpressionWriteSerializer(serializers.ModelSerializer):
    condition_id = serializers.PrimaryKeyRelatedField(queryset=Condition.objects)

    class Meta:
        model = Expression
        fields = ['id', 'count', 'RPKM', 'note', 'condition_id']
    
    def create(self, validated_data):
        validated_data['condition_id'] = validated_data['condition_id'].id
        return Expression.objects.create(**validated_data)

################## ISOFORM

class IsoformBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Isoform
        fields = ['id', 'isoform_id']

class IsoformSerializer(serializers.ModelSerializer):
    gene = GeneBasicSerializer()
    expression = ExpressionBasicSerializer()
    protein = ProteinBasicSerializer()

    class Meta:
        model = Isoform
        fields = ['id', 'isoform_id', 'splicing', 'psi', 'gene', 'expression', 'protein']

class IsoformWriteSerializer(serializers.ModelSerializer):
    gene_id = serializers.PrimaryKeyRelatedField(queryset=Gene.objects)
    expression_id = serializers.PrimaryKeyRelatedField(queryset=Expression.objects)
    protein_id = serializers.PrimaryKeyRelatedField(queryset=Protein.objects)

    class Meta:
        model = Isoform
        fields = ['id', 'isoform_id', 'splicing', 'psi', 'gene_id', 'expression_id', 'protein_id']

    def create(self, validated_data):
        validated_data['gene_id'] = validated_data['gene_id'].id
        validated_data['expression_id'] = validated_data['expression_id'].id
        validated_data['protein_id'] = validated_data['protein_id'].id
        return Isoform.objects.create(**validated_data)


################## FEATURE

class FeatureSerializer(serializers.ModelSerializer):
    gene = GeneBasicSerializer()
    isoform = IsoformBasicSerializer()

    class Meta:
        model = Feature
        fields = ['id', 'feature_id', 'name', 'contig', 'start', 'end', 'strand', 'feature', 'sequence', 'gene', 'isoform']


class FeatureWriteSerializer(serializers.ModelSerializer):
    gene_id = serializers.PrimaryKeyRelatedField(queryset=Gene.objects)
    isoform_id = serializers.PrimaryKeyRelatedField(queryset=Isoform.objects, allow_null=True)

    class Meta:
        model = Feature
        fields = ['id', 'feature_id', 'name', 'contig', 'start', 'end', 'strand', 'feature', 'sequence', 'gene_id', 'isoform_id']

    def create(self, validated_data):
        validated_data['gene_id'] = validated_data['gene_id'].id
        if 'isoform_id' in validated_data and not validated_data['isoform_id'] is None:
            validated_data['isoform_id'] = validated_data['isoform_id'].id
        return Feature.objects.create(**validated_data)

 