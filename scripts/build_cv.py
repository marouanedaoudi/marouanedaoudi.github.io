"""Build bilingual academic CV PDFs. Requires reportlab.

Run from any directory: python scripts/build_cv.py
Facts are drawn from the previous CV, current project sources and the owner's
confirmed M2 / research plans. Keep this content aligned with content/cv/.
"""
from pathlib import Path
from shutil import copyfile
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'static' / 'uploads'
INK = colors.HexColor('#182f42')
TEXT = colors.HexColor('#273139')
MUTED = colors.HexColor('#54636c')


def link(label, url):
    return f'<link href="{escape(url)}" color="#234f69">{escape(label)}</link>'


def build(lang):
    fr = lang == 'fr'
    output = OUT / f'Marouane-Daoudi-CV-{lang}.pdf'
    styles = {
        'name': ParagraphStyle('name', fontName='Times-Roman', fontSize=25, leading=29, textColor=INK, spaceAfter=4),
        'role': ParagraphStyle('role', fontName='Times-Italic', fontSize=12, leading=15, textColor=INK, spaceAfter=8),
        'contacts': ParagraphStyle('contacts', fontName='Helvetica', fontSize=8.7, leading=12, textColor=MUTED, spaceAfter=2),
        'section': ParagraphStyle('section', fontName='Helvetica-Bold', fontSize=9.7, leading=13, textColor=INK, spaceBefore=13, spaceAfter=6),
        'body': ParagraphStyle('body', fontName='Times-Roman', fontSize=10.3, leading=13.7, textColor=TEXT, spaceAfter=5),
        'entry': ParagraphStyle('entry', fontName='Times-Roman', fontSize=10.3, leading=13.4, textColor=TEXT, spaceAfter=6),
    }
    story = []

    def p(text, style='body'):
        return Paragraph(text, styles[style])

    def section(title):
        story.append(p(title.upper(), 'section'))

    story.append(p('Marouane Daoudi', 'name'))
    story.append(p('M2 Statistique et science des données' if fr else 'M2 Statistics and Data Science', 'role'))
    story.append(p('Université de Montpellier · Montpellier, France' if fr else 'University of Montpellier · Montpellier, France', 'contacts'))
    story.append(p(link('marouane.daoudi@etu.umontpellier.fr', 'mailto:marouane.daoudi@etu.umontpellier.fr') + ' &nbsp; · &nbsp; ' + link('marouanedaoudi.github.io', 'https://marouanedaoudi.github.io/'), 'contacts'))
    story.append(p(link('GitHub / marouanedaoudi', 'https://github.com/marouanedaoudi') + ' &nbsp; · &nbsp; ' + link('LinkedIn', 'https://fr.linkedin.com/in/daoudimarouane'), 'contacts'))
    story.append(Spacer(1, 9))
    story.append(p(
        'Étudiant en deuxième année de master, avec une formation en probabilités, statistique et optimisation. Je recherche un <b>stage de recherche en machine learning à Taïwan</b>, avec l’objectif de poursuivre en doctorat en ML.' if fr else
        'Second-year master’s student with a background in probability, statistics and optimization. Seeking a <b>machine learning research internship in Taiwan</b>, with the aim of subsequently pursuing a PhD in ML.'
    ))

    section('Formation' if fr else 'Education')
    education = [
        ('2026-2027', 'M2 Statistique et science des données', 'Université de Montpellier · En cours', 'Apprentissage statistique, statistique bayésienne, estimation non paramétrique, modèles linéaires généralisés, analyse multivariée, modèles à variables latentes.') if fr else
        ('2026-2027', 'M2 Statistics and Data Science', 'University of Montpellier · In progress', 'Statistical learning, Bayesian statistics, nonparametric estimation, generalized linear models, multivariate analysis, latent-variable models.'),
        ('2025-2026', 'M1 Mathématiques appliquées', 'Université de Montpellier', 'Probabilités, processus stochastiques, inférence, optimisation, séries temporelles, modèles linéaires et développement logiciel.') if fr else
        ('2025-2026', 'M1 Applied Mathematics', 'University of Montpellier', 'Probability, stochastic processes, inference, optimization, time series, linear models and software development.'),
        ('2024-2025', 'Licence 3 Mathématiques', 'Université de Montpellier', '') if fr else
        ('2024-2025', 'Third year, Bachelor’s degree in Mathematics', 'University of Montpellier', ''),
        ('2022-2024', 'Classes préparatoires scientifiques (CPGE)', 'Lycée Descartes, Tours', '') if fr else
        ('2022-2024', 'Scientific preparatory classes (CPGE)', 'Lycée Descartes, Tours', ''),
        ('2022', 'Baccalauréat général, mention Bien', 'Lycée Jean Moulin, Béziers', '') if fr else
        ('2022', 'French general baccalaureate, Mention Bien', 'Lycée Jean Moulin, Béziers', ''),
    ]
    for date, title, school, detail in education:
        text = f'<b>{date} &nbsp; {escape(title)}</b><br/>{escape(school)}'
        if detail:
            text += '<br/>' + escape(detail)
        story.append(p(text, 'entry'))

    section('Projets sélectionnés' if fr else 'Selected projects')
    projects = [
        ('2025-2026', 'Bandits adaptatifs et tests multiples' if fr else 'Adaptive bandits and multiple testing', 'https://github.com/Chams22/bandit_approach_simulation',
         'Projet en équipe avec I. Bahraoui et C.-E. Bouaziz ; encadrement : A. Nguyen-Huu et L. Boisgibault. Inférence séquentielle, allocations adaptative et uniforme, simulations et analyse des limites statistiques.' if fr else
         'Team project with I. Bahraoui and C.-E. Bouaziz; supervision: A. Nguyen-Huu and L. Boisgibault. Sequential inference, adaptive and uniform allocation, simulations and analysis of statistical limitations.'),
        ('2025', 'L1BallPGD', 'https://github.com/marouanedaoudi/L1BallPGD',
         'PGD et FISTA pour les moindres carrés sous contrainte L1. Projection exacte, expériences synthétiques et comparaison numérique avec scikit-learn.' if fr else
         'PGD and FISTA for L1-constrained least squares. Exact projection, synthetic experiments and numerical comparison with scikit-learn.'),
        ('2026', 'Slitherlink Shiny', 'https://github.com/marouanedaoudi/slitherlink-shiny',
         'Package R : modélisation et validation des grilles, propagation de contraintes, backtracking, génération de puzzles et interface Shiny.' if fr else
         'R package: grid modelling and validation, constraint propagation, backtracking, puzzle generation and a Shiny interface.'),
        ('2024', 'Recip Score', 'https://github.com/akram3409/recip_score',
         'Projet Python en équipe avec A. El Mahzoum, C.-E. Bouaziz et M. Diagne. Traitement de données de recettes et données nutritionnelles, calcul de scores et filtre par ingrédients.' if fr else
         'Python team project with A. El Mahzoum, C.-E. Bouaziz and M. Diagne. Recipe and nutritional data processing, score computation and ingredient-based filtering.'),
    ]
    for date, title, url, description in projects:
        story.append(KeepTogether([p(f'<b>{date} &nbsp; {escape(title)}</b> &nbsp; {link("Code", url)}<br/>{escape(description)}', 'entry')]))

    section('Compétences et langues' if fr else 'Skills and languages')
    story.append(p('<b>Python</b> : NumPy, pandas, scikit-learn. &nbsp; <b>R</b> : dplyr, Shiny. &nbsp; <b>Outils</b> : SQL, LaTeX, Git/GitHub.' if fr else '<b>Python:</b> NumPy, pandas, scikit-learn. &nbsp; <b>R:</b> dplyr, Shiny. &nbsp; <b>Tools:</b> SQL, LaTeX, Git/GitHub.'))
    story.append(p('Anglais : C1 · Arabe : intermédiaire · Espagnol : scolaire' if fr else 'English: C1 · Arabic: intermediate · Spanish: basic'))

    def furniture(canvas, doc):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor('#c7d0d6'))
        canvas.setLineWidth(0.5)
        canvas.line(43, 38, A4[0]-43, 38)
        canvas.setFont('Helvetica', 8)
        canvas.setFillColor(MUTED)
        canvas.drawString(43, 26, 'Mis à jour le 14 octobre 2026' if fr else 'Updated 14 October 2026')
        canvas.drawRightString(A4[0]-43, 26, f'{doc.page}')
        canvas.restoreState()

    OUT.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=43, leftMargin=43, topMargin=37, bottomMargin=51,
        title='Marouane Daoudi - Curriculum vitae', author='Marouane Daoudi', subject='M2 Statistics and Data Science - Machine learning research internship', pageCompression=1)
    document.build(story, onFirstPage=furniture, onLaterPages=furniture)
    return output


if __name__ == '__main__':
    for language in ('fr', 'en'):
        pdf = build(language)
        print(pdf)
    copyfile(OUT / 'Marouane-Daoudi-CV-fr.pdf', OUT / 'CV.pdf')
    print(OUT / 'CV.pdf')
