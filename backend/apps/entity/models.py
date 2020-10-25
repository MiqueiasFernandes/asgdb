from django.db import models

class Organism(models.Model):
    taxonomy = models.PositiveIntegerField(blank=False, null=False, unique=True)
    name = models.CharField(max_length=20, blank=True, null=True)
    aka = models.CharField(max_length=20, blank=True, null=True)
    lineage = models.CharField(max_length=500, blank=True, null=True)
    avatar = models.ImageField(verbose_name='Organism Logo', blank=True, upload_to='organism')


class Annotation(models.Model):
    entry = models.CharField(max_length=30, unique=True)
    name = models.CharField(max_length=80, blank=True, null=True)
    db = models.CharField(max_length=20, blank=True, null=True)
    link = models.CharField(max_length=80, blank=True, null=True)


class Gene(models.Model):
    gene_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=50, null=True)
    family = models.CharField(max_length=50, null=True)

    organism = models.ForeignKey(Organism, on_delete=models.CASCADE)
    annotations = models.ManyToManyField(Annotation)


class Protein(models.Model):
    protein_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    family = models.CharField(max_length=50, blank=True, null=True, unique=True)
    sequence = models.TextField(blank=True, null=True)

    annotations = models.ManyToManyField(Annotation)


class Domain(models.Model):
    start = models.PositiveIntegerField(blank=False, null=False)
    end = models.PositiveIntegerField(blank=False, null=False)
    description =  models.CharField(max_length=50, unique=True)

    protein = models.ForeignKey(Protein, on_delete=models.CASCADE)
    annotations = models.ManyToManyField(Annotation)


class Condition(models.Model):
    name = models.CharField(max_length=50, blank=True, null=True)
    label = models.CharField(max_length=50, blank=True, null=True)
    replicate = models.CharField(max_length=50, blank=True, null=True)
    reference = models.CharField(max_length=500, blank=True, null=True)
    ontology = models.CharField(max_length=500, blank=True, null=True)

    organism = models.ForeignKey(Organism, on_delete=models.CASCADE)


class Expression(models.Model):
    count = models.DecimalField(max_digits=19, decimal_places=10)
    RPKM = models.DecimalField(max_digits=19, decimal_places=10)
    note = models.CharField(max_length=50, unique=True)

    condition = models.ForeignKey(Condition, on_delete=models.CASCADE)


class Isoform(models.Model):
    isoform_id = models.CharField(max_length=20, unique=True)
    splicing = models.CharField(max_length=20, blank=True, null=True)
    psi = models.DecimalField(max_digits=19, decimal_places=10)

    gene = models.ForeignKey(Gene, on_delete=models.CASCADE)
    expression = models.ForeignKey(Expression, on_delete=models.CASCADE)
    protein = models.OneToOneField(Protein, on_delete=models.CASCADE)
    annotations = models.ManyToManyField(Annotation)


class Feature(models.Model):
    STRAND_TYPE = [(0, 'Sense'), (1, 'Anti-Sense')]
    FEATURE_TYPE = [('G', 'Gene'), ('M', 'mRNA'), ('E', 'Exon'), ('I', 'Isoform'), ('C', 'CDS')]
    feature_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=20, blank=True, null=True)
    contig = models.CharField(max_length=20)
    start = models.PositiveIntegerField(blank=False, null=False)
    end = models.PositiveIntegerField(blank=False, null=False)
    strand = models.PositiveIntegerField(choices=STRAND_TYPE, blank=False, null=False)
    feature = models.CharField(max_length=1, choices=FEATURE_TYPE, blank=False, null=False)
    sequence = models.TextField(blank=True, null=True)

    gene = models.OneToOneField(Gene, on_delete=models.CASCADE)
    isoform = models.ForeignKey(Isoform, on_delete=models.CASCADE)

